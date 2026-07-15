import {
  MYMEMORY_MAX_Q_BYTES,
  MYMEMORY_TRANSLATE_URL,
} from "@/lib/soro/constants";
import { formatStepError } from "@/lib/soro/errors";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Per-request timeout for MyMemory translation. */
export const TRANSLATE_TIMEOUT_MS = 15_000;

const textEncoder = new TextEncoder();

function utf8ByteLength(text: string): number {
  return textEncoder.encode(text).length;
}

/**
 * Split text into chunks of at most `maxBytes` UTF-8 bytes, preferring
 * paragraph → sentence → word → hard byte boundaries so order is preserved.
 */
function splitForMyMemory(text: string, maxBytes = MYMEMORY_MAX_Q_BYTES): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (utf8ByteLength(trimmed) <= maxBytes) return [trimmed];

  const paragraphs = trimmed.split(/\n\n+/);
  const chunks: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) continue;
    if (utf8ByteLength(paragraph) <= maxBytes) {
      chunks.push(paragraph);
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let buffer = "";

    const flushBuffer = () => {
      if (buffer) {
        chunks.push(buffer);
        buffer = "";
      }
    };

    for (const sentence of sentences) {
      const candidate = buffer ? `${buffer} ${sentence}` : sentence;
      if (utf8ByteLength(candidate) <= maxBytes) {
        buffer = candidate;
        continue;
      }

      flushBuffer();

      if (utf8ByteLength(sentence) <= maxBytes) {
        buffer = sentence;
        continue;
      }

      // Hard-split oversized sentence by words, then by bytes if needed.
      const words = sentence.split(/\s+/);
      for (const word of words) {
        const next = buffer ? `${buffer} ${word}` : word;
        if (utf8ByteLength(next) <= maxBytes) {
          buffer = next;
          continue;
        }
        flushBuffer();
        if (utf8ByteLength(word) <= maxBytes) {
          buffer = word;
        } else {
          chunks.push(...splitByUtf8Bytes(word, maxBytes));
        }
      }
    }

    flushBuffer();
  }

  return chunks;
}

function splitByUtf8Bytes(text: string, maxBytes: number): string[] {
  const bytes = textEncoder.encode(text);
  const decoder = new TextDecoder();
  const parts: string[] = [];

  for (let offset = 0; offset < bytes.length; ) {
    let end = Math.min(offset + maxBytes, bytes.length);
    // Avoid cutting mid-codepoint: walk back from a non-continuation byte.
    while (end > offset && (bytes[end] & 0xc0) === 0x80) {
      end -= 1;
    }
    if (end === offset) {
      end = Math.min(offset + maxBytes, bytes.length);
    }
    parts.push(decoder.decode(bytes.subarray(offset, end)));
    offset = end;
  }

  return parts;
}

type MyMemoryResponse = {
  responseStatus?: number | string;
  responseDetails?: string;
  responseData?: {
    translatedText?: string;
  };
};

async function translateChunk(
  text: string,
  target: "es" | "fr",
  attempt = 1,
): Promise<string> {
  if (!text.trim()) return text;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);

  try {
    const url = new URL(MYMEMORY_TRANSLATE_URL);
    url.searchParams.set("q", text);
    // Site locale is fr-ca; MyMemory expects ISO "fr".
    url.searchParams.set("langpair", `en|${target}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
    });

    if (response.status === 429 || response.status >= 500) {
      throw new Error(`MyMemory returned ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(
        `MyMemory failed: ${response.status} ${await response.text()}`,
      );
    }

    const data = (await response.json()) as MyMemoryResponse;
    const status = Number(data.responseStatus);
    const translated = data.responseData?.translatedText;

    if (status && status !== 200) {
      throw new Error(
        `MyMemory responseStatus=${status}: ${data.responseDetails || "unknown"}`,
      );
    }

    if (!translated) {
      throw new Error("MyMemory returned empty translation");
    }

    return translated;
  } catch (error) {
    const labeled = formatStepError("translation failed", error);
    console.warn(
      `[soro-sync] translate attempt failed (mymemory, target=${target}, try=${attempt}): ${labeled.message}`,
    );

    if (attempt < 4) {
      const backoffMs = 750 * 2 ** (attempt - 1);
      await sleep(backoffMs);
      return translateChunk(text, target, attempt + 1);
    }

    throw formatStepError("translation failed", error);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Translate text via MyMemory, chunking to stay within the 500-byte `q` limit. */
export async function translateText(
  text: string,
  target: "es" | "fr",
): Promise<string> {
  const chunks = splitForMyMemory(text);
  if (chunks.length === 0) return text;
  if (chunks.length === 1) return translateChunk(chunks[0], target);

  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk, target));
  }

  // Rejoin with double newlines when original had paragraph breaks;
  // for mid-paragraph splits we join with a space.
  // Prefer reconstructing from how we split: paragraphs were separate chunks
  // when under limit; sentence/word splits within a paragraph should be spaces.
  // Simplest correct-enough join: use " " for adjacent mid-body pieces, but
  // preserve blank lines by detecting original paragraph separators via
  // reconstructing from splitForMyMemory which keeps \n\n as separate units.
  // Since splitForMyMemory emits paragraph-level chunks when possible,
  // join consecutive chunks with space if they don't look like full paragraphs
  // ending — actually original approach of join("\n\n") broke sentence splits.
  return rejoinChunks(text, chunks, translated);
}

function rejoinChunks(
  original: string,
  sourceChunks: string[],
  translatedChunks: string[],
): string {
  if (sourceChunks.length !== translatedChunks.length) {
    return translatedChunks.join(" ");
  }

  // Walk the original string and replace each source chunk occurrence in order
  // with its translation, preserving separators between chunks.
  let cursor = 0;
  let output = "";

  for (let i = 0; i < sourceChunks.length; i += 1) {
    const src = sourceChunks[i];
    const idx = original.indexOf(src, cursor);
    if (idx === -1) {
      output += (output ? " " : "") + translatedChunks[i];
      continue;
    }
    output += original.slice(cursor, idx) + translatedChunks[i];
    cursor = idx + src.length;
  }

  output += original.slice(cursor);
  return output;
}

export async function translatePostFields(input: {
  title: string;
  excerpt: string;
  content: string;
}) {
  try {
    // Sequential to stay kinder to MyMemory free-tier rate limits.
    const titleEs = await translateText(input.title, "es");
    const titleFr = await translateText(input.title, "fr");
    const excerptEs = await translateText(input.excerpt, "es");
    const excerptFr = await translateText(input.excerpt, "fr");
    const bodyEs = await translateText(input.content, "es");
    const bodyFr = await translateText(input.content, "fr");

    return {
      title: { en: input.title, es: titleEs, frCA: titleFr },
      excerpt: { en: input.excerpt, es: excerptEs, frCA: excerptFr },
      body: { en: input.content, es: bodyEs, frCA: bodyFr },
    };
  } catch (error) {
    throw formatStepError("translation failed", error);
  }
}
