import { Database, Layers, Moon, Network, RefreshCw, Sun, Terminal } from "lucide-react";
import type { CampusFeed } from "@/hooks/use-campus-feed";
import { useTheme } from "@/hooks/use-theme";
import { campusLabels, formatClock, withinWindow } from "@/lib/campus-events";

export const menuLinks = [
  { label: "Showcase", href: "#showcase", icon: Layers },
  { label: "Services", href: "#services", icon: Network },
  { label: "Company", href: "#company", icon: Database },
  { label: "Help", href: "#help", icon: Terminal },
];

const campusCodes = Object.keys(campusLabels) as Array<keyof typeof campusLabels>;

function StatRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function FeedStats({ feed }: { feed: CampusFeed }) {
  const { events, lastRefreshed, refreshing, refresh } = feed;
  const total = events.length;
  const free = events.filter((event) => event.free).length;
  const thisWeek = events.filter((event) => withinWindow(event, "week")).length;
  const sources = new Set(events.map((event) => event.source)).size;
  const countsByCampus = campusCodes.map((code) => ({
    code,
    count: events.filter((event) => event.campus === code).length,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="px-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Unify index
        </span>
        <div className="mt-3 px-2">
          <StatRow label="Events" value={total} />
          <StatRow label="Free entry" value={free} />
          <StatRow label="Paid entry" value={total - free} />
          <StatRow label="This week" value={thisWeek} />
          <StatRow label="Sources" value={sources} />
        </div>
      </div>

      <div>
        <span className="px-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          By campus
        </span>
        <div className="mt-3 px-2">
          {countsByCampus.map((item) => (
            <StatRow key={item.code} label={item.code} value={item.count} />
          ))}
        </div>
      </div>

      <div className="px-2">
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[11px] text-primary transition-colors hover:border-primary/60 hover:bg-primary/10 disabled:opacity-60"
        >
          <RefreshCw className={`size-3 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "refreshing…" : "refresh index"}
        </button>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground">
          {refreshing
            ? "checking sources"
            : lastRefreshed
              ? `last refreshed ${formatClock(lastRefreshed)}`
              : "waiting for first refresh"}
        </p>
      </div>
    </div>
  );
}

export function DashboardSidebar({ feed }: { feed: CampusFeed }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside className="sidebar-sheen fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-border md:flex">
      <a
        href="/"
        className="flex h-16 shrink-0 items-center gap-2.5 border-b border-border px-5"
      >
        <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-semibold text-primary-foreground">
          L
        </span>
        <span className="font-display text-sm font-semibold tracking-wide text-foreground">
          Leteane Industries
        </span>
      </a>
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto py-6">
        <nav className="flex flex-col gap-1 px-3">
          <span className="px-2 pb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Menu
          </span>
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-sidebar-deep/60 hover:text-foreground"
            >
              <link.icon className="size-4" />
              {link.label}
            </a>
          ))}
        </nav>
        <div className="px-3">
          <FeedStats feed={feed} />
        </div>
      </div>
      <div className="border-t border-border px-3 py-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-deep/60 hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </aside>
  );
}
