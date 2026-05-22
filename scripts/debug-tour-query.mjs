import { createClient } from "next-sanity";

const client = createClient({
  projectId: "5ohkqz3d",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const slug = "adventuresfinder.com/saona-island-monkeyland-combo/";
const wrongSlug = "adventuresfinder.com";

const TOUR_QUERY = `*[_type == "tour" && slug.current == $slug][0]{
  "slug": slug.current,
  isCombo,
  "title": coalesce(title.en, title.es, title.frCA)
}`;

console.log("Full slug:", await client.fetch(TOUR_QUERY, { slug }));
console.log("First segment only:", await client.fetch(TOUR_QUERY, { slug: wrongSlug }));
