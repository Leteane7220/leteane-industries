import { Database, Layers, Moon, Network, Sun, Terminal } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export const menuLinks = [
  { label: "Showcase", href: "#showcase", icon: Layers },
  { label: "Services", href: "#services", icon: Network },
  { label: "Company", href: "#company", icon: Database },
  { label: "Help", href: "#help", icon: Terminal },
];

/* Dashboard sidebar: slides in from the left and holds the menu and the theme toggle */
export function DashboardSidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <aside
      className={`sidebar-sheen fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border transition-[transform,visibility] duration-300 ease-out ${
        open ? "visible translate-x-0" : "invisible -translate-x-full"
      }`}
    >
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
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6">
        <span className="px-2 pb-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Menu
        </span>
        {menuLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-sidebar-deep/60 hover:text-foreground"
          >
            <link.icon className="size-4" />
            {link.label}
          </a>
        ))}
      </nav>
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
