import type { ComponentType, SVGProps } from "react";
import {
  Diamond,
  GrowthChart,
  Megaphone,
  Monitor,
  Share,
  Target,
} from "@/components/icons";

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  "digital-marketing": Megaphone,
  "social-media": Share,
  "seo-growth": GrowthChart,
  "website-development": Monitor,
  "brand-identity": Diamond,
  "lead-generation": Target,
};

export function ServiceIcon({ id, className }: { id: string; className?: string }) {
  const Icon = ICONS[id] ?? Diamond;
  return <Icon className={className} />;
}
