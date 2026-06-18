import { type AppLocale } from "@/i18n/routing";

export type LocalizedString = {
  en?: string;
  es?: string;
  frCA?: string;
};

export function resolveLocalizedTitle(
  title: LocalizedString | string | undefined | null,
  locale: AppLocale,
): string {
  if (!title) return "";
  if (typeof title === "string") return title;
  const localized =
    locale === "fr-ca" ? title.frCA : title[locale as keyof LocalizedString];
  return localized || title.en || title.es || title.frCA || "";
}
