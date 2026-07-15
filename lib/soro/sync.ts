import { uploadRemoteImageToSanity } from "@/lib/soro/image";
import { fetchSoroRssItems, type SoroRssItem } from "@/lib/soro/rss";
import { getSanityWriteClient } from "@/lib/soro/sanityWriteClient";
import { slugifyPostTitle, uniqueSlugCandidate } from "@/lib/soro/slug";
import { translatePostFields } from "@/lib/soro/translate";

/** Max new articles to create per cron invocation (Hobby timeout safety). */
export const MAX_ARTICLES_PER_RUN = 3;

export type SoroSyncResult = {
  fetched: number;
  skippedExisting: number;
  pendingNew: number;
  processedThisRun: number;
  remainingPending: number;
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
  // Title/excerpt/body for es + fr are translated in parallel via Promise.all.
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

function sortOldestFirst(items: SoroRssItem[]): SoroRssItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
  );
}

export async function syncSoroFeedToSanity(): Promise<SoroSyncResult> {
  const result: SoroSyncResult = {
    fetched: 0,
    skippedExisting: 0,
    pendingNew: 0,
    processedThisRun: 0,
    remainingPending: 0,
    created: 0,
    failed: 0,
    errors: [],
    createdSlugs: [],
  };

  console.log(
    `[soro-sync] starting sync (MAX_ARTICLES_PER_RUN=${MAX_ARTICLES_PER_RUN})`,
  );
  const client = getSanityWriteClient();
  const items = sortOldestFirst(await fetchSoroRssItems());
  result.fetched = items.length;
  console.log(`[soro-sync] fetched ${items.length} RSS items (oldest-first)`);

  const pendingItems: SoroRssItem[] = [];

  for (const item of items) {
    try {
      const exists = await postExistsByGuid(client, item.guid);
      if (exists) {
        result.skippedExisting += 1;
        console.log(`[soro-sync] skip existing guid=${item.guid}`);
        continue;
      }
      pendingItems.push(item);
    } catch (error) {
      result.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({
        guid: item.guid,
        title: item.title,
        message,
      });
      console.error(
        `[soro-sync] existence check failed guid=${item.guid}:`,
        message,
      );
    }
  }

  result.pendingNew = pendingItems.length;
  const batch = pendingItems.slice(0, MAX_ARTICLES_PER_RUN);
  result.remainingPending = Math.max(0, pendingItems.length - batch.length);

  console.log(
    `[soro-sync] pending new=${result.pendingNew}; processing this run=${batch.length}; leaving for future runs=${result.remainingPending}`,
  );

  for (const item of batch) {
    result.processedThisRun += 1;
    try {
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
    `[soro-sync] done fetched=${result.fetched} created=${result.created} skipped=${result.skippedExisting} failed=${result.failed} remainingPending=${result.remainingPending}`,
  );

  return result;
}
