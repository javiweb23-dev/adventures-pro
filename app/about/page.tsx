import TeamGrid from "@/components/TeamGrid";

export default function AboutPage() {
  const bodyParagraphs = [
    `With over two decades in the travel industry and more than 15 years rooted in Punta Cana, our team has built a reputation for trusted guidance, reliable operations, and truly local expertise.`,
    `We believe in crafting memories that matter, designing each experience with care so every guest gets the most value from their time and money while enjoying the very best this destination has to offer.`,
    `What sets us apart is our customer service: thoughtful details, personalized attention, and seamless coordination across every step of the journey, from first contact to your final day in paradise.`,
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-[#0a192f] px-6 py-20 md:px-10 md:py-28 lg:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#0f2744] to-[#0a192f]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl md:leading-tight">
            Who We Are
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-xl">
            Your trusted travel companion in Punta Cana...
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {bodyParagraphs.map((paragraph, index) => (
            <article
              key={index}
              className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
            >
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 md:text-lg">
                {paragraph}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16 md:px-10 md:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl pb-4">
          <TeamGrid />
        </div>
      </section>
    </div>
  );
}
