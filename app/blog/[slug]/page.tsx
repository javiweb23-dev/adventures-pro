import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type PortableTextBlock = {
  _type: "block";
  _key: string;
  children?: Array<{ _type: "span"; text?: string }>;
};

type PostDoc = {
  title: string;
  publishedAt: string;
  mainImage?: { asset: unknown };
  excerpt?: string;
  body?: PortableTextBlock[];
};

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title,
  publishedAt,
  mainImage,
  excerpt,
  body
}`;

const extractBodyText = (blocks: PortableTextBlock[] = []) =>
  blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter((t) => t.trim().length > 0);

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<PostDoc | null>(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const paragraphs = extractBodyText(post.body ?? []);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-blue-950 underline-offset-4 hover:underline"
        >
          ← All articles
        </Link>
        {post.mainImage?.asset ? (
          <div className="relative mt-8 aspect-video w-full overflow-hidden border border-slate-200 bg-slate-200">
            <img
              src={urlFor(post.mainImage).width(1200).height(675).fit("crop").url()}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
          {post.title}
        </h1>
        {date ? (
          <p className="mt-2 text-sm text-slate-500">{date}</p>
        ) : null}
        {post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-slate-700">{post.excerpt}</p>
        ) : null}
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700 md:text-base">
          {paragraphs.map((p, i) => (
            <p key={`${i}-${p.slice(0, 24)}`}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
