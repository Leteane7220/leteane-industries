import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage, companyHead } from "@/components/CompanyPage";

export const Route = createFileRoute("/legal")({
  head: () => companyHead("Legal", "Review drafts for website use, privacy, data collection and access to information."),
  component: Page,
});

const sections = [
  {
    "title": "Company particulars",
    "body": "Registered entity name, registration number, registered address and authorised contact: to be confirmed. This draft does not verify company registration or regulatory status."
  },
  {
    "title": "Terms of Service",
    "body": "Proposed terms for using this website and engaging Leteane Industries. Project scope, delivery commitments, fees and intellectual property arrangements should be recorded in a separate written agreement."
  },
  {
    "title": "Privacy Policy",
    "body": "A proposed notice describing personal information, processing purposes, providers, retention and the rights of affected people. It must be checked against actual operations before adoption."
  },
  {
    "title": "Data Scraping Compliance",
    "body": "A proposed source assessment and data collection standard. It addresses permission, access restrictions, provenance, personal information and corrections."
  },
  {
    "title": "PAIA Manual",
    "body": "A section 51 private body manual draft under the Promotion of Access to Information Act. Missing company particulars, record categories and request contacts must be completed before adoption."
  },
  {
    "title": "Review and adoption",
    "body": "These documents have not been approved as final policies. Obtain qualified South African legal review, complete outstanding details and set effective dates before relying on them."
  }
];

function Page() {
  return <CompanyPage title="Legal" intro="Review drafts for website use, privacy, data collection and access to information." sections={sections} legal={true}></CompanyPage>;
}
