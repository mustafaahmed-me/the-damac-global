// Central content source for The Damac Global.
// Edit copy here so every page, form and footer stays in sync.

export const SITE = {
  name: "The Damac Global",
  shortName: "THE DAMAC GLOBAL",
  tagline: "Your Vision. Our Strategy. Global Success.",
  descriptor: "Building Brands Beyond Borders",
  positioning: "Premium Digital Marketing & Creative Agency",
  locationLine: "Pakistan · Working worldwide",
  est: "Est. 2026",
  description:
    "The Damac Global is a premium digital marketing and creative agency building brands beyond borders through strategy, brand design, web experiences and growth marketing.",
} as const;

export type NavKey = "home" | "services" | "packages" | "portfolio" | "about" | "founder" | "contact" | "leadforge";

export const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
  { key: "services", label: "Services", href: "/services" },
  { key: "packages", label: "Packages", href: "/packages" },
  { key: "portfolio", label: "Portfolio", href: "/portfolio" },
  { key: "about", label: "About", href: "/about" },
  { key: "founder", label: "Founder", href: "/founder" },
  { key: "contact", label: "Contact", href: "/contact" },
  { key: "leadforge", label: "LeadForge", href: "/leadforge" },
];

export const SERVICES = [
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    body: "Integrated campaigns across paid, organic and owned channels, planned around clear business goals and measured with honest reporting.",
    points: ["Campaign strategy", "Paid & organic channels", "Performance reporting"],
  },
  {
    id: "social-media",
    title: "Social Media Management",
    body: "Content planning, creative production, community management and platform growth that keep your brand present and recognisable.",
    points: ["Content calendars", "Creative production", "Community management"],
  },
  {
    id: "seo-growth",
    title: "SEO & Growth",
    body: "Technical SEO, content strategy and growth experiments that build search visibility and compounding organic traffic over time.",
    points: ["Technical SEO audits", "Content strategy", "Growth experiments"],
  },
  {
    id: "website-development",
    title: "Website Development",
    body: "Fast, responsive and conversion-focused websites and landing pages, designed with premium detail and engineered to perform on every device.",
    points: ["Responsive builds", "Conversion-led layouts", "Performance & accessibility"],
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    body: "Logos, visual systems, typography and brand guidelines that give your business a sophisticated, consistent and instantly recognisable presence.",
    points: ["Logo & visual system", "Typography & colour", "Brand guidelines"],
  },
  {
    id: "lead-generation",
    title: "Lead Generation",
    body: "Funnels, landing pages and tracking set-ups that turn attention into qualified enquiries your sales team can act on.",
    points: ["Funnel design", "Landing pages", "Enquiry tracking"],
  },
] as const;

export type ServiceTitle = (typeof SERVICES)[number]["title"];
export const SERVICE_TITLES: readonly string[] = SERVICES.map((s) => s.title);

export const PACKAGE_OPTIONS = ["Basic", "Standard", "Premium", "Custom", "Not sure yet"] as const;

export const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $7,500",
  "$7,500 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

export const PACKAGES = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Establish your presence",
    description:
      "A focused starting point for businesses that need a credible online presence and a clear first step into digital marketing.",
    includes: [
      "Brand & channel audit",
      "One core channel managed",
      "Monthly performance summary",
      "Email support",
    ],
    featured: false,
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Build consistent moment",
    description:
      "Balanced support for growing brands that need steady content, regular campaigns and a clearer view of what is working.",
    includes: [
      "Two channels managed",
      "Monthly content plan & creative",
      "Website or landing page refresh",
      "Enquiry tracking set-up",
      "Fortnightly strategy review",
    ],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Lead your market",
    description:
      "A full-service growth partnership for brands ready to lead tfir category with strategy, identity, web and performance working together.",
    includes: [
      "Multi-channel strategy & management",
      "Brand identity refresh",
      "Full website build or redesign",
      "SEO & growth roadmap",
      "Lead generation funnels",
      "Weekly reporting & strategy calls",
    ],
    featured: true,
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "Built around your goals",
    description:
      "Choose any combination of services. We scope the work, timeline and delivery model around the outcomes you need.",
    includes: [
      "Choose any services",
      "Bespoke scope & timeline",
      "Flexible project or retainer model",
      "Direct strategy consultation",
    ],
    featured: false,
  },
] as const;

