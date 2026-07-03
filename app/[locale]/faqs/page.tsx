type FaqsPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

export default async function FaqsPage({ params }: FaqsPageProps) {
  await params;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
        <article className="space-y-10">
          <header className="border-b border-slate-200 pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0a192f] md:text-4xl">
              FAQ&apos;s Tours
            </h1>
          </header>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              How do I book a tour?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Booking a tour is simple and convenient through our website. Here&apos;s a step-by-step
              guide on how to do it:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed text-slate-700">
              <li>Visit our webpage and select the tour you are interested in.</li>
              <li>Click on the &ldquo;Book Now&rdquo; button.</li>
              <li>Choose your preferred date and starting time (if multiple options are listed).</li>
              <li>Select the number of participants joining the tour.</li>
              <li>Click on &ldquo;Pay Now&rdquo; to proceed with the payment process.</li>
            </ul>
            <p className="leading-relaxed text-slate-700">
              If you have any questions or need further assistance during the booking process, feel
              free to reach out to us via email at info@adventuresfinder.com. Additionally, you can
              chat with us in real-time via WhatsApp; just click on the WhatsApp icon on our webpage
              for instant support.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              What payment methods are accepted?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Detail the variety of payment options available, such as credit/debit cards, PayPal, or
              bank transfers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              How do I receive my booking confirmation and itinerary?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Upon successfully booking your tour, a confirmation email will be sent to you, which
              includes a unique confirmation number along with pickup details and other essential
              information. Please ensure you provide an accurate hotel name during the booking
              process. For those staying in a condo or another type of accommodation, kindly select
              any listed location initially, and promptly send us an email at info@adventuresfinder.com
              with your exact location details post-booking. Failure to provide precise location
              details prior to the tour date may result in a missed pickup, which could lead to a
              situation where the booking is considered a &lsquo;no show,&rsquo; and guarantees for
              refunds may not be available.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              What is the cancellation or rescheduling policy?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Our cancellation and rescheduling policies are crafted to be as fair and flexible as
              possible. To thoroughly understand the specifics, terms, and conditions related to
              cancellations or rescheduling of tours, we highly recommend visiting our webpage.
              There, you&apos;ll find detailed information ensuring that any decision you make is
              well-informed, aligning with our policies and procedures. Cancellation Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Is transportation included, and where are the pickup and drop-off points?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Yes, transportation is included in all our tours, ensuring you a seamless and
              convenient travel experience. The pickup and drop-off points vary depending on your
              accommodation. For some hotels, we provide direct pickup from the main lobby, while
              others have designated meeting points for tour pickups. If you&apos;re staying in a
              private condo, once we receive the exact location, we&apos;ll inform you of the nearest
              pickup point, making sure your journey is as comfortable and hassle-free as possible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Are there any age or health restrictions for the tours?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Yes, the age and health restrictions vary depending on the tour chosen. Some tours are
              suitable for all ages, while others may have specific age limits or health
              considerations due to the physical demands of the activity. It&apos;s essential to check
              the individual tour descriptions for detailed information on age and health
              restrictions to ensure the chosen tour is appropriate and safe for all participants.
              This way, we can ensure that every guest has an enjoyable and secure experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Are meals or refreshments included?
            </h2>
            <p className="leading-relaxed text-slate-700">
              The inclusion of meals and refreshments depends on the specific tour you choose. Some
              tours offer meals and drinks as part of the package, ensuring that you are well-fed and
              hydrated during your adventure. Other tours might offer only drinks or just water to
              keep you refreshed. We recommend checking the detailed description of each tour on our
              website to know exactly what is included in terms of meals and refreshments. This way,
              you can plan your day accordingly and make the most out of your tour experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Do the tours operate in all weather conditions?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Most of our tours operate under various weather conditions, and some, like our Buggy
              tours, become even more exciting with a bit of rain! However, certain tours, especially
              those on the water, might be affected by severe weather conditions such as hurricanes
              or strong winds and rain. Safety is our priority, so in cases where a tour needs to be
              cancelled due to adverse weather, we will inform you in advance. Options for refunds or
              rescheduling in such scenarios are outlined in our cancellation policy, ensuring that
              you are covered regardless of the weather.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Are the tours guided, and what languages are spoken?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Yes, all our tours are conducted by certified guides who are knowledgeable and
              passionate about providing a rich and engaging tour experience. Our guides are
              bilingual, fluently speaking both Spanish and English, ensuring that a wide array of
              visitors can fully enjoy and understand the information shared during the tour. We also
              provide tours in French.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
              Can I book a private tour, and what is the cost?
            </h2>
            <p className="leading-relaxed text-slate-700">
              Absolutely, private tours are an excellent way to enjoy a more personalized and
              exclusive experience! To get detailed information tailored just for you, including
              costs and customization options, please reach out to us directly. You can contact us via
              email at info@adventuresfinder.com. Our team is here to assist you in creating a
              unique adventure that suits your preferences and needs.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
