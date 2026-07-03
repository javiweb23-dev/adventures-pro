import { groq } from "next-sanity";

export const mapDestinationsQuery = groq`*[_type == "destination"] | order(coalesce(title.en, title.es, title.frCA) asc) {
  "slug": slug.current,
  "title": coalesce(
    select($locale == "fr-ca" => title.frCA, title[$locale]),
    title.en,
    title.es,
    title.frCA
  ),
  "tourCount": count(*[_type == "tour" && destination->slug.current == ^.slug.current])
}`;

export type MapDestination = {
  slug: string;
  title: string;
  tourCount: number;
};
