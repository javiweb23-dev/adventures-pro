import TeamGrid from "@/components/TeamGrid";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

type AboutPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

type AboutPageData = {
  whoWeAreTitle?: string | null;
  whoWeAreSubtitle?: string | null;
  whoWeAreBody?: string | null;
};

const ABOUT_PAGE_QUERY = groq`*[_type == "aboutPage"][0]{
  "whoWeAreTitle": coalesce(select($locale == "fr-ca" => whoWeAreTitle.frCA, whoWeAreTitle[$locale]), whoWeAreTitle.en, whoWeAreTitle),
  "whoWeAreSubtitle": coalesce(select($locale == "fr-ca" => whoWeAreSubtitle.frCA, whoWeAreSubtitle[$locale]), whoWeAreSubtitle.en, whoWeAreSubtitle),
  "whoWeAreBody": coalesce(select($locale == "fr-ca" => whoWeAreBody.frCA, whoWeAreBody[$locale]), whoWeAreBody.en, whoWeAreBody)
}`;

const FALLBACK_TITLE = "Who We Are";
const FALLBACK_SUBTITLE = "Your trusted travel companion in Punta Cana...";
const FALLBACK_BODY = `With over two decades in the travel industry and more than 15 years rooted in Punta Cana, our team has built a reputation for trusted guidance, reliable operations, and truly local expertise.

We believe in crafting memories that matter, designing each experience with care so every guest gets the most value from their time and money while enjoying the very best this destination has to offer.

What sets us apart is our customer service: thoughtful details, personalized attention, and seamless coordination across every step of the journey, from first contact to your final day in paradise.`;

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  const about = await client.fetch<AboutPageData | null>(ABOUT_PAGE_QUERY, { locale }).catch(() => null);

  const title = about?.whoWeAreTitle?.trim() || FALLBACK_TITLE;
  const subtitle = about?.whoWeAreSubtitle?.trim() || FALLBACK_SUBTITLE;
  const bodyText = about?.whoWeAreBody?.trim() || FALLBACK_BODY;
  const bodyParagraphs = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section>
          <h1 className="text-center text-5xl font-bold tracking-tight text-[#0a192f] md:text-6xl">{title}</h1>
          <p className="mt-5 text-center text-2xl leading-relaxed text-slate-500">{subtitle}</p>
        </section>
        <section className="mx-auto mt-14 max-w-5xl space-y-8 text-left text-xl leading-loose text-slate-700">
          {bodyParagraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </section>
        <div className="pb-12 pt-20">
          <TeamGrid locale={locale} />
        </div>
      </main>
    </div>
  );
}
