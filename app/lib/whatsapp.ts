import { siteConfig, WhatsAppMessageKey } from "./config";

/**
 * Generates a WhatsApp deep link with a pre-filled message.
 * @param message - The text message to pre-fill in WhatsApp
 * @returns Full WhatsApp URL with encoded message
 */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}

/**
 * Generates a WhatsApp link using a predefined message key from config.
 * @param key - Key from siteConfig.whatsappMessages
 * @returns Full WhatsApp URL
 */
export function buildWhatsAppLinkByKey(key: WhatsAppMessageKey): string {
  return buildWhatsAppLink(siteConfig.whatsappMessages[key]);
}
