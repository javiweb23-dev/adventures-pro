import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const wordpressRedirects: Array<{ source: string; destination: string; permanent: true }> = [
  {
    source: "/when-not-to-visit-punta-cana-costly-mistakes-tourists-make-and-the-best-months-instead",
    destination: "/en/blog/when-not-to-visit-punta-cana-costly-mistakes-tourists-make-and-the-best-months-instead",
    permanent: true,
  },
  {
    source: "/when-not-to-visit-punta-cana-costly-mistakes-tourists-make-and-the-best-months-instead/",
    destination: "/en/blog/when-not-to-visit-punta-cana-costly-mistakes-tourists-make-and-the-best-months-instead",
    permanent: true,
  },
  {
    source: "/sea-turtles-in-the-dominican-republic-when-where-and-how-to-see-them-responsibly",
    destination: "/en/blog/sea-turtles-in-the-dominican-republic-when-where-and-how-to-see-them-responsibly",
    permanent: true,
  },
  {
    source: "/sea-turtles-in-the-dominican-republic-when-where-and-how-to-see-them-responsibly/",
    destination: "/en/blog/sea-turtles-in-the-dominican-republic-when-where-and-how-to-see-them-responsibly",
    permanent: true,
  },
  {
    source: "/supermarkets-in-punta-cana",
    destination: "/en/blog/supermarkets-in-punta-cana",
    permanent: true,
  },
  {
    source: "/supermarkets-in-punta-cana/",
    destination: "/en/blog/supermarkets-in-punta-cana",
    permanent: true,
  },
  {
    source: "/transfers",
    destination: "/en/transfers",
    permanent: true,
  },
  {
    source: "/transfers/",
    destination: "/en/transfers",
    permanent: true,
  },
  {
    source: "/who-we-are",
    destination: "/en/about",
    permanent: true,
  },
  {
    source: "/who-we-are/",
    destination: "/en/about",
    permanent: true,
  },
  {
    source: "/the-history-of-punta-cana",
    destination: "/en/blog/the-history-of-punta-cana",
    permanent: true,
  },
  {
    source: "/the-history-of-punta-cana/",
    destination: "/en/blog/the-history-of-punta-cana",
    permanent: true,
  },
  {
    source: "/land-tours",
    destination: "/en/excursions/categoria/land-tours",
    permanent: true,
  },
  {
    source: "/land-tours/",
    destination: "/en/excursions/categoria/land-tours",
    permanent: true,
  },
  {
    source: "/punta-cana-neighborhoods-explained-where-to-stay-rent-or-relocate",
    destination: "/en/blog/punta-cana-neighborhoods-explained-where-to-stay-rent-or-relocate",
    permanent: true,
  },
  {
    source: "/punta-cana-neighborhoods-explained-where-to-stay-rent-or-relocate/",
    destination: "/en/blog/punta-cana-neighborhoods-explained-where-to-stay-rent-or-relocate",
    permanent: true,
  },
  {
    source: "/top-best-beaches-in-dominican-republic",
    destination: "/en/blog/top-best-beaches-in-dominican-republic",
    permanent: true,
  },
  {
    source: "/top-best-beaches-in-dominican-republic/",
    destination: "/en/blog/top-best-beaches-in-dominican-republic",
    permanent: true,
  },
  {
    source: "/shopping-center-in-punta-cana",
    destination: "/en/blog/shopping-center-in-punta-cana",
    permanent: true,
  },
  {
    source: "/shopping-center-in-punta-cana/",
    destination: "/en/blog/shopping-center-in-punta-cana",
    permanent: true,
  },
  {
    source: "/private-tours",
    destination: "/en/excursions/categoria/private-tours",
    permanent: true,
  },
  {
    source: "/private-tours/",
    destination: "/en/excursions/categoria/private-tours",
    permanent: true,
  },
  {
    source: "/water-tours",
    destination: "/en/excursions/categoria/water-tours",
    permanent: true,
  },
  {
    source: "/water-tours/",
    destination: "/en/excursions/categoria/water-tours",
    permanent: true,
  },
  {
    source: "/faqs-tours",
    destination: "/en/faqs",
    permanent: true,
  },
  {
    source: "/faqs-tours/",
    destination: "/en/faqs",
    permanent: true,
  },
  {
    source: "/about-our-vlog",
    destination: "/en/blog",
    permanent: true,
  },
  {
    source: "/about-our-vlog/",
    destination: "/en/blog",
    permanent: true,
  },
  {
    source: "/",
    destination: "/en",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return wordpressRedirects;
  },
};

export default withNextIntl(nextConfig);
