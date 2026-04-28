import TeamGrid from "@/components/TeamGrid";

type AboutPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <section>
          <h1 className="text-center text-5xl font-bold tracking-tight text-[#0a192f] md:text-6xl">
            Who We Are
          </h1>
          <p className="mt-5 text-center text-2xl leading-relaxed text-slate-500">
            Your trusted travel companion in Punta Cana...
          </p>
        </section>
        <section className="mx-auto mt-14 max-w-5xl space-y-8 text-left text-xl leading-loose text-slate-700">
          <p>
            With over two decades in the travel industry and more than 15 years
            rooted in Punta Cana, our team has built a reputation for trusted
            guidance, reliable operations, and truly local expertise.
          </p>
          <p>
            We believe in crafting memories that matter, designing each
            experience with care so every guest gets the most value from their
            time and money while enjoying the very best this destination has to
            offer.
          </p>
          <p>
            What sets us apart is our customer service: thoughtful details,
            personalized attention, and seamless coordination across every step
            of the journey, from first contact to your final day in paradise.
          </p>
        </section>
        <div className="pb-12 pt-20">
          <TeamGrid locale={locale} />
        </div>
      </main>
    </div>
  );
}
