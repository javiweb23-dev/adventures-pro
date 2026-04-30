"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const localeOptions: { code: AppLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr-ca", label: "French" },
];

type LanguageSwitcherProps = {
  compact?: boolean;
};

function FlagIcon({ locale }: { locale: AppLocale }) {
  if (locale === "en") {
    return (
      <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[3px]" aria-hidden>
        <rect width="24" height="16" fill="#b22234" />
        <path d="M0 2h24v2H0zm0 4h24v2H0zm0 4h24v2H0zm0 4h24v2H0z" fill="#fff" />
        <rect width="10.5" height="7" fill="#3c3b6e" />
      </svg>
    );
  }
  if (locale === "es") {
    return (
      <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[3px]" aria-hidden>
        <rect width="24" height="16" fill="#aa151b" />
        <rect y="4" width="24" height="8" fill="#f1bf00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-6 rounded-[3px]" aria-hidden>
      <rect width="8" height="16" fill="#0055a4" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#ef4135" />
    </svg>
  );
}

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
        <FlagIcon locale={current.code} />
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
                <FlagIcon locale={item.code} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
