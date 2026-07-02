import ContactForm from "@/components/ContactForm";
import { getTranslations } from "next-intl/server";

type ContactPageProps = {
  params: Promise<{ locale: "en" | "es" | "fr-ca" }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  await params;
  const t = await getTranslations("Contact");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-3xl px-6 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="mb-8 text-center md:mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#0a192f] md:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            {t("pageSubtitle")}
          </p>
        </div>
        <ContactForm />
      </main>
    </div>
  );
}
