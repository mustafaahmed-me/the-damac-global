import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/site/Footer";
import Header from "@/components/site/Header";
import { SITE } from "@/lib/content";
import "./globals.css";

// Configuration (contact channels, LeadForge URL) is read from environment
// variables at request time, so changing .env never needs a rebuild.
export const dynamic = "force-dynamic";

const siteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "") || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE.name,
  title: {
    default: `${SITE.name} | ${SITE.descriptor}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "digital marketing agency",
    "creative agency",
    "brand identity",
    "website development",
    "SEO and growth",
    "social media management",
    "lead generation",
    "The Damac Global",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    title: `${SITE.name} | ${SITE.descriptor}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
