import Link from "next/link";
import { ArrowDown, ArrowUpRight, Compass, Layers, ShieldCheck, Users, Diamond, Mail, WhatsApp, Instagram } from "@/components/icons";
import { ServiceIcon } from "@/components/service-icons";
import { ConceptTile } from "@/components/portfolio/ConceptTile";
import Reveal from "@/components/site/Reveal";
import { OrbitVisual, PageHero } from "@/components/site/PageHero";
import { CtaBand, SectionHead } from "@/components/site/ui";
import { PROCESS_STEPS, PROJECT_CONCEPTS, SERVICES, SITE, WHY_US } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { getSiteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Premium Digital Marketing & Creative Agency",
  description:
    "The Damac Global is a premium digital marketing and creative agency. We build brand identities, websites, growth strategies and campaigns that make brands impossible to ignore.",
  path: "/",
});

const WHY_ICONS = [ShieldCheck, Diamond, Layers, Users];

export default function HomePage() {
  const config = getSiteConfig();

  return (
    <>
      <PageHero
        id="home-title"
        tall
        eyebrow="Design that moves business forward / 001"
        title={
          <>
            Make your brand <span className="accent">impossible</span> to ignore.
          </>
        }
        lead="We build remarkable digital experiences for ambitious businesses. Strategy, design and technology that turn attention into impact."
        actions={
          <>
            <Link href="/portfolio" className="btn btn-gold">
              Explore the work <ArrowUpRight />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Let&apos;s talk <ArrowUpRight />
            </Link>
          </>
        }
        visual={<OrbitVisual label="Boundless" sub="Possibilities" />}
        meta={["Creative digital agency", SITE.locationLine]}
      />

      {/* Brand introduction */}
      <section className="section section--tight" aria-labelledby="intro-title">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid gap-6">
              <p className="eyebrow">Who we are</p>
              <h2 id="intro-title" className="section-title">
                A premium agency for brands that refuse to blend in.
              </h2>
              <p className="section-lead">{SITE.description}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="panel relative overflow-hidden">
              <div className="glow" style={{ width: 300, height: 300, right: "-20%", top: "-30%" }} aria-hidden="true" />
              <p className="eyebrow eyebrow--plain">Our promise</p>
              <p className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[var(--color-text)]">
                <span className="gold-text">Your Vision.</span> Our Strategy.{" "}
                <span className="gold-text">Global Success.</span>
              </p>
              <p className="mt-6 text-[var(--color-muted)]">
                {SITE.positioning}. Every project starts with the business goal and ends with work that looks, feels and performs like it belongs on a global stage.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services overview */}
      <section id="services" className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHead
            id="services-title"
            eyebrow="What we do"
            title="Six disciplines. One unforgettable brand."
            lead="Strategy, identity, web, content and growth, delivered together so every touchpoint tells the same confident story."
          />
          <div className="grid-3">
            {SERVICES.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 90} className="h-full">
                <article className="card">
                  <span className="card-icon">
                    <ServiceIcon id={service.id} />
                  </span>
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-body">{service.body}</p>
                  <div className="card-foot">
                    <Link href={`/services#${service.id}`} className="text-link">
                      Explore service <ArrowUpRight />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section section--alt" aria-labelledby="process-title">
        <div className="container">
          <SectionHead
            id="process-title"
            eyebrow="Agency process"
            title="A clear path from first idea to launch."
            lead="A structured, transparent method keeps creative ambition grounded in measurable results."
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 100} className="h-full">
                <li className="card h-full list-none">
                  <span className="process-step-number" aria-label={`Step ${step.step}`}>
                    {step.step}
                  </span>
                  <h3 className="card-title mt-8">{step.title}</h3>
                  <p className="card-body">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section" aria-labelledby="why-title">
        <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <div className="grid content-start gap-6 lg:sticky lg:top-32">
              <p className="eyebrow">Why choose us</p>
              <h2 id="why-title" className="section-title">
                Premium thinking. Practical delivery.
              </h2>
              <p className="section-lead">
                Our team combines brand strategy, design, development and performance marketing, so you work with one accountable partner from start to finish.
              </p>
              <div>
                <Link href="/about" className="text-link">
                  About the studio <ArrowUpRight />
                </Link>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WHY_US.map((item, index) => {
              const Icon = WHY_ICONS[index] ?? Compass;
              return (
                <Reveal key={item.title} delay={index * 90} className="h-full">
                  <article className="card">
                    <span className="card-icon">
                      <Icon />
                    </span>
                    <h3 className="card-title text-[1.2rem]">{item.title}</h3>
                    <p className="card-body">{item.body}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio teaser (concepts only) */}
      <section className="section section--alt" aria-labelledby="work-title">
        <div className="container">
          <SectionHead
            id="work-title"
            eyebrow="Selected concepts"
            title="Creative direction, shown as concepts."
            lead="The projects below are illustrative concepts that show how we think. They are not client case studies."
          />
          <div className="grid-3">
            {PROJECT_CONCEPTS.slice(0, 3).map((project, index) => (
              <Reveal key={project.id} delay={index * 100} className="h-full">
                <ConceptTile tag={project.tag} title={project.title} body={project.body} palette={project.palette} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/portfolio" className="btn btn-ghost">
              View all concepts <ArrowDown />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact conversion */}
      <section className="section" aria-labelledby="home-cta-title">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="Start the conversation"
              title="Ready to make your brand impossible to ignore?"
              lead="Share your goals and we will recommend the right mix of strategy, design and growth. Most enquiries receive a reply within two working days."
              primaryHref="/contact"
              primaryLabel="Start your enquiry"
              secondaryHref="/packages"
              secondaryLabel="View packages"
            />
          </Reveal>

          {(config.contactEmail || config.phoneUrl || config.whatsappUrl || config.instagramUrl) && (
            <Reveal delay={120}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {config.contactEmail && (
                  <a href={`mailto:${config.contactEmail}`} className="social-pill">
                    <Mail /> {config.contactEmail}
                  </a>
                )}
                <a href={config.phoneUrl} className="social-pill">
                  <span aria-hidden="true">☎</span> {config.phoneNumber}
                </a>
                {config.whatsappUrl && (
                  <a href={config.whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                    <WhatsApp /> WhatsApp
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                {config.instagramUrl && (
                  <a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                    <Instagram /> Instagram
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
