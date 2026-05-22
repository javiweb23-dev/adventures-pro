import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "5ohkqz3d";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Set SANITY_API_WRITE_TOKEN in the environment.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const BAD_SLUG = "adventuresfinder.com/saona-island-monkeyland-combo/";
const GOOD_SLUG = "saona-island-monkeyland-combo";

const doc = await client.fetch(
  `*[_type == "tour" && slug.current == $slug][0]{ _id, slug }`,
  { slug: BAD_SLUG },
);

if (!doc?._id) {
  console.log("No tour found with legacy slug:", BAD_SLUG);
  process.exit(0);
}

await client
  .patch(doc._id)
  .set({ slug: { _type: "slug", current: GOOD_SLUG } })
  .commit();

console.log(`Updated ${doc._id}: ${BAD_SLUG} -> ${GOOD_SLUG}`);
console.log(`Open: /en/excursions/${GOOD_SLUG}`);
