"use client";

import { useTranslations } from "next-intl";

/** SEO hero copy from i18n only (locale from route via next-intl). */
export default function HomeHeroText() {
  const t = useTranslations("Home");

  return (
    <>
      <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
        {t("brandEyebrow")}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
        {t("defaultTitle")}
      </h1>
      <h2 className="mt-4 text-sm font-normal leading-relaxed text-slate-100 md:text-base">
        {t("defaultSubtitle")}
      </h2>
    </>
  );
}
