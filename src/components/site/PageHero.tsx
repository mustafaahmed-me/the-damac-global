import type { CSSProperties, ReactNode } from "react";
import { Sparkle } from "@/components/icons";

/**
 * Shared hero for every page. Vertical alignment comes from the global
 * --header-height and --hero-top-spacing tokens (see globals.css), so the
 * heading starts at the same baseline on all eight pages. Only the
 * composition (split vs centred, visual vs none) varies per page.
 */
export function PageHero({
  id,
  eyebrow,
  title,
  lead,
  actions,
  visual,
  variant = "split",
  tall = false,
  meta,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  variant?: "split" | "center";
  tall?: boolean;
  meta?: string[];
}) {
  const delay = (ms: number): CSSProperties => ({ "--d": `${ms}ms` }) as CSSProperties;
  const centered = variant === "center" || !visual;

  return (
    <section className={`hero${tall ? " hero--home" : ""}`} aria-labelledby={id}>
      <div className="grain" aria-hidden="true" />
      <div className="glow" style={{ width: 640, height: 640, right: "-18%", top: "-20%" }} aria-hidden="true" />
      <div className="container relative z-[1]">
        <div className={`hero-grid${visual && variant === "split" ? " hero-grid--split" : ""}`}>
          <div className={`hero-copy${centered ? " hero-copy--center" : ""}`}>
            <p className="eyebrow hero-anim" style={delay(0)}>
              {eyebrow}
            </p>
            <h1 id={id} className={`hero-title hero-anim${centered ? "" : ""}`} style={delay(120)}>
              {title}
            </h1>
            {lead && (
              <p className="hero-lead hero-anim" style={delay(260)}>
                {lead}
              </p>
            )}
            {actions && (
              <div className="hero-actions hero-anim" style={delay(380)}>
                {actions}
              </div>
            )}
          </div>
          {visual && (
            <div className="hero-visual hero-visual-anim" aria-hidden="true">
              {visual}
            </div>
          )}
        </div>
        {meta && meta.length > 0 && (
          <div className="hero-meta hero-anim" style={delay(480)}>
            {meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Decorative globe + orbit used on hero visuals across the site. */
export function OrbitVisual({ label, sub }: { label?: string; sub?: string }) {
  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit__ring orbit__ring--a" />
      <div className="orbit__ring orbit__ring--b" />
      <div className="orbit__globe" />
      <span className="orbit__spark" style={{ right: "8%", top: "10%" }}>
        <Sparkle />
      </span>
      {label && (
        <span className="orbit__tag" style={{ left: "6%", bottom: "12%" }}>
          {label}
          {sub && (
            <>
              <br />
              {sub}
            </>
          )}
        </span>
      )}
    </div>
  );
}
