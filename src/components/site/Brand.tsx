import Link from "next/link";

/**
 * Gold "D" monogram with globe and orbit. Drawn as vector so it stays sharp
 * at every size. Swap for the official logo file in /public if you prefer.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="dm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e9c2" />
          <stop offset="0.5" stopColor="#e6bd74" />
          <stop offset="1" stopColor="#a9773a" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        fill="url(#dm-gold)"
        d="M8 6h24c12 0 21 9 21 26S44 58 32 58H8V6zm11 10v32h13c6.6 0 11-5.2 11-16s-4.4-16-11-16H19z"
      />
      <circle cx="34" cy="32" r="8.5" fill="none" stroke="url(#dm-gold)" strokeWidth="2" />
      <path d="M25.5 32h17M34 23.5v17" stroke="url(#dm-gold)" strokeWidth="1.2" opacity="0.8" />
      <ellipse
        cx="33"
        cy="32"
        rx="30"
        ry="9"
        transform="rotate(-24 33 32)"
        fill="none"
        stroke="url(#dm-gold)"
        strokeWidth="2.6"
      />
    </svg>
  );
}

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="The Damac Global, back to home">
      <BrandMark className="brand-mark" />
      <span className="brand-text">
        <span className="brand-name">The Damac</span>
        <span className="brand-sub">Global</span>
      </span>
    </Link>
  );
}
