import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { groq } from "next-sanity";
import {
  Car,
  Clock,
  DollarSign,
  HelpCircle,
  Plane,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type TransfersPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

type WhyUsCard = {
  _key: string;
  title?: string | null;
  description?: string | null;
  icon?: string | null;
};

type FaqItem = {
  _key: string;
  question?: string | null;
  answer?: string | null;
};

type TransferPageData = {
  heroImage?: unknown;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  whyUsTitle?: string | null;
  whyUsCards?: WhyUsCard[] | null;
  airportsTitle?: string | null;
  airportsSubtitle?: string | null;
  ctaTitle?: string | null;
  ctaDescription?: string | null;
  ctaButtonText?: string | null;
  faqsTitle?: string | null;
  faqsSubtitle?: string | null;
  faqsList?: FaqItem[] | null;
};

const TRANSFER_PAGE_QUERY = groq`*[_type == "transferPage"][0]{
  heroImage,
  "heroTitle": coalesce(select($locale == "fr-ca" => heroTitle.frCA, heroTitle[$locale]), heroTitle.en, heroTitle.es, heroTitle.frCA),
  "heroSubtitle": coalesce(select($locale == "fr-ca" => heroSubtitle.frCA, heroSubtitle[$locale]), heroSubtitle.en, heroSubtitle.es, heroSubtitle.frCA),
  "whyUsTitle": coalesce(select($locale == "fr-ca" => whyUsTitle.frCA, whyUsTitle[$locale]), whyUsTitle.en, whyUsTitle.es, whyUsTitle.frCA),
  whyUsCards[]{
    _key,
    "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title.es, title.frCA),
    "description": coalesce(select($locale == "fr-ca" => description.frCA, description[$locale]), description.en, description.es, description.frCA),
    icon
  },
  "airportsTitle": coalesce(select($locale == "fr-ca" => airportsTitle.frCA, airportsTitle[$locale]), airportsTitle.en, airportsTitle.es, airportsTitle.frCA),
  "airportsSubtitle": coalesce(select($locale == "fr-ca" => airportsSubtitle.frCA, airportsSubtitle[$locale]), airportsSubtitle.en, airportsSubtitle.es, airportsSubtitle.frCA),
  "ctaTitle": coalesce(select($locale == "fr-ca" => ctaTitle.frCA, ctaTitle[$locale]), ctaTitle.en, ctaTitle.es, ctaTitle.frCA),
  "ctaDescription": coalesce(select($locale == "fr-ca" => ctaDescription.frCA, ctaDescription[$locale]), ctaDescription.en, ctaDescription.es, ctaDescription.frCA),
  "ctaButtonText": coalesce(select($locale == "fr-ca" => ctaButtonText.frCA, ctaButtonText[$locale]), ctaButtonText.en, ctaButtonText.es, ctaButtonText.frCA),
  "faqsTitle": coalesce(select($locale == "fr-ca" => faqsTitle.frCA, faqsTitle[$locale]), faqsTitle.en, faqsTitle.es, faqsTitle.frCA),
  "faqsSubtitle": coalesce(select($locale == "fr-ca" => faqsSubtitle.frCA, faqsSubtitle[$locale]), faqsSubtitle.en, faqsSubtitle.es, faqsSubtitle.frCA),
  faqsList[]{
    _key,
    "question": coalesce(select($locale == "fr-ca" => question.frCA, question[$locale]), question.en, question.es, question.frCA),
    "answer": coalesce(select($locale == "fr-ca" => answer.frCA, answer[$locale]), answer.en, answer.es, answer.frCA)
  }
}`;

const ICON_MAP: Record<string, LucideIcon> = {
  dollar: DollarSign,
  price: DollarSign,
  shield: ShieldCheck,
  verified: ShieldCheck,
  clock: Clock,
  car: Car,
  transfer: Car,
  star: Star,
  users: Users,
  plane: Plane,
  help: HelpCircle,
};

const FALLBACK_WHY_US_CARDS: WhyUsCard[] = [
  {
    _key: "fallback-1",
    title: "Mejor Precio",
    description: "Tarifas competitivas y transparentes sin sorpresas.",
    icon: "dollar",
  },
  {
    _key: "fallback-2",
    title: "Conductores Verificados",
    description: "Profesionales capacitados y vehículos monitoreados.",
    icon: "shield",
  },
  {
    _key: "fallback-3",
    title: "Puntualidad Garantizada",
    description: "Seguimiento de vuelos y recogidas a tiempo.",
    icon: "clock",
  },
  {
    _key: "fallback-4",
    title: "Flota Moderna",
    description: "Vehículos cómodos para individuos y grupos.",
    icon: "car",
  },
];

const FALLBACK_FAQS: FaqItem[] = [
  {
    _key: "faq-1",
    question: "¿Cómo reservo un traslado?",
    answer:
      "Indica tu aeropuerto, destino y detalles del vuelo. Nuestro equipo confirmará tu reserva de inmediato.",
  },
  {
    _key: "faq-2",
    question: "¿Incluye seguimiento de vuelos?",
    answer:
      "Sí. Monitoreamos tu vuelo para ajustar el horario de recogida ante retrasos.",
  },
];

const AIRPORT_CARDS = [
  { code: "PUJ", name: "Punta Cana" },
  { code: "SDQ", name: "Santo Domingo" },
  { code: "STI", name: "Santiago" },
] as const;

function resolveIcon(icon?: string | null): LucideIcon {
  if (!icon) return HelpCircle;
  const key = icon.trim().toLowerCase();
  return ICON_MAP[key] ?? HelpCircle;
}

export default async function TransfersPage({ params }: TransfersPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Transfers");

  const transferPage = await client
    .fetch<TransferPageData | null>(TRANSFER_PAGE_QUERY, { locale })
    .catch(() => null);

  const heroTitle = transferPage?.heroTitle?.trim() || t("heroTitle");
  const heroSubtitle = transferPage?.heroSubtitle?.trim() || t("heroSubtitle");
  const heroImageUrl = (() => {
    try {
      return transferPage?.heroImage
        ? urlFor(transferPage.heroImage).width(1920).height(800).fit("crop").url()
        : null;
    } catch {
      return null;
    }
  })();

  const whyUsTitle =
    transferPage?.whyUsTitle?.trim() || "Por qué reservar con nosotros";
  const whyUsCards =
    transferPage?.whyUsCards?.filter((card) => card.title?.trim())?.length
      ? transferPage.whyUsCards.filter((card) => card.title?.trim())
      : FALLBACK_WHY_US_CARDS;

  const airportsTitle =
    transferPage?.airportsTitle?.trim() || "Dominican Airports Covered";
  const airportsSubtitle =
    transferPage?.airportsSubtitle?.trim() ||
    "Cobertura en los principales aeropuertos de República Dominicana.";

  const ctaTitle =
    transferPage?.ctaTitle?.trim() || "Can't find your destination...";
  const ctaDescription =
    transferPage?.ctaDescription?.trim() ||
    "Escríbenos y armamos un traslado a medida para tu itinerario.";
  const ctaButtonText =
    transferPage?.ctaButtonText?.trim() || "Contact our transfers team";

  const faqsTitle =
    transferPage?.faqsTitle?.trim() || "Frequently Asked Questions";
  const faqsSubtitle =
    transferPage?.faqsSubtitle?.trim() ||
    "Respuestas rápidas sobre nuestros traslados al aeropuerto.";
  const faqsList =
    transferPage?.faqsList?.filter((item) => item.question?.trim())?.length
      ? transferPage.faqsList.filter((item) => item.question?.trim())
      : FALLBACK_FAQS;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <section className="relative overflow-hidden bg-[#0a192f] px-6 py-20 md:px-10 md:py-28 lg:px-12">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={heroTitle}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : null}
        <div
          className={
            heroImageUrl
              ? "absolute inset-0 bg-gradient-to-br from-[#0a192f]/85 via-[#0f2744]/75 to-[#0a192f]/85"
              : "absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#0f2744] to-[#0a192f]"
          }
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl md:leading-tight">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
          {whyUsTitle}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUsCards.map((card) => {
            const Icon = resolveIcon(card.icon);
            return (
              <article
                key={card._key}
                className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm"
              >
                <Icon className="h-8 w-8 text-[#0a192f]" strokeWidth={1.75} />
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-[#0a192f]">
                  {card.title}
                </h3>
                {card.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
            {airportsTitle}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
            {airportsSubtitle}
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {AIRPORT_CARDS.map((airport) => (
            <article
              key={airport.code}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold tracking-tight text-[#0a192f]">
                {airport.code}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">{airport.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-[#0a192f] px-6 py-12 text-center md:px-10 md:py-14">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
            {ctaDescription}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
            {faqsTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
            {faqsSubtitle}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faqsList.map((item) => (
            <article
              key={item._key}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold tracking-tight text-[#0a192f]">
                {item.question}
              </h3>
              {item.answer ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 md:text-base">
                  {item.answer}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
