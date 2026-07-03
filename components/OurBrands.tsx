import Image from "next/image";
import { type AppLocale } from "@/i18n/routing";

const brands = [
  {
    src: "/images/logo_marca_1.png",
    url: "https://www.afdmctravel.com/en",
    alt: "AF DMC Travel",
  },
  {
    src: "/images/logo_marca_2.png",
    url: "https://www.afdigitalsolutions.com/",
    alt: "AF Digital Solutions",
  },
  {
    src: "/images/logo_marca_3.png",
    url: "https://adventuresfinder.com/",
    alt: "Adventures Finder",
  },
  {
    src: "/images/logo_marca_4.png",
    url: null,
    alt: "Destination Management Company",
  },
] as const;

const titles: Record<AppLocale, string> = {
  en: "Our Brands",
  es: "Nuestras Marcas",
  "fr-ca": "Nos Marques",
};

const logoClassName =
  "h-16 w-auto object-contain grayscale opacity-75 transition-all duration-500 ease-in-out hover:scale-105 hover:grayscale-0 hover:opacity-100";

type OurBrandsProps = {
  locale: AppLocale;
};

export default function OurBrands({ locale }: OurBrandsProps) {
  const title = titles[locale] ?? titles.en;

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-[#0a192f] md:text-3xl">
          {title}
        </h2>
        <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-8 sm:gap-10 md:mt-12 md:grid-cols-4 md:gap-12">
          {brands.map((brand) => {
            const image = (
              <Image
                src={brand.src}
                alt={brand.alt}
                width={200}
                height={64}
                className={logoClassName}
              />
            );

            if (brand.url) {
              return (
                <a
                  key={brand.src}
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  {image}
                </a>
              );
            }

            return (
              <div key={brand.src} className="inline-flex items-center justify-center">
                {image}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
