import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Filter,
  Layers,
  Network,
  Radio,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Letane Industries — Data Engineering & Analytics",
      },
      {
        name: "description",
        content:
          "Letane Industries builds automated data aggregation systems, custom APIs, and intelligent data architecture for African enterprises and platforms.",
      },
      {
        property: "og:title",
        content: "Letane Industries — Engineering the Data Pipelines of Tomorrow",
      },
      {
        property: "og:description",
        content:
          "Automated data aggregation, custom APIs, and intelligent data architecture for African enterprises and platforms.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-primary">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function Nav() {
  const links = [
    { label: "Showcase", href: "#showcase" },
    { label: "Services", href: "#services" },
    { label: "Company", href: "#company" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-bold text-primary-foreground">
            L
          </span>
          <span className="font-display text-sm font-semibold tracking-wide text-foreground">
            Letane Industries
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#showcase"
          className="hidden items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex"
        >
          Work with us
          <ArrowUpRight className="size-4" />
        </a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const heroStats = [
  { value: "4+", label: "Data sources unified" },
  { value: "<60s", label: "Ingest-to-serve latency" },
  { value: "99.9%", label: "Pipeline uptime target" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-blueprint absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px accent-line opacity-60"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-28 sm:pt-36">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Data Engineering — Johannesburg, ZA
          </p>
        </div>

        <h1 className="mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Engineering the{" "}
          <span className="text-primary">Data Pipelines</span> of Tomorrow.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Letane Industries builds automated data aggregation systems, custom APIs, and
          intelligent data architecture for African enterprises and platforms.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#showcase"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-8px] shadow-primary/50 transition-all hover:brightness-110"
          >
            View Our Solutions
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/30 hover:bg-surface"
          >
            Explore Capabilities
          </a>
        </div>

        <dl className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-5">
              <dt className="font-display text-2xl font-semibold text-foreground">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured showcase — The Johannesburg Campus Connect                 */
/* ------------------------------------------------------------------ */

const pipelineStages = [
  { icon: Radio, label: "Multi-source scraping", detail: "University portals & social feeds" },
  { icon: Filter, label: "Cleaning & normalisation", detail: "Dedup, tagging, enrichment" },
  { icon: Database, label: "Centralised warehouse", detail: "Single queryable source of truth" },
];

const mockEvents = [
  {
    title: "AI & Machine Learning Society — Kickoff",
    source: "UJ Events Portal",
    campus: "APK",
    time: "Fri 18:00",
    status: "Live",
  },
  {
    title: "Career Fair: Tech & Finance Recruiters",
    source: "Instagram @uj_career",
    campus: "APB",
    time: "Sat 09:30",
    status: "Live",
  },
  {
    title: "Postgrad Research Methods Workshop",
    source: "Faculty Portal",
    campus: "SWC",
    time: "Sat 13:00",
    status: "Verified",
  },
  {
    title: "Entrepreneurship Pitch Night",
    source: "X / @UJLibrary",
    campus: "APK",
    time: "Sun 17:00",
    status: "Pending",
  },
  {
    title: "Open Day — Faculty of Engineering",
    source: "UJ Events Portal",
    campus: "APK",
    time: "Mon 10:00",
    status: "Live",
  },
];

function statusClass(status: string) {
  switch (status) {
    case "Live":
      return "border-primary/40 bg-primary/10 text-primary";
    case "Verified":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";
    default:
      return "border-border bg-surface-2 text-muted-foreground";
  }
}

function Showcase() {
  return (
    <section id="showcase" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Featured Project — Flagship POC"
          title="The Johannesburg Campus Connect"
          intro="An automated, multi-source data pipeline that scrapes, cleans, and centralises fragmented university and social media event data — surfacing everything students need in one real-time, searchable interface."
        />

        {/* Pipeline strip */}
        <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {pipelineStages.map((stage, i) => (
            <li key={stage.label} className="relative flex items-start gap-4 bg-surface px-6 py-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <stage.icon className="size-4.5" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Stage 0{i + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{stage.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{stage.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Dashboard mock */}
        <div className="panel-sheen mt-10 overflow-hidden rounded-xl border border-border bg-surface">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              campus-connect / events — live index
            </p>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
              <RefreshCw className="size-3" />
              synced 12s ago
            </span>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-muted-foreground">
              <Search className="size-4" />
              <span className="text-sm">Search events, venues, societies…</span>
            </div>
            {["All campuses", "This week", "Source: any"].map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Campus</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Time</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.map((event) => (
                  <tr
                    key={event.title}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">{event.title}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{event.source}</td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-muted-foreground sm:table-cell">
                      {event.campus}
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-muted-foreground md:table-cell">
                      {event.time}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${statusClass(event.status)}`}
                      >
                        {event.status === "Live" ? (
                          <span className="size-1.5 rounded-full bg-primary" />
                        ) : null}
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[11px] text-muted-foreground">
            <span>1,284 events indexed</span>
            <span className="flex items-center gap-1.5">
              <Terminal className="size-3" />
              pipeline: healthy
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const services = [
  {
    icon: Layers,
    num: "01",
    title: "Data Ingestion & Web Scraping",
    body: "Automated ETL pipelines, custom wrappers, and proxy-backed data extraction built to collect reliably at scale — from static pages to authenticated portals.",
    points: ["Automated ETL pipelines", "Custom scraper wrappers", "Proxy-backed extraction"],
  },
  {
    icon: Database,
    num: "02",
    title: "Relational Database Architecture",
    body: "Scalable SQL and PostgreSQL storage designed around your domain — normalised schemas, aggressive indexing, and warehousing ready for analytics.",
    points: ["PostgreSQL schema design", "Query tuning & indexing", "Data warehousing"],
  },
  {
    icon: Network,
    num: "03",
    title: "API Deployment & Integration",
    body: "Fast, secure RESTful APIs built with FastAPI to serve clean, structured data to your front-end apps, dashboards, and partner platforms.",
    points: ["FastAPI REST services", "Auth & rate limiting", "Front-end integration"],
  },
];

function Services() {
  return (
    <section id="services" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="What we do"
          title="From raw web data to production intelligence"
          intro="Three core commercial capabilities, engineered to slot together as one continuous pipeline — or deliver standalone value on their own."
        />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative flex flex-col bg-background p-8 transition-colors hover:bg-surface"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <service.icon className="size-5" />
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">
                  /{service.num}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.body}
              </p>
              <ul className="mt-6 space-y-2 border-t border-border pt-5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground"
                  >
                    <span className="size-1 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

const aboutTraits = [
  {
    icon: Terminal,
    title: "Engineering-first",
    body: "Every asset we ship is reproducible: versioned, tested, and monitored in production.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-conscious",
    body: "Scraping and storage practices designed with data governance and POPIA in mind.",
  },
  {
    icon: ArrowUpRight,
    title: "Built for monetisation",
    body: "We don't just collect data — we structure it into assets that generate revenue.",
  },
];

function About() {
  return (
    <section id="company" className="border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-24 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="About the company"
            title="A registered South African technology umbrella firm"
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Letane Industries is a registered South African technology umbrella firm
              focused on turning raw, unstructured web data into structured, monetisable
              business intelligence assets.
            </p>
            <p>
              We work at the intersection of extraction, storage, and delivery — building
              the pipelines, warehouses, and APIs that let African enterprises and
              platforms make decisions on data they previously couldn't reach.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8 font-mono text-xs text-muted-foreground">
            <span>Reg. ZA — (Pty) Ltd</span>
            <span>Johannesburg, South Africa</span>
            <span>Est. 2026</span>
          </div>
        </div>

        <div className="flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          {aboutTraits.map((trait) => (
            <div key={trait.title} className="flex items-start gap-4 bg-surface px-6 py-6">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <trait.icon className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {trait.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {trait.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  const columns = [
    {
      heading: "Company",
      links: ["Showcase", "Services", "About", "Careers"],
    },
    {
      heading: "Legal",
      links: ["Privacy Policy & Data Scraping Compliance", "Terms of Service", "PAIA Manual"],
    },
    {
      heading: "Contact",
      links: ["hello@letane.industries", "Johannesburg, ZA", "LinkedIn"],
    },
  ];
  return (
    <footer className="bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-border pb-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-bold text-primary-foreground">
                L
              </span>
              <span className="font-display text-sm font-semibold tracking-wide text-foreground">
                Letane Industries
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Automated data aggregation, custom APIs, and intelligent data architecture
              for African enterprises and platforms.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Letane Industries (Pty) Ltd. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70">
            Privacy Policy &amp; Data Scraping Compliance — placeholder pending legal review
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <Showcase />
        <Services />
        <About />
      </main>
      <Footer />
    </div>
  );
}
