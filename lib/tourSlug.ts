export function slugFromParams(slug: string | string[]): string {
  const joined = Array.isArray(slug) ? slug.join("/") : slug;
  return decodeURIComponent(joined).replace(/^\/+|\/+$/g, "");
}

export function slugLookupVariants(slug: string): string[] {
  const base = slug.replace(/^\/+|\/+$/g, "");
  if (!base) return [];
  return [...new Set([base, `${base}/`, `/${base}`, `/${base}/`])];
}

export function tourExcursionPath(slug: string): string {
  const base = slug.replace(/^\/+|\/+$/g, "");
  if (!base) return "/excursions";
  const segments = base.split("/").filter(Boolean);
  return `/excursions/${segments.join("/")}`;
}

export function slugToStaticParams(slug: string): string[] {
  return slug.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
}
