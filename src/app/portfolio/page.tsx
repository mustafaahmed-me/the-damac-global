import Link from "next/link";
import { ArrowUpRight, Compass } from "@/components/icons";
import { ConceptTile } from "@/components/portfolio/ConceptTile";
import Reveal from "@/components/site/Reveal";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/ui";
import { PROJECT_CONCEPTS } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Explore The Damac Global's creative concepts across brand identity, websites, social content and lead generation. Concept work, clearly labelled.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        id="portfolio-title"
        variant="center"
        eyebrow="Portfolio"
        title={
          <>
            Projects built to be <span className="accent">remembered.</span>
          </>
        }
        lead="A look at the kind of creative direction we develop. The work below is concept exploration, not client case studies."
        actions={
          <>
            <Link href="#concepts" className="btn btn-gold">
              View concepts <ArrowUpRight />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Start a new project
            </Link>
          </>
        }
      />

      <section className="section section--tight" aria-label="About these examples">
        <div className="container">
          <div className="panel flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[var(--color-line)] text-[var(--gold)]">
              <Compass className="h-6 w-6" />
            </span>
            <div>
              <p className="font-semibold text-[var(--color-text)]">Concept work, clearly labelled</p>
              <p className="mt-2 text-[var(--color-muted)]">
                These are illustrative creative explorations. They do not represent completed client projects, results, or testimonials. Client case studies will be added only with permission to publish them.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="concepts" className="section" aria-labelledby="concepts-title" style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Concept projects</p>
            <h2 id="concepts-title" className="section-title">
              Four concepts. Four disciplines.
            </h2>
            <p className="section-lead">Each concept shows how strategy, design and execution come together.</p>
          </div>
          <div className="grid-2">
            {PROJECT_CONCEPTS.map((project, index) => (
              <Reveal key={project.id} delay={(index % 2) * 110} className="h-full">
                <ConceptTile
                  tag={project.tag}
                  title={project.title}
                  body={project.body}
                  palette={project.palette}
                  href={`/contact?service=${encodeURIComponent(project.tag)}`}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="portfolio-cta">
        <div className="container">
          <Reveal>
            <CtaBand
              eyebrow="New projects"
              title="Have a project in mind?"
              lead="Share your brief and we will show you how we would approach it, from strategy and identity to build and growth."
              primaryHref="/contact"
              primaryLabel="Start a new project"
              secondaryHref="/packages"
              secondaryLabel="See packages"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
