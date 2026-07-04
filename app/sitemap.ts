import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import {
  STATIC_PATHS,
  blogPathFromSlug,
  buildSitemapEntry,
  categoryPathFromSlug,
  destinationPathFromSlug,
  tourPathFromSlug,
} from "@/lib/seo";

const categoriesQuery = groq`*[_type == "category" && defined(slug.current)]{
  "slug": slug.current
}`;

const destinationsQuery = groq`*[_type == "destination" && defined(slug.current)]{
  "slug": slug.current
}`;

const toursQuery = groq`*[_type == "tour" && defined(slug.current)]{
  "slug": slug.current,
  _updatedAt
}`;

const postsQuery = groq`*[_type == "post" && defined(slug.current)]{
  "slug": slug.current,
  publishedAt,
  _updatedAt
}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, destinations, tours, posts] = await Promise.all([
    client.fetch<Array<{ slug: string }>>(categoriesQuery).catch(() => []),
    client.fetch<Array<{ slug: string }>>(destinationsQuery).catch(() => []),
    client.fetch<Array<{ slug: string; _updatedAt?: string }>>(toursQuery).catch(() => []),
    client
      .fetch<Array<{ slug: string; publishedAt?: string; _updatedAt?: string }>>(postsQuery)
      .catch(() => []),
  ]);

  const staticEntries = STATIC_PATHS.map((pathname) => buildSitemapEntry(pathname));

  const categoryEntries = categories.map((category) =>
    buildSitemapEntry(categoryPathFromSlug(category.slug)),
  );

  const destinationEntries = destinations.map((destination) =>
    buildSitemapEntry(destinationPathFromSlug(destination.slug)),
  );

  const tourEntries = tours.map((tour) =>
    buildSitemapEntry(tourPathFromSlug(tour.slug), tour._updatedAt),
  );

  const postEntries = posts.map((post) =>
    buildSitemapEntry(
      blogPathFromSlug(post.slug),
      post.publishedAt ?? post._updatedAt,
    ),
  );

  return [
    ...staticEntries,
    ...categoryEntries,
    ...destinationEntries,
    ...tourEntries,
    ...postEntries,
  ];
}
