"use client";

import { useTranslations } from "next-intl";

export default function FeaturedAdventuresHeading() {
  const t = useTranslations("Featured");

  return (
    <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900/70">{t("kicker")}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-blue-950 md:text-4xl md:leading-tight">
        {t("headline")}
      </h2>
    </div>
  );
}
