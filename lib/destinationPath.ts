export function destinationExcursionPath(slug: string): string {
  const base = slug.replace(/^\/+|\/+$/g, "");
  if (!base) return "/excursions";
  return `/excursions/destino/${base}`;
}
