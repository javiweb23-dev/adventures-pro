import { client } from "@/sanity/lib/client";
import TourCard from "@/components/TourCard";
import { peekBookingUrl } from "@/lib/tourPrice";

type FeaturedTour = {
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

const FEATURED_TOURS_QUERY = `*[_type == "tour" && isFeatured == true] | order(_createdAt desc) [0...6] {
  _id,
  "title": coalesce(title.en, title),
  "slug": slug.current,
  duration,
  listingImage,
  highlightBadge,
  peekProId,
  "currency": coalesce(currency, "USD"),
  pricing[]{price}
}`;

export default async function FeaturedAdventures() {
  const tours = await client.fetch<FeaturedTour[]>(FEATURED_TOURS_QUERY);

  return (
    <section className="w-full">
      <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900/70">
          Our recommended adventures
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-blue-950 md:text-4xl md:leading-tight">
          Exceptional travel moments designed with You in mind
        </h2>
      </div>
      {tours.length === 0 ? (
        <p className="text-center text-slate-600">
          Featured tours will appear here when marked in the CMS.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
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
      )}
    </section>
  );
}
