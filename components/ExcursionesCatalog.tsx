"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { formatTourPrice } from "@/lib/tourPrice";

export type ExcursionTour = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: unknown;
  duration?: string;
  category?: {
    slug?: string;
    title?: string;
  };
  currency: string;
  pricing?: Array<{ price?: number | string | null }>;
};

type CatalogCategory = {
  slug: string;
  title: string;
};

const getMinPricing = (pricing: Array<{ price?: number | string | null }> = []) => {
  const values = pricing
    .map((item) =>
      typeof item.price === "number"
        ? item.price
        : Number(String(item.price ?? "").replace(/[^0-9.]/g, "")),
    )
    .filter((item): item is number => Number.isFinite(item));
  if (!values.length) return undefined;
  values.sort((a, b) => a - b);
  return values[0];
};

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
    return tours.filter((tour) => tour.category?.slug === activeCategory);
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

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTours.map((tour) => {
            const minPrice = getMinPricing(tour.pricing);
            const displayPrice =
              minPrice != null ? formatTourPrice(tour.currency, minPrice) : "Consultar precio";

            return (
              <article
                key={tour._id}
                className="group flex h-[30rem] flex-col overflow-hidden rounded-[2rem] bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-[60%] w-full overflow-hidden">
                  {tour.mainImage ? (
                    <Image
                      src={urlFor(tour.mainImage).width(900).height(700).fit("crop").url()}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
                <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                <div className="h-[40%] p-6">
                  <div className="mb-3 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
                    From {displayPrice}
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight text-[#0a192f]">
                    {tour.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {tour.category?.title || tour.category?.slug || "Uncategorized"}
                    {tour.duration ? ` • ${tour.duration}` : ""}
                  </p>
                  <Link
                    href={`/excursiones/${tour.slug}`}
                    className="mt-5 inline-flex rounded-full bg-[#0a192f] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#132a46]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
