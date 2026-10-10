import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage, companyHead, OfficialLink } from "@/components/CompanyPage";

export const Route = createFileRoute("/privacy")({
  head: () => companyHead("Privacy Policy", "A proposed approach to handling personal information on the Leteane Industries website, Unify and client services."),
  component: Page,
});

const sections = [
  {
    "title": "1. Who is responsible",
    "body": "Leteane Industries is the company named on this website. Confirm the full registered entity name, registration number, business address, Information Officer and privacy contact before adopting this policy. For client projects, the agreement must identify whether we act as a responsible party or an operator."
  },
  {
    "title": "2. Information covered",
    "body": "Depending on the service and its configuration, information may include contact enquiries, application materials, technical request logs, event organiser details and information entered into the Unify assistant. Confirm the actual fields, providers and collection methods before publication."
  },
  {
    "title": "3. Purposes and lawful grounds",
    "body": "Personal information should be processed only for a defined, lawful purpose, such as responding to an enquiry, delivering an agreed service, maintaining security or administering recruitment. Identify an appropriate justification under POPIA for each activity. Consent is not the only possible justification and public availability is not unrestricted permission to reuse data."
  },
  {
    "title": "4. Unify and the assistant",
    "body": "Unify displays event information from third party sources and links to their original listings. Assistant messages may be processed by an external AI service to generate a reply. Do not enter sensitive personal information into the assistant. Confirm the provider, processing location, retention settings and applicable safeguards before adopting this notice."
  },
  {
    "title": "5. Sharing and transfers",
    "body": "Access should be limited to authorised staff and service providers who need the information for the stated purpose. Providers, including hosting and AI services, must be identified and their contractual safeguards reviewed. Any transfer outside South Africa must meet the applicable requirements of section 72 of POPIA."
  },
  {
    "title": "6. Retention and security",
    "body": "Set and document retention periods for enquiries, applications, logs and client records based on their purpose and applicable obligations. Do not retain personal information indefinitely. Confirm implemented access controls, deletion procedures and incident handling rather than assuming this draft establishes them."
  },
  {
    "title": "7. Your rights",
    "body": "Subject to applicable law, you may request access or correction, raise an objection, request deletion where appropriate, or withdraw consent where processing relies on consent. Identity may need to be verified proportionately. Requests for records may also be made through the PAIA process."
  },
  {
    "title": "8. Cookies and complaints",
    "body": "Confirm any cookies, analytics and browser storage in actual use and provide any required notices or choices. Privacy contact: to be confirmed. Complaints may be directed to the Information Regulator South Africa using its official complaint channels."
  }
];

function Page() {
  return <CompanyPage title="Privacy Policy" intro="A proposed approach to handling personal information on the Leteane Industries website, Unify and client services." sections={sections} legal={true}><OfficialLink href="https://inforegulator.org.za/">Information Regulator South Africa</OfficialLink></CompanyPage>;
}
