import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import Reveal from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/ui";
import { FOUNDERS } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Founders",
  description:
    "Meet Hunain Faraz Memon and Mustafa Ahmed Memon, the co-founders of The Damac Global, a premium digital marketing and creative agency.",
  path: "/founder",
});

export default function FounderPage() {
  return (
    <>
      <PageHero
        id="founder-title"
        variant="center"
        eyebrow="Founders"
        title={
          <>
            The minds behind <span className="accent">the brand.</span>
          </>
        }
        lead="The Damac Global was founded by Hunain Faraz Memon and Mustafa Ahmed Memon, with a shared belief that ambitious brands deserve premium, globally minded creative partners."
        actions={
          <>
            <Link href="#founder-hunain-faraz-memon" className="btn btn-gold">
              Meet the founders
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Start a project <ArrowUpRight />
            </Link>
          </>
        }
      />

      {FOUNDERS.map((founder, index) => {
        const reversed = index % 2 === 1;
        return (
          <section
            key={founder.id}
            id={`founder-${founder.id}`}
            className={`section${index % 2 === 1 ? " section--alt" : ""}`}
            aria-labelledby={`${founder.id}-name`}
            style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}
          >
            <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal className={reversed ? "lg:order-2" : ""}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-charcoal)] shadow-[var(--shadow-card)]" aria-hidden="true">
                  <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_20%,rgba(233,194,125,0.28),transparent_55%),linear-gradient(160deg,#1c1812,#070707_70%)]" />
                  <div className="orbit">
                    <div className="orbit__ring orbit__ring--a" style={{ width: "120%" }} />
                    <div className="orbit__ring orbit__ring--b" style={{ width: "95%" }} />
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,7rem)] font-extrabold tracking-[-0.04em] gold-text">
                      {founder.initials}
                    </span>
                  </div>
                  <span className="concept-label">Portrait</span>
                </div>
              </Reveal>

              <Reveal delay={120} className={reversed ? "lg:order-1" : ""}>
                <div className="grid gap-6">
                  <p className="eyebrow">{founder.role}</p>
                  <h2 id={`${founder.id}-name`} className="section-title">
                    {founder.name}
                  </h2>
                  <p className="section-lead max-w-none">{founder.intro}</p>
                  <ul className="flex flex-wrap gap-3" aria-label={`${founder.name} areas of focus`}>
                    {founder.focus.map((item) => (
                      <li key={item} className="pill-chip">
                        <span className="dot" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href="/contact" className="text-link">
                      Work with {founder.name.split(" ")[0]} & the team <ArrowUpRight />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <section className="section" aria-labelledby="founder-cta">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="Partner with us"
              title="Build a brand with founders who care about the details."
              lead="Reach out with your goals and we will arrange a conversation with our team."
              primaryHref="/contact"
              primaryLabel="Contact the team"
              secondaryHref="/about"
              secondaryLabel="About the studio"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
