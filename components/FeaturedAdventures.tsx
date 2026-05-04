import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import TourCard from "@/components/TourCard";
import FeaturedAdventuresHeading from "@/components/FeaturedAdventuresHeading";
import FeaturedAdventuresEmpty from "@/components/FeaturedAdventuresEmpty";
import { peekBookingUrl } from "@/lib/tourPrice";
import { type AppLocale } from "@/i18n/routing";

type FeaturedTour = {
  _id: string;
  title?: string;
  slug?: string;
  duration?: string;
  listingImage?: { asset: unknown };
  highlightBadge?: string;
  peekProId?: string;
  currency?: string;
  pricing?: Array<{ price?: number | string | null }>;
};

const FEATURED_TOURS_QUERY = groq`*[_type == "tour" && isFeatured == true] | order(_createdAt desc) [0...6] {
  _id,
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
  "slug": slug.current,
  "duration": coalesce(select($locale == "fr-ca" => duration.frCA, duration[$locale]), duration.en, duration.es, duration.frCA),
  listingImage,
  highlightBadge,
  peekProId,
  "currency": coalesce(currency, "USD"),
  pricing[]{price}
}`;

export default async function FeaturedAdventures({ locale }: { locale: AppLocale }) {
  const tours = await client
    .fetch<FeaturedTour[]>(FEATURED_TOURS_QUERY, { locale })
    .catch(() => []);

  return (
    <section className="w-full">
      <FeaturedAdventuresHeading />
      {tours.length === 0 ? (
        <FeaturedAdventuresEmpty />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => {
            const slug = tour.slug ?? "";
            const title = tour.title ?? "Tour";
            const peekUrl = tour.peekProId ? peekBookingUrl(tour.peekProId) : "#";
            return (
              <TourCard
                key={tour._id}
                tour={{
                  title,
                  slug,
                  duration: tour.duration,
                  listingImage: tour.listingImage,
                  highlightBadge: tour.highlightBadge,
                  pricing: tour.pricing,
                  currency: tour.currency,
                  peekUrl,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
