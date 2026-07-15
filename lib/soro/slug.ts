export function slugifyPostTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

export function uniqueSlugCandidate(baseSlug: string, attempt: number): string {
  if (attempt <= 1) return baseSlug;
  const suffix = `-${attempt}`;
  return `${baseSlug.slice(0, Math.max(1, 96 - suffix.length))}${suffix}`;
}
