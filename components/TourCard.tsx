import { Clock3 } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Link } from "@/i18n/navigation";
import { formatTourPrice } from "@/lib/tourPrice";

type TourCardProps = {
  tour: {
    title: string;
    slug: string;
    duration?: string;
    listingImage?: { asset: unknown };
    highlightBadge?: string;
    pricing?: Array<{ price?: string }>;
    currency?: string;
    fromPriceLabel?: string;
    peekUrl: string;
  };
};

export default function TourCard({ tour }: TourCardProps) {
  const firstPrice = tour.pricing?.[0]?.price;
  const computedPrice = firstPrice
    ? `From ${formatTourPrice(tour.currency || "USD", firstPrice)}`
    : tour.fromPriceLabel || "Consultar precio";
  const safeSlug = tour.slug || "";
  const detailsHref = safeSlug ? `/excursiones/${safeSlug}` : "/excursiones";
  const imageUrl = (() => {
    try {
      return tour.listingImage?.asset
        ? urlFor(tour.listingImage).width(1200).height(800).fit("crop").url()
        : null;
    } catch {
      return null;
    }
  })();

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tour.title}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="h-56 w-full bg-slate-200" />
        )}
        {tour.highlightBadge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900">
            {tour.highlightBadge}
          </span>
        ) : null}
      </div>
      <div className="space-y-4 p-5">
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
          <Clock3 className="h-4 w-4" />
          <span>{tour.duration || "Duration on request"}</span>
        </div>
        <h3 className="text-xl font-semibold leading-tight text-slate-900">
          {tour.title}
        </h3>
        <p className="text-lg font-semibold text-blue-950">
          {computedPrice}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={tour.peekUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Book Now
          </a>
          <Link
            href={detailsHref}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            More Info
          </Link>
        </div>
      </div>
    </article>
  );
}
