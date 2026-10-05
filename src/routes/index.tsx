import { CampusAssistant } from "@/components/CampusAssistant";
import {
  campusEvents,
  campusLabels,
  eventSources,
  formatEventDate,
  formatEventWhen,
  mapsUrl,
  isEventPast,
  withinWindow,
  type TimeWindow,
} from "@/lib/campus-events";
import { verifyEvents, type EventVerification } from "@/lib/verify-events.functions";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Database,
  Layers,
  MapPin,
  AlertTriangle,
  Network,
  RefreshCw,
  Search,
  ShieldCheck,
  Terminal,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Leteane Industries — Data Engineering & Analytics",
      },
      {
        name: "description",
        content:
          "Leteane Industries builds automated data aggregation systems, custom APIs, and intelligent data architecture for African enterprises and platforms.",
      },
      {
        property: "og:title",
        content: "Leteane Industries — Engineering the Data Pipelines of Tomorrow",
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
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
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
          <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-normal text-primary-foreground">
            L
          </span>
          <span className="font-display text-sm font-normal tracking-wide text-foreground">
            Leteane Industries
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
      <div
        className="absolute inset-x-0 top-0 h-px accent-line opacity-60"
        aria-hidden="true"
      />
      <div
        className="draft-construction pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="draft-rule-dashed-v absolute top-28 hidden h-[calc(100%-26rem)] md:left-6 md:block"
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

        <h1 className="mt-8 max-w-4xl font-display text-5xl font-normal leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Engineering the{" "}
          <span className="text-primary">Data Pipelines</span> of Tomorrow.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Leteane Industries builds automated data aggregation systems, custom APIs, and
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

        <div
          className="draft-rule-dashed-h relative mt-20 hidden items-end sm:flex"
          aria-hidden="true"
        >
          <span className="draft-cross absolute -left-2 -top-2 size-4" aria-hidden="true" />
          <span className="draft-cross absolute -right-2 -top-2 size-4" aria-hidden="true" />
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-5">
              <dt className="font-display text-2xl font-normal text-foreground">
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
/* Featured showcase — Unify by Leteane Industries                       */
/* ------------------------------------------------------------------ */

function entryClass(free: boolean) {
  return free
    ? "border-foreground bg-foreground text-background"
    : "border-border bg-surface-2 text-muted-foreground";
}

const campusOptions: Array<{ value: string; label: string }> = [
  { value: "all", label: "All campuses" },
  ...(Object.keys(campusLabels) as Array<keyof typeof campusLabels>).map((code) => ({
    value: code,
    label: `${code} — ${campusLabels[code]}`,
  })),
];

const windowOptions: Array<{ value: TimeWindow; label: string }> = [
  { value: "week", label: "This week" },
  { value: "today", label: "Today" },
  { value: "month", label: "This month" },
  { value: "any", label: "Any date" },
];

const selectClass =
  "rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground outline-none transition-colors focus:border-primary/60";

function Showcase() {
  const [query, setQuery] = useState("");
  const [campus, setCampus] = useState("all");
  const [window, setWindow] = useState<TimeWindow>("any");
  const [source, setSource] = useState("any");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [checks, setChecks] = useState<Record<string, EventVerification>>({});
  const runVerification = useServerFn(verifyEvents);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await runVerification({});
      const next: Record<string, EventVerification> = {};
      for (const result of data.results) next[result.url] = result;
      setChecks(next);
      setLastRefreshed(new Date(data.checkedAt));
    } catch {
      setLastRefreshed(new Date());
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return campusEvents
      // After each refresh, events whose date and time have passed are removed.
      .filter((event) => (lastRefreshed ? !isEventPast(event, lastRefreshed) : true))
      .filter((event) => (campus === "all" ? true : event.campus === campus))
      .filter((event) => (source === "any" ? true : event.source === source))
      .filter((event) => withinWindow(event, window))
      .filter((event) =>
        q
          ? [event.title, event.location, event.source, event.category, event.campus]
              .join(" ")
              .toLowerCase()
              .includes(q)
          : true,
      )
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [query, campus, window, source, lastRefreshed]);

  const pastCount = useMemo(
    () => (lastRefreshed ? campusEvents.filter((event) => isEventPast(event, lastRefreshed)).length : 0),
    [lastRefreshed],
  );

  return (
    <section id="showcase" className="relative border-b border-border">
      <span className="draft-cross absolute left-6 -top-2 size-4" aria-hidden="true" />
      <span className="draft-cross absolute right-6 -top-2 size-4" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="Featured Project — Flagship POC"
          title={
            <>
              <span className="text-uni-blue">UNI</span>FY
            </>
          }
          intro="Unify, provided by Leteane Industries — an automated, multi-source data pipeline that scrapes, cleans, and centralises fragmented university and social media event data, surfacing everything students need in one real-time, searchable interface."
        />

        {/* Dashboard */}
        <div className="panel-sheen mt-10 overflow-hidden rounded-xl border border-border bg-surface">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              unify / events — live index
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[11px] text-primary transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:opacity-60"
            >
              <RefreshCw className={`size-3 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing
                ? "refreshing…"
                : lastRefreshed
                  ? `last refreshed ${lastRefreshed.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}`
                  : "refresh index"}
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4">
            <div className="flex min-w-56 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-muted-foreground focus-within:border-primary/60">
              <Search className="size-4" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events, venues, societies…"
                aria-label="Search events"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <select
              value={campus}
              onChange={(event) => setCampus(event.target.value)}
              aria-label="Filter by campus"
              className={selectClass}
            >
              {campusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={window}
              onChange={(event) => setWindow(event.target.value as TimeWindow)}
              aria-label="Filter by date"
              className={selectClass}
            >
              {windowOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={source}
              onChange={(event) => setSource(event.target.value)}
              aria-label="Filter by source"
              className={selectClass}
            >
              <option value="any">Source: any</option>
              {eventSources.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="max-h-[26rem] overflow-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Event</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="hidden px-5 py-3 font-medium lg:table-cell">Location</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Campus</th>
                  <th className="hidden px-5 py-3 font-medium md:table-cell">Time</th>
                  <th className="px-5 py-3 font-medium">Going</th>
                  <th className="px-5 py-3 font-medium">Entry</th>
                </tr>
              </thead>
              <tbody>
                {results.map((event, index) => (
                  <tr
                    key={event.title}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                      >
                        {event.title}
                        <ArrowUpRight className="size-3.5 text-muted-foreground/60 transition-colors group-hover:text-primary" />
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{event.source}</td>
                    <td className="hidden max-w-80 px-5 py-3.5 text-muted-foreground lg:table-cell">
                      <a
                        href={mapsUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-start gap-1.5 transition-colors hover:text-primary"
                      >
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" />
                        <span>{event.location}</span>
                      </a>
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-muted-foreground sm:table-cell">
                      {event.campus}
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-xs text-muted-foreground md:table-cell">
                      {formatEventWhen(event)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                        <Users className="size-3.5 text-muted-foreground/60" />
                        {event.attendees.toLocaleString("en-ZA")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex flex-col gap-1">
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${entryClass(event.free)}`}
                          >
                            {event.free ? "Free" : "Paid"}
                          </span>
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary"
                          >
                            {event.free ? "Get free ticket" : "Buy tickets"}
                            <ArrowUpRight className="size-3 transition-colors group-hover:text-primary" />
                          </a>
                        </span>
                        {(() => {
                          const check = checks[event.url];
                          if (!check) {
                            return (
                              <span
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70"
                                title={`Price re-checked on the source page on ${formatEventDate(event.priceCheckedOn)}`}
                              >
                                <ShieldCheck className="size-3 text-primary/70" />
                                price checked {formatEventDate(event.priceCheckedOn)}
                              </span>
                            );
                          }
                          const time = new Date(check.checkedAt).toLocaleTimeString("en-ZA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          if (!check.reachable) {
                            return (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground">
                                <AlertTriangle className="size-3" />
                                source unreachable at {time}
                              </span>
                            );
                          }
                          const mismatch = check.free !== null && check.free !== event.free;
                          return (
                            <span
                              className={`inline-flex items-center gap-1 font-mono text-[10px] ${mismatch ? "text-foreground" : "text-muted-foreground/70"}`}
                              title={`Source page re-checked live at ${time}`}
                            >
                              {mismatch ? (
                                <AlertTriangle className="size-3" />
                              ) : (
                                <ShieldCheck className="size-3 text-primary/70" />
                              )}
                              {mismatch
                                ? `source now reads ${check.free ? "free" : "paid"} — checked ${time}`
                                : `re-verified ${time}`}
                            </span>
                          );
                        })()}
                      </span>
                    </td>
                  </tr>
                ))}
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-sm text-muted-foreground"
                    >
                      No events match those filters yet — try a different campus, date range
                      or source.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[11px] text-muted-foreground">
            <span>
              {results.length} of {campusEvents.length} indexed events shown
              {pastCount > 0 ? ` · ${pastCount} passed ${pastCount === 1 ? "event" : "events"} removed` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="size-3" />
              pipeline: healthy
            </span>
          </div>
        </div>

        {/* AI assistant */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Eyebrow>Ask the assistant</Eyebrow>
            <h3 className="mt-3 font-display text-2xl font-normal tracking-tight text-foreground">
              Not sure which events are for you?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The Unify assistant reads the same live index the table above serves.
              Tell it your campus, year of study or interests and it will recommend events
              with dates, venues and links back to the original post.
            </p>
          </div>
          <CampusAssistant />
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
              <h3 className="mt-6 font-display text-xl font-normal tracking-tight text-foreground">
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
    <section id="company" className="relative border-b border-border">
      <span className="draft-cross absolute left-6 -top-2 size-4" aria-hidden="true" />
      <span className="draft-cross absolute right-6 -top-2 size-4" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-24 sm:py-32 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="About the company"
            title="A registered South African technology umbrella firm"
          />
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Leteane Industries is a registered South African technology umbrella firm
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
            <div key={trait.title} className="flex flex-1 items-start gap-4 bg-surface px-6 py-6">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <trait.icon className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-base font-normal text-foreground">
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
  const columns: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Company",
      links: [
        { label: "Showcase", href: "#showcase" },
        { label: "Services", href: "#services" },
        { label: "About", href: "#company" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy & Data Scraping Compliance", href: "#" },
        { label: "Terms of Service", href: "/terms" },
        { label: "PAIA Manual", href: "#" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "hello@leteane.industries", href: "#" },
        { label: "Johannesburg, ZA", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
  ];
  return (
    <footer className="bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-border pb-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-normal text-primary-foreground">
                L
              </span>
              <span className="font-display text-sm font-normal tracking-wide text-foreground">
                Leteane Industries
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
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Leteane Industries (Pty) Ltd. All rights reserved.
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
