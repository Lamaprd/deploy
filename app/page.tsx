"use client";

/**
 * Dansovia — Marketing homepage (app/page.tsx)
 * Single file. Animation via framer-motion; icons via lucide-react.
 *
 * Team: 1 founder + 3 senior team = 4 people. Headshot files live in
 * /public/team/ with the filenames referenced in the TEAM DATA block.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   BRAND / DEPLOYMENT CONFIG
───────────────────────────────────────────── */

const BRAND = {
  name: "Dansovia",
  legalName: "Dansovia Advisory Group, Inc.",
  domain: "dansovia.com",
  tagline:
    "AI governance and regulatory advisory for organizations deploying AI at scale.",
  emailGeneral: "hello@dansovia.com",
  emailCareers: "careers@dansovia.com",
  phone: "+1 (213) 555-0142",
  address: {
    line1: "1200 Wilshire Boulevard, Suite 800",
    city: "Los Angeles",
    region: "CA",
    postal: "90017",
    country: "United States",
  },
  founded: 2021,
  careersUpdated: "October 2026",
  linkedin: "https://www.linkedin.com/company/dansovia",
} as const;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#regulatory", label: "Regulatory Intelligence" },
  { href: "#insights", label: "Insights" },
  { href: "#about", label: "About" },
  { href: "#careers", label: "Careers" },
];

const heroNodes = [
  { label: "EU AI ACT", x: 20, y: 25, delay: 0.2 },
  { label: "CALIFORNIA SB 942", x: 55, y: 15, delay: 0.35 },
  { label: "GPAI", x: 80, y: 35, delay: 0.5 },
  { label: "CCPA / CPRA", x: 30, y: 60, delay: 0.4 },
  { label: "GOVERNANCE", x: 65, y: 70, delay: 0.55 },
  { label: "VENDOR RISK", x: 85, y: 55, delay: 0.65 },
];

const tickerItems = [
  {
    region: "EU AI ACT",
    type: "REGULATORY UPDATE",
    detail: "High-risk obligations phased in through 2027",
  },
  {
    region: "CALIFORNIA",
    type: "SB 942 · AB 2013 · CPRA",
    detail: "AI transparency and training-data disclosure rules",
  },
  {
    region: "UNITED STATES",
    type: "FEDERAL + STATE",
    detail: "Executive orders and state AI legislation tracker",
  },
  {
    region: "CANADA",
    type: "AIDA + PIPEDA REFORM",
    detail: "Artificial Intelligence and Data Act developments",
  },
];

const services = [
  {
    num: "01",
    title: "AI Act & Global Compliance",
    description:
      "AI system classification, regulatory gap assessments, high-risk AI readiness and compliance documentation for EU, US and Canadian regimes.",
  },
  {
    num: "02",
    title: "AI Governance & Board Advisory",
    description:
      "Enterprise AI policies, governance frameworks, risk registers, internal controls and executive-level oversight design.",
  },
  {
    num: "03",
    title: "Generative AI, Copyright & IP",
    description:
      "Data provenance, training-data review, copyright exposure, licensing strategy and contractual risk around generative AI — with a focus on media and entertainment workflows.",
  },
  {
    num: "04",
    title: "AI Vendor Due Diligence",
    description:
      "Structured assessment of third-party AI vendors covering model risk, data practices, privacy, security and contractual exposure.",
  },
];

const stages = [
  { num: "01", title: "Discover",  description: "Inventory AI systems, vendors, data and use cases." },
  { num: "02", title: "Classify",  description: "Determine regulatory exposure and AI risk category." },
  { num: "03", title: "Assess",    description: "Evaluate governance, privacy, IP, security and documentation." },
  { num: "04", title: "Remediate", description: "Develop policies, controls and supporting documentation." },
  { num: "05", title: "Monitor",   description: "Continuously monitor regulatory and operational changes." },
];

const riskCategories = [
  { name: "Regulatory",  score: 85 },
  { name: "Privacy",     score: 70 },
  { name: "IP",          score: 60 },
  { name: "Governance",  score: 88 },
  { name: "Vendor Risk", score: 65 },
];

