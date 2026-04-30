"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeOptions: { code: AppLocale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr-ca", label: "French", flag: "🇫🇷" },
];

type LanguageSwitcherProps = {
  compact?: boolean;
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = localeOptions.find((o) => o.code === locale) ?? localeOptions[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectLocale = (code: AppLocale) => {
    if (!routing.locales.includes(code)) return;
    router.replace(pathname, { locale: code });
    setOpen(false);
  };

  const triggerClass = compact
    ? "h-9 gap-2 px-3 pr-2 text-sm"
    : "h-10 gap-2.5 px-3.5 pr-2.5 text-sm";

  const rowClass = compact ? "px-3 py-2 text-sm" : "px-3.5 py-2.5 text-sm";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Language switcher"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center rounded-full border border-slate-200 bg-white font-medium text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/20 ${triggerClass}`}
      >
        <span
          className="shrink-0 select-none text-base leading-none"
          style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
          aria-hidden
        >
          {current.flag}
        </span>
        <span className="truncate">{current.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm"
        >
          {localeOptions.map((item) => (
            <li key={item.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.code === locale}
                onClick={() => selectLocale(item.code)}
                className={`flex w-full items-center gap-2.5 rounded-xl font-medium hover:bg-slate-50 ${rowClass} ${
                  item.code === locale ? "bg-slate-100 text-slate-900" : "text-slate-800"
                }`}
              >
                <span
                  className="shrink-0 text-base leading-none"
                  style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
                  aria-hidden
                >
                  {item.flag}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
