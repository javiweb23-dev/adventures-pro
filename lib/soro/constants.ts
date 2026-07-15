export const SORO_RSS_URL =
  "https://app.trysoro.com/api/rss/42943f4e-87e0-40b0-908d-0408e9b2fea4";

/** MyMemory free GET endpoint (no API key for basic usage). */
export const MYMEMORY_TRANSLATE_URL =
  "https://api.mymemory.translated.net/get";

/**
 * MyMemory `q` max is 500 UTF-8 bytes. Stay under that with a small margin
 * for multi-byte characters / edge cases.
 */
export const MYMEMORY_MAX_Q_BYTES = 450;
