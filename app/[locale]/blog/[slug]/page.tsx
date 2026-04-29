import Image from "next/image";
import { notFound } from "next/navigation";
import { groq, PortableText, type PortableTextComponents } from "next-sanity";
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
  body?: unknown[];
};

const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
  "body": coalesce(body, []),
  mainImage,
  publishedAt
}`;

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[15px] leading-relaxed text-slate-700 last:mb-0 md:text-base">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-12 text-xl font-semibold tracking-tight text-blue-950 first:mt-0 md:text-2xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-10 text-lg font-semibold tracking-tight text-blue-950 first:mt-0 md:text-xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-slate-300 pl-5 text-slate-600 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-1 pl-6 text-[15px] text-slate-700 md:text-base">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-1 pl-6 text-[15px] text-slate-700 md:text-base">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const openInNewTab = Boolean(value?.blank);
      return (
        <a
          href={href}
          className="font-medium text-blue-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-blue-950"
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          target={openInNewTab ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

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

  const bodyValue = Array.isArray(post.body) ? post.body : [];

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

        {bodyValue.length > 0 ? (
          <div className="mt-12 max-w-none border-t border-slate-100 pt-12">
            <PortableText value={bodyValue} components={portableComponents} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
