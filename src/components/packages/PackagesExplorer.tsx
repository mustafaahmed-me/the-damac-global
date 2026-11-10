"use client";

import Link from "next/link";
import { useState } from "react";
import InquiryForm from "@/components/forms/InquiryForm";
import Reveal from "@/components/site/Reveal";
import { Check } from "@/components/icons";
import { CONTACT_EXPECTATIONS, PACKAGES } from "@/lib/content";

/**
 * Package cards and the custom request form share state: choosing a package
 * pre-selects it in the form and scrolls the user to the request section.
 */
export default function PackagesExplorer({ contactEmail }: { contactEmail: string | null }) {
  const [selected, setSelected] = useState("");

  const choose = (name: string) => {
    setSelected(name);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("custom-package")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="grid-4 items-stretch">
        {PACKAGES.map((pkg, index) => {
          const isSelected = selected === pkg.name;
          return (
            <Reveal key={pkg.id} delay={index * 90} className="h-full">
              <article
                aria-labelledby={`pkg-${pkg.id}`}
                className={`card${pkg.featured ? " card--featured" : ""}${isSelected ? " is-selected" : ""}`}
              >
                {/* {pkg.featured ? (
                  <span className="badge">Recommended</span>
                ) : (
                  <span className="badge badge--ghost invisible" aria-hidden="true">
                    Recommended
                  </span>
                )} */}
                <p className="mt-6 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
                  {pkg.tagline}
                </p>
                <h2 id={`pkg-${pkg.id}`} className="card-title mt-3 text-[1.75rem]">
                  {pkg.name}
                </h2>
                <p className="card-body">{pkg.description}</p>

                <p className="price-note mt-7" aria-label={`${pkg.name} pricing on request`}>
                  Pricing on request
                </p>

                <ul className="card-list" aria-label={`${pkg.name} includes`}>
                  {pkg.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="card-foot">
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => choose(pkg.name)}
                    className={`btn w-full ${pkg.featured ? "btn-gold" : "btn-ghost"}`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" /> Selected
                      </>
                    ) : pkg.id === "custom" ? (
                      "Build my package"
                    ) : (
                      `Select ${pkg.name}`
                    )}
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <section id="custom-package" className="section" aria-labelledby="custom-package-title" style={{ scrollMarginTop: "calc(var(--header-height) + 16px)" }}>
        <div className="container grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="grid gap-6">
              <p className="eyebrow">Custom package request</p>
              <h2 id="custom-package-title" className="section-title">
                Build a package around your goals
              </h2>
              <p className="section-lead">
                Select the services you need, share your budget and goals, and we will reply with a tailored proposal.
                Your request is sent directly to our team.
              </p>
              <ol className="mt-4 grid gap-5">
                {CONTACT_EXPECTATIONS.map((item, index) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-sm font-bold text-[var(--gold)]">
                      {index + 1}
                    </span>
                    <span className="pt-1.5 text-[var(--color-muted)]">{item}</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-[var(--color-subtle)]">
                Want to talk before choosing?{" "}
                <Link href="/contact" className="text-link">
                  Contact us
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="panel">
              <InquiryForm
                variant="custom"
                contactEmail={contactEmail}
                packageValue={selected}
                onPackageChange={setSelected}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
