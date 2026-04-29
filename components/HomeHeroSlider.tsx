"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=85",
    alt: "Executive airport transfer van",
  },
  {
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=85",
    alt: "Catamaran and ocean excursions",
  },
  {
    src: "https://images.unsplash.com/photo-1628526495849-e82acd46496d?auto=format&fit=crop&w=2400&q=85",
    alt: "Off-road and land adventures",
  },
  {
    src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2400&q=85",
    alt: "Tropical beach and coastline",
  },
];

const ROTATE_MS = 6000;

type HeroSlide = {
  src: string;
  alt?: string;
};

type HomeHeroSliderProps = {
  slides?: HeroSlide[];
};

export default function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const [active, setActive] = useState(0);
  const safeSlides = slides?.length ? slides : SLIDES;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % safeSlides.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [safeSlides.length]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {safeSlides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === active ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt || "Hero slide"}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 z-[2] bg-black/50" aria-hidden />
    </div>
  );
}
