import Image from "next/image";
import Link from "next/link";
import { BadgeDollarSign, Plane, ShieldCheck } from "lucide-react";

const fleet = [
  {
    title: "VIP Excellence",
    subtitle: "Chevrolet Suburban",
    description:
      "A private luxury transfer focused on discretion, premium comfort, and a seamless arrival experience.",
    image:
      "https://images.unsplash.com/photo-1617469767053-3a17f31e89ac?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Executive Vans",
    subtitle: "Group Comfort",
    description:
      "Ideal for families and medium groups with generous luggage space and powerful climate control.",
    image:
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1500&q=80",
  },
  {
    title: "Private Coaches",
    subtitle: "Event Logistics",
    description:
      "Reliable movement for large groups, destination weddings, and corporate programs with coordinated timing.",
    image:
      "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?auto=format&fit=crop&w=1500&q=80",
  },
];

const trustItems = [
  {
    title: "Fixed Pricing",
    description: "Clear rates confirmed before pickup.",
    icon: BadgeDollarSign,
  },
  {
    title: "Flight Monitoring",
    description: "Real-time tracking to adapt to delays or early arrivals.",
    icon: Plane,
  },
  {
    title: "Bilingual Drivers",
    description: "Professional drivers trained for hospitality and safety.",
    icon: ShieldCheck,
  },
];

export default function TransfersPage() {
  return (
    <div className="bg-white text-slate-800">
      <section className="relative h-[76vh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=2100&q=80"
          alt="VIP airport transfer in Punta Cana"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Punta Cana Airport Transfers
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-slate-100 md:text-2xl">
            Luxury and Reliability from Touchdown to Destination
          </p>
          <Link
            href="https://wa.me/18294216101"
            target="_blank"
            className="mt-10 rounded-full bg-cyan-500 px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-cyan-400"
          >
            Book via WhatsApp
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className="text-center text-3xl font-semibold text-[#0a192f] md:text-4xl">
          Fleet Showcase
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {fleet.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                  {item.subtitle}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#0a192f]">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-700">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-semibold text-[#0a192f] md:text-4xl">
            Trust Block
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl bg-white p-7 text-center shadow-md"
                >
                  <Icon className="mx-auto h-8 w-8 text-cyan-600" />
                  <h3 className="mt-4 text-xl font-semibold text-[#0a192f]">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
