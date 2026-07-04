import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { routing, type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import { client } from "@/sanity/lib/client";
import { navCategoriesQuery, type NavCategory } from "@/lib/sanityCategories";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  return buildPageMetadata({
    locale: locale as AppLocale,
    pathname,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const categories = await client
    .fetch<NavCategory[]>(navCategoriesQuery, { locale })
    .catch(() => []);

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar categories={categories} />
      {children}
      <Footer />
      <WhatsAppButton />
    </NextIntlClientProvider>
  );
}