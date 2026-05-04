"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function BlogSectionViewAll() {
  const t = useTranslations("Blog");

  return (
    <div className="mt-10 text-center md:mt-12">
      <Link
        href="/blog"
        className="text-sm font-semibold text-blue-950 underline-offset-4 transition hover:underline"
      >
        {t("viewAll")}
      </Link>
    </div>
  );
}
