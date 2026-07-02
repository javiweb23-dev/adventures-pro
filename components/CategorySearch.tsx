"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import TourCard from "@/components/TourCard";
import { peekBookingUrl } from "@/lib/tourPrice";

export type CategoryTour = {
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

type CategorySearchProps = {
  tours: CategoryTour[];
  categorySlug: string;
  messagesNamespace?: "CategoryPage" | "DestinationPage";
};

export default function CategorySearch({
  tours,
  categorySlug,
  messagesNamespace = "CategoryPage",
}: CategorySearchProps) {
  const t = useTranslations(messagesNamespace);
  const [query, setQuery] = useState("");

  const filteredTours = useMemo(() => {
    const scoped = tours.filter((tour) => Boolean(tour.slug));
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return scoped;
    return scoped.filter((tour) =>
      (tour.title ?? "").toLowerCase().includes(trimmed),
    );
  }, [query, tours]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16 lg:px-12">
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-center"
      >
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/15"
        />
        <button
          type="submit"
          className="h-12 w-full shrink-0 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 md:w-auto"
        >
          {t("searchButton")}
        </button>
      </form>

      {tours.length === 0 ? (
        <p className="mt-16 text-center text-lg text-slate-600">{t("empty")}</p>
      ) : filteredTours.length === 0 ? (
        <p className="mt-16 text-center text-lg text-slate-600">{t("noResults")}</p>
      ) : (
        <div
          key={categorySlug}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {filteredTours.map((tour) => {
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
    </div>
  );
}
