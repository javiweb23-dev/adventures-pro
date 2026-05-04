import Image from "next/image";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 0;

type BlogPostPageProps = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

type PostDoc = {
  title?: string | null;
  mainImage?: { asset: unknown };
  publishedAt?: string;
  body?: string | null;
};

const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
  "body": coalesce(select($locale == "fr-ca" => body.frCA, body[$locale]), body.en, body),
  mainImage,
  publishedAt
}`;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;

  const post = await client.fetch<PostDoc | null>(POST_QUERY, { slug, locale }).catch(() => null);

  if (!post || !post.title?.trim()) {
    notFound();
  }

  const imageUrl = post.mainImage
    ? (() => {
        try {
          return urlFor(post.mainImage).width(1600).height(900).fit("crop").url();
        } catch {
          return null;
        }
      })()
    : null;

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === "es" ? "es" : locale === "fr-ca" ? "fr-CA" : "en-US", {
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
    <article className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-12 md:px-8 md:py-16 lg:max-w-3xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-slate-500 transition hover:text-blue-950"
        >
          ← Blog
        </Link>

        {imageUrl ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}

        <header className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">{post.title}</h1>
          {dateLabel ? <p className="mt-3 text-sm text-slate-500">{dateLabel}</p> : null}
        </header>

        {bodyParagraphs.length > 0 ? (
          <div className="mt-12 max-w-none space-y-5 border-t border-slate-100 pt-12 text-[15px] leading-relaxed text-slate-700 md:text-base">
            {bodyParagraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
