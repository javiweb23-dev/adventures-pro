"use client";

import { useTranslations } from "next-intl";

type HomeHeroTextProps = {
  cmsTitle?: string | null;
  cmsSubtitle?: string | null;
};

export default function HomeHeroText({ cmsTitle, cmsSubtitle }: HomeHeroTextProps) {
  const t = useTranslations("Home");
  const title = (cmsTitle?.trim() || t("defaultTitle")).trim();
  const subtitle = (cmsSubtitle?.trim() || t("defaultSubtitle")).trim();

  return (
    <>
      <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
        {t("brandEyebrow")}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 text-sm text-slate-100 md:text-base">{subtitle}</p>
    </>
  );
}
