import Link from "next/link";
import PackagesExplorer from "@/components/packages/PackagesExplorer";
import { ArrowDown } from "@/components/icons";
import { PageHero } from "@/components/site/PageHero";
import { getSiteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Packages",
  description:
    "Choose from four packages: Basic, Standard, Premium and Custom. Request a tailored package from The Damac Global.",
  path: "/packages",
});

export default function PackagesPage() {
  const config = getSiteConfig();

  return (
    <>
      <PageHero
        id="packages-title"
        variant="center"
        eyebrow="Packages"
        title={
          <>
            Choose your <span className="accent">growth path.</span>
          </>
        }
        lead="Four structured packages for every stage of growth. Pick the one closest to your goals, or build a custom package around the services you need."
        actions={
          <>
            <Link href="#packages-grid" className="btn btn-gold">
              Compare packages <ArrowDown />
            </Link>
            <Link href="#custom-package" className="btn btn-ghost">
              Request custom package
            </Link>
          </>
        }
      />

      <section id="packages-grid" className="section section--tight" aria-labelledby="packages-grid-title" style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}>
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow">Compare</p>
            <h2 id="packages-grid-title" className="section-title">
              Four packages. Clear inclusions.
            </h2>
            <p className="section-lead">
              Every package is scoped after a short discovery conversation, so you only pay for work that moves your business forward.
            </p>
          </div>
          <PackagesExplorer contactEmail={config.contactEmail} />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container text-center">
          <p className="mx-auto max-w-2xl text-[var(--color-subtle)]">
            Not sure which package fits?{" "}
            <Link href="/contact" className="text-link">
              Talk to our team
            </Link>{" "}
            and we will recommend the right starting point.
          </p>
        </div>
      </section>
    </>
  );
}
