"use client";

import { useTranslations } from "next-intl";
import { type PriceRange, type SortOrder } from "@/lib/tourFilters";

type TourFiltersProps = {
  sortOrder: SortOrder;
  priceRange: PriceRange;
  onSortOrderChange: (value: SortOrder) => void;
  onPriceRangeChange: (value: PriceRange) => void;
};

const priceRanges: PriceRange[] = ["all", "upTo200", "upTo500", "over500"];

const priceRangeLabelKey: Record<PriceRange, "priceAll" | "priceUpTo200" | "priceUpTo500" | "priceOver500"> = {
  all: "priceAll",
  upTo200: "priceUpTo200",
  upTo500: "priceUpTo500",
  over500: "priceOver500",
};

export default function TourFilters({
  sortOrder,
  priceRange,
  onSortOrderChange,
  onPriceRangeChange,
}: TourFiltersProps) {
  const t = useTranslations("TourFilters");

  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 lg:flex-1 lg:flex-wrap lg:overflow-visible">
        {priceRanges.map((range) => {
          const isActive = priceRange === range;
          return (
            <button
              key={range}
              type="button"
              onClick={() => onPriceRangeChange(range)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "border-blue-800 bg-blue-800 text-white shadow-md shadow-blue-800/20"
                  : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              {t(priceRangeLabelKey[range])}
            </button>
          );
        })}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <label htmlFor="tour-sort" className="text-sm font-medium text-slate-600">
          {t("sortLabel")}
        </label>
        <select
          id="tour-sort"
          value={sortOrder}
          onChange={(event) => onSortOrderChange(event.target.value as SortOrder)}
          className="h-11 min-w-[200px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/15"
        >
          <option value="asc">{t("sortLowToHigh")}</option>
          <option value="desc">{t("sortHighToLow")}</option>
        </select>
      </div>
    </div>
  );
}
