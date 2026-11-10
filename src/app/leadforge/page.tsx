import Link from "next/link";
import { ArrowUpRight, Clock } from "@/components/icons";
import Reveal from "@/components/site/Reveal";
import { OrbitVisual, PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/ui";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "LeadForge",
  description:
    "LeadForge, the lead-generation product from The Damac Global. Currently in development and coming soon.",
  path: "/leadforge",
});

const STAGES = [
  { title: "Product design", state: "In progress" },
  { title: "Build & testing", state: "Upcoming" },
  { title: "Launch", state: "Upcoming" },
] as const;

export default function LeadForgePage() {
  const config = getSiteConfig();
  const launchUrl = config.leadforgeUrl;

  return (
    <>
      <PageHero
        id="leadforge-title"
        eyebrow="Product · Coming soon"
        title={
          <>
            LeadForge — <span className="accent">coming soon.</span>
          </>
        }
        lead="LeadForge is the lead-generation product being developed by The Damac Global. We are building it carefully, and we will share details as it approaches launch."
        actions={
          <>
            {launchUrl ? (
              <a href={launchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Visit LeadForge <ArrowUpRight />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="btn btn-gold" aria-disabled="true">
                <Clock className="h-4 w-4" /> Coming soon
              </span>
            )}
            <Link href="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </>
        }
        visual={<OrbitVisual label="LeadForge" sub="Coming soon" />}
        meta={["Lead generation", "In development"]}
      />

      <section className="section section--tight" aria-labelledby="status-title">
        <div className="container grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid gap-6">
              <p className="eyebrow">Product status</p>
              <h2 id="status-title" className="section-title">
                In development, built with care.
              </h2>
              <p className="section-lead">
                LeadForge is not yet available to use. This page will be updated with access details when the product is ready, so you can rely on the official announcement rather than unverified links.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ol className="panel grid gap-6">
              {STAGES.map((stage, index) => (
                <li key={stage.title} className="flex items-center justify-between gap-4 border-b border-[var(--color-line-soft)] pb-5 last:border-0 last:pb-0">
                  <span className="flex items-center gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] text-sm font-bold text-[var(--gold)]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-[var(--color-text)]">{stage.title}</span>
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] ${stage.state === "In progress" ? "gold-text" : "text-[var(--color-subtle)]"}`}>
                    {stage.state}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="leadforge-cta">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="Meanwhile"
              title="Need lead generation today?"
              lead="Our lead generation service builds funnels, landing pages and tracking that turn attention into enquiries."
              primaryHref="/contact?service=Lead%20Generation"
              primaryLabel="Discuss lead generation"
              secondaryHref="/services#lead-generation"
              secondaryLabel="Learn more"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
