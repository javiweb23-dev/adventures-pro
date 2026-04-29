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
  pricing?: Array<{ price?: string }>;
};

type BudgetFilter = "all" | "under-100" | "100-200" | "premium";

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "water-tours", label: "Water" },
  { id: "land-tours", label: "Land" },
  { id: "private-tours", label: "Private" },
  { id: "multidays-tours", label: "Multidays" },
] as const;

const budgetFilters: { id: BudgetFilter; label: string }[] = [
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

const parseNumericPrice = (value?: string) => {
  if (!value) return Number.NaN;
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const getMinPricingValue = (pricing?: Array<{ price?: string }>) => {
  if (!pricing?.length) return Number.NaN;
  const values = pricing
    .map((item) => parseNumericPrice(item.price))
    .filter((value) => Number.isFinite(value));
  return values.length ? Math.min(...values) : Number.NaN;
};

const buildImageUrl = (image: unknown) => {
  try {
    return image ? urlFor(image).width(900).height(700).fit("crop").url() : null;
  } catch {
    return null;
  }
};

export default function LiveDiscoveryHub({ tours }: { tours?: DiscoveryTour[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [budget, setBudget] = useState<BudgetFilter>("all");

  const filteredTours = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (tours ?? []).filter((tour) => {
      const safeTitle = tour.title ?? "";
      const safeCategory = tour.category ?? "";
      const matchesQuery =
        !query ||
        safeTitle.toLowerCase().includes(query) ||
        (categoryLabels[safeCategory] || "").toLowerCase().includes(query);

      const matchesCategory = category === "all" || safeCategory === category;

      const minPrice = getMinPricingValue(tour.pricing);
      const matchesBudget =
        budget === "all" ||
        (budget === "under-100" && Number.isFinite(minPrice) && minPrice < 100) ||
        (budget === "100-200" &&
          Number.isFinite(minPrice) &&
          minPrice >= 100 &&
          minPrice <= 200) ||
        (budget === "premium" && Number.isFinite(minPrice) && minPrice > 200);

      return matchesQuery && matchesCategory && matchesBudget;
    });
  }, [budget, category, searchQuery, tours]);

  const visibleTours = filteredTours.slice(0, 4);

  const resultsHref = useMemo(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (category !== "all") params.set("category", category);
    if (budget !== "all") params.set("budget", budget);
    const query = params.toString();
    return query ? `/excursiones?${query}` : "/excursiones";
  }, [budget, category, searchQuery]);

  return (
    <div>
      <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
        Live Discovery Hub
      </h2>

      <div className="mx-auto max-w-3xl">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search your next adventure"
          className="h-12 w-full rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-800 outline-none transition focus:border-[#0a192f] focus:ring-2 focus:ring-[#0a192f]/15"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {categoryFilters.map((item) => {
          const isActive = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
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
        {budgetFilters.map((item) => {
          const isActive = budget === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setBudget(item.id)}
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

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        {visibleTours.map((tour) => {
          const firstPrice = tour.pricing?.[0]?.price;
          const price = formatTourPrice(
            tour.currency ?? "USD",
            undefined,
            firstPrice,
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

      {(searchQuery.trim().length > 0 || category !== "all" || budget !== "all") && (
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