const jurisdictions = [
  {
    region: "EUROPEAN UNION",
    title: "EU AI Act",
    status: "Implementation monitoring",
    focus: ["Risk classification", "GPAI", "High-risk systems", "Transparency"],
    updated: "Oct 2026",
  },
  {
    region: "CALIFORNIA",
    title: "SB 942 · AB 2013",
    status: "Active enforcement",
    focus: ["AI transparency", "Training data", "Deepfakes", "CPRA amendments"],
    updated: "Oct 2026",
  },
  {
    region: "UNITED STATES",
    title: "Federal + State",
    status: "Active developments",
    focus: ["Executive orders", "State legislation", "Sector guidance", "Agency rules"],
    updated: "Oct 2026",
  },
  {
    region: "CANADA",
    title: "AIDA + Privacy",
    status: "Legislative progress",
    focus: ["AIDA", "PIPEDA reform", "Public sector AI", "OPC guidance"],
    updated: "Oct 2026",
  },
];

const engagementModels = [
  {
    title: "AI Impact Assessment",
    description:
      "A focused assessment of a single AI product or deployment to identify regulatory, privacy and governance exposure — typically delivered in 4–6 weeks.",
  },
  {
    title: "Fractional AI Governance",
    description:
      "Ongoing regulatory monitoring and governance support embedded within your organization's operating rhythm, under a monthly retainer.",
  },
  {
    title: "Board & C-Suite Advisory",
    description:
      "Executive briefings on AI liability, governance obligations and emerging regulatory exposure for boards, audit committees and executive teams.",
  },
];

const caseStudies = [
  {
    sector: "MEDIA & ENTERTAINMENT",
    title: "Governance framework for generative AI in production workflows",
    challenge:
      "A Los Angeles–based studio needed a defensible governance position for generative AI tools entering pre-production, VFX and marketing workflows.",
    approach:
      "Dansovia mapped current tool usage, assessed training-data provenance and copyright exposure, and drafted an internal AI use policy with escalation paths.",
    outcome:
      "A board-ready governance framework and a documented review process for new generative AI vendors entering the production pipeline.",
  },
  {
    sector: "FINANCIAL SERVICES",
    title: "Building a repeatable AI vendor-risk framework",
    challenge:
      "A regional financial institution needed a consistent way to assess third-party AI systems across procurement and model risk functions.",
    approach:
      "We developed a structured assessment framework covering governance, privacy, model risk and contractual considerations, aligned to existing risk workflows.",
    outcome:
      "A repeatable process for evaluating AI vendors that integrated with the institution's existing third-party risk and procurement programs.",
  },
];

const insights = [
  {
    category: "AI ACT",
    title: "Understanding high-risk AI obligations",
    description:
      "A practical overview of classification criteria, documentation requirements and governance expectations under the EU AI Act.",
    date: "Oct 2026",
  },
  {
    category: "CALIFORNIA",
    title: "What California's AI transparency laws mean for employers",
    description:
      "SB 942 and related California rules are reshaping disclosure obligations for AI-generated content and automated decision systems.",
    date: "Sep 2026",
  },
  {
    category: "GENERATIVE AI",
    title: "Copyright and training data: what media companies need to know",
    description:
      "Key questions studios, agencies and publishers should ask before adopting generative AI tools in production workflows.",
    date: "Aug 2026",
  },
  {
    category: "VENDOR RISK",
    title: "What to ask before deploying third-party AI",
    description:
      "A structured set of diligence questions covering model risk, data practices, IP and contractual exposure.",
    date: "Jul 2026",
  },
];

/* ─────────────────────────────────────────────
   TEAM DATA
   Four people. Headshots live in /public/team/.
───────────────────────────────────────────── */

type TeamMember = {
  name: string | null;
  role: string;
  area?: string;
  location?: string;
  bio?: string;
  focus: string[];
  photo: string | null;
};

const founder: TeamMember = {
  name: "Jordan Rivera",
  role: "Founder & Managing Principal",
  location: "Los Angeles, CA",
  bio:
    "Jordan founded Dansovia in 2021 after a decade split between technology regulatory practice and in-house AI policy roles at two Fortune 100 media companies. He advises boards and executive teams on AI governance design, regulatory strategy and enterprise risk, and leads the firm's work across media, financial services and healthcare.",
  focus: [
    "AI governance",
    "Regulatory strategy",
    "Board advisory",
  ],
  photo: "/team/jordan-rivera.jpg",
};

