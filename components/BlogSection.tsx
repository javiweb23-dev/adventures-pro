import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type BlogPostPreview = {
  _id: string;
  title?: string;
  slug?: string;
  mainImage?: { asset: unknown };
  excerpt?: string;
};

const BLOG_PREVIEW_QUERY = `*[_type == "post"] | order(publishedAt desc) [0...3] {
  _id,
  "title": coalesce(title.en, title),
  "slug": slug.current,
  mainImage,
  "excerpt": coalesce(excerpt.en, excerpt)
}`;

export default async function BlogSection() {
  const posts = await client.fetch<BlogPostPreview[]>(BLOG_PREVIEW_QUERY).catch(() => []);

  return (
    <section className="w-full bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">
            Traveler&apos;s Guide
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            Stories, tips, and inspiration for your next Dominican Republic adventure.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-slate-600">
            New articles are coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {posts.map((post) => {
              const slug = post.slug ?? "";
              const href = slug ? `/blog/${slug}` : "/blog";
              const title = post.title ?? "Untitled";
              const imageUrl = (() => {
                try {
                  return post.mainImage?.asset
                    ? urlFor(post.mainImage).width(800).height(450).fit("crop").url()
                    : null;
                } catch {
                  return null;
                }
              })();
              return (
                <Link
                  key={post._id}
                  href={href}
                  className="group flex flex-col overflow-hidden border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
                >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-blue-950 group-hover:underline md:text-xl">
                    {title}
                  </h3>
                  {post.excerpt ? (
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 md:text-[15px]">
                      {post.excerpt}
                    </p>
                  ) : null}
                </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-center md:mt-12">
          <Link
            href="/blog"
            className="text-sm font-semibold text-blue-950 underline-offset-4 transition hover:underline"
          >
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
