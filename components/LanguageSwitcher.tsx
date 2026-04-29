"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeOptions: { code: AppLocale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "fr-ca", label: "FR", flag: "🇨🇦" },
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
    ? "h-9 gap-1.5 px-2.5 pr-1.5 text-[11px]"
    : "h-10 gap-2 px-3 pr-2 text-xs";

  const rowClass = compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Language switcher"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center rounded-full border border-slate-300 bg-white font-semibold tracking-[0.08em] text-[#0a192f] outline-none transition hover:border-slate-400 focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/20 ${triggerClass}`}
      >
        <span className="shrink-0 select-none text-[1.1rem] leading-none" aria-hidden>
          {current.flag}
        </span>
        <span>{current.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {localeOptions.map((item) => (
            <li key={item.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={item.code === locale}
                onClick={() => selectLocale(item.code)}
                className={`flex w-full items-center gap-2 font-semibold tracking-[0.08em] hover:bg-slate-50 ${rowClass} ${
                  item.code === locale ? "bg-slate-50 text-[#0a192f]" : "text-slate-700"
                }`}
              >
                <span className="shrink-0 text-[1.1rem] leading-none" aria-hidden>
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
