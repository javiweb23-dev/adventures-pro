"use client";

import { ChangeEvent } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeOptions: { code: AppLocale; label: string; flag?: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr-ca", label: "FR", flag: "🇨🇦" },
];

type LanguageSwitcherProps = {
  compact?: boolean;
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const onChangeLocale = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as AppLocale;
    if (!routing.locales.includes(nextLocale)) {
      return;
    }
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="relative">
      <select
        aria-label="Language switcher"
        value={locale}
        onChange={onChangeLocale}
        className={`rounded-full border border-slate-300 bg-white text-xs font-semibold tracking-[0.08em] text-[#0a192f] outline-none transition focus:border-cyan-500 ${
          compact ? "h-9 px-2 pr-7 text-[11px]" : "h-10 px-3 pr-8"
        }`}
      >
        {localeOptions.map((item) => (
          <option key={item.code} value={item.code}>
            {item.flag ? `${item.flag} ${item.label}` : item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
