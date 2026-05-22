import {
  Baby,
  Calendar,
  Camera,
  Check,
  Clock,
  ShieldCheck,
  Ticket,
  Timer,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { formatTourPrice, peekBookingUrl } from "@/lib/tourPrice";
import { routing, type AppLocale } from "@/i18n/routing";

type TourPageProps = {
  params: Promise<{ slug: string; locale?: AppLocale }>;
};

type GalleryImage = { _key: string; asset: unknown };

type ComboDayTour = {
  title: string;
  duration?: string | null;
  infoTour?: string | null;
  whatHappens?: string | null;
  goodToKnow?: string | null;
  whatsIncluded?: string | null;
  whatToBring?: string | null;
};

type ComboDay = {
  _key: string;
  dayLabel: string;
  tour?: ComboDayTour | null;
};

type TourData = {
  title: string;
  slug: string;
  category: string;
  currency?: string;
  pricing?: Array<{ _key: string; label: string; price?: number | string | null }> | null;
  duration?: string;
  availability?: string;
  ages?: string;
  starts?: string;
  peekProId: string;
  mainImage?: { asset: unknown } | null;
  gallery?: GalleryImage[] | null;
  isCombo?: boolean;
  comboDays?: ComboDay[] | null;
  infoTour?: string | null;
  whatHappens?: string | null;
  includes?: string | null;
  excludes?: string | null;
  goodToKnow?: string | null;
  faq?: string | null;
};

const TOUR_QUERY = `*[_type == "tour" && slug.current == $slug][0]{
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title.es, title.frCA),
  "slug": slug.current,
  "category": category->slug.current,
  "currency": coalesce(currency, "USD"),
  pricing[]{_key, label, price},
  isCombo,
  peekProId,
  "mainImage": coalesce(listingImage, mainTour->listingImage),
  "gallery": (
    coalesce(gallery, []) +
    coalesce(mainTour->gallery, []) +
    coalesce(comboDays[].tour->gallery, [])
  )[]{_key, asset},
  "duration": select(
    isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->duration.frCA, mainTour->duration[$locale]),
      mainTour->duration.en,
      mainTour->duration.es,
      mainTour->duration.frCA
    ),
    coalesce(select($locale == "fr-ca" => duration.frCA, duration[$locale]), duration.en, duration.es, duration.frCA)
  ),
  "availability": select(
    isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->availability.frCA, mainTour->availability[$locale]),
      mainTour->availability.en,
      mainTour->availability.es,
      mainTour->availability.frCA
    ),
    coalesce(select($locale == "fr-ca" => availability.frCA, availability[$locale]), availability.en, availability.es, availability.frCA)
  ),
  "ages": select(
    isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->ages.frCA, mainTour->ages[$locale]),
      mainTour->ages.en,
      mainTour->ages.es,
      mainTour->ages.frCA
    ),
    coalesce(select($locale == "fr-ca" => ages.frCA, ages[$locale]), ages.en, ages.es, ages.frCA)
  ),
  "starts": select(
    isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->starts.frCA, mainTour->starts[$locale]),
      mainTour->starts.en,
      mainTour->starts.es,
      mainTour->starts.frCA
    ),
    coalesce(select($locale == "fr-ca" => starts.frCA, starts[$locale]), starts.en, starts.es, starts.frCA)
  ),
  comboDays[]{
    _key,
    dayLabel,
    tour->{
      "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title.es, title.frCA),
      "duration": coalesce(select($locale == "fr-ca" => duration.frCA, duration[$locale]), duration.en, duration.es, duration.frCA),
      "infoTour": coalesce(select($locale == "fr-ca" => infoTour.frCA, infoTour[$locale]), infoTour.en, infoTour.es, infoTour.frCA),
      "whatHappens": coalesce(select($locale == "fr-ca" => whatHappens.frCA, whatHappens[$locale]), whatHappens.en, whatHappens.es, whatHappens.frCA),
      "goodToKnow": coalesce(select($locale == "fr-ca" => goodToKnow.frCA, goodToKnow[$locale]), goodToKnow.en, goodToKnow.es, goodToKnow.frCA),
      "whatsIncluded": coalesce(select($locale == "fr-ca" => includes.frCA, includes[$locale]), includes.en, includes.es, includes.frCA),
      "whatToBring": coalesce(select($locale == "fr-ca" => whatToBring.frCA, whatToBring[$locale]), whatToBring.en, whatToBring.es, whatToBring.frCA)
    }
  },
  "infoTour": coalesce(select($locale == "fr-ca" => infoTour.frCA, infoTour[$locale]), infoTour.en, infoTour.es, infoTour.frCA),
  "whatHappens": coalesce(select($locale == "fr-ca" => whatHappens.frCA, whatHappens[$locale]), whatHappens.en, whatHappens.es, whatHappens.frCA),
  "includes": coalesce(select($locale == "fr-ca" => includes.frCA, includes[$locale]), includes.en, includes.es, includes.frCA),
  "excludes": coalesce(select($locale == "fr-ca" => excludes.frCA, excludes[$locale]), excludes.en, excludes.es, excludes.frCA),
  "goodToKnow": coalesce(select($locale == "fr-ca" => goodToKnow.frCA, goodToKnow[$locale]), goodToKnow.en, goodToKnow.es, goodToKnow.frCA),
  "faq": coalesce(select($locale == "fr-ca" => faq.frCA, faq[$locale]), faq.en, faq.es, faq.frCA)
}`;

const formatCategoryTitle = (value: string) =>
  (value?.split("-") || [])
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const displayPricingLabel = (label: string) =>
  label.replace(/\bCHILDS\b/gi, "CHILDREN");

const parsePriceValue = (value?: number | string | null) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return Number.NaN;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const pickAdultLeadPricing = (
  rows?: TourData["pricing"] | null,
): NonNullable<TourData["pricing"]>[number] | null => {
  if (!rows?.length) return null;
  const upper = (s: string) => s.trim().toUpperCase();
  const exact = rows.find((r) => {
    const u = upper(r.label);
    return u === "ADULTS" || u === "ADULT";
  });
  if (exact) return exact;
  const partial = rows.find((r) => r.label.toLowerCase().includes("adult"));
  return partial ?? null;
};

const splitLines = (value?: string | null) =>
  (value ?? "")
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const dedupeGallery = (images: GalleryImage[]) => {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (!image?._key || seen.has(image._key) || !image.asset) return false;
    seen.add(image._key);
    return true;
  });
};

