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

const normalizeLocaleKey = (value: string) => value.trim().toLowerCase().replace(/_/g, "-");

const resolveAppLocale = (raw: string): AppLocale => {
  const key = normalizeLocaleKey(raw);
  if (routing.locales.includes(key as AppLocale)) return key as AppLocale;
  if (key === "us") return "en";
  if (key === "fr" || key.startsWith("fr-")) return "fr-ca";
  if (key.startsWith("en")) return "en";
  if (key.startsWith("es")) return "es";
  return routing.defaultLocale;
};

const localeMeta = (code: AppLocale) => {
  if (code === "en") return { label: "English", flag: "🇺🇸" };
  if (code === "es") return { label: "Spanish", flag: "🇪🇸" };
  return { label: "French", flag: "🇫🇷" };
};

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const rawLocale = useLocale();
  const activeLocale = resolveAppLocale(String(rawLocale));
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = localeMeta(activeLocale);

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
    ? "h-9 min-w-[150px] grid-cols-[auto_1fr_auto] gap-2 px-3 text-sm"
    : "h-10 min-w-[168px] grid-cols-[auto_1fr_auto] gap-2.5 px-3.5 text-sm";

  const rowClass = compact ? "px-3 py-2 text-sm" : "px-3.5 py-2.5 text-sm";

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-label="Language switcher"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={`grid items-center rounded-full border border-slate-200 bg-white font-medium text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/20 ${triggerClass}`}
      >
        <span
          className="shrink-0 text-base leading-none"
          style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
          aria-hidden
        >
          {current.flag}
        </span>
        <span className="truncate text-center">{current.label}</span>
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
          {localeOptions.map((item) => {
            const meta = localeMeta(item.code);
            return (
              <li key={item.code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={item.code === activeLocale}
                  onClick={() => selectLocale(item.code)}
                  className={`flex w-full items-center gap-2.5 rounded-xl font-medium hover:bg-slate-50 ${rowClass} ${
                    item.code === activeLocale ? "bg-slate-100 text-slate-900" : "text-slate-800"
                  }`}
                >
                  <span
                    className="shrink-0 text-base leading-none"
                    style={{ fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif' }}
                    aria-hidden
                  >
                    {meta.flag}
                  </span>
                  <span>{meta.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
