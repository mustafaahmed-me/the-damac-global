import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

const CONCEPT_ART: Record<string, { src: string; alt: string }> = {
  "from-gold": {
    src: "/images/concepts/luxury-product-launch.svg",
    alt: "Luxury fragrance product identity concept with a sculptural bottle and gold studio lighting",
  },
  "from-slate": {
    src: "/images/concepts/premium-website-design.svg",
    alt: "Premium responsive website concept shown across desktop and mobile screens",
  },
  "from-ember": {
    src: "/images/concepts/social-editorial-campaign.svg",
    alt: "Luxury social media editorial campaign with a curated grid of branded content",
  },
  "from-ink": {
    src: "/images/concepts/lead-generation-dashboard.svg",
    alt: "Lead generation analytics concept with campaign performance, conversion chart and funnel",
  },
};

const FALLBACK_ART = CONCEPT_ART["from-gold"];

export function ConceptTile({
  tag,
  title,
  body,
  palette,
  href,
}: {
  tag: string;
  title: string;
  body: string;
  palette: string;
  href?: string;
}) {
  const artwork = CONCEPT_ART[palette] ?? FALLBACK_ART;

  return (
    <article className="tile concept-tile h-full">
      <div className="tile-art concept-tile__art">
        <Image
          src={artwork.src}
          alt={artwork.alt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 40vw"
          className="concept-tile__image"
          priority={palette === "from-gold"}
        />
        <div className="concept-tile__shade" aria-hidden="true" />
        <div className="shine" aria-hidden="true" />
        <span className="concept-label">Concept</span>
      </div>
      <div className="tile-body">
        <p className="tile-tag">{tag}</p>
        <h3 className="card-title !mb-0 text-[1.3rem]">{title}</h3>
        <p className="card-body">{body}</p>
        {href && (
          <div className="pt-2">
            <Link href={href} className="text-link">
              Discuss a similar project <ArrowUpRight />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
