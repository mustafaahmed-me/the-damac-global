import { ArrowUpRight, Clock, Instagram, Mail, Phone, WhatsApp } from "@/components/icons";
import InquiryForm from "@/components/forms/InquiryForm";
import Reveal from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { CONTACT_EXPECTATIONS, SERVICE_TITLES } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Start a project with The Damac Global. Send your enquiry about digital marketing, branding, websites, SEO, social media or lead generation.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = typeof params.service === "string" ? params.service : "";
  const initialService = SERVICE_TITLES.includes(requested) ? requested : "";
  const config = getSiteConfig();

  const channels = [
    config.contactEmail && {
      key: "email",
      label: "Email",
      value: config.contactEmail,
      href: `mailto:${config.contactEmail}`,
      icon: Mail,
      external: false,
    },
    {
      key: "phone",
      label: "Phone",
      value: config.phoneNumber,
      href: config.phoneUrl,
      icon: Phone,
      external: false,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      value: "Message us on WhatsApp",
      href: config.whatsappUrl,
      icon: WhatsApp,
      external: true,
    },
    {
      key: "instagram",
      label: "Instagram",
      value: "Follow and message on Instagram",
      href: config.instagramUrl,
      icon: Instagram,
      external: true,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    value: string;
    href: string;
    icon: typeof Mail;
    external: boolean;
  }[];

  return (
    <>
      <PageHero
        id="contact-title"
        variant="center"
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build something <span className="accent">unforgettable.</span>
          </>
        }
        lead="Tell us about your brand, your goals and your timeline. We will reply within two working days with clear next steps."
      />

      <section className="section section--tight" aria-labelledby="contact-form-title" style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}>
        <div className="container grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="grid gap-10">
              <div className="grid gap-5">
                <p className="eyebrow">Get in touch</p>
                <h2 id="contact-form-title" className="section-title">
                  Start your enquiry
                </h2>
                <ol className="grid gap-5">
                  {CONTACT_EXPECTATIONS.map((item, index) => (
                    <li key={item} className="flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-sm font-bold text-[var(--gold)]">
                        {index + 1}
                      </span>
                      <span className="pt-1.5 text-[var(--color-muted)]">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="panel grid gap-5">
                <p className="flex items-center gap-3 font-semibold text-[var(--color-text)]">
                  <Clock className="h-5 w-5 text-[var(--gold)]" /> Response time
                </p>
                <p className="text-[var(--color-muted)]">
                  We aim to reply within two working days. Urgent project questions are best sent by email.
                </p>
              </div>

              <div className="grid gap-3" aria-labelledby="channels-title">
                <h3 id="channels-title" className="field-label">
                  Other ways to reach us
                </h3>
                {channels.length > 0 ? (
                  <ul className="grid gap-3">
                    {channels.map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <li key={channel.key}>
                          <a
                            href={channel.href}
                            target={channel.external ? "_blank" : undefined}
                            rel={channel.external ? "noopener noreferrer" : undefined}
                            className="card card--row"
                          >
                            <span className="card-icon !mb-0 !h-12 !w-12">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="grid min-w-0 flex-1">
                              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">{channel.label}</span>
                              <span className="break-words text-[var(--color-text)]">{channel.value}</span>
                            </span>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                            {channel.external && <span className="sr-only">(opens in a new tab)</span>}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[var(--color-muted)]">Use the enquiry form to reach our team.</p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="panel">
              <InquiryForm variant="contact" contactEmail={config.contactEmail} initialService={initialService} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
