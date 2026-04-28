"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

const excursionLinks = [
  { label: "Water Tours", href: "/excursions/water-tours" },
  { label: "Land Tours", href: "/excursions/land-tours" },
  { label: "Private Tours", href: "/excursions/private-tours" },
  { label: "Combo Experience", href: "/excursions/combo-experience" },
  { label: "Multidays Tours", href: "/excursions/multidays-tours" },
];

type TripType = "one_way" | "round_trip";

type OriginCode = "PUJ" | "LRM";

type TransferHotel = {
  n: string;
  ow: string;
  rt: string;
};

const hotels: TransferHotel[] = [
  {
    n: "AC Marriot Hotel",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Alsol Tiara Cap Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/8m1X5",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/aDke6",
  },
  {
    n: "ART VILLA DOMINICANA",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Bahía Príncipe Grand Bavaro",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Barceló Bávaro Palace",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Be Live Collection Punta Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Casa de Campo",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/EPeyo",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmk2z",
  },
  {
    n: "Club Med Michès Playa Esmeralda",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/mYxlz",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/B0RO0",
  },
  {
    n: "Dreams Dominicus La Romana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbd1",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/aDke6",
  },
  {
    n: "Dreams Royal Beach",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Excellence El Carmen",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/V3jLJ",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/PWb4D",
  },
  {
    n: "Excellence Punta Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/V3jLJ",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/PWb4D",
  },
  {
    n: "Hard Rock Hotel & Casino",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Hyatt Ziva Cap Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/8m1X5",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/aDke6",
  },
  {
    n: "Iberostar Grand Bávaro",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Impressive Punta Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Lopesan Costa Bávaro",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Majestic Elegance Punta Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Meliá Caribe Beach Resort",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Nickelodeon Hotels & Resorts",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/V3jLJ",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/PWb4D",
  },
  {
    n: "Ocean El Faro",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/V3jLJ",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/PWb4D",
  },
  {
    n: "Paradisus Palma Real",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Riu República",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Royalton Bávaro",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Sanctuary Cap Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/8m1X5",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/aDke6",
  },
  {
    n: "Secrets Royal Beach",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "TRS Turquesa Hotel",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
  {
    n: "Vista Sol Punta Cana",
    ow: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/LRbq4",
    rt: "https://book.peek.com/s/d11643a7-7613-46f8-b5cd-5cd508dfbc46/dmkA8",
  },
];

const ORIGIN_OPTIONS: { code: OriginCode; label: string }[] = [
  { code: "PUJ", label: "Punta Cana Airport (PUJ)" },
  { code: "LRM", label: "La Romana Airport (LRM)" },
];

function buildPeekTransferHref(
  hotel: TransferHotel,
  tripType: TripType,
  originCode: OriginCode,
) {
  const base = tripType === "one_way" ? hotel.ow : hotel.rt;
  const url = new URL(base);
  const originLabel =
    ORIGIN_OPTIONS.find((o) => o.code === originCode)?.label ?? "";
  url.searchParams.set("pickup_airport", originLabel);
  return url.toString();
}

export default function HeroSearch() {
  const t = useTranslations("HeroSearch");
  const [tab, setTab] = useState<"activities" | "transfers">("activities");
  const [activityQuery, setActivityQuery] = useState("");
  const [tripType, setTripType] = useState<TripType>("one_way");
  const [origin, setOrigin] = useState<OriginCode>("PUJ");
  const [hotelQuery, setHotelQuery] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<TransferHotel | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filteredHotels = useMemo(() => {
    const q = hotelQuery.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter((h) => h.n.toLowerCase().includes(q));
  }, [hotelQuery]);

  const clearHotelField = () => {
    setHotelQuery("");
    setSelectedHotel(null);
    setListOpen(true);
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setListOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const transferHref = selectedHotel
    ? buildPeekTransferHref(selectedHotel, tripType, origin)
    : "";

  const transferReady = Boolean(selectedHotel);

  return (
    <div className="rounded-2xl bg-white p-1 shadow-lg md:p-2">
      <div className="flex border-b border-slate-200 px-2 pt-1 md:px-3">
        <button
          type="button"
          onClick={() => setTab("activities")}
          className={`relative px-4 py-3 text-sm font-semibold transition md:px-6 md:text-base ${
            tab === "activities"
              ? "text-blue-950"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Activities
          {tab === "activities" ? (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-800" />
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => setTab("transfers")}
          className={`relative px-4 py-3 text-sm font-semibold transition md:px-6 md:text-base ${
            tab === "transfers"
              ? "text-blue-950"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Airport Transfers
          {tab === "transfers" ? (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-800" />
          ) : null}
        </button>
      </div>

      <div className="p-4 md:p-6">
        {tab === "activities" ? (
          <div className="space-y-5">
            <form
              action="/excursions/water-tours"
              method="get"
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <input
                type="search"
                name="q"
                value={activityQuery}
                onChange={(e) => setActivityQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/15"
              />
              <button
                type="submit"
                className="h-12 w-full shrink-0 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 md:w-auto"
              >
                {t("searchButton")}
              </button>
            </form>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-950">
                {t("quickCategories")}
              </p>
              <div className="flex flex-wrap gap-2">
                {excursionLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-blue-950 transition hover:border-blue-800/40 hover:bg-blue-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-950">
                Trip type
              </p>
              <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setTripType("one_way")}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    tripType === "one_way"
                      ? "bg-blue-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-blue-950"
                  }`}
                >
                  One Way
                </button>
                <button
                  type="button"
                  onClick={() => setTripType("round_trip")}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    tripType === "round_trip"
                      ? "bg-blue-800 text-white shadow-sm"
                      : "text-slate-600 hover:text-blue-950"
                  }`}
                >
                  Round Trip
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="hero-origin"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-blue-950"
              >
                Origin
              </label>
              <select
                id="hero-origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value as OriginCode)}
                className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/15"
              >
                {ORIGIN_OPTIONS.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div ref={wrapRef} className="relative">
              <label
                htmlFor="hero-hotel"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-blue-950"
              >
                Hotel Destination
              </label>
              <div className="relative">
                <input
                  id="hero-hotel"
                  type="text"
                  autoComplete="off"
                  value={hotelQuery}
                  onChange={(e) => {
                    setHotelQuery(e.target.value);
                    setSelectedHotel(null);
                    setListOpen(true);
                  }}
                  onFocus={() => {
                    setListOpen(true);
                    if (selectedHotel) setSelectedHotel(null);
                  }}
                  placeholder="Type to search your hotel"
                  className="h-12 w-full rounded-xl border border-slate-200 py-2 pl-4 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/15"
                />
                {hotelQuery.trim().length > 0 || selectedHotel ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label="Clear hotel"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => {
                      clearHotelField();
                    }}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                ) : null}
              </div>
              {listOpen ? (
                filteredHotels.length > 0 ? (
                  <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    {filteredHotels.map((h) => (
                      <li key={h.n}>
                        <button
                          type="button"
                          className="w-full px-4 py-3 text-left text-sm text-blue-950 transition hover:bg-blue-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedHotel(h);
                            setHotelQuery(h.n);
                            setListOpen(false);
                          }}
                        >
                          {h.n}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : hotelQuery.trim().length > 0 ? (
                  <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
                    No hotels match your search.
                  </div>
                ) : null
              ) : null}
            </div>

            <div className="flex flex-col gap-3 pt-1 md:flex-row md:items-center md:justify-end">
              <a
                href={transferReady ? transferHref : undefined}
                aria-disabled={!transferReady}
                onClick={(e) => {
                  if (!transferReady) e.preventDefault();
                }}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-12 w-full items-center justify-center rounded-xl px-8 text-sm font-semibold uppercase tracking-wide transition md:ml-auto md:w-auto ${
                  transferReady
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 hover:bg-orange-600"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
              >
                {t("searchButton")}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
