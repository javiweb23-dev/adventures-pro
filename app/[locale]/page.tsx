import HeroSearch from "@/components/HeroSearch";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import PromoBanner from "@/components/PromoBanner";
import FeaturedAdventures from "@/components/FeaturedAdventures";
import ReviewsSection from "@/components/ReviewsSection";
import BoutiqueBanner from "@/components/BoutiqueBanner";
import AllianceLogos from "@/components/AllianceLogos";
import BlogSection from "@/components/BlogSection";
import LiveDiscoveryHub from "@/components/LiveDiscoveryHub";
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

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  
  const landingPage = await client
    .fetch<LandingPageData | null>(
      groq`*[_type == "landingPage"][0]{
        title,
        subtitle,
        "sliderImages": sliderImages[]{
          "url": asset->url
        }
      }`,
    )
    .catch(() => null);

  const discoveryTours = await client
    .fetch(
      groq`*[_type == "tour"] | order(isFeatured desc, _createdAt desc) [0...12] {
      _id,
      "title": coalesce(select($locale == "fr-ca" => title.frCA, title[$locale]), title.en, title),
      "slug": slug.current,
      "mainImage": listingImage,
      "category": category->slug.current,
      duration,
      "currency": coalesce(currency, "USD"),
      pricing[]{price, amount}
    }`,
      { locale },
    )
    .catch(() => []);

  const heroTitle = landingPage?.title?.trim() || "Find your next perfect adventure";
  const heroSubtitle =
    landingPage?.subtitle?.trim() ||
    "Browse curated tours by destination, budget, and experience type in one place.";
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
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                  Adventures Finder
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  {heroTitle}
                </h1>
                <p className="mt-4 text-sm text-slate-100 md:text-base">
                  {heroSubtitle}
                </p>
                <div className="mx-auto mt-8 w-full max-w-4xl md:mt-10">
                  <HeroSearch />
                </div>
              </div>
            </div>
          </div>
        </section>

        <PromoBanner />

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-14 md:px-10 md:pb-24 md:pt-16 lg:px-12">
          <LiveDiscoveryHub tours={discoveryTours} />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20 lg:px-12">
          <FeaturedAdventures />
        </section>

        <ReviewsSection />

        <BlogSection />

        <BoutiqueBanner />

        <AllianceLogos />
      </main>
    </div>
  );
}