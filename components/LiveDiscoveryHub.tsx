"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import { formatTourPrice } from "@/lib/tourPrice";

export type DiscoveryTour = {
  _id: string;
  title?: string;
  slug?: string;
  mainImage?: unknown;
  category?: string;
  duration?: string;
  currency?: string;
  price?: string | number | null;
  amount?: number | null;
  pricing?: Array<{ price?: string | number; amount?: number | null }>;
};

type PriceRange = "all" | "under-100" | "100-200" | "premium";

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "water-tours", label: "Water" },
  { id: "land-tours", label: "Land" },
  { id: "private-tours", label: "Private" },
  { id: "multidays-tours", label: "Multidays" },
] as const;

const priceRangeFilters: { id: PriceRange; label: string }[] = [
  { id: "all", label: "All Budgets" },
  { id: "under-100", label: "Under $100" },
  { id: "100-200", label: "$100-$200" },
  { id: "premium", label: "Premium" },
];

const categoryLabels: Record<string, string> = {
  "water-tours": "Water",
  "land-tours": "Land",
  "private-tours": "Private",
  "combo-experience": "Combo",
  "multidays-tours": "Multidays",
};

const parseNumericPrice = (value?: string | number | null) => {
  if (value == null) return Number.NaN;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return Number.NaN;
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  const cleaned = trimmed.replace(/[^\d.,-]/g, "");
  if (!cleaned) return Number.NaN;
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");
  const decimalIndex = Math.max(lastDot, lastComma);
  let normalized = cleaned;
  if (decimalIndex !== -1) {
    const intPart = cleaned.slice(0, decimalIndex).replace(/[.,]/g, "");
    const decimalPart = cleaned.slice(decimalIndex + 1).replace(/[.,]/g, "");
    normalized = `${intPart}.${decimalPart}`;
  } else {
    normalized = cleaned.replace(/[.,]/g, "");
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const numericFromPricingRow = (item: {
  price?: string | number | null;
  amount?: number | null;
}) => {
  const parsedPrice = parseNumericPrice(item.price);
  if (Number.isFinite(parsedPrice)) return parsedPrice;
  if (item.amount != null && Number.isFinite(item.amount)) return item.amount;
  return Number.NaN;
};

const getMinPricingValue = (pricing?: Array<{
  price?: string | number | null;
  amount?: number | null;
}>) => {
  if (!pricing?.length) return Number.NaN;
  const values = pricing
    .map((item) => numericFromPricingRow(item))
    .filter((value) => Number.isFinite(value));
  return values.length ? Math.min(...values) : Number.NaN;
};

const getTourMinPrice = (tour: DiscoveryTour) => {
  const pricingMin = getMinPricingValue(tour.pricing);
  if (Number.isFinite(pricingMin)) return pricingMin;
  const topLevelAmount =
    tour.amount != null && Number.isFinite(tour.amount) ? tour.amount : Number.NaN;
  if (Number.isFinite(topLevelAmount)) return topLevelAmount;
  return parseNumericPrice(tour.price);
};

const buildImageUrl = (image: unknown) => {
  try {
    return image ? urlFor(image).width(900).height(700).fit("crop").url() : null;
  } catch {
    return null;
  }
};

export default function LiveDiscoveryHub({ tours }: { tours?: DiscoveryTour[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePriceRange, setActivePriceRange] = useState<PriceRange>("all");

  const filteredTours = useMemo(() => {
    return (tours ?? []).filter((tour) => {
      const safeCategory = tour.category ?? "";
      const matchesCategory = activeCategory === "all" || safeCategory === activeCategory;

      const minPrice = getTourMinPrice(tour);
      const matchesPriceRange =
        activePriceRange === "all" ||
        (activePriceRange === "under-100" &&
          Number.isFinite(minPrice) &&
          minPrice >= 0 &&
          minPrice < 100) ||
        (activePriceRange === "100-200" &&
          Number.isFinite(minPrice) &&
          minPrice >= 100 &&
          minPrice <= 200) ||
        (activePriceRange === "premium" && Number.isFinite(minPrice) && minPrice > 200);

      return matchesCategory && matchesPriceRange;
    });
  }, [activePriceRange, activeCategory, tours]);

  const visibleTours = filteredTours.slice(0, 4);

  const resultsHref = useMemo(() => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (activePriceRange !== "all") params.set("budget", activePriceRange);
    const query = params.toString();
    return query ? `/excursiones?${query}` : "/excursiones";
  }, [activePriceRange, activeCategory]);

  return (
    <div>
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
        Live Discovery Hub
      </h2>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {categoryFilters.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveCategory(item.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#0a192f] bg-[#0a192f] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {priceRangeFilters.map((item) => {
          const isActive = activePriceRange === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePriceRange(item.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                isActive
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {visibleTours.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-[#0a192f]">No tours found</p>
          <p className="mt-2 text-sm text-slate-600">
            Try a different category or budget to discover more experiences.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {visibleTours.map((tour) => {
            const minPrice = getTourMinPrice(tour);
            const price = Number.isFinite(minPrice)
              ? formatTourPrice(tour.currency ?? "USD", minPrice)
              : formatTourPrice(
                  tour.currency ?? "USD",
                  undefined,
                  typeof tour.pricing?.[0]?.price === "number"
                    ? String(tour.pricing[0].price)
                    : tour.pricing?.[0]?.price ?? (typeof tour.price === "number" ? String(tour.price) : tour.price),
                );
            const slug = tour.slug ?? "";
            const title = tour.title ?? "Tour";
            const categoryLabel = categoryLabels[tour.category ?? ""] ?? tour.category ?? "Uncategorized";
            const imageUrl = buildImageUrl(tour.mainImage);

            return (
              <article
                key={tour._id}
                className="group overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
                <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
                <div className="p-5">
                  <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-orange-500">
                    From {price}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-[#0a192f]">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {categoryLabel}
                    {tour.duration ? ` • ${tour.duration}` : ""}
                  </p>
                  <Link
                    href={slug ? `/excursiones/${slug}` : "/excursiones"}
                    className="mt-4 inline-flex rounded-full bg-[#0a192f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132a46]"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {(activeCategory !== "all" || activePriceRange !== "all") && (
        <div className="mt-8 text-center">
          <Link
            href={resultsHref}
            className="inline-flex rounded-full border border-[#0a192f] px-6 py-3 text-sm font-semibold text-[#0a192f] transition hover:bg-[#0a192f] hover:text-white"
          >
            Ver todos los resultados
          </Link>
        </div>
      )}
    </div>
  );
}
