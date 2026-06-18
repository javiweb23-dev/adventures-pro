export function categoryExcursionPath(slug: string): string {
  const base = slug.replace(/^\/+|\/+$/g, "");
  if (!base) return "/excursions";
  return `/excursions/categoria/${base}`;
}
