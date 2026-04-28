import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950 text-gray-400">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 text-center md:grid-cols-2 md:gap-12 md:px-10 md:text-left lg:grid-cols-4 lg:gap-14 lg:px-12">
        <div className="space-y-4">
          <Image
            src="/logo-v2.png"
            alt="Adventures Finder"
            width={190}
            height={64}
            className="mx-auto h-14 w-auto brightness-0 invert md:mx-0"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {t("helpfulLinks")}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="#" className="transition hover:text-white">
              {t("terms")}
            </Link>
            <Link href="#" className="transition hover:text-white">
              {t("cancellation")}
            </Link>
            <Link href="#" className="transition hover:text-white">
              {t("faq")}
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {t("contactUs")}
          </h3>
          <div className="mt-4 space-y-2 text-sm leading-relaxed">
            <p>Plaza Cueva Taina, Local #B2, Av. Estados Unidos - Bavaro, Dominican Republic</p>
            <a href="tel:+18294216101" className="block transition hover:text-white">
              +1 829 421 6101
            </a>
            <a
              href="mailto:commercial@adventuresfinder.com"
              className="block transition hover:text-white"
            >
              commercial@adventuresfinder.com
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {t("followUs")}
          </h3>
          <div className="mt-4 flex items-center justify-center gap-4 md:justify-start">
            <a
              href="https://www.facebook.com/adventurefinder1/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-gray-300 transition hover:text-white"
              aria-label="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white transition-opacity hover:opacity-80"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.05H7.9v-2.88h2.54V9.86c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.88h2.8l-.45 2.88h-2.35V22A10.03 10.03 0 0 0 22 12.07Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/adventuresfinder1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-gray-300 transition hover:text-white"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white transition-opacity hover:opacity-80"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="text-center text-sm text-gray-400">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
