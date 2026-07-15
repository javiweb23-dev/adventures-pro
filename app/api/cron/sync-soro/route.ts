import { NextRequest, NextResponse } from "next/server";
import { syncSoroFeedToSanity } from "@/lib/soro/sync";

export const runtime = "nodejs";
/** Hobby max without Fluid is 60s; with Fluid compute Hobby allows up to 300s. */
export const maxDuration = 60;
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[soro-sync] CRON_SECRET is not configured");
    return false;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const headerSecret = request.headers.get("x-cron-secret");
  return headerSecret === cronSecret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncSoroFeedToSanity();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[soro-sync] fatal error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
