"use client";

import { useTranslations } from "next-intl";

export default function BlogSectionEmpty() {
  const t = useTranslations("Blog");
  return <p className="text-center text-slate-600">{t("empty")}</p>;
}
