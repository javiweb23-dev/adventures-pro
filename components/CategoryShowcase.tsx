import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { type AppLocale } from "@/i18n/routing";

const categories: Record<
  AppLocale,
  { title: string; href: string; image: string }[]
> = {
  en: [
    {
      title: "Water Tours",
      href: "/excursions/water-tours",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Land Tours",
      href: "/excursions/land-tours",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Private Tours",
      href: "/excursions/private-tours",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Multidays Tours",
      href: "/excursions/multidays-tours",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    },
  ],
  es: [
    {
      title: "Tours Acuáticos",
      href: "/excursions/water-tours",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Tours de Tierra",
      href: "/excursions/land-tours",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Tours Privados",
      href: "/excursions/private-tours",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Tours Multidía",
      href: "/excursions/multidays-tours",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    },
  ],
  "fr-ca": [
    {
      title: "Excursions nautiques",
      href: "/excursions/water-tours",
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Excursions terrestres",
      href: "/excursions/land-tours",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Excursions privées",
      href: "/excursions/private-tours",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
    },
    {
      title: "Excursions multijours",
      href: "/excursions/multidays-tours",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    },
  ],
};

const sectionTitle: Record<AppLocale, string> = {
  en: "Explore by category",
  es: "Explora por categoría",
  "fr-ca": "Explorez par catégorie",
};

export default function CategoryShowcase({ locale = "en" }: { locale?: AppLocale }) {
  const localizedCategories = categories[locale] ?? categories.en;
  const title = sectionTitle[locale] ?? sectionTitle.en;

  return (
    <div>
      <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-blue-950 md:mb-12 md:text-4xl">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {localizedCategories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group relative aspect-[4/5] overflow-hidden border border-slate-200 shadow-sm sm:aspect-[3/4]"
          >
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-900/35 transition duration-500 group-hover:bg-slate-900/55" />
            <div className="absolute inset-0 flex items-end justify-center p-6 pb-10">
              <span className="text-center text-lg font-semibold leading-snug tracking-tight text-white drop-shadow-md md:text-xl">
                {cat.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
