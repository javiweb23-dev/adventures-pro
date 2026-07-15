import Parser from "rss-parser";
import { SORO_RSS_URL } from "@/lib/soro/constants";

export type SoroRssItem = {
  guid: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  imageUrl?: string;
  link?: string;
};

type RawItem = {
  guid?: string;
  id?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string; type?: string };
};

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "content:encoded"],
      ["media:content", "media:content", { keepArray: true }],
      ["media:thumbnail", "media:thumbnail", { keepArray: true }],
    ],
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|br|tr)[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstImageFromHtml(html: string): string | undefined {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

function mediaUrl(item: RawItem & Record<string, unknown>): string | undefined {
  if (item.enclosure?.url && (!item.enclosure.type || item.enclosure.type.startsWith("image/"))) {
    return item.enclosure.url;
  }

  const mediaContent = item["media:content"];
  if (Array.isArray(mediaContent)) {
    for (const entry of mediaContent) {
      if (entry && typeof entry === "object") {
        const url =
          (entry as { $?: { url?: string } }).$?.url ||
          (entry as { url?: string }).url;
        if (url) return url;
      }
    }
  }

  const mediaThumb = item["media:thumbnail"];
  if (Array.isArray(mediaThumb)) {
    for (const entry of mediaThumb) {
      if (entry && typeof entry === "object") {
        const url =
          (entry as { $?: { url?: string } }).$?.url ||
          (entry as { url?: string }).url;
        if (url) return url;
      }
    }
  }

  return undefined;
}

export async function fetchSoroRssItems(): Promise<SoroRssItem[]> {
  const feed = await parser.parseURL(SORO_RSS_URL);
  const items: SoroRssItem[] = [];

  for (const raw of feed.items as unknown as Array<RawItem & Record<string, unknown>>) {
    const guid = String(raw.guid || raw.id || raw.link || "").trim();
    const title = String(raw.title || "").trim();
    if (!guid || !title) continue;

    const html = String(
      raw["content:encoded"] || raw.content || raw.summary || "",
    );
    const content = stripHtml(html);
    const excerpt =
      String(raw.contentSnippet || "").trim() ||
      content.split(/\n\n+/)[0]?.slice(0, 280) ||
      "";

    const publishedAt = raw.isoDate || raw.pubDate || new Date().toISOString();
    const imageUrl = mediaUrl(raw) || firstImageFromHtml(html);

    items.push({
      guid,
      title,
      content,
      excerpt,
      publishedAt: new Date(publishedAt).toISOString(),
      imageUrl,
      link: raw.link,
    });
  }

  return items;
}
