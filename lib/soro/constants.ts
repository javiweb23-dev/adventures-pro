export const SORO_RSS_URL =
  "https://app.trysoro.com/api/rss/42943f4e-87e0-40b0-908d-0408e9b2fea4";

/** MyMemory free GET endpoint (no API key for basic usage). */
export const MYMEMORY_TRANSLATE_URL =
  "https://api.mymemory.translated.net/get";

/**
 * Contact email (`de` param) raises the free daily quota from ~5k to ~50k
 * characters without requiring registration or an API key.
 */
export const MYMEMORY_CONTACT_EMAIL = "info@afdigitalsolutions.com";

/**
 * MyMemory `q` max is 500 UTF-8 bytes. Stay just under with a tiny margin.
 */
export const MYMEMORY_MAX_Q_BYTES = 490;
