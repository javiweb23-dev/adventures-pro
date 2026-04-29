import {
  Baby,
  Backpack,
  Calendar,
  Camera,
  Check,
  ChevronRight,
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

type TourPageProps = {
  params: Promise<{ slug: string }>;
};

type PortableTextBlock = {
  _type: "block";
  _key: string;
  children?: Array<{ _type: "span"; _key: string; text?: string }>;
};

type TourData = {
  title: string;
  slug: string;
  category: string;
  currency?: string;
  pricing: Array<{ _key: string; label: string; price?: number | string | null }>;
  duration: string;
  availability: string;
  ages: string;
  starts: string;
  peekProId: string;
  gallery: Array<{ _key: string; asset: unknown }>;
  infoTour: PortableTextBlock[];
  program: PortableTextBlock[];
  whatToBring: string[];
  whatsIncluded: string[];
  goodToKnow: PortableTextBlock[];
  faq: Array<{ _key: string; question: string; answer: string }>;
};

const TOUR_QUERY = `*[_type == "tour" && slug.current == $slug][0]{
  "title": coalesce(title.en, title),
  "slug": slug.current,
  "category": category->slug.current,
  "currency": coalesce(currency, "USD"),
  pricing[]{_key, label, price},
  duration,
  availability,
  ages,
  starts,
  peekProId,
  gallery[]{_key, asset},
  infoTour,
  program,
  whatToBring,
  whatsIncluded,
  goodToKnow,
  faq[]{_key, question, answer}
}`;

const extractPortableText = (blocks: PortableTextBlock[] = []) =>
  blocks
    .map((block) => (block.children ?? []).map((child) => child.text ?? "").join(""))
    .filter((line) => line.trim().length > 0);

const formatCategoryTitle = (value: string) =>
  value
    .split("-")
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
  rows: TourData["pricing"],
): TourData["pricing"][number] | null => {
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

export default async function TourDetailPage({ params }: TourPageProps) {
  const { slug } = await params;
  const tour = await client.fetch<TourData | null>(TOUR_QUERY, { slug });

  if (!tour) {
    notFound();
  }

  const currency = tour.currency || "USD";
  const infoTourLines = extractPortableText(tour.infoTour);
  const programLines = extractPortableText(tour.program);
  const goodToKnowLines = extractPortableText(tour.goodToKnow);
  const gallery = (tour.gallery ?? []).slice(0, 3);
  const galleryLightbox = (tour.gallery ?? []).slice(0, 5);
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
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Clock className="h-4 w-4" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Calendar className="h-4 w-4" />
              {tour.availability}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Baby className="h-4 w-4" />
              {tour.ages}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Timer className="h-4 w-4" />
              {tour.starts}
            </span>
          </div>
        </div>

        <section className="relative mb-8 left-1/2 right-1/2 w-screen -translate-x-1/2 md:mb-10">
          <input id="gallery-toggle" type="checkbox" className="peer sr-only" />
          <div className="md:hidden">
            <div className="flex snap-x snap-mandatory overflow-x-auto">
              {gallery.map((image, index) => (
                <img
                  key={image._key}
                  src={urlFor(image).width(1200).height(900).fit("crop").url()}
                  alt={`${tour.title} image ${index + 1}`}
                  className="h-[260px] w-full flex-shrink-0 snap-center object-cover"
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              {gallery.map((image) => (
                <span
                  key={`dot-${image._key}`}
                  className="h-1.5 w-1.5 rounded-full bg-slate-300"
                />
              ))}
            </div>
          </div>
          <div className="hidden h-[350px] w-full md:block">
            <div className="grid h-full w-full gap-4 px-6 md:grid-cols-3 md:px-10 lg:px-12">
              {gallery.map((image, index) => (
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
                {galleryLightbox.map((image, index) => (
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
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Tour overview
              </h2>
              <div className="mt-4 space-y-3">
                {infoTourLines.map((line) => (
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
                {programLines.map((step, index) => (
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                What to bring
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {tour.whatToBring.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <Backpack className="h-5 w-5 text-slate-700" />
                    <span className="text-sm font-medium text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                What&apos;s included
              </h2>
              <ul className="mt-6 space-y-3">
                {tour.whatsIncluded.map((item) => (
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
                {goodToKnowLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                FAQs
              </h2>
              <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
                {tour.faq.map((faq) => (
                  <details
                    key={faq._key}
                    className="group px-5 py-4 open:bg-slate-50"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-slate-900">
                      {faq.question}
                      <ChevronRight className="h-5 w-5 text-slate-500 transition group-open:rotate-90" />
                    </summary>
                    <p className="pt-3 text-[15px] leading-7 text-slate-700">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
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
                {pricing.map((item) => {
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
