import { uploadRemoteImageToSanity } from "@/lib/soro/image";
import { fetchSoroRssItems, type SoroRssItem } from "@/lib/soro/rss";
import { getSanityWriteClient } from "@/lib/soro/sanityWriteClient";
import { slugifyPostTitle, uniqueSlugCandidate } from "@/lib/soro/slug";
import { translatePostFields } from "@/lib/soro/translate";

export type SoroSyncResult = {
  fetched: number;
  skippedExisting: number;
  created: number;
  failed: number;
  errors: Array<{ guid: string; title?: string; message: string }>;
  createdSlugs: string[];
};

async function postExistsByGuid(
  client: ReturnType<typeof getSanityWriteClient>,
  sourceGuid: string,
): Promise<boolean> {
  const existing = await client.fetch<string | null>(
    `*[_type == "post" && sourceGuid == $sourceGuid][0]._id`,
    { sourceGuid },
  );
  return Boolean(existing);
}

async function resolveUniqueSlug(
  client: ReturnType<typeof getSanityWriteClient>,
  titleEn: string,
): Promise<string> {
  const base = slugifyPostTitle(titleEn) || `soro-post-${Date.now()}`;

  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const candidate = uniqueSlugCandidate(base, attempt);
    const taken = await client.fetch<string | null>(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug: candidate },
    );
    if (!taken) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`.slice(0, 96);
}

async function createPostFromItem(
  client: ReturnType<typeof getSanityWriteClient>,
  item: SoroRssItem,
): Promise<string> {
  const localized = await translatePostFields({
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
  });

  const slug = await resolveUniqueSlug(client, item.title);

  let mainImage: Awaited<ReturnType<typeof uploadRemoteImageToSanity>> | undefined;
  if (item.imageUrl) {
    try {
      mainImage = await uploadRemoteImageToSanity(client, item.imageUrl, slug);
    } catch (error) {
      console.warn(
        `[soro-sync] image upload failed for guid=${item.guid}; continuing without image:`,
        error,
      );
    }
  }

  const doc = {
    _type: "post" as const,
    title: localized.title,
    excerpt: localized.excerpt,
    body: localized.body,
    publishedAt: item.publishedAt,
    slug: {
      _type: "slug" as const,
      current: slug,
    },
    sourceGuid: item.guid,
    ...(mainImage ? { mainImage } : {}),
  };

  const created = await client.create(doc);
  console.log(
    `[soro-sync] created post _id=${created._id} slug=${slug} guid=${item.guid}`,
  );
  return slug;
}

export async function syncSoroFeedToSanity(): Promise<SoroSyncResult> {
  const result: SoroSyncResult = {
    fetched: 0,
    skippedExisting: 0,
    created: 0,
    failed: 0,
    errors: [],
    createdSlugs: [],
  };

  console.log("[soro-sync] starting sync");
  const client = getSanityWriteClient();
  const items = await fetchSoroRssItems();
  result.fetched = items.length;
  console.log(`[soro-sync] fetched ${items.length} RSS items`);

  for (const item of items) {
    try {
      const exists = await postExistsByGuid(client, item.guid);
      if (exists) {
        result.skippedExisting += 1;
        console.log(`[soro-sync] skip existing guid=${item.guid}`);
        continue;
      }

      const slug = await createPostFromItem(client, item);
      result.created += 1;
      result.createdSlugs.push(slug);
    } catch (error) {
      result.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({
        guid: item.guid,
        title: item.title,
        message,
      });
      console.error(
        `[soro-sync] failed guid=${item.guid} title="${item.title}":`,
        message,
      );
    }
  }

  console.log(
    `[soro-sync] done fetched=${result.fetched} created=${result.created} skipped=${result.skippedExisting} failed=${result.failed}`,
  );

  return result;
}
