import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage, companyHead } from "@/components/CompanyPage";

export const Route = createFileRoute("/careers")({
  head: () => companyHead("Careers", "Help shape practical data tools for South African businesses and communities."),
  component: Page,
});

const sections = [
  {
    "title": "Work with Leteane Industries",
    "body": "Our work brings together data engineering, software development and responsible information use. We are interested in people who enjoy solving real problems, documenting their work and building systems that others can maintain."
  },
  {
    "title": "Areas of interest",
    "body": "Future opportunities may involve data ingestion, PostgreSQL, API development, front end engineering, quality assurance and data governance. These are areas of interest, not advertised vacancies."
  },
  {
    "title": "Current opportunities",
    "body": "No specific role is advertised on this draft page. Confirm available positions, employment arrangements and application deadlines before publishing a vacancy."
  },
  {
    "title": "What to include",
    "body": "When an application channel is confirmed, share a short introduction, your area of interest and links to relevant projects or a portfolio. Do not send identity documents, banking details or other sensitive records with an initial enquiry."
  },
  {
    "title": "Applications and privacy",
    "body": "Application contact and recruitment retention period: to be confirmed. Applicant information should be used only for the stated recruitment purpose, shared only with authorised reviewers and handled in line with the Privacy Policy."
  }
];

function Page() {
  return <CompanyPage title="Careers" intro="Help shape practical data tools for South African businesses and communities." sections={sections} legal={false}></CompanyPage>;
}
