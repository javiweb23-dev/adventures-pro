"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { formatTourPrice, peekBookingUrl } from "@/lib/tourPrice";
import { tourExcursionPath } from "@/lib/tourSlug";

export type ExcursionTour = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: unknown;
  duration?: string;
  peekProId?: string;
  category?: {
    slug?: string;
    title?: string;
  };
  categorySlugs?: string[];
  currency: string;
  pricing?: Array<{ price?: number | string | null }>;
};

type CatalogCategory = {
  slug: string;
  title: string;
};

const parseNumericPrice = (value?: string | number | null) => {
  if (value == null) return Number.NaN;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return Number.NaN;
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  const cleaned = trimmed.replace(/[^\d.,-]/g, "");
  if (!cleaned) return Number.NaN;
  let normalized = cleaned;
  if (cleaned.includes(",") && cleaned.includes(".")) {
    normalized = cleaned.replace(/,/g, "");
  } else if (cleaned.includes(",") && !cleaned.includes(".")) {
    normalized = /,\d{1,2}$/.test(cleaned) ? cleaned.replace(",", ".") : cleaned.replace(/,/g, "");
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const getFirstPricingValue = (tour: ExcursionTour) => parseNumericPrice(tour.pricing?.[0]?.price);

export default function ExcursionesCatalog({
  tours,
  categories,
  initialCategory = "all",
}: {
  tours: ExcursionTour[];
  categories: CatalogCategory[];
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const filteredTours = useMemo(() => {
    if (activeCategory === "all") return tours;
    return tours.filter(
      (tour) =>
        tour.category?.slug === activeCategory ||
        tour.categorySlugs?.includes(activeCategory),
    );
  }, [activeCategory, tours]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16 lg:px-12">
        <h1 className="text-center text-4xl font-bold tracking-tight text-[#0a192f] md:text-5xl">
          Excursions Catalog
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600">
          Explore premium curated adventures across Punta Cana and filter by category.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "border-[#0a192f] bg-[#0a192f] text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTours.map((tour) => {
            const firstPricingValue = getFirstPricingValue(tour);
            const computedPrice = Number.isFinite(firstPricingValue)
              ? formatTourPrice(tour.currency, firstPricingValue)
              : "Consultar precio";
            const slug = tour.slug ?? "";
            const title = tour.title ?? "Tour";
            const peekUrl = tour.peekProId ? peekBookingUrl(tour.peekProId) : "#";

            return (
              <article
                key={tour._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative">
                  {tour.mainImage ? (
                    <Image
                      src={urlFor(tour.mainImage).width(1200).height(800).fit("crop").url()}
                      alt={title}
                      width={1200}
                      height={800}
                      className="h-56 w-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-56 w-full bg-slate-200" />
                  )}
                </div>
                <div className="space-y-4 p-5">
                  <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <Clock3 className="h-4 w-4" />
                    <span>{tour.duration || "Duration on request"}</span>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-slate-900">{title}</h2>
                  <p className="text-sm text-slate-600">
                    {tour.category?.title || tour.category?.slug || "Uncategorized"}
                  </p>
                  <p className="text-lg font-semibold text-blue-950">From {computedPrice}</p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={peekUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      Book Now
                    </a>
                    <Link
                      href={tourExcursionPath(slug)}
                      className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      More Info
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
