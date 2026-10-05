import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Leteane Industries" },
      {
        name: "description",
        content:
          "Terms of Service for Leteane Industries (Pty) Ltd — governing use of our data engineering, API, and analytics services.",
      },
      { property: "og:title", content: "Terms of Service — Leteane Industries" },
      {
        property: "og:description",
        content:
          "Terms of Service for Leteane Industries (Pty) Ltd — governing use of our data engineering, API, and analytics services.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. Agreement to these terms",
    body: "These Terms of Service govern your access to and use of the services provided by Leteane Industries (Pty) Ltd, a registered South African company, including data engineering, data aggregation, database architecture, and API deployment services, as well as this website. By engaging our services or using this website, you agree to be bound by these terms.",
  },
  {
    title: "2. Services",
    body: "Leteane Industries provides automated data ingestion and web scraping, relational database architecture, and API development and integration services. The specific scope, deliverables, timelines, and fees for any engagement will be set out in a separate written agreement, statement of work, or service-level agreement signed by both parties.",
  },
  {
    title: "3. Data collection and lawful use",
    body: "We collect and process data in accordance with applicable South African law, including the Protection of Personal Information Act (POPIA) and the Promotion of Access to Information Act (PAIA). Data collection is performed with regard to the terms of service of the source platforms, applicable robots directives, and reasonable expectations of privacy. Clients are responsible for ensuring that any data they direct us to collect or process is lawfully obtained and that they hold the necessary rights or consents to process it.",
  },
  {
    title: "4. Client responsibilities",
    body: "You agree to: (a) provide accurate information required for the delivery of services; (b) ensure you have lawful authority over any systems, accounts, or data sources you request we access; (c) use data delivered by us only for the purposes agreed in writing; and (d) not use our services to infringe the rights of any third party or to violate any applicable law or regulation.",
  },
  {
    title: "5. Intellectual property",
    body: "All pipelines, schemas, software, documentation, and other deliverables created by Leteane Industries remain the intellectual property of Leteane Industries unless expressly assigned in writing. Upon full payment, clients receive a perpetual, non-exclusive licence to use the deliverables for their internal business purposes. Pre-existing tools, libraries, and methodologies retained by Leteane Industries remain our sole property.",
  },
  {
    title: "6. Data accuracy and availability",
    body: "While we engineer our systems for reliability and accuracy, aggregated third-party data may be incomplete, delayed, or change without notice. Unless otherwise agreed in a service-level agreement, services are provided \"as is\", and we make no warranties regarding uninterrupted availability, error-free operation, or fitness for a particular purpose.",
  },
  {
    title: "7. Limitation of liability",
    body: "To the maximum extent permitted by law, Leteane Industries shall not be liable for any indirect, incidental, special, or consequential damages, including loss of profits, data, or business opportunities, arising from the use of or inability to use our services. Our total aggregate liability for any claim shall not exceed the fees paid by you for the services giving rise to the claim in the twelve months preceding it.",
  },
  {
    title: "8. Confidentiality",
    body: "Each party agrees to keep confidential any non-public business, technical, or commercial information disclosed by the other party, and to use such information solely for the purpose of the engagement. This obligation survives the termination of any agreement for a period of three years.",
  },
  {
    title: "9. Termination",
    body: "Either party may terminate an engagement in accordance with the notice period set out in the applicable agreement. We may suspend or terminate access to our services immediately if you breach these terms, fail to pay amounts due, or if continued provision would breach applicable law.",
  },
  {
    title: "10. Governing law",
    body: "These terms are governed by the laws of the Republic of South Africa. Any dispute arising from them shall be subject to the exclusive jurisdiction of the courts of South Africa.",
  },
  {
    title: "11. Changes to these terms",
    body: "We may update these Terms of Service from time to time. The current version will always be published on this page with its effective date. Continued use of our services after changes take effect constitutes acceptance of the revised terms.",
  },
];

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-sm bg-primary font-display text-sm font-normal text-primary-foreground">
              L
            </span>
            <span className="font-display text-sm font-semibold tracking-wide text-foreground">
              Leteane Industries
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Legal
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Effective date: 18 September 2026 · Leteane Industries (Pty) Ltd, Johannesburg, South
          Africa
        </p>

        <div className="mt-12 space-y-px overflow-hidden rounded-xl border border-border bg-border">
          {sections.map((section) => (
            <section key={section.title} className="bg-surface px-6 py-6 sm:px-8">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 font-mono text-xs text-muted-foreground/70">
          Questions about these terms? Contact hello@leteane.industries.
        </p>
      </main>

      <footer className="border-t border-border bg-surface/40">
        <div className="mx-auto flex max-w-4xl flex-col justify-between gap-2 px-6 py-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Leteane Industries (Pty) Ltd. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground/70">
            Privacy Policy &amp; Data Scraping Compliance — pending legal review
          </p>
        </div>
      </footer>
    </div>
  );
}
