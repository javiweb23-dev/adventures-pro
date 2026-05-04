import HeroSearch from "@/components/HeroSearch";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import PromoBanner from "@/components/PromoBanner";
import CategoryShowcase from "@/components/CategoryShowcase";
import FeaturedAdventures from "@/components/FeaturedAdventures";
import ReviewsSection from "@/components/ReviewsSection";
import BoutiqueBanner from "@/components/BoutiqueBanner";
import AllianceLogos from "@/components/AllianceLogos";
import BlogSection from "@/components/BlogSection";
import { routing } from "@/i18n/routing";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main>
        <section className="relative w-full">
          <div className="relative min-h-[600px] w-full md:min-h-[70vh]">
            <HomeHeroSlider />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-4 text-white md:gap-10 md:px-10 lg:px-12">
              <div className="w-full max-w-4xl text-center">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                  Adventures Finder
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Find your next perfect adventure
                </h1>
                <p className="mt-4 text-sm text-slate-100 md:text-base">
                  Browse curated tours by destination, budget, and experience type
                  in one place.
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
          <CategoryShowcase />
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-16 md:px-10 md:pb-32 md:pt-20 lg:px-12">
          <FeaturedAdventures locale={routing.defaultLocale} />
        </section>

        <ReviewsSection />

        <BlogSection />

        <BoutiqueBanner />

        <AllianceLogos />
      </main>
    </div>
  );
}
