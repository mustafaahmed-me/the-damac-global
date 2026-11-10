import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@/components/icons";

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  return (
    <div className={`section-head${center ? " section-head--center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
}

export function CtaBand({
  title,
  lead,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  center = false,
  eyebrow,
}: {
  title: string;
  lead?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  center?: boolean;
  eyebrow?: string;
}) {
  return (
    <div className={`cta-band${center ? " cta-band--center" : ""}`}>
      <div className="glow" style={{ width: 420, height: 420, right: "-8%", top: "-30%" }} aria-hidden="true" />
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="cta-title">{title}</h2>
      {lead && <p className="max-w-2xl text-[var(--color-muted)]">{lead}</p>}
      <div className={`flex flex-wrap gap-3 ${center ? "justify-center" : ""}`}>
        <Link href={primaryHref} className="btn btn-gold">
          {primaryLabel} <ArrowUpRight />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link href={secondaryHref} className="btn btn-ghost">
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
