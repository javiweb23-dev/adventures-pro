"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const destinations = [
  { slug: "punta-cana", top: 62, left: 85 },
  { slug: "la-romana-bayahibe", top: 72, left: 75 },
  { slug: "juan-dolio", top: 76, left: 65 },
  { slug: "santo-domingo", top: 78, left: 53 },
  { slug: "samana", top: 35, left: 68 },
  { slug: "miches", top: 43, left: 72 },
  { slug: "puerto-plata", top: 22, left: 32 },
] as const;

export default function InteractiveMap() {
  const t = useTranslations("InteractiveMap");

  return (
    <section className="w-full">
      <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900/70">
          {t("kicker")}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-blue-950 md:text-4xl md:leading-tight">
          {t("headline")}
        </h2>
      </div>
      <div className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-blue-950 shadow-lg md:h-[420px] md:aspect-auto">
        <Image
          src="/images/dr-map.jpg"
          alt={t("mapAlt")}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 1024px"
        />
        {destinations.map((destination) => (
          <Link
            key={destination.slug}
            href={`/excursions?destination=${destination.slug}`}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${destination.top}%`, left: `${destination.left}%` }}
            aria-label={t(`destinations.${destination.slug}`)}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-orange-500 shadow-md transition group-hover:scale-125" />
            </span>
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#0a192f] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition duration-200 group-hover:opacity-100 md:text-sm">
              {t(`destinations.${destination.slug}`)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
