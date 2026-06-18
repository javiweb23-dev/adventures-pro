import { groq } from "next-sanity";

export const navCategoriesQuery = groq`*[_type == "category"] | order(coalesce(title.en, title.es, title.frCA) asc) {
  "slug": slug.current,
  "title": coalesce(
    select($locale == "fr-ca" => title.frCA, title[$locale]),
    title.en,
    title.es,
    title.frCA
  )
}`;

export type NavCategory = {
  slug: string;
  title: string;
};
