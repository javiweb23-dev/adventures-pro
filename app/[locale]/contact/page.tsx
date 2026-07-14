import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { groq } from "next-sanity";
import ContactForm from "@/components/ContactForm";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type ContactPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

type ContactPageData = {
  heroImage?: unknown;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
};

const CONTACT_PAGE_QUERY = groq`*[_type == "contactPage"][0]{
  heroImage,
  "heroTitle": coalesce(select($locale == "fr-ca" => heroTitle.frCA, heroTitle[$locale]), heroTitle.en, heroTitle),
  "heroSubtitle": coalesce(select($locale == "fr-ca" => heroSubtitle.frCA, heroSubtitle[$locale]), heroSubtitle.en, heroSubtitle)
}`;

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations("Contact");

  const contactPage = await client
    .fetch<ContactPageData | null>(CONTACT_PAGE_QUERY, { locale })
    .catch(() => null);

  const heroTitle = contactPage?.heroTitle?.trim() || t("pageTitle");
  const heroSubtitle = contactPage?.heroSubtitle?.trim() || t("pageSubtitle");
  const heroImageUrl = (() => {
    try {
      return contactPage?.heroImage
        ? urlFor(contactPage.heroImage).width(1920).height(800).fit("crop").url()
        : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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

      <main className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16 lg:px-12">
        <ContactForm />
      </main>
    </div>
  );
}