const buildGallery = (
  images: GalleryImage[],
  mainImage?: { asset: unknown } | null,
): GalleryImage[] => {
  const merged = dedupeGallery(images);
  if (merged.length > 0) return merged;
  if (mainImage?.asset) {
    return [{ _key: "main-image", asset: mainImage.asset }];
  }
  return [];
};

export default async function TourDetailPage({ params }: TourPageProps) {
  const { slug, locale } = await params;
  const activeLocale = locale ?? routing.defaultLocale;
  const tour = await client.fetch<TourData | null>(TOUR_QUERY, { slug, locale: activeLocale });

  if (!tour) {
    notFound();
  }

  const currency = tour.currency || "USD";
  const isCombo = tour.isCombo === true;
  const comboDays = tour.comboDays ?? [];
  const infoTourLines = splitLines(tour.infoTour);
  const programLines = splitLines(tour.whatHappens);
  const goodToKnowLines = splitLines(tour.goodToKnow);
  const includesLines = splitLines(tour.includes);
  const excludesLines = splitLines(tour.excludes);
  const faqText = (tour.faq ?? "").trim();
  const fullGallery = buildGallery(tour.gallery ?? [], tour.mainImage);
  const gallery = fullGallery.slice(0, 3);
  const galleryLightbox = fullGallery.slice(0, 5);
  const pricing = tour.pricing ?? [];
  const adultLeadPricing = pickAdultLeadPricing(pricing);
  const adultLeadPriceValue = parsePriceValue(adultLeadPricing?.price);
  const leadFromFormatted = adultLeadPricing
    ? Number.isFinite(adultLeadPriceValue)
      ? formatTourPrice(currency, adultLeadPriceValue)
      : "Consultar precio"
    : null;
  const peekUrl = peekBookingUrl(tour.peekProId);
  const categoryTitle = formatCategoryTitle(tour.category);

  return (
    <div className="bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-8 pb-28 md:px-10 md:py-12 md:pb-12 lg:px-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: categoryTitle, href: `/excursions/${tour.category}` },
            { label: tour.title },
          ]}
        />
        <div className="mb-8 px-1 py-2 md:mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            {categoryTitle}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-5xl">
            {tour.title}
          </h1>
          {(tour.duration || tour.availability || tour.ages || tour.starts) ? (
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {tour.duration ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Clock className="h-4 w-4" />
                  {tour.duration}
                </span>
              ) : null}
              {tour.availability ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Calendar className="h-4 w-4" />
                  {tour.availability}
                </span>
              ) : null}
              {tour.ages ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Baby className="h-4 w-4" />
                  {tour.ages}
                </span>
              ) : null}
              {tour.starts ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Timer className="h-4 w-4" />
                  {tour.starts}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <section className="relative mb-8 left-1/2 right-1/2 w-screen -translate-x-1/2 md:mb-10">
          <input id="gallery-toggle" type="checkbox" className="peer sr-only" />
          <div className="md:hidden">
            <div className="flex snap-x snap-mandatory overflow-x-auto">
              {(gallery ?? []).map((image, index) => (
                <img
                  key={image._key}
                  src={urlFor(image).width(1200).height(900).fit("crop").url()}
                  alt={`${tour.title} image ${index + 1}`}
                  className="h-[260px] w-full flex-shrink-0 snap-center object-cover"
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              {(gallery ?? []).map((image) => (
                <span
                  key={`dot-${image._key}`}
                  className="h-1.5 w-1.5 rounded-full bg-slate-300"
                />
              ))}
            </div>
          </div>
          <div className="hidden h-[350px] w-full md:block">
            <div className="grid h-full w-full gap-4 px-6 md:grid-cols-3 md:px-10 lg:px-12">
              {(gallery ?? []).map((image, index) => (
                <img
                  key={image._key}
                  src={urlFor(image).width(1600).height(1000).fit("crop").url()}
                  alt={`${tour.title} image ${index + 1}`}
                  className="h-full w-full rounded-none object-cover"
                />
              ))}
            </div>
          </div>
          <label
            htmlFor="gallery-toggle"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-md md:right-14"
          >
            <Camera className="h-4 w-4" />
            View gallery
          </label>
          <div className="pointer-events-none fixed inset-0 z-[70] bg-black/70 opacity-0 transition peer-checked:pointer-events-auto peer-checked:opacity-100">
            <div className="mx-auto mt-8 h-[calc(100vh-4rem)] w-[min(1200px,92vw)] overflow-y-auto rounded-2xl bg-white p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Gallery</h3>
                <label
                  htmlFor="gallery-toggle"
                  className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  Close
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {(galleryLightbox ?? []).map((image, index) => (
                  <img
                    key={image._key}
                    src={urlFor(image).width(2000).height(1400).fit("crop").url()}
                    alt={`${tour.title} gallery ${index + 1}`}
                    className="h-64 w-full object-cover md:h-80"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="space-y-6 md:space-y-12">
            {isCombo ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Itinerario del Combo
                </h2>
                <div className="mt-8 space-y-10">
                  {comboDays.map((day) => {
                    const ref = day.tour;
                    const itemInfoLines = splitLines(ref?.infoTour);
                    const itemProgramLines = splitLines(ref?.whatHappens);
                    const itemGoodToKnowLines = splitLines(ref?.goodToKnow);
                    const itemIncludedLines = splitLines(ref?.whatsIncluded);
                    const itemBringLines = splitLines(ref?.whatToBring);
                    return (
                      <article
                        key={day._key}
                        className="border-t border-slate-100 pt-10 first:border-t-0 first:pt-0"
                      >
                        <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                          {ref?.title
                            ? `${day.dayLabel} — ${ref.title}`
                            : day.dayLabel}
                        </h3>
                        {ref?.duration ? (
                          <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            {ref.duration}
                          </p>
                        ) : null}
                        {itemInfoLines.length > 0 ? (
                          <div className="mt-6 space-y-3">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              Overview
                            </p>
                            {itemInfoLines.map((line) => (
                              <p
                                key={line}
                                className="text-[15px] leading-relaxed text-slate-700"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : null}
                        {itemProgramLines.length > 0 ? (
                          <div className="mt-8 space-y-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              What happens
                            </p>
                            {itemProgramLines.map((step, index) => (
                              <div key={`${index}-${step}`} className="flex gap-4">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                  {index + 1}
                                </div>
                                <p className="pt-0.5 text-[15px] leading-7 text-slate-700">
                                  {step}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {itemGoodToKnowLines.length > 0 ? (
                          <div className="mt-8 space-y-3 rounded-xl bg-amber-50/60 px-4 py-4">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              Good to know
                            </p>
                            {itemGoodToKnowLines.map((line) => (
                              <p
                                key={line}
                                className="text-[15px] leading-relaxed text-slate-700"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : null}
                        {itemIncludedLines.length > 0 ? (
                          <div className="mt-8 space-y-3">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              What&apos;s included
                            </p>
                            <ul className="space-y-2">
                              {itemIncludedLines.map((line) => (
                                <li key={line} className="flex items-start gap-3">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                  <span className="text-[15px] text-slate-700">{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {itemBringLines.length > 0 ? (
                          <div className="mt-8 space-y-3">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              What to bring
                            </p>
                            <ul className="space-y-2">
                              {itemBringLines.map((line) => (
                                <li key={line} className="flex items-start gap-3">
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                  <span className="text-[15px] text-slate-700">{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Tour overview
                  </h2>
                  <div className="mt-4 space-y-3">
                    {(infoTourLines ?? []).map((line) => (
                      <p
                        key={line}
                        className="mb-6 text-[15px] leading-relaxed text-slate-700 last:mb-0"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    What happens on this tour
                  </h2>
                  <div className="mt-6 space-y-5">
                    {(programLines ?? []).map((step, index) => (
                      <div key={`${index}-${step}`} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-[15px] leading-7 text-slate-700">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {!isCombo ? (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Excludes
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {(excludesLines ?? []).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                        <span className="text-[15px] text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    What&apos;s included
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {(includesLines ?? []).map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 text-emerald-500" />
                        <span className="text-[15px] text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Good to know
                  </h2>
                  <div className="mt-5 space-y-3 text-[15px] leading-7 text-slate-700">
                    {(goodToKnowLines ?? []).map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    FAQs
                  </h2>
                  <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
                    <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
                      {faqText}
                    </p>
                  </div>
                </section>
              </>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.14)] md:p-10">
              <div className="flex items-start justify-between gap-5 pb-6">
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-blue-950">
                  Book this experience
                </h3>
                <Ticket
                  className="mt-0.5 h-6 w-6 shrink-0 text-blue-800"
                  strokeWidth={1.75}
                />
              </div>
              <div className="mt-2 space-y-0 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-6 py-2">
                {(pricing ?? []).map((item) => {
                  const priceValue = parsePriceValue(item.price);
                  const hasPrice = Number.isFinite(priceValue);
                  return (
                  <div
                    key={item._key}
                    className="flex items-start justify-between gap-6 border-b border-slate-200/80 py-5 last:border-b-0"
                  >
                    <p className="max-w-[58%] text-[13px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-blue-950/85">
                      {displayPricingLabel(item.label)}
                    </p>
                    <p className="text-right text-lg font-semibold leading-relaxed tracking-tight text-blue-950">
                      {hasPrice
                        ? formatTourPrice(currency, priceValue, { freeAsWord: true })
                        : "Consultar precio"}
                    </p>
                  </div>
                  );
                })}
              </div>

              <div className="mt-10 space-y-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-6 py-7">
                <div className="flex items-start gap-4 text-[15px] leading-relaxed text-blue-950">
                  <ShieldCheck
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-800"
                    strokeWidth={1.75}
                  />
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="flex items-start gap-4 text-[15px] leading-relaxed text-blue-950">
                  <Users
                    className="mt-0.5 h-5 w-5 shrink-0 text-blue-800"
                    strokeWidth={1.75}
                  />
                  <span>Instant confirmation</span>
                </div>
              </div>

              <a
                href={peekUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 text-base font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/35"
              >
                Book Now
              </a>
            </div>
          </aside>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-slate-200/80 bg-white/95 shadow-[0_-12px_32px_rgba(15,23,42,0.1)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <p className="min-w-0 truncate text-base font-semibold leading-snug tracking-tight text-blue-950">
            {leadFromFormatted
              ? `From ${leadFromFormatted}`
              : "From -"}
          </p>
          <a
            href={peekUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/35"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
