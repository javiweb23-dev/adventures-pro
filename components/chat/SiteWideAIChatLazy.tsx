"use client";

import dynamic from "next/dynamic";
import type { AppLocale } from "@/i18n/routing";

const SiteWideAIChat = dynamic(() => import("@/components/chat/SiteWideAIChat"), {
  ssr: false,
  loading: () => null,
});

type SiteWideAIChatLazyProps = {
  locale: AppLocale;
};

/** Lazy site-wide sales concierge — excluded from SSR/LCP. */
export default function SiteWideAIChatLazy({ locale }: SiteWideAIChatLazyProps) {
  return <SiteWideAIChat locale={locale} />;
}
