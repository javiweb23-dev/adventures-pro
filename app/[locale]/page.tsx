import HeroSearch from "@/components/HeroSearch";
import HomeHeroText from "@/components/HomeHeroText";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import PromoBanner from "@/components/PromoBanner";
import FeaturedAdventures, { type FeaturedTour } from "@/components/FeaturedAdventures";
import ReviewsSection from "@/components/ReviewsSection";
import BoutiqueBanner from "@/components/BoutiqueBanner";
import AllianceLogos from "@/components/AllianceLogos";
import BlogSection from "@/components/BlogSection";
import LiveDiscoveryHub, { type DiscoveryTour } from "@/components/LiveDiscoveryHub";
import LeadForm from "@/components/LeadForm";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export const revalidate = 0;

type HomePageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

type LandingPageData = {
  title?: string;
  subtitle?: string;
  sliderImages?: Array<{ url?: string }>;
};

const featuredToursQuery = groq`*[_type == "tour" && isFeatured == true] | order(_createdAt desc) {
  _id,
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
  "slug": slug.current,
  "listingImage": coalesce(listingImage, mainTour->listingImage),
  highlightBadge,
  peekProId,
  "currency": coalesce(currency, mainTour->currency, "USD"),
  "duration": coalesce(
    select(isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->duration.frCA, mainTour->duration[$locale]),
      mainTour->duration.en,
      mainTour->duration.es,
      mainTour->duration.frCA
    ), null),
    coalesce(select($locale == "fr-ca" => duration.frCA, duration[$locale]), duration.en, duration.es, duration.frCA)
  ),
  pricing[]{price}
}`;

const allDiscoveryToursQuery = groq`*[_type == "tour"] | order(_createdAt desc) {
  _id,
  "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
  "slug": slug.current,
  "mainImage": coalesce(listingImage, mainTour->listingImage),
  "category": select(
    isCombo == true => "combo-tours",
    coalesce(
      category->slug.current,
      coalesce(comboDays, comboItems)[0].tour->category->slug.current
    )
  ),
  "duration": coalesce(
    select(isCombo == true => coalesce(
      select($locale == "fr-ca" => mainTour->duration.frCA, mainTour->duration[$locale]),
      mainTour->duration.en,
      mainTour->duration.es,
      mainTour->duration.frCA
    ), null),
    coalesce(select($locale == "fr-ca" => duration.frCA, duration[$locale]), duration.en, duration.es, duration.frCA)
  ),
  peekProId,
  "currency": coalesce(currency, mainTour->currency, "USD"),
  pricing[]{price}
}`;

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  const landingPage = await client
    .fetch<LandingPageData | null>(
      groq`*[_type == "landingPage"][0]{
        "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
        "subtitle": coalesce(select($locale == "fr-ca" => subtitle.frCA, subtitle[$locale]), subtitle.en, subtitle),
        "sliderImages": sliderImages[]{
          "url": asset->url
        }
      }`,
      { locale },
    )
    .catch(() => null);

  const [featuredTours, allDiscoveryTours] = await Promise.all([
    client.fetch<FeaturedTour[]>(featuredToursQuery, { locale }).catch(() => []),
    client.fetch<DiscoveryTour[]>(allDiscoveryToursQuery, { locale }).catch(() => []),
  ]);

  const cmsTitle = landingPage?.title?.trim() || null;
  const cmsSubtitle = landingPage?.subtitle?.trim() || null;
  const heroSlides =
    landingPage?.sliderImages
      ?.map((image) => image?.url?.trim())
      .filter((url): url is string => Boolean(url)) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <section className="relative w-full">
          <div className="relative min-h-[600px] w-full md:min-h-[70vh]">
            <HomeHeroSlider
              slides={heroSlides.map((url, index) => ({
                src: url,
                alt: `Hero slide ${index + 1}`,
              }))}
            />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-4 text-white md:gap-10 md:px-10 lg:px-12">
              <div className="w-full max-w-4xl text-center">
                <HomeHeroText cmsTitle={cmsTitle} cmsSubtitle={cmsSubtitle} />
                <div className="mx-auto mt-8 w-full max-w-4xl md:mt-10">
                  <HeroSearch />
                </div>
              </div>
            </div>
          </div>
        </section>

        <PromoBanner />

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-14 md:px-10 md:pb-24 md:pt-16 lg:px-12">
          <LiveDiscoveryHub tours={allDiscoveryTours} />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20 lg:px-12">
          <FeaturedAdventures tours={featuredTours} />
        </section>

        <section className="mx-auto w-full max-w-4xl px-6 py-12 md:px-10 lg:px-12">
          <LeadForm />
        </section>

        <ReviewsSection />

        <BlogSection locale={locale} />

        <BoutiqueBanner />

        <AllianceLogos />
      </main>
    </div>
  );
}
