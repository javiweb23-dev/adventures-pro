import { formatStepError } from "@/lib/soro/errors";
import { uploadRemoteImageToSanity } from "@/lib/soro/image";
import { fetchSoroRssItems, type SoroRssItem } from "@/lib/soro/rss";
import { getSanityWriteClient } from "@/lib/soro/sanityWriteClient";
import { slugifyPostTitle, uniqueSlugCandidate } from "@/lib/soro/slug";
import { translatePostFields } from "@/lib/soro/translate";
import { dataset, projectId } from "@/sanity/env";

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
  createdIds: string[];
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
): Promise<{ slug: string; id: string }> {
  let localized: Awaited<ReturnType<typeof translatePostFields>>;
  try {
    console.log(`[soro-sync] step=translation start guid=${item.guid}`);
    localized = await translatePostFields({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
    });
    console.log(`[soro-sync] step=translation ok guid=${item.guid}`);
  } catch (error) {
    throw formatStepError("translation failed", error);
  }

  let slug: string;
  try {
    console.log(`[soro-sync] step=slug start guid=${item.guid}`);
    slug = await resolveUniqueSlug(client, item.title);
    console.log(`[soro-sync] step=slug ok guid=${item.guid} slug=${slug}`);
  } catch (error) {
    throw formatStepError("slug resolution failed", error);
  }

  let mainImage: Awaited<ReturnType<typeof uploadRemoteImageToSanity>> | undefined;
  if (item.imageUrl) {
    try {
      console.log(
        `[soro-sync] step=image start guid=${item.guid} url=${item.imageUrl}`,
      );
      mainImage = await uploadRemoteImageToSanity(client, item.imageUrl, slug);
      console.log(
        `[soro-sync] step=image ok guid=${item.guid} asset=${mainImage.asset._ref}`,
      );
    } catch (error) {
      const labeled = formatStepError("image processing failed", error);
      // Non-fatal for image: continue without mainImage, but log the specific step.
      console.warn(
        `[soro-sync] ${labeled.message}; continuing without image guid=${item.guid}`,
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

  try {
    console.log(
      `[soro-sync] step=sanity.create start guid=${item.guid} projectId=${projectId} dataset=${dataset}`,
    );
    const created = await client.create(doc);
    console.log(
      `[soro-sync] step=sanity.create ok _id=${created._id} slug=${slug} guid=${item.guid} (published, not draft)`,
    );
    return { slug, id: created._id };
  } catch (error) {
    throw formatStepError("sanity create failed", error);
  }
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
    createdIds: [],
  };

  console.log(
    `[soro-sync] starting sync (MAX_ARTICLES_PER_RUN=${MAX_ARTICLES_PER_RUN}) projectId=${projectId} dataset=${dataset}`,
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
      const labeled = formatStepError("existence check failed", error);
      result.failed += 1;
      result.errors.push({
        guid: item.guid,
        title: item.title,
        message: labeled.message,
      });
      console.error(
        `[soro-sync] ${labeled.message} guid=${item.guid}`,
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
      const { slug, id } = await createPostFromItem(client, item);
      result.created += 1;
      result.createdSlugs.push(slug);
      result.createdIds.push(id);
    } catch (error) {
      // Errors thrown from individual steps already include the step label.
      result.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      result.errors.push({
        guid: item.guid,
        title: item.title,
        message,
      });
      console.error(
        `[soro-sync] article failed guid=${item.guid} title="${item.title}": ${message}`,
      );
    }
  }

  console.log(
    `[soro-sync] done fetched=${result.fetched} created=${result.created} skipped=${result.skippedExisting} failed=${result.failed} remainingPending=${result.remainingPending} createdIds=${JSON.stringify(result.createdIds)}`,
  );

  return result;
}
