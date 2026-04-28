import Image from "next/image";

const BOUTIQUE_LINK = "https://cheznicoleboutique.com/";

export default function BoutiqueBanner() {
  return (
    <section className="w-full bg-gray-50/80 py-12 md:py-16">
      <div className="mx-auto flex max-w-7xl justify-center px-6 md:px-10 lg:px-12">
        <a
          href={BOUTIQUE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-5xl overflow-hidden border border-slate-200 bg-white"
        >
          <Image
            src="/images/boutique-banner.jpg"
            alt="Boutique banner"
            width={1800}
            height={700}
            className="h-auto w-full object-contain"
          />
        </a>
      </div>
    </section>
  );
}
