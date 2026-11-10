import Link from "next/link";
import { ArrowUpRight, Check } from "@/components/icons";
import Reveal from "@/components/site/Reveal";
import { OrbitVisual, PageHero } from "@/components/site/PageHero";
import { CtaBand, SectionHead } from "@/components/site/ui";
import { PROCESS_STEPS, SITE, VALUES } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn about The Damac Global: our vision, philosophy, brand values, creative approach and working methodology as a premium digital marketing and creative agency.",
  path: "/about",
});

const PRINCIPLES = [
  "Concept before craft: we define the idea before we decorate it.",
  "Systems over one-offs: templates and guidelines that keep quality consistent as you grow.",
  "Culture as an asset: your brand voice is treated as seriously as your logo.",
];

const TRUST_POINTS = [
  "Transparent scope, timelines and pricing conversations from the first call.",
  "Plain-language reporting that explains what is working and what we will change.",
  "One clear point of ownership from discovery through to launch and optimisation.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        id="about-title"
        eyebrow="About The Damac Global"
        title={
          <>
            We think <span className="accent">beyond</span> ordinary.
          </>
        }
        lead="The Damac Global is a premium digital marketing and creative agency. We believe brands are built through considered ideas, crafted experiences and disciplined growth."
        actions={
          <>
            <Link href="/founder" className="btn btn-gold">
              Meet the founders <ArrowUpRight />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Start a project
            </Link>
          </>
        }
        visual={<OrbitVisual label="Vision" sub="Strategy · Global" />}
        meta={["Premium creative agency", SITE.locationLine]}
      />

      {/* Company introduction */}
      <section className="section section--tight" aria-labelledby="about-intro">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="grid content-start gap-6">
              <p className="eyebrow">Company introduction</p>
              <h2 id="about-intro" className="section-title">
                A studio built on strategy, craft and ambition.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-6 text-[1.05rem] text-[var(--color-muted)]">
              <p>
                The Damac Global works with businesses that want more than visibility. We help brands define who they are, how they should look and speak, and how they can reach the right audiences with confidence.
              </p>
              <p>
                Our services span digital marketing, social media, SEO and growth, website development, brand identity and lead generation. Because they are delivered by one connected team, every decision reinforces the others.
              </p>
              <p>
                We are based in Pakistan and work with clients around the world, bringing a global standard of design and communication to every market we serve.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & philosophy */}
      <section className="section" aria-labelledby="about-vision">
        <div className="container">
          <div className="grid-2">
            <Reveal className="h-full">
              <article className="panel h-full">
                <p className="eyebrow eyebrow--plain">Our vision</p>
                <h2 id="about-vision" className="card-title mt-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
                  Brands that stand out, wherever they are.
                </h2>
                <p className="mt-5 text-[var(--color-muted)]">
                  To make every brand we work with unmistakable in its market and ambitious in its reach, building brands beyond borders with work that feels premium at every touchpoint.
                </p>
              </article>
            </Reveal>
            <Reveal delay={120} className="h-full">
              <article className="panel h-full" aria-labelledby="about-philosophy">
                <p className="eyebrow eyebrow--plain">Our philosophy</p>
                <h2 id="about-philosophy" className="card-title mt-5 text-[clamp(1.6rem,2.6vw,2.1rem)]">
                  Design with purpose. Measure with honesty.
                </h2>
                <p className="mt-5 text-[var(--color-muted)]">
                  Beautiful work has to do a job. We design with purpose, build with precision and measure with honesty, so creativity and results always move together.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="section section--alt" aria-labelledby="values-title">
        <div className="container">
          <SectionHead
            id="values-title"
            eyebrow="Brand values"
            title="What guides every decision."
            lead="Four principles shape how we plan, design and deliver for every client."
          />
          <div className="grid-4">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 90} className="h-full">
                <article className="card">
                  <span className="mb-6 font-[family-name:var(--font-display)] text-sm font-extrabold tracking-[0.2em] text-[var(--gold)]">
                    0{index + 1}
                  </span>
                  <h3 className="card-title text-[1.2rem]">{value.title}</h3>
                  <p className="card-body">{value.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Creative approach */}
      <section className="section" aria-labelledby="approach-title">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid content-start gap-6">
              <p className="eyebrow">Creative approach</p>
              <h2 id="approach-title" className="section-title">
                Thoughtful ideas, executed with obsessive care.
              </h2>
              <p className="section-lead">
                Our creative process moves from insight to expression. We study the market, define a clear position, and then shape every visual, word and interaction around it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="grid gap-4">
              {PRINCIPLES.map((item) => (
                <li key={item} className="card card--row">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--gold-gradient)] text-[#0a0a0a]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="pt-1 text-[var(--color-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Working methodology */}
      <section className="section section--alt" aria-labelledby="method-title">
        <div className="container">
          <SectionHead
            id="method-title"
            eyebrow="Working methodology"
            title="How we work, step by step."
            lead="Each stage has clear deliverables, so you always know where the project stands."
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 100} className="h-full">
                <li className="card h-full list-none">
                  <span className="text-sm font-bold tracking-[0.2em] text-[var(--gold)]">STEP {step.step}</span>
                  <h3 className="card-title mt-6">{step.title}</h3>
                  <p className="card-body">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust & strategy */}
      <section className="section" aria-labelledby="trust-title">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="grid gap-6">
              <p className="eyebrow">Trust & strategy</p>
              <h2 id="trust-title" className="section-title">
                Trust is built through clarity.
              </h2>
              <p className="section-lead">
                We keep our clients informed, involved and in control. Strategy is never a slide deck that sits on a shelf. It is the working plan behind every deliverable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="panel grid gap-6">
              {TRUST_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--gold)]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[var(--color-muted)]">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="about-cta">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="Let's begin"
              title="Bring us your vision. We will bring the strategy."
              lead="Tell us about your business and goals. We will suggest the right starting point."
              primaryHref="/contact"
              primaryLabel="Start a project"
              secondaryHref="/services"
              secondaryLabel="Explore services"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
