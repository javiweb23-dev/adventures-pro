import { groq } from "next-sanity";
import TourDetailPage from "@/app/tours/[slug]/page";
import { client } from "@/sanity/lib/client";
import { routing, type AppLocale } from "@/i18n/routing";
import { slugFromParams, slugToStaticParams } from "@/lib/tourSlug";

export const revalidate = 0;
export const dynamicParams = true;

type LocalizedTourDetailPageProps = {
  params: Promise<{ locale: AppLocale; slug: string[] }>;
};

export async function generateStaticParams() {
  const tours = await client.fetch<Array<{ slug: string }>>(
    groq`*[_type == "tour" && defined(slug.current)]{
      "slug": slug.current
    }`,
  );

  return routing.locales.flatMap((locale) =>
    tours?.map((tour) => ({
      locale,
      slug: slugToStaticParams(tour.slug),
    })) || [],
  );
}

export default async function LocalizedTourDetailPage({
  params,
}: LocalizedTourDetailPageProps) {
  const { slug, locale } = await params;
  const resolvedSlug = slugFromParams(slug);
  return (
    <TourDetailPage params={Promise.resolve({ slug: resolvedSlug, locale })} />
  );
}
