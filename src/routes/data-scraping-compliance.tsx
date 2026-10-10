import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage, companyHead } from "@/components/CompanyPage";

export const Route = createFileRoute("/data-scraping-compliance")({
  head: () => companyHead("Data Scraping Compliance", "Proposed standards for lawful collection, careful reuse and transparent presentation of source data."),
  component: Page,
});

const sections = [
  {
    "title": "1. Permission and scope",
    "body": "Before collecting data, review the purpose, source terms, technical access rules, applicable intellectual property rights and any personal information involved. Obtain permission where needed. Publicly accessible material is not automatically free of restrictions."
  },
  {
    "title": "2. Access restrictions",
    "body": "Do not bypass authentication, paywalls, access controls or technical restrictions. An inaccessible social media post should remain unverified rather than being treated as a confirmed event. Review robots directives and platform policies as part of the source assessment."
  },
  {
    "title": "3. Personal information",
    "body": "Collect only information necessary for the documented purpose. Assess lawful grounds under POPIA, transparency requirements and any additional conditions for sensitive information or information about children. Avoid publishing unnecessary personal contact details."
  },
  {
    "title": "4. Source attribution",
    "body": "Event references should lead to the specific original listing or social media post, not merely an account profile. Retain provenance and verification notes. Link to the source rather than assuming a right to republish photographs, posters or videos."
  },
  {
    "title": "5. Accuracy and verification",
    "body": "Check event dates, venues and ticket conditions against the original listing before inclusion. Automated checks can be blocked or incomplete and cannot guarantee accuracy. The original organiser remains the appropriate source for final attendance and booking decisions."
  },
  {
    "title": "6. Responsible collection",
    "body": "Use proportionate request rates and stop collection when access is denied. Do not use collection methods that impair a source service. Confirm the collection schedule, approved sources and escalation process for each project."
  },
  {
    "title": "7. Correction and removal",
    "body": "Provide a confirmed contact for organisers, rights holders and affected individuals to request corrections or raise concerns. Review disputed material and restrict further use while its status is assessed where appropriate. Contact and review process: to be confirmed."
  },
  {
    "title": "8. Client responsibilities",
    "body": "Each engagement should document authorised sources, intended uses, handling requirements and the responsibilities of both parties. This policy draft does not establish that a particular collection activity is lawful or that a platform has approved it."
  }
];

function Page() {
  return <CompanyPage title="Data Scraping Compliance" intro="Proposed standards for lawful collection, careful reuse and transparent presentation of source data." sections={sections} legal={true}></CompanyPage>;
}
