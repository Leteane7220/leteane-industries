import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export type ContentSection = { title: string; body: string; items?: string[] };

export function companyHead(title: string, description: string) {
  const pageTitle = `${title}, Leteane Industries`;
  return { meta: [
    { title: pageTitle },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] };
}

export function CompanyPage({ title, intro, sections, legal = false, children }: {
  title: string; intro: string; sections: ContentSection[]; legal?: boolean; children?: ReactNode;
}) {
  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="mx-auto flex min-h-16 max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <Link to="/" className="font-display text-lg font-semibold">Leteane Industries</Link>
          <Button variant="outline" asChild><Link to="/"><ArrowLeft />Back to site</Link></Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-14 sm:pt-20">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest">{legal ? "Legal, review draft" : "Company, draft"}</p>
        <h1 className="mt-4 break-words font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        {legal && <aside className="mt-8 border-y border-border py-5 text-sm leading-relaxed text-foreground">
          Draft for review, not an adopted policy or legal advice. Company particulars, responsible contacts and actual practices must be confirmed before this document is relied upon. Effective date pending approval.
        </aside>}
        <div className="mt-10 divide-y divide-border border-y border-border">
          {sections.map(section => <section key={section.title} className="py-7 sm:py-9">
            <h2 className="font-display text-2xl font-semibold">{section.title}</h2>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted-foreground">{section.body}</p>
            {section.items && <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>)}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </main>
      <footer className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <nav aria-label="Company and legal pages" className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
            <Link to="/careers">Careers</Link><Link to="/legal">Legal</Link><Link to="/privacy">Privacy Policy</Link>
            <Link to="/data-scraping-compliance">Data Scraping Compliance</Link><Link to="/paia">PAIA Manual</Link><Link to="/terms">Terms of Service</Link>
          </nav>
          <p className="mt-6 text-xs text-muted-foreground">© 2026 Leteane Industries. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">{children}<ArrowUpRight className="size-4" /></a>;
}