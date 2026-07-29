/**
 * Paso 0 — Verificación de modelo Gemini (producción).
 * Prueba candidatos estables/recomendados y elige el primero que responde.
 *
 * Uso:
 *   GEMINI_API_KEY=... node scripts/verify-gemini-model.mjs
 *   npm run verify:gemini
 *
 * Carga opcionalmente .env.local / .env sin imprimir secretos.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GoogleGenAI } from "@google/genai";

const ROOT = resolve(import.meta.dirname, "..");
const OUTPUT_PATH = resolve(ROOT, "lib/tour-chat/verified-model.json");

/** Orden: estables recientes → flash-lite (latencia) → fallback 2.5 */
const CANDIDATES = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

function loadEnvFile(filename) {
  const path = resolve(ROOT, filename);
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  console.error(
    "[verify-gemini] Falta GEMINI_API_KEY (o GOOGLE_API_KEY). Añádela a .env.local y vuelve a ejecutar.",
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const results = [];

async function probe(model) {
  const started = Date.now();
  try {
    const response = await ai.models.generateContent({
      model,
      contents:
        "Reply with exactly one word: OK. You are a connectivity probe for Adventures Finder.",
      config: {
        maxOutputTokens: 16,
        // Minimize latency for chat widgets (2.5 thinking models).
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    const text = (response.text ?? "").trim();
    const ms = Date.now() - started;
    if (!text) {
      results.push({ model, ok: false, ms, error: "empty_response" });
      return false;
    }
    results.push({ model, ok: true, ms, sample: text.slice(0, 80) });
    console.log(`✓ ${model} (${ms}ms) → ${JSON.stringify(text.slice(0, 80))}`);
    return true;
  } catch (error) {
    const ms = Date.now() - started;
    const message = error instanceof Error ? error.message : String(error);
    results.push({ model, ok: false, ms, error: message.slice(0, 200) });
    console.log(`✗ ${model} (${ms}ms) → ${message.slice(0, 120)}`);
    return false;
  }
}

let selected = null;
for (const model of CANDIDATES) {
  // eslint-disable-next-line no-await-in-loop
  const ok = await probe(model);
  if (ok) {
    selected = model;
    break;
  }
}

if (!selected) {
  console.error("[verify-gemini] Ningún candidato respondió. Revisa la API key y cuotas.");
  console.error(JSON.stringify({ results }, null, 2));
  process.exit(1);
}

const payload = {
  verifiedAt: new Date().toISOString(),
  model: selected,
  candidatesTried: results,
  source: "scripts/verify-gemini-model.mjs",
};

writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`\nModelo verificado: ${selected}`);
console.log(`Escrito en: ${OUTPUT_PATH}`);
console.log("Úsalo como default vía GEMINI_MODEL o lib/tour-chat/geminiConfig.ts");
process.exit(0);
