export type FormatTourPriceOptions = {
  freeAsWord?: boolean;
};

export function formatTourPrice(
  currency: string,
  price?: string | number | null,
  options?: FormatTourPriceOptions,
): string {
  const c = (currency || "USD").toUpperCase();
  const raw = String(price ?? "")
    .trim()
    .toLowerCase();
  if (raw.includes("free")) {
    return options?.freeAsWord ? "FREE" : `$0 ${c}`;
  }
  if (typeof price === "number" && Number.isFinite(price)) {
    const rounded =
      Math.abs(price - Math.round(price)) < 1e-6
        ? Math.round(price)
        : Number(price.toFixed(2));
    return `$${rounded} ${c}`;
  }
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  if (Number.isFinite(n) && n >= 0) {
    const rounded =
      Math.abs(n - Math.round(n)) < 1e-6 ? Math.round(n) : Number(n.toFixed(2));
    return `$${rounded} ${c}`;
  }
  const fallback = String(price ?? "").trim();
  if (!fallback || fallback === "-") return "-";
  return `${fallback} ${c}`.trim();
}

export function peekBookingUrl(peekProId: string) {
  return peekProId.startsWith("http")
    ? peekProId
    : `https://www.peek.com/s/${peekProId}`;
}
