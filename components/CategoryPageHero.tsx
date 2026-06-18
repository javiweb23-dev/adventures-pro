import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type CategoryPageHeroProps = {
  title: string;
  bannerImage?: unknown;
  mainImage?: unknown;
};

export default function CategoryPageHero({
  title,
  bannerImage,
  mainImage,
}: CategoryPageHeroProps) {
  const heroImage = bannerImage ?? mainImage;
  const imageUrl = (() => {
    try {
      return heroImage ? urlFor(heroImage).width(1920).height(600).fit("crop").url() : null;
    } catch {
      return null;
    }
  })();

  return (
    <section className="relative min-h-[280px] w-full md:min-h-[360px]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex min-h-[280px] items-center justify-center px-6 md:min-h-[360px]">
        <h1 className="max-w-4xl text-center text-3xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
