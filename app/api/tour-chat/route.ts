import { NextResponse } from "next/server";

/**
 * @deprecated Use POST /api/site-chat
 * Kept briefly so any cached clients fail clearly instead of silently.
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "unavailable",
      fallback: "whatsapp",
      migratedTo: "/api/site-chat",
    },
    { status: 410 },
  );
}
