import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Svg className="arrow-diag" {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </Svg>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Svg className="arrow-down" {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function Check(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </Svg>
  );
}

export function Phone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.2 3.5h-2A1.7 1.7 0 0 0 3.5 5.2c0 8.45 6.85 15.3 15.3 15.3a1.7 1.7 0 0 0 1.7-1.7v-2l-4.2-1.4-1.5 2a13.3 13.3 0 0 1-6.8-6.8l2-1.5-1.4-4.2z" />
    </Svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 20.5l1.2-3.7A8.5 8.5 0 1 1 8 19.3z" />
      <path d="M9 9.5c0 2.6 2.9 5.5 5.5 5.5l1-1.4-1.9-.9-.8.9c-.9-.4-2-1.5-2.4-2.4l.9-.8-.9-1.9-1.4 1z" />
    </Svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </Svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <Svg strokeWidth={1.3} {...props}>
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
    </Svg>
  );
}

export function Megaphone(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18.5 6a8 8 0 0 1 0 12" />
    </Svg>
  );
}

export function Share(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 13.2l7.6 4.1M15.8 6.7L8.2 10.8" />
    </Svg>
  );
}

export function GrowthChart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </Svg>
  );
}

export function Monitor(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4M9.5 8.5l-2 2 2 2M14.5 8.5l2 2-2 2" />
    </Svg>
  );
}

export function Diamond(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20M10 3l-2 6 4 12 4-12-2-6" />
    </Svg>
  );
}

export function Target(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </Svg>
  );
}

export function Globe(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
    </Svg>
  );
}

export function Rocket(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 15c-1.5 1.2-2 4-2 4s2.8-.5 4-2c.8-1 .7-2.4-.2-3.3S5.8 14.2 5 15z" />
      <path d="M12 12l-2-2c.5-3 3-7.5 8-9-1.5 5-6 7.5-9 8.1z" />
      <circle cx="15" cy="9" r="1.2" />
    </Svg>
  );
}

export function Layers(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </Svg>
  );
}

export function Pen(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M13.5 6.5l4 4" />
    </Svg>
  );
}

export function Lightbulb(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

export function Users(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.4.8 2.3 2.6 2.5 5.2" />
    </Svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5L15.5 10" />
    </Svg>
  );
}

export function Compass(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </Svg>
  );
}

export function Clock(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}
