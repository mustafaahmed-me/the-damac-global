import Link from "next/link";
import { ArrowUpRight, Check } from "@/components/icons";
import { ServiceIcon } from "@/components/service-icons";
import Reveal from "@/components/site/Reveal";
import { OrbitVisual, PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/ui";
import { SERVICES } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Digital marketing, social media management, SEO and growth, website development, brand identity and lead generation from The Damac Global.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        id="services-title"
        eyebrow="What we do / 2026"
        title={
          <>
            We make <span className="accent">big ideas</span> happen.
          </>
        }
        lead="We turn ambitious ideas into brands, websites and campaigns that people can't ignore."
        actions={
          <>
            <Link href="#services-list" className="btn btn-gold">
              Explore services <ArrowUpRight />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Start a project
            </Link>
          </>
        }
        visual={<OrbitVisual label="Strategy" sub="Creativity · Results" />}
        meta={["Strategy. Creativity. Results."]}
      />

      <section id="services-list" className="section" aria-labelledby="services-list-title" style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Our services</p>
            <h2 id="services-list-title" className="section-title">
              Six services. One connected team.
            </h2>
            <p className="section-lead">
              Choose a single service or combine several. Each one is designed to strengthen the others.
            </p>
          </div>

          <div className="grid-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 90} className="h-full">
                <article id={service.id} className="card" style={{ scrollMarginTop: "calc(var(--header-height) + 24px)" }} aria-labelledby={`${service.id}-title`}>
                  <span className="card-icon">
                    <ServiceIcon id={service.id} />
                  </span>
                  <h2 id={`${service.id}-title`} className="card-title">
                    {service.title}
                  </h2>
                  <p className="card-body">{service.body}</p>
                  <ul className="card-list">
                    {service.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="card-foot">
                    <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="text-link">
                      Enquire about {service.title} <ArrowUpRight />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="services-approach">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid gap-6">
              <p className="eyebrow">How services work together</p>
              <h2 id="services-approach" className="section-title">
                Strategy at the centre of every service.
              </h2>
              <p className="section-lead">
                A strong brand makes marketing more effective, a fast website makes campaigns convert, and clear tracking makes growth repeatable. We plan these together.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="panel grid gap-5">
              {[
                "Start with positioning and audience insight.",
                "Build the identity and website that carry the message.",
                "Launch campaigns with tracking in place from day one.",
                "Refine channels using clear, honest reporting.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--gold-gradient)] text-[#0a0a0a]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[var(--color-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="services-cta">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="Next step"
              title="Tell us which service you need first."
              lead="Not sure where to begin? Share your goals and we will recommend the right starting point."
              primaryHref="/contact"
              primaryLabel="Contact us"
              secondaryHref="/packages"
              secondaryLabel="View packages"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
