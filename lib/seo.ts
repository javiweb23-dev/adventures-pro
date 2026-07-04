import type { Metadata } from "next";
import type { MetadataRoute } from "next";
import { routing, type AppLocale } from "@/i18n/routing";
import { categoryExcursionPath } from "@/lib/categoryPath";
import { destinationExcursionPath } from "@/lib/destinationPath";
import { tourExcursionPath } from "@/lib/tourSlug";

export const SITE_URL = "https://www.adventuresfinder.com";

export const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/transfers",
  "/excursions",
  "/blog",
  "/terms-and-conditions",
  "/cancellation-policy",
  "/faqs",
] as const;

export function hreflangForLocale(locale: AppLocale): string {
  return locale === "fr-ca" ? "fr" : locale;
}

export function localizedUrl(locale: AppLocale, pathname: string): string {
  const normalizedPath = pathname === "/" ? "" : pathname;
  return `${SITE_URL}/${locale}${normalizedPath}`;
}

export function buildLanguageAlternates(pathname: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[hreflangForLocale(locale)] = localizedUrl(locale, pathname);
  }

  languages["x-default"] = localizedUrl("en", pathname);

  return languages;
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
}: {
  locale: AppLocale;
  pathname: string;
  title?: string;
  description?: string;
}): Metadata {
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: localizedUrl(locale, pathname),
      languages: buildLanguageAlternates(pathname),
    },
  };
}

export function buildSitemapEntry(
  pathname: string,
  lastModified?: string | Date,
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl("en", pathname),
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    alternates: {
      languages: buildLanguageAlternates(pathname),
    },
  };
}

export function categoryPathFromSlug(slug: string): string {
  return categoryExcursionPath(slug);
}

export function destinationPathFromSlug(slug: string): string {
  return destinationExcursionPath(slug);
}

export function tourPathFromSlug(slug: string): string {
  return tourExcursionPath(slug);
}

export function blogPathFromSlug(slug: string): string {
  return `/blog/${slug.replace(/^\/+|\/+$/g, "")}`;
}
