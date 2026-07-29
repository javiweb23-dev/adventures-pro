/**
 * Modelo Gemini por defecto para Tour AI Chat.
 *
 * Prioridad:
 * 1. process.env.GEMINI_MODEL
 * 2. lib/tour-chat/verified-model.json (generado por `npm run verify:gemini`)
 * 3. FALLBACK_MODEL — estable Flash más reciente documentado en
 *    https://ai.google.dev/gemini-api/docs/models (familia Flash GA).
 *
 * Ejecuta `npm run verify:gemini` con GEMINI_API_KEY antes de desplegar.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Estables/recomendados a probar en orden (latencia + disponibilidad). */
export const GEMINI_MODEL_CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
] as const;

/** Default documentado (GA Flash) si aún no hay verificación local. */
export const FALLBACK_GEMINI_MODEL = "gemini-3.6-flash" as const;

type VerifiedModelFile = {
  model?: string;
  verifiedAt?: string | null;
};

function readVerifiedModel(): string | null {
  try {
    const path = join(process.cwd(), "lib/tour-chat/verified-model.json");
    if (!existsSync(path)) return null;
    const parsed = JSON.parse(readFileSync(path, "utf8")) as VerifiedModelFile;
    const model = parsed.model?.trim();
    // Accept provisional defaults (verifiedAt null) and live verification results.
    return model || null;
  } catch {
    return null;
  }
}

export function resolveGeminiModel(): string {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  if (fromEnv) return fromEnv;

  const verified = readVerifiedModel();
  if (verified) return verified;

  return FALLBACK_GEMINI_MODEL;
}

export function geminiModelFallbackChain(preferred?: string): string[] {
  const primary = preferred?.trim() || resolveGeminiModel();
  const rest = GEMINI_MODEL_CANDIDATES.filter((m) => m !== primary);
  return [primary, ...rest];
}
