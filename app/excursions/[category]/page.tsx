import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import TourCard from "@/components/TourCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { peekBookingUrl } from "@/lib/tourPrice";

type ListingPageProps = {
  params: Promise<{ category: string }>;
};

type ListingTour = {
  _id: string;
  title: string;
  slug: string;
  duration?: string;
  listingImage?: { asset: unknown };
  highlightBadge?: string;
  peekProId: string;
  currency?: string;
  pricing?: Array<{ price?: string }>;
};

const CATEGORIES = [
  "water-tours",
  "land-tours",
  "private-tours",
  "combo-experience",
  "multidays-tours",
];

const TOURS_BY_CATEGORY_QUERY = `*[_type == "tour" && category->slug.current == $category]{
  _id,
  "title": coalesce(title.en, title),
  "slug": slug.current,
  duration,
  listingImage,
  highlightBadge,
  peekProId,
  "currency": coalesce(currency, "USD"),
  pricing[]{price}
} | order(_createdAt desc)`;

const formatCategoryTitle = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function CategoryPage({ params }: ListingPageProps) {
  const { category } = await params;

  if (!CATEGORIES.includes(category)) {
    notFound();
  }

  const tours = await client.fetch<ListingTour[]>(TOURS_BY_CATEGORY_QUERY, {
    category,
  });

  const categoryTitle = formatCategoryTitle(category);

  return (
    <div className="bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-12 lg:px-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: categoryTitle },
          ]}
        />
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {categoryTitle}
        </h1>
        <p className="mt-3 text-slate-600">
          Find your perfect excursion.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => {
            return (
              <TourCard
                key={tour._id}
                tour={{
                  title: tour.title,
                  slug: tour.slug,
                  duration: tour.duration,
                  listingImage: tour.listingImage,
                  highlightBadge: tour.highlightBadge,
                  pricing: tour.pricing,
                  currency: tour.currency,
                  peekUrl: peekBookingUrl(tour.peekProId),
                }}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
