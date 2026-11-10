// Server-side configuration read from environment variables.
// Never import this module into a client component. Pass the resulting
// values down as props instead, so private values are never bundled.

export type SiteConfig = {
  contactEmail: string;
  phoneNumber: string;
  phoneUrl: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramUrl: string;
  leadforgeUrl: string | null;
  siteUrl: string | null;
  sheetsConfigured: boolean;
};

function readHttpUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getSiteConfig(): SiteConfig {
  // Official brand contact channels are centralized here so every page uses
  // the same verified destinations and outdated environment values cannot
  // silently reintroduce old contact details.
  const contactEmail = "thedamacglobal@gmail.com";
  const phoneNumber = "+92 371 4968118";
  const phoneDigits = "+923714968118";
  const instagramUrl = "https://www.instagram.com/thedamacglobal";
  const whatsappUrl = "https://wa.me/923714968118";
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL?.trim() ?? "";
  const sheetsSecret = process.env.SHEETS_SHARED_SECRET?.trim() ?? "";

  return {
    contactEmail,
    phoneNumber,
    phoneUrl: `tel:${phoneDigits}`,
    whatsappNumber: phoneDigits,
    whatsappUrl,
    instagramUrl,
    leadforgeUrl: readHttpUrl(process.env.LEADFORGE_URL),
    siteUrl: readHttpUrl(process.env.SITE_URL)?.replace(/\/$/, "") ?? null,
    sheetsConfigured: Boolean(readHttpUrl(sheetsUrl) && sheetsSecret),
  };
}