const seniorTeam: TeamMember[] = [
  {
    name: "Amara Chen",
    role: "Head of Regulatory Intelligence",
    area: "Regulatory Intelligence",
    bio:
      "Amara leads jurisdictional monitoring, regulatory analysis and the firm's intelligence product. She tracks EU, US federal and state, and Canadian developments relevant to enterprise AI programs, and previously built the regulatory research function at a global advisory firm.",
    focus: ["EU AI Act", "US state law", "Monitoring"],
    photo: "/team/amara-chen.jpg",
  },
  {
    name: "Marcus Bennett",
    role: "Head of AI Governance",
    area: "Governance Advisory",
    bio:
      "Marcus leads the design of enterprise AI policies, risk registers and governance operating models. He previously built AI risk programs at two publicly traded technology companies, and advises clients on internal controls, oversight structures and audit readiness.",
    focus: ["AI policy", "Risk registers", "Internal controls"],
    photo: "/team/marcus-bennett.jpg",
  },
  {
    name: "Jonathan Wells",
    role: "Head of Financial Services",
    area: "Financial Services",
    bio:
      "Jonathan leads the firm's work with banks, asset managers and insurers on AI model risk, third-party risk and regulatory expectations. He previously led model risk management at a regional institution and has supported multiple SR 11-7 alignment programs.",
    focus: ["Model risk", "Third-party risk", "SR 11-7 alignment"],
    photo: "/team/jonathan-wells.jpg",
  },
];

const careerValues = [
  { title: "Intellectual Curiosity", description: "Deep engagement with evolving technology and regulation." },
  { title: "Rigor",                  description: "Evidence-based analysis and precise, defensible recommendations." },
  { title: "Impact",                 description: "Practical outcomes that strengthen organizational resilience." },
];

const openRoles = [
  { title: "Research Associate, Regulatory Intelligence", team: "Regulatory Intelligence", location: "Remote — US",               type: "Full-time", level: "Entry" },
  { title: "Data Analyst",                                 team: "Regulatory Intelligence", location: "Remote — US",               type: "Full-time", level: "Mid" },
  { title: "AI Governance Analyst",                        team: "Governance Advisory",     location: "Hybrid — Los Angeles",    type: "Full-time", level: "Mid" },
  { title: "Privacy & AI Compliance Consultant",           team: "Privacy & Data",          location: "Hybrid — Los Angeles",    type: "Full-time", level: "Senior" },
  { title: "AI Vendor Risk Analyst",                       team: "Vendor Due Diligence",    location: "Remote — North America",  type: "Full-time", level: "Mid" },
  { title: "IP & Licensing Analyst",                       team: "Generative AI & IP",      location: "Hybrid — Los Angeles",    type: "Full-time", level: "Mid" },
];

/* ─────────────────────────────────────────────
   HEADSHOT
───────────────────────────────────────────── */

