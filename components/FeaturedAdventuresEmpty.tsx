"use client";

import { useTranslations } from "next-intl";

export default function FeaturedAdventuresEmpty() {
  const t = useTranslations("Featured");
  return <p className="text-center text-slate-600">{t("empty")}</p>;
}