export type PackageId = (typeof PACKAGES)[number]["id"];

export const FOUNDERS = [
  {
    id: "hunain-faraz-memon",
    name: "Hunain Faraz Memon",
    role: "Co-Founder",
    initials: "HF",
    intro:
      "Co-founder of The Damac Global, focused on shaping brand direction and turning ambitious ideas into clear, confident digital experiences.",
    focus: ["Brand direction", "Strategy & positioning", "Client partnerships"],
  },
  {
    id: "mustafa-ahmed-memon",
    name: "Mustafa Ahmed Memon",
    role: "Co-Founder",
    initials: "MA",
    intro:
      "Co-founder of The Damac Global, focused on building the systems, campaigns and creative execution that carry brands across borders.",
    focus: ["Campaign execution", "Creative production", "Growth & delivery"],
  },
] as const;

export const PROJECT_CONCEPTS = [
  {
    id: "concept-luxury-launch",
    tag: "Brand Identity",
    title: "Luxury Product Launch",
    body: "Concept direction for a premium product launch: a restrained gold identity system, editorial imagery and a launch microsite.",
    palette: "from-gold",
  },
  {
    id: "concept-growth-site",
    tag: "Website Development",
    title: "Conversion-Led Service Website",
    body: "Concept architecture for a professional services website with a clear hero, proof sections and a streamlined enquiry journey.",
    palette: "from-slate",
  },
  {
    id: "concept-social-campaign",
    tag: "Social Media",
    title: "Social Content Series",
    body: "Concept content series with a modular template system, motion-led reels and a repeatable weekly publishing rhythm.",
    palette: "from-ember",
  },
  {
    id: "concept-lead-funnel",
    tag: "Lead Generation",
    title: "Enquiry Funnel Concept",
    body: "Concept funnel mapping campaign, landing page and tracking steps from first impression to qualified enquiry.",
    palette: "from-ink",
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    body: "We learn your business, audience and competitive landscape before forming any opinion about the work.",
  },
  {
    step: "02",
    title: "Strategise",
    body: "We define positioning, channels and measurable goals so every decision has a clear purpose.",
  },
  {
    step: "03",
    title: "Create",
    body: "Our designers, writers and developers build the identity, content and experiences together.",
  },
  {
    step: "04",
    title: "Launch & Optimise",
    body: "We launch with tracking in place, then refine based on what the data and your audience tell us.",
  },
] as const;

export const VALUES = [
  {
    title: "Strategy first",
    body: "Beautiful work has to do a job. We start with the business outcome and design backwards from it.",
  },
  {
    title: "Craft without compromise",
    body: "Typography, motion, code and copy are treated as brand assets, not afterthoughts.",
  },
  {
    title: "A global mindset",
    body: "Built in Pakistan and working with ambitious brands wherever they are, with a voice that travels.",
  },
  {
    title: "Honest measurement",
    body: "We report what is working and what is not, and we adjust without drama.",
  },
] as const;

export const WHY_US = [
  {
    title: "One team, one vision",
    body: "Strategy, identity, web and marketing are delivered by a joined-up team, so nothing gets lost between handovers.",
  },
  {
    title: "Premium by design",
    body: "We hold every touchpoint to the same high standard, from the first ad to the final checkout page.",
  },
  {
    title: "Built to scale",
    body: "Systems, templates and content frameworks that grow with your business instead of being rebuilt every quarter.",
  },
  {
    title: "Clear communication",
    body: "Plain-language updates, transparent scope and a single point of contact throughout the project.",
  },
] as const;

export const CONTACT_EXPECTATIONS = [
  "Share a short overview of your business and goals.",
  "Tell us which services interest you and your timeline.",
  "We reply with next steps, usually within two working days.",
] as const;
