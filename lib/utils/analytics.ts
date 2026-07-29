/**
 * Safe GA4 event helper — no-ops when gtag is missing (ad blockers, SSR).
 */

export type GAEventParams = Record<string, string | number | boolean | undefined>;

export function trackGAEvent(eventName: string, params?: GAEventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  try {
    window.gtag("event", eventName, params ?? {});
  } catch {
    // Never break UX because of analytics.
  }
}

/** Client-only viewport helper for chat analytics. */
export function getAnalyticsDevice(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}
