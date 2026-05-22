import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const tours = await client.fetch(
  `*[_type == "tour" && isCombo == true && defined(comboItems) && count(comboItems) > 0]{
    _id,
    comboDays,
    comboItems
  }`,
);

let updated = 0;

for (const tour of tours) {
  const days = tour.comboDays?.length ? tour.comboDays : tour.comboItems;
  if (!days?.length) continue;

  await client
    .patch(tour._id)
    .set({ comboDays: days })
    .unset(["comboItems"])
    .commit();

  updated += 1;
  console.log(`Migrated ${tour._id}`);
}

console.log(`Done. Migrated ${updated} combo tour(s).`);
