import { groq } from "next-sanity";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import type { AppLocale } from "@/i18n/routing";

type PostRow = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
};

const ALL_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title.es, title.frCA),
  "slug": slug.current,
  "excerpt": coalesce(select($locale == "fr-ca" => excerpt.frCA, excerpt[$locale]), excerpt.en, excerpt.es, excerpt.frCA)
}`;

type BlogIndexPageProps = {
  params: Promise<{ locale: AppLocale }>;
};

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await client.fetch<PostRow[]>(ALL_POSTS_QUERY, { locale });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
          Blog
        </h1>
        <p className="mt-3 text-slate-600">
          Travel guides and updates from Adventures Finder.
        </p>
        <ul className="mt-10 divide-y divide-slate-200 border border-slate-200 bg-white">
          {posts.length === 0 ? (
            <li className="px-5 py-8 text-center text-slate-600">
              No articles yet.
            </li>
          ) : (
            posts.map((post) => {
              const title = post.title?.trim() || "Untitled";
              const excerpt = post.excerpt?.trim();
              const slug = post.slug ?? "";
              return (
                <li key={post._id}>
                  <Link
                    href={slug ? `/blog/${slug}` : "/blog"}
                    className="block px-5 py-5 transition hover:bg-slate-50"
                  >
                    <span className="font-semibold text-blue-950">{title}</span>
                    {excerpt ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </main>
    </div>
  );
}
