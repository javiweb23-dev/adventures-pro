export type FormatTourPriceOptions = {
  freeAsWord?: boolean;
};

export function formatTourPrice(
  currency: string,
  amount?: number | null,
  priceString?: string,
  options?: FormatTourPriceOptions,
): string {
  const c = (currency || "USD").toUpperCase();
  const raw = (priceString || "").trim().toLowerCase();
  if (raw.includes("free")) {
    return options?.freeAsWord ? "FREE" : `$0 ${c}`;
  }
  if (amount != null && Number.isFinite(amount)) {
    const rounded =
      Math.abs(amount - Math.round(amount)) < 1e-6
        ? Math.round(amount)
        : Number(amount.toFixed(2));
    return `$${rounded} ${c}`;
  }
  const n = Number(String(priceString).replace(/[^0-9.]/g, ""));
  if (Number.isFinite(n) && n >= 0) {
    const rounded =
      Math.abs(n - Math.round(n)) < 1e-6 ? Math.round(n) : Number(n.toFixed(2));
    return `$${rounded} ${c}`;
  }
  const fallback = (priceString || "").trim();
  if (!fallback || fallback === "-") return "-";
  return `${fallback} ${c}`.trim();
}

export function peekBookingUrl(peekProId: string) {
  return peekProId.startsWith("http")
    ? peekProId
    : `https://www.peek.com/s/${peekProId}`;
}
