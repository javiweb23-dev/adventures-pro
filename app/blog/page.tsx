import Link from "next/link";
import { client } from "@/sanity/lib/client";

type PostRow = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
};

const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt
}`;

export default async function BlogIndexPage() {
  const posts = await client.fetch<PostRow[]>(ALL_POSTS_QUERY);

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
            posts.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block px-5 py-5 transition hover:bg-slate-50"
                >
                  <span className="font-semibold text-blue-950">{post.title}</span>
                  {post.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {post.excerpt}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
