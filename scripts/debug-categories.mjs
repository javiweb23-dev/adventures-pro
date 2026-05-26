const projectId = "5ohkqz3d";
const dataset = "production";
const query = `*[_type == "category"]{ "slug": slug.current, "titleEn": title.en }`;
const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
const res = await fetch(url);
const data = await res.json();
console.log(JSON.stringify(data.result, null, 2));
