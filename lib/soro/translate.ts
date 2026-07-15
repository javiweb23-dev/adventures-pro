import {
  MYMEMORY_CONTACT_EMAIL,
  MYMEMORY_MAX_Q_BYTES,
  MYMEMORY_TRANSLATE_URL,
} from "@/lib/soro/constants";
import { formatStepError } from "@/lib/soro/errors";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Per-request timeout for MyMemory translation. */
export const TRANSLATE_TIMEOUT_MS = 15_000;

/** First attempt + up to 3 retries on HTTP/body 429. */
const RATE_LIMIT_MAX_ATTEMPTS = 4;

const textEncoder = new TextEncoder();

function utf8ByteLength(text: string): number {
  return textEncoder.encode(text).length;
}

/** Largest prefix of `text` whose UTF-8 length is ≤ maxBytes. */
function maxPrefixByBytes(text: string, maxBytes: number): number {
  if (utf8ByteLength(text) <= maxBytes) return text.length;

  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (utf8ByteLength(text.slice(0, mid)) <= maxBytes) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return Math.max(1, lo);
}

/**
 * Split text into as few chunks as possible under the MyMemory `q` byte limit,
 * breaking preferably at paragraph → sentence → whitespace boundaries.
 */
function splitForMyMemory(text: string, maxBytes = MYMEMORY_MAX_Q_BYTES): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (utf8ByteLength(trimmed) <= maxBytes) return [trimmed];

  const chunks: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0) {
    if (utf8ByteLength(remaining) <= maxBytes) {
      chunks.push(remaining);
      break;
    }

    const hardEnd = maxPrefixByBytes(remaining, maxBytes);
    const window = remaining.slice(0, hardEnd);

    const paraBreak = window.lastIndexOf("\n\n");
    const sentenceBreak = Math.max(
      window.lastIndexOf(". "),
      window.lastIndexOf("! "),
      window.lastIndexOf("? "),
      window.lastIndexOf(".\n"),
      window.lastIndexOf("!\n"),
      window.lastIndexOf("?\n"),
    );
    const spaceBreak = window.lastIndexOf(" ");

    let cut = hardEnd;
    if (paraBreak > hardEnd * 0.4) {
      cut = paraBreak;
    } else if (sentenceBreak > hardEnd * 0.4) {
      cut = sentenceBreak + 1; // keep the punctuation with this chunk
    } else if (spaceBreak > hardEnd * 0.4) {
      cut = spaceBreak;
    }

    cut = Math.max(1, Math.min(cut, hardEnd));
    const chunk = remaining.slice(0, cut).trimEnd();
    chunks.push(chunk.length > 0 ? chunk : remaining.slice(0, hardEnd));

    remaining = remaining.slice(chunk.length > 0 ? cut : hardEnd).replace(/^\s+/, "");
  }

  return chunks.filter((c) => c.length > 0);
}

type MyMemoryResponse = {
  responseStatus?: number | string;
  responseDetails?: string;
  responseData?: {
    translatedText?: string;
  };
};

function isRateLimited(status: number, details?: string): boolean {
  if (status === 429) return true;
  if (details && /rate.?limit|too many|quota/i.test(details)) return true;
  return false;
}

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
    url.searchParams.set("de", MYMEMORY_CONTACT_EMAIL);

    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw Object.assign(new Error(`MyMemory returned 429`), {
        isRateLimit: true,
      });
    }

    if (response.status >= 500) {
      throw new Error(`MyMemory returned ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(
        `MyMemory failed: ${response.status} ${await response.text()}`,
      );
    }

    const data = (await response.json()) as MyMemoryResponse;
    const status = Number(data.responseStatus);
    const details = data.responseDetails || "";
    const translated = data.responseData?.translatedText;

    if (isRateLimited(status, details)) {
      throw Object.assign(
        new Error(
          `MyMemory responseStatus=${status}: ${details || "rate limit"}`,
        ),
        { isRateLimit: true },
      );
    }

    if (status && status !== 200) {
      throw new Error(
        `MyMemory responseStatus=${status}: ${details || "unknown"}`,
      );
    }

    if (!translated) {
      throw new Error("MyMemory returned empty translation");
    }

    return translated;
  } catch (error) {
    const labeled = formatStepError("translation failed", error);
    const rateLimited =
      typeof error === "object" &&
      error !== null &&
      "isRateLimit" in error &&
      Boolean((error as { isRateLimit?: boolean }).isRateLimit);

    console.warn(
      `[soro-sync] translate attempt failed (mymemory, target=${target}, try=${attempt}${rateLimited ? ", rateLimit=true" : ""}): ${labeled.message}`,
    );

    if (rateLimited && attempt < RATE_LIMIT_MAX_ATTEMPTS) {
      // Exponential backoff aimed at 429: ~2s, 4s, 8s
      const backoffMs = 2000 * 2 ** (attempt - 1);
      console.warn(
        `[soro-sync] MyMemory 429 — waiting ${backoffMs}ms before retry ${attempt + 1}/${RATE_LIMIT_MAX_ATTEMPTS}`,
      );
      await sleep(backoffMs);
      return translateChunk(text, target, attempt + 1);
    }

    if (!rateLimited && attempt < 3) {
      const backoffMs = 750 * 2 ** (attempt - 1);
      await sleep(backoffMs);
      return translateChunk(text, target, attempt + 1);
    }

    throw formatStepError("translation failed", error);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Translate text via MyMemory, packing chunks near the 500-byte `q` limit. */
export async function translateText(
  text: string,
  target: "es" | "fr",
): Promise<string> {
  const chunks = splitForMyMemory(text);
  if (chunks.length === 0) return text;
  if (chunks.length === 1) return translateChunk(chunks[0], target);

  console.log(
    `[soro-sync] mymemory packing target=${target} chunks=${chunks.length} chars=${text.length}`,
  );

  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk, target));
  }

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
    const [titleEs, titleFr, excerptEs, excerptFr, bodyEs, bodyFr] =
      await Promise.all([
        translateText(input.title, "es"),
        translateText(input.title, "fr"),
        translateText(input.excerpt, "es"),
        translateText(input.excerpt, "fr"),
        translateText(input.content, "es"),
        translateText(input.content, "fr"),
      ]);

    return {
      title: { en: input.title, es: titleEs, frCA: titleFr },
      excerpt: { en: input.excerpt, es: excerptEs, frCA: excerptFr },
      body: { en: input.content, es: bodyEs, frCA: bodyFr },
    };
  } catch (error) {
    throw formatStepError("translation failed", error);
  }
}
