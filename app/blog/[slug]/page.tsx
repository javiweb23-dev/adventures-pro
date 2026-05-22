import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { routing } from "@/i18n/routing";

type PostDoc = {
  title?: string | null;
  mainImage?: { asset: unknown };
  publishedAt?: string;
  excerpt?: string | null;
  body?: string | null;
};

const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title.es, title.frCA),
  "excerpt": coalesce(select($locale == "fr-ca" => excerpt.frCA, excerpt[$locale]), excerpt.en, excerpt.es, excerpt.frCA),
  "body": coalesce(select($locale == "fr-ca" => body.frCA, body[$locale]), body.en, body.es, body.frCA),
  mainImage,
  publishedAt
}`;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = routing.defaultLocale;
  const post = await client.fetch<PostDoc | null>(POST_QUERY, { slug, locale });

  if (!post || !post.title?.trim()) {
    notFound();
  }

  const title = post.title.trim();
  const excerpt = post.excerpt?.trim();
  const imageUrl = post.mainImage
    ? (() => {
        try {
          return urlFor(post.mainImage).width(1200).height(675).fit("crop").url();
        } catch {
          return null;
        }
      })()
    : null;

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const bodyParagraphs = (post.body ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-blue-950 underline-offset-4 hover:underline"
        >
          ← All articles
        </Link>
        {imageUrl ? (
          <div className="relative mt-8 aspect-video w-full overflow-hidden border border-slate-200 bg-slate-200">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
          {title}
        </h1>
        {date ? <p className="mt-2 text-sm text-slate-500">{date}</p> : null}
        {excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-slate-700">{excerpt}</p>
        ) : null}
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
          {bodyParagraphs.map((p, i) => (
            <p key={`${i}-${p.slice(0, 24)}`}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
