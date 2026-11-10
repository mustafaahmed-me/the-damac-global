import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Instagram, Mail, Phone, WhatsApp } from "@/components/icons";
import { NAV_ITEMS, SITE } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";
import logo from "@/picture/logo.png";

export default function Footer() {
  const config = getSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="site-footer">
      <div
        className="glow"
        style={{
          width: 620,
          height: 620,
          left: "-12%",
          bottom: "-30%",
        }}
        aria-hidden="true"
      />

      <div className="container">
        <div className="footer-grid">

          {/* Footer Brand and Logo */}
          <div className="footer-brand grid gap-6 justify-items-start">
            <Link
              href="/"
              aria-label="The Damac Global Home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Image
                src={logo}
                alt="The Damac Global"
                width={260}
                height={95}
                loading="lazy"
                style={{
                  display: "block",
                  width: "clamp(190px, 23vw, 260px)",
                  height: "auto",
                  maxHeight: "95px",
                  objectFit: "contain",
                  objectPosition: "left center",
                }}
              />
            </Link>

            <p className="max-w-sm text-[var(--color-muted)]">
              <span className="block font-semibold text-[var(--color-text)]">
                {SITE.tagline}
              </span>

              <span className="mt-3 block text-[0.95rem]">
                {SITE.positioning}. {SITE.description}
              </span>
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="footer-title">Navigate</h2>

            <ul className="footer-list">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="footer-title">Contact</h2>

            <ul className="footer-list">
              {config.contactEmail && (
                <li>
                  <a
                    href={`mailto:${config.contactEmail}`}
                    className="inline-flex items-center gap-3"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                    {config.contactEmail}
                  </a>
                </li>
              )}

              <li>
                <a
                  href={config.phoneUrl}
                  className="inline-flex items-center gap-3"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                  {config.phoneNumber}
                </a>
              </li>

              {config.whatsappUrl && (
                <li>
                  <a
                    href={config.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3"
                  >
                    <WhatsApp className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                    WhatsApp
                    <span className="sr-only">
                      (opens in a new tab)
                    </span>
                  </a>
                </li>
              )}

              {config.instagramUrl && (
                <li>
                  <a
                    href={config.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                    Instagram
                    <span className="sr-only">
                      (opens in a new tab)
                    </span>
                  </a>
                </li>
              )}

              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3"
                >
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                  Send an enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Start a Project */}
          <div>
            <h2 className="footer-title">Start a project</h2>

            <p className="mb-5 text-[0.95rem] text-[var(--color-muted)]">
              Tell us about your brand and goals. We will reply with clear next steps.
              <br />
              <br />
            </p>

            <div className="grid gap-3">
              <Link
                href="/contact"
                className="btn btn-gold w-full sm:w-auto"
              >
                Let&apos;s talk <ArrowUpRight />
              </Link>

              <Link href="/leadforge" className="text-link">
                Explore LeadForge
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            &copy; {year} {SITE.name}. All rights reserved.
          </p>

          <p className="gold-text tracking-[0.14em] uppercase text-[0.72rem]">
            {SITE.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
