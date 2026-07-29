/**
 * Universal WhatsApp deep-link helper (Meta-compatible).
 * Works with WhatsApp, WhatsApp Business, and WhatsApp Web.
 */

/** Adventures Finder sales WhatsApp (digits only, international). */
export const ADVENTURES_WHATSAPP_PHONE = "18495700202";

/**
 * Strip spaces, "+", dashes, parentheses — keep international digits only.
 * Example: "+1 849-570-0202" → "18495700202"
 */
export function cleanWhatsAppPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Official Meta universal send URL.
 * Format: https://api.whatsapp.com/send/?phone={digits}&text={encoded}
 */
export function getUniversalWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanWhatsAppPhone(phone);
  return `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}
