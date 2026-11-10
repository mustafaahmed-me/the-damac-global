import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site-config";

/**
 * Builds per-page metadata. The layout supplies the "| The Damac Global"
 * suffix for <title>. Canonical and absolute Open Graph URLs are only emitted
 * when SITE_URL is configured, so no guessed production domain is used.
 */
export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const { siteUrl } = getSiteConfig();
  const url = siteUrl ? `${siteUrl}${path === "/" ? "" : path}` : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: `${title} | The Damac Global`,
      description,
      type: "website",
      siteName: "The Damac Global",
      locale: "en_US",
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary",
      title: `${title} | The Damac Global`,
      description,
    },
  };
}
