const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "5ohkqz3d";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const listQuery = `*[_type == "tour"]{
  "slug": slug.current,
  isCombo,
  "titleEn": title.en,
  "hasMainTour": defined(mainTour),
  "comboDaysCount": count(coalesce(comboDays, comboItems))
}`;

const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(listQuery)}`;
const res = await fetch(url);
const data = await res.json();

if (data.error) {
  console.error("API error:", data.error);
  process.exit(1);
}

console.log("Tours:", JSON.stringify(data.result, null, 2));

const combo = data.result?.filter((t) => t.isCombo);
console.log("\nCombo tours:", combo?.length ?? 0);

for (const t of combo || []) {
  const slug = t.slug;
  const tourQuery = `*[_type == "tour" && slug.current == $slug][0]{
    "slug": slug.current,
    isCombo,
    "title": coalesce(title.en, title.es, title.frCA)
  }`;
  const testUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(tourQuery)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`;
  const testRes = await fetch(testUrl);
  const testData = await testRes.json();
  console.log(`\nSlug "${slug}" fetch:`, testData.result ? "OK" : "NULL", testData.error || "");
}
