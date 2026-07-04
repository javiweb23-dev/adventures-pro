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
    source: "/vista-cana-golf-club",
    destination: "/en/excursions/vista-cana-golf-club",
    permanent: true,
  },
  {
    source: "/vista-cana-golf-club/",
    destination: "/en/excursions/vista-cana-golf-club",
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
    source: "/domitai-park-punta-cana-adventures",
    destination: "/en/excursions/domitai-park-punta-cana-adventures",
    permanent: true,
  },
  {
    source: "/domitai-park-punta-cana-adventures/",
    destination: "/en/excursions/domitai-park-punta-cana-adventures",
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
    source: "/water-tours/deep-sea-half-day-shared-fishing-charter",
    destination: "/en/excursions/deep-sea-half-day-shared-fishing-charter",
    permanent: true,
  },
  {
    source: "/water-tours/deep-sea-half-day-shared-fishing-charter/",
    destination: "/en/excursions/deep-sea-half-day-shared-fishing-charter",
    permanent: true,
  },
  {
    source: "/swim-with-dolphins-explorer",
    destination: "/en/excursions/swim-with-dolphins-explorer",
    permanent: true,
  },
  {
    source: "/swim-with-dolphins-explorer/",
    destination: "/en/excursions/swim-with-dolphins-explorer",
    permanent: true,
  },
  {
    source: "/unique-evening-buggy-tour",
    destination: "/en/excursions/unique-evening-buggy-tour",
    permanent: true,
  },
  {
    source: "/unique-evening-buggy-tour/",
    destination: "/en/excursions/unique-evening-buggy-tour",
    permanent: true,
  },
  {
    source: "/punta-cana-sky-sea-adventure",
    destination: "/en/excursions/punta-cana-sky-sea-adventure",
    permanent: true,
  },
  {
    source: "/punta-cana-sky-sea-adventure/",
    destination: "/en/excursions/punta-cana-sky-sea-adventure",
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
    source: "/golf-n-shots-punta-cana-interactive-golf-experience",
    destination: "/en/excursions/golf-n-shots-punta-cana-interactive-golf-experience",
    permanent: true,
  },
  {
    source: "/golf-n-shots-punta-cana-interactive-golf-experience/",
    destination: "/en/excursions/golf-n-shots-punta-cana-interactive-golf-experience",
    permanent: true,
  },
  {
    source: "/golfnshots",
    destination: "/en/excursions/golf-n-shots-punta-cana-interactive-golf-experience",
    permanent: true,
  },
  {
    source: "/golfnshots/",
    destination: "/en/excursions/golf-n-shots-punta-cana-interactive-golf-experience",
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
    source: "/iberostar-golf-club-bavaro",
    destination: "/en/excursions/iberostar-golf-club-bavaro",
    permanent: true,
  },
  {
    source: "/iberostar-golf-club-bavaro/",
    destination: "/en/excursions/iberostar-golf-club-bavaro",
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
    source: "/saona-island-classic-tour",
    destination: "/en/excursions/saona-island-classic-tour",
    permanent: true,
  },
  {
    source: "/saona-island-classic-tour/",
    destination: "/en/excursions/saona-island-classic-tour",
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
    source: "/punta-cana-helicopter-tour-scenic-flights-over-bavaro-cap-cana",
    destination: "/en/excursions/punta-cana-helicopter-tour-scenic-flights-over-bavaro-cap-cana",
    permanent: true,
  },
  {
    source: "/punta-cana-helicopter-tour-scenic-flights-over-bavaro-cap-cana/",
    destination: "/en/excursions/punta-cana-helicopter-tour-scenic-flights-over-bavaro-cap-cana",
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
