"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryExcursionPath } from "@/lib/categoryPath";
import { resolveLocalizedTitle, type LocalizedString } from "@/lib/localizedTitle";
import { urlFor } from "@/sanity/lib/image";
import { type AppLocale } from "@/i18n/routing";

export type CategoryBanner = {
  slug?: string;
  title?: LocalizedString | string;
  mainImage?: unknown;
};

type CategoryBannersProps = {
  categories: CategoryBanner[];
  locale: AppLocale;
};

export default function CategoryBanners({ categories, locale }: CategoryBannersProps) {
  const t = useTranslations("CategoryBanners");

  if (!categories.length) {
    return null;
  }

  return (
    <div key={locale} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {categories.map((category) => {
        const slug = category.slug ?? "";
        const title = resolveLocalizedTitle(category.title, locale) || "Category";
        const href = slug ? categoryExcursionPath(slug) : "/excursions";
        const imageUrl = (() => {
          try {
            return category.mainImage
              ? urlFor(category.mainImage).width(1200).height(800).fit("crop").url()
              : null;
          } catch {
            return null;
          }
        })();

        return (
          <article
            key={slug || title}
            className="group relative min-h-[280px] overflow-hidden rounded-xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl md:min-h-[320px]"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
            )}
            <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/50" />
            <div className="relative flex h-full min-h-[280px] flex-col items-center justify-center gap-5 p-8 text-center md:min-h-[320px]">
              <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h3>
              <Link
                href={href}
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white hover:bg-white hover:text-slate-900"
              >
                {t("exploreTours")}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
