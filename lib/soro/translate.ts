import { LIBRETRANSLATE_ENDPOINTS } from "@/lib/soro/constants";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateChunk(
  text: string,
  target: "es" | "fr",
  attempt = 1,
): Promise<string> {
  if (!text.trim()) return text;

  let lastError: unknown;

  for (const endpoint of LIBRETRANSLATE_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target,
          format: "text",
        }),
      });

      if (response.status === 429 || response.status >= 500) {
        throw new Error(`LibreTranslate ${endpoint} returned ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(
          `LibreTranslate ${endpoint} failed: ${response.status} ${await response.text()}`,
        );
      }

      const data = (await response.json()) as { translatedText?: string };
      if (!data.translatedText) {
        throw new Error(`LibreTranslate ${endpoint} returned empty translation`);
      }

      return data.translatedText;
    } catch (error) {
      lastError = error;
      console.warn(
        `[soro-sync] translate attempt failed (${endpoint}, target=${target}, try=${attempt}):`,
        error,
      );
    }
  }

  if (attempt < 4) {
    const backoffMs = 750 * 2 ** (attempt - 1);
    await sleep(backoffMs);
    return translateChunk(text, target, attempt + 1);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("LibreTranslate translation failed after retries");
}

/** Translate long text by paragraph chunks to avoid provider size limits. */
export async function translateText(
  text: string,
  target: "es" | "fr",
): Promise<string> {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length <= 1 && text.length < 1800) {
    return translateChunk(text, target);
  }

  const translated: string[] = [];
  let buffer = "";

  for (const paragraph of paragraphs) {
    const next = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (next.length > 1600 && buffer) {
      translated.push(await translateChunk(buffer, target));
      buffer = paragraph;
    } else {
      buffer = next;
    }
  }

  if (buffer) {
    translated.push(await translateChunk(buffer, target));
  }

  return translated.join("\n\n");
}

export async function translatePostFields(input: {
  title: string;
  excerpt: string;
  content: string;
}) {
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
}