function Headshot({
  src,
  alt,
  size = "sm",
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "lg" ? "h-28 w-28" : size === "md" ? "h-14 w-14" : "h-12 w-12";
  const iconSize = size === "lg" ? 36 : size === "md" ? 22 : 18;

  return (
    <div
      className={`${dims} shrink-0 overflow-hidden rounded-full border border-border bg-background`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[#595959] opacity-50"
          aria-label={`${alt} — headshot pending`}
          role="img"
        >
          <User size={iconSize} aria-hidden />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <style jsx global>{`
        html {
          overflow-x: clip;
          scroll-behavior: smooth;
          scroll-padding-top: 6rem;
        }
        section[id],
        main[id] {
          scroll-margin-top: 6rem;
        }
        a:focus-visible,
        button:focus-visible {
          outline: 3px solid #2563eb;
          outline-offset: 4px;
          border-radius: 4px;
        }
        ::selection {
          background: #dbeafe;
          color: #111827;
        }
        body {
          overflow-wrap: break-word;
        }
        .regulatory-ticker-track {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform focus:translate-y-0 focus-visible:translate-y-0"
      >
        Skip to main content
      </a>
      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            <Link href="/" className="text-[15px] font-semibold tracking-tight text-foreground">
              {BRAND.name.toUpperCase()}
            </Link>

            <div className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm py-2 text-[14px] font-medium text-[#4B5563] transition-colors duration-200 hover:text-foreground focus-visible:outline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="#contact"
                className="hidden rounded-md bg-foreground px-4 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90 sm:inline-block"
              >
                Book an Assessment
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-foreground transition-colors hover:bg-black/5 focus-visible:outline-offset-2 lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-white lg:hidden"
          >
            <div className="flex min-h-full flex-col px-6 pb-8 pt-[calc(5rem+env(safe-area-inset-top))]">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-4 text-lg font-medium text-foreground transition-colors hover:bg-background focus-visible:outline-offset-1"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-8">
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-white sm:w-auto"
                >
                  Book an Assessment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="relative overflow-hidden pt-24 pb-12 sm:min-h-[100svh] sm:pb-16 lg:pt-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6 xl:col-span-5">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-4 max-w-[34rem] font-mono text-[11px] font-medium leading-relaxed tracking-[0.1em] text-[#595959] uppercase sm:mb-6 sm:text-[12px] sm:tracking-[0.12em]"
                >
                  AI Governance · Regulatory Intelligence · Risk Advisory
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[12ch] text-[clamp(2.25rem,10vw,3rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-foreground sm:max-w-none sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
                >
                  AI governance
                  <br />
                  without the
                  <br />
                  <span className="text-[#4B5563]">guesswork.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="mt-5 max-w-md text-base leading-relaxed text-[#4B5563] sm:mt-6 sm:text-base"
                >
                  Dansovia helps organizations identify, govern and manage the regulatory, legal
                  and operational risks of artificial intelligence.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center"
                >
                  <Link
                    href="#assessment"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:w-auto"
                  >
                    Assess Your AI Risk
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="#contact"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background sm:w-auto"
                  >
                    Speak With an Advisor
                  </Link>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-6 font-mono text-[11px] leading-relaxed tracking-wider text-[#595959] uppercase sm:mt-8 sm:text-[12px]"
                >
                  Los Angeles · Toronto · London
                </motion.p>
              </div>

              {/* Hero Visual */}
              <div className="relative lg:col-span-6 xl:col-span-7">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative mx-auto aspect-[4/3] min-h-[250px] max-w-xl overflow-hidden rounded-xl border border-border bg-white shadow-[0_8px_30px_-20px_rgba(17,17,17,0.22)] sm:min-h-[360px] lg:min-h-[420px] lg:max-w-none"
                >
                  <div className="flex items-center gap-1.5 border-b border-border px-3 py-3 sm:gap-2 sm:px-4">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#E5E5E5]" />
                    </div>
                    <span className="ml-1 min-w-0 truncate font-mono text-[10px] tracking-wide text-[#595959] sm:ml-3 sm:text-[12px]">
                      DANSOVIA · REGULATORY INTELLIGENCE
                    </span>
                  </div>

                  <div className="relative h-[calc(100%-44px)] p-3 sm:p-6">
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage:
                          "linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    <svg className="absolute inset-0 hidden h-full w-full sm:block" aria-hidden>
                      <motion.line
                        x1="22%" y1="28%" x2="52%" y2="18%"
                        stroke="#E5E5E5" strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                      />
                      <motion.line
                        x1="55%" y1="20%" x2="78%" y2="38%"
                        stroke="#E5E5E5" strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 1.0 }}
                      />
                      <motion.line
                        x1="32%" y1="62%" x2="62%" y2="68%"
                        stroke="#E5E5E5" strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 1.1 }}
                      />
                      <motion.line
                        x1="68%" y1="72%" x2="82%" y2="58%"
                        stroke="#E5E5E5" strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 1.2 }}
                      />
                    </svg>

                    <div className="absolute left-3 right-3 top-4 flex flex-wrap gap-2 sm:hidden">
                      {["EU AI ACT", "GPAI", "GOVERNANCE", "VENDOR RISK"].map((label) => (
                        <span key={label} className="rounded-md border border-border bg-white px-2.5 py-1.5 font-mono text-[10px] font-medium tracking-wide text-foreground shadow-sm">
                          {label}
                        </span>
                      ))}
                    </div>

                    {heroNodes.map((node) => (
                      <motion.div
                        key={node.label}
                        className="absolute hidden sm:block"
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: node.delay + 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="flex items-center gap-2 rounded-md border border-border bg-white px-2.5 py-1.5 shadow-sm">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                          </span>
                          <span className="font-mono text-[12px] font-medium tracking-wide text-foreground">
                            {node.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                      className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-md border border-border bg-background/90 px-2 py-2 backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:px-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-[#595959] sm:text-[12px]">STATUS</span>
                        <span className="font-mono text-[10px] font-medium text-foreground sm:text-[12px]">MONITORING</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono text-[10px] text-[#595959] sm:text-[12px]">
                          {jurisdictions.length} JURISDICTIONS
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ REGULATORY TICKER ═══════════════ */}
        <section className="border-y border-border bg-white" aria-label="Regulatory intelligence updates">
          <div className="mx-auto max-w-[1400px]">
            <div
              className="regulatory-ticker-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain lg:overflow-visible"
              aria-label="Scroll regulatory updates horizontally"
            >
              {tickerItems.map((item, i) => (
                <motion.div
                  key={item.region}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex min-w-[min(86vw,290px)] snap-start items-center gap-3 border-r border-border px-4 py-4 last:border-r-0 sm:min-w-[320px] sm:px-5 lg:min-w-0 lg:flex-1 lg:px-6 lg:py-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-semibold tracking-wider text-foreground">
                        {item.region}
                      </span>
                      <span className="hidden font-mono text-[12px] text-[#595959] sm:inline">
                        {item.type}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-[#4B5563] lg:truncate">{item.detail}</p>
                  </div>
                  <Link
                    href="#regulatory"
                    className="hidden shrink-0 items-center gap-1 text-[12px] font-medium text-accent sm:inline-flex"
                  >
                    View
                    <ArrowRight size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="sr-only">
            Demonstration data for illustrative purposes. Not live regulatory feeds.
          </p>
        </section>

        {/* ═══════════════ TRUST / POSITIONING ═══════════════ */}
        <section className="py-16 sm:py-20 lg:py-32" id="about">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
              >
                AI regulation is becoming
                <br />a board-level concern.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-base leading-relaxed text-[#4B5563] sm:text-lg"
              >
                From the EU AI Act to California&apos;s transparency statutes, organizations are
                increasingly required to understand how AI systems are developed, procured,
                deployed and governed. Dansovia combines regulatory intelligence, governance
                frameworks and practical risk management so executive teams can move forward with
                confidence — not paralysis.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4"
            >
              {[
                { label: "Jurisdictions Monitored", value: "14" },
                { label: "Risk Domains",            value: "6" },
                { label: "Engagements Delivered",   value: "80+" },
                { label: "Founded",                 value: String(BRAND.founded) },
              ].map((stat) => (
                <div key={stat.label} className="bg-white px-3 py-6 text-center sm:px-6 sm:py-8">
                  <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[13px] text-[#595959]">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* ── Leadership ──────────────────────────────── */}
            <div className="mt-24 lg:mt-32">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <p className="font-mono text-[12px] font-medium tracking-[0.12em] text-[#595959] uppercase">
                    Leadership
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    The people behind the practice.
                  </h3>
                </div>
                <p className="max-w-sm text-[14px] leading-relaxed text-[#595959]">
                  Based in Los Angeles, with advisors in Toronto and London.
                </p>
              </motion.div>

              {/* Founder — full width */}
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group mt-10 overflow-hidden rounded-lg border border-border bg-white transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_1px_2px_rgba(17,17,17,0.04),0_16px_40px_-28px_rgba(17,17,17,0.28)]"
              >
                <div className="grid gap-0 sm:grid-cols-12">
                  <div className="flex items-center justify-center border-b border-border bg-background px-4 py-8 sm:col-span-3 sm:border-b-0 sm:border-r sm:px-8 sm:py-10 lg:py-14">
                    <Headshot
                      src={founder.photo}
                      alt={founder.name ?? "Founder"}
                      size="lg"
                    />
                  </div>

                  <div className="px-4 py-8 sm:col-span-9 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[12px] font-medium tracking-wider text-foreground uppercase">
                        {founder.role}
                      </span>
                      {founder.location && (
                        <span className="font-mono text-[12px] tracking-wider text-[#595959] uppercase">
                          {founder.location}
                        </span>
                      )}
                    </div>

                    {founder.name ? (
                      <h4 className="mt-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {founder.name}
                      </h4>
                    ) : (
                      <div
                        className="mt-6 h-7 w-48 rounded border border-dashed border-border"
                        aria-label="Founder name pending"
                      />
                    )}

                    {founder.bio && (
                      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#4B5563]">
                        {founder.bio}
                      </p>
                    )}

                    <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-2 border-t border-border pt-6">
                      {founder.focus.map((focus) => (
                        <li
                          key={focus}
                          className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[12px] tracking-wider text-[#4B5563] uppercase"
                        >
                          {focus}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>

              {/* Senior team — 3-up grid */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {seniorTeam.map((person, i) => (
                  <motion.article
                    key={person.role}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex h-full flex-col rounded-lg border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_1px_2px_rgba(17,17,17,0.04),0_14px_36px_-26px_rgba(17,17,17,0.24)] lg:p-7"
                  >
                    <div className="flex items-start justify-between">
                      <Headshot
                        src={person.photo}
                        alt={person.name ?? person.role}
                        size="md"
                      />
                      {person.area && (
                        <span className="font-mono text-[12px] tracking-wider text-[#595959] uppercase">
                          {person.area}
                        </span>
                      )}
                    </div>

                    {person.name ? (
                      <h4 className="mt-6 text-[15.5px] font-semibold leading-snug tracking-tight text-foreground">
                        {person.name}
                      </h4>
                    ) : (
                      <div
                        className="mt-6 h-5 w-36 rounded border border-dashed border-border"
                        aria-label="Name pending"
                      />
                    )}

                    <p className="mt-1.5 font-mono text-[12px] tracking-wider text-[#595959] uppercase">
                      {person.role}
                    </p>

                    {person.bio && (
                      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#4B5563]">
                        {person.bio}
                      </p>
                    )}

                    <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 border-t border-border pt-5">
                      {person.focus.map((f) => (
                        <li
                          key={f}
                          className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[12px] tracking-wider text-[#4B5563] uppercase"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ SERVICES ═══════════════ */}
        <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-32" id="services">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Practical guidance for complex AI risk.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-base text-[#4B5563]"
              >
                From EU AI Act readiness to generative AI copyright exposure, Dansovia helps
                organizations turn complex regulatory requirements into practical governance.
              </motion.p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {services.map((service, i) => (
                <motion.div
                  key={service.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-white p-6 transition-colors duration-200 hover:bg-background sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[13px] font-medium tracking-wider text-[#595959]">
                      {service.num}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-[#595959] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#4B5563]">
                    {service.description}
                  </p>
                  <Link
                    href="#contact"
                    className="absolute inset-0"
                    aria-label={`Learn more about ${service.title}`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ METHODOLOGY ═══════════════ */}
        <section className="py-16 sm:py-20 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-mono text-[12px] font-medium tracking-[0.12em] text-[#595959] uppercase"
              >
                The Dansovia Approach
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                A structured approach to AI governance.
              </motion.h2>
            </div>

            {/* Desktop */}
            <div className="mt-16 hidden lg:block">
              <div className="relative">
                <div className="absolute left-0 right-0 top-[28px] h-px bg-border" />
                <div className="grid grid-cols-5 gap-4">
                  {stages.map((stage, i) => (
                    <motion.div
                      key={stage.num}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="relative"
                    >
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white">
                        <span className="font-mono text-[14px] font-semibold text-foreground">
                          {stage.num}
                        </span>
                      </div>
                      <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-foreground">
                        {stage.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4B5563]">
                        {stage.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="mt-12 space-y-0 lg:hidden">
              {stages.map((stage, i) => (
                <motion.div
                  key={stage.num}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {i < stages.length - 1 && (
                    <div className="absolute bottom-0 left-[19px] top-10 w-px bg-border" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white">
                    <span className="font-mono text-[12px] font-semibold">{stage.num}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[15px] font-semibold text-foreground">{stage.title}</h3>
                    <p className="mt-1 text-[14px] text-[#4B5563]">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ AI RISK SCORECARD ═══════════════ */}
        <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-32" id="assessment">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                >
                  How much AI risk does your organization carry?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-4 text-base text-[#4B5563]"
                >
                  Complete a preliminary assessment to identify potential areas of regulatory,
                  privacy, intellectual-property and governance exposure. Your results are
                  confidential and reviewed by a Dansovia advisor within two business days.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8"
                >
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Start AI Risk Assessment
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <p className="mt-6 max-w-md text-[13px] leading-relaxed text-[#595959]">
                  This preliminary assessment is informational only and does not constitute legal
                  advice, a legal opinion or a definitive regulatory classification.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="rounded-xl border border-border bg-background p-6 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[12px] font-medium tracking-wider text-[#595959]">
                      DANSOVIA AI RISK SCORE
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-semibold tracking-tight text-foreground"
                      >
                        72
                      </motion.span>
                      <span className="text-lg text-[#595959]">/ 100</span>
                    </div>
                  </div>
                  <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 font-mono text-[12px] font-medium text-amber-800">
                    HIGHER ATTENTION
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  {riskCategories.map((cat, i) => (
                    <div key={cat.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[14px] font-medium text-foreground">{cat.name}</span>
                        <span className="font-mono text-[13px] text-[#595959]">{cat.score}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <motion.div
                          className="h-full rounded-full bg-foreground"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cat.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════ REGULATORY DASHBOARD ═══════════════ */}
        <section className="py-16 sm:py-20 lg:py-32" id="regulatory">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-xl">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                >
                  Regulatory intelligence, continuously monitored.
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
                >
                  Explore Regulatory Intelligence
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            <p className="mt-3 text-[13px] text-[#595959]">
              Sample interface — data shown is illustrative, not live regulatory feeds.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {jurisdictions.map((j, i) => (
                <motion.article
                  key={j.region}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-lg border border-border bg-white p-5 transition-shadow hover:shadow-sm"
                >
                  <p className="font-mono text-[12px] font-medium tracking-wider text-[#595959]">
                    {j.region}
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold text-foreground">{j.title}</h3>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="font-mono text-[12px] text-[#595959]">STATUS</p>
                      <p className="mt-0.5 text-[14px] text-foreground">{j.status}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[12px] text-[#595959]">FOCUS</p>
                      <ul className="mt-1 space-y-0.5">
                        {j.focus.map((f) => (
                          <li key={f} className="text-[13px] text-[#4B5563]">
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    <p className="font-mono text-[12px] text-[#595959]">
                      LAST UPDATED · {j.updated}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ ENGAGEMENT MODELS ═══════════════ */}
        <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Support built around your risk profile.
            </motion.h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {engagementModels.map((model, i) => (
                <motion.div
                  key={model.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col rounded-lg border border-border bg-background p-6"
                >
                  <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
                    {model.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#4B5563]">
                    {model.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity hover:opacity-70"
              >
                Discuss Your Requirements
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════ CASE STUDIES ═══════════════ */}
        <section className="py-16 sm:py-20 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[12px] font-medium tracking-[0.12em] text-[#595959] uppercase"
            >
              Illustrative Case Studies
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              How organizations approach AI risk.
            </motion.h2>
            <p className="mt-3 text-[13px] text-[#595959]">
              Client names withheld. Examples are composite engagements drawn from our advisory practice.
            </p>

            <div className="mt-12 space-y-8">
              {caseStudies.map((c, i) => (
                <motion.article
                  key={c.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-lg border border-border bg-white p-6 sm:p-8"
                >
                  <p className="font-mono text-[12px] font-medium tracking-wider text-[#595959]">
                    {c.sector}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {c.title}
                  </h3>
                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#595959]">Challenge</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4B5563]">{c.challenge}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#595959]">Approach</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4B5563]">{c.approach}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#595959]">Outcome</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4B5563]">{c.outcome}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ INSIGHTS ═══════════════ */}
        <section className="border-t border-border bg-white py-16 sm:py-20 lg:py-32" id="insights">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Research for the people making decisions about AI.
            </motion.h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {insights.map((item, i) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex flex-col"
                >
                  <p className="font-mono text-[12px] font-medium tracking-wider text-[#595959]">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#4B5563]">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[12px] text-[#595959]">{item.date}</span>
                    <Link
                      href="#insights"
                      className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                    >
                      Read
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CAREERS ═══════════════ */}
        <section className="bg-[#0D0D0D] py-16 sm:py-20 lg:py-32" id="careers">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-6"
              >
                <p className="font-mono text-[12px] font-medium tracking-[0.12em] text-white/70 uppercase">
                  Careers
                </p>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                  Build the governance layer for the AI economy.
                </h2>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80">
                  Join a small, senior team working at the intersection of artificial intelligence,
                  regulation and technology. We hire from Los Angeles, Toronto and remote across
                  North America.
                </p>
                <p className="mt-5 text-[14px] leading-relaxed text-white/80">
                  Interested in joining us? Apply at{" "}
                  <a
                    href={`mailto:${BRAND.emailCareers}?subject=${encodeURIComponent("Job application — Dansovia")}`}
                    className="font-semibold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {BRAND.emailCareers}
                  </a>
                  .
                </p>
              </motion.div>

              <div className="lg:col-span-5 lg:col-start-8">
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {careerValues.map((v, i) => (
                    <motion.li
                      key={v.title}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                        <span className="font-mono text-[12px] tracking-wider text-white/70 uppercase sm:w-40 sm:shrink-0">
                          {v.title}
                        </span>
                        <span className="text-[14px] leading-relaxed text-white/80">
                          {v.description}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Vacancies ────────────────────────────────── */}
            <div id="open-roles" className="mt-16 scroll-mt-24 sm:mt-20 lg:mt-32">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
              >
                <div>
                  <p className="font-mono text-[12px] font-medium tracking-wider text-white/70 uppercase">
                    Open Positions — {openRoles.length.toString().padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
                    Current opportunities.
                  </h3>
                </div>
                <p className="font-mono text-[12px] tracking-wider text-white/70 uppercase">
                  Updated {BRAND.careersUpdated}
                </p>
              </motion.div>

              <ul className="mt-10 border-t border-white/10">
                {openRoles.map((role, i) => (
                  <motion.li
                    key={role.title}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={`mailto:${BRAND.emailCareers}?subject=${encodeURIComponent(
                        `Application — ${role.title}`
                      )}`}
                      className="group grid grid-cols-1 items-center gap-4 py-6 transition-colors hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:grid-cols-12 sm:gap-6 sm:px-2 lg:py-7"
                    >
                      <div className="sm:col-span-5">
                        <h4 className="text-[15.5px] font-semibold tracking-tight text-white">
                          {role.title}
                        </h4>
                        <p className="mt-1.5 font-mono text-[12px] tracking-wider text-white/70 uppercase">
                          {role.team}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:col-span-6">
                        <span className="inline-flex items-center gap-1.5 text-[13px] text-white/80">
                          <MapPin size={12} className="text-white/70" aria-hidden />
                          {role.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] text-white/80">
                          <Clock size={12} className="text-white/70" aria-hidden />
                          {role.type}
                        </span>
                        <span className="rounded-md border border-white/15 px-2 py-0.5 font-mono text-[12px] tracking-wider text-white/80 uppercase">
                          {role.level}
                        </span>
                      </div>

                      <div className="hidden justify-end sm:col-span-1 sm:flex">
                        <ArrowUpRight
                          size={16}
                          className="text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        />
                      </div>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 max-w-3xl text-[14px] leading-relaxed text-white/80"
              >
                Don&apos;t see a role that fits? We welcome speculative applications from strong
                candidates across regulatory, legal, privacy and technology disciplines. Send your
                CV and a short introduction to{" "}
                <a
                  href={`mailto:${BRAND.emailCareers}?subject=${encodeURIComponent("Speculative application — Dansovia")}`}
                  className="font-semibold text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {BRAND.emailCareers}
                </a>
                .
              </motion.p>
            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="border-t border-border bg-background py-16 sm:py-20 lg:py-32" id="contact">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
              >
                Know your AI risk.
                <br />
                Manage it with confidence.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-base text-[#4B5563]"
              >
                Start a conversation with Dansovia about your organization&apos;s AI governance and
                regulatory priorities. Introductory calls are 30 minutes, no obligation.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
              >
                <Link
                  href="#contact"
                  className="inline-flex rounded-md bg-foreground px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Book an Assessment
                </Link>
                <Link
                  href={`mailto:${BRAND.emailGeneral}`}
                  className="inline-flex rounded-md border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  Contact Dansovia
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-[15px] font-semibold tracking-tight text-foreground">
                {BRAND.name.toUpperCase()}
              </p>
              <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[#4B5563]">
                {BRAND.tagline}
              </p>
              <address className="mt-5 not-italic text-[13px] leading-relaxed text-[#595959]">
                {BRAND.address.line1}
                <br />
                {BRAND.address.city}, {BRAND.address.region} {BRAND.address.postal}
                <br />
                <a
                  href={`mailto:${BRAND.emailGeneral}`}
                  className="transition-colors hover:text-foreground"
                >
                  {BRAND.emailGeneral}
                </a>
                <br />
                <a
                  href={`tel:${BRAND.phone.replace(/[^\d+]/g, "")}`}
                  className="transition-colors hover:text-foreground"
                >
                  {BRAND.phone}
                </a>
              </address>
              <p className="mt-4">
                <a
                  href={BRAND.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-[13px] text-[#595959] transition-colors hover:text-foreground"
                >
                  LinkedIn
                  <ArrowUpRight size={12} aria-hidden />
                </a>
              </p>
            </div>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#595959]">Firm</p>
              <ul className="mt-4 space-y-2">
                {[
                  { href: "#services", label: "Services" },
                  { href: "#regulatory", label: "Regulatory Intelligence" },
                  { href: "#insights", label: "Insights" },
                  { href: "#about", label: "About" },
                  { href: "#careers", label: "Careers" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[#4B5563] transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#595959]">Legal</p>
              <ul className="mt-4 space-y-2">
                {[
                  { href: `mailto:${BRAND.emailGeneral}`, label: "Contact" },
                  { href: "/privacy", label: "Privacy" },
                  { href: "/terms", label: "Terms" },
                  { href: "/disclaimer", label: "Disclaimer" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[#4B5563] transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <p className="max-w-3xl text-[12px] leading-relaxed text-[#595959]">
              {BRAND.legalName} provides AI governance, regulatory risk and compliance advisory
              services. Dansovia is not a law firm and does not provide legal advice or legal
              representation. Where legal opinions or jurisdiction-specific counsel are required,
              we coordinate with appropriately licensed legal professionals.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#595959]">
              <p>
                © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
              </p>
              <p className="font-mono tracking-wider uppercase">
                Los Angeles · Toronto · London
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}