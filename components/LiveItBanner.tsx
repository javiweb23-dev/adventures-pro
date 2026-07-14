"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LIVE_IT_URL =
  "https://play.google.com/store/apps/details?id=com.gallusgolf.c1881.android.liveit";

export default function LiveItBanner() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const pastThreshold = currentScrollY > 80;

      setHidden(scrollingDown && pastThreshold);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2 shadow-2xl transition-all duration-300 ease-in-out ${
        hidden
          ? "translate-y-[150%] opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <a
        href={LIVE_IT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl"
      >
        <Image
          src="/images/live-it-banner-2026.jpg"
          alt="Live It App - Golf, Tours, Transfers - Download on Google Play and App Store"
          width={1600}
          height={600}
          className="h-auto w-full rounded-2xl object-cover"
        />
      </a>
    </div>
  );
}
