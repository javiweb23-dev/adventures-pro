import CategoryShowcase from "@/components/CategoryShowcase";
import { type AppLocale } from "@/i18n/routing";

export default function CategoryCards({ locale }: { locale?: AppLocale }) {
  return <CategoryShowcase locale={locale} />;
}
