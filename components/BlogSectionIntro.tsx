"use client";

import { useTranslations } from "next-intl";

export default function BlogSectionIntro() {
  const t = useTranslations("Blog");

  return (
    <div className="mb-10 text-center md:mb-14">
      <h2 className="text-3xl font-semibold tracking-tight text-blue-950 md:text-4xl">{t("title")}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
        {t("subtitle")}
      </p>
    </div>
  );
}
