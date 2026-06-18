import TourCard from "@/components/TourCard";
import FeaturedAdventuresHeading from "@/components/FeaturedAdventuresHeading";
import FeaturedAdventuresEmpty from "@/components/FeaturedAdventuresEmpty";
import { peekBookingUrl } from "@/lib/tourPrice";

export type FeaturedTour = {
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

type FeaturedAdventuresProps = {
  tours: FeaturedTour[];
};

export default function FeaturedAdventures({ tours }: FeaturedAdventuresProps) {
  return (
    <section className="w-full">
      <FeaturedAdventuresHeading />
      {tours.length === 0 ? (
        <FeaturedAdventuresEmpty />
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
