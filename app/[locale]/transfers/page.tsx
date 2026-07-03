import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type TransfersPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

export default async function TransfersPage({ params }: TransfersPageProps) {
  await params;
  const t = await getTranslations("Transfers");

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <section className="relative overflow-hidden bg-[#0a192f] px-6 py-20 md:px-10 md:py-28 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#0f2744] to-[#0a192f]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl md:leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
              {t("section1Text")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/buses.jpg"
                alt={t("busesImageAlt")}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/suv-chevy4.jpg"
                alt={t("suvImageAlt")}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0a192f]">
                  {t("fleetBadge")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
            {t("section2Title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-slate-700 md:text-lg">
            {t("section2Text")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg lg:order-1">
            <Image
              src="/images/suv-chevy.jpg"
              alt={t("suvChevyImageAlt")}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:order-2">
            <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
              {t("section3Text")}
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 md:text-base">
              <a
                href="mailto:commercial@adventuresfinder.com"
                className="font-medium text-[#0a192f] transition hover:text-blue-700"
              >
                commercial@adventuresfinder.com
              </a>
              <a
                href="https://wa.me/18294216101"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0a192f] transition hover:text-blue-700"
              >
                +1 (829) 421 6101
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-6 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
            {t("outroText")}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </div>
  );
}
