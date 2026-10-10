import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage, companyHead, OfficialLink } from "@/components/CompanyPage";

export const Route = createFileRoute("/paia")({
  head: () => companyHead("PAIA Manual", "Draft private body manual prepared for review under section 51 of the Promotion of Access to Information Act, 2000."),
  component: Page,
});

const sections = [
  {
    "title": "1. Purpose and company particulars",
    "body": "This manual describes how a person may request access to records held by Leteane Industries where those records are required for the exercise or protection of a right. Confirm the registered entity name, registration number, head of the body and nature of the business."
  },
  {
    "title": "2. Contact details",
    "body": "Head of the body: to be confirmed.\nInformation Officer and any Deputy Information Officer: to be confirmed.\nPostal and street addresses: to be confirmed.\nTelephone and email: to be confirmed.\nWebsite: confirm the final public website address."
  },
  {
    "title": "3. Guide on access to information",
    "body": "The Information Regulator publishes the guide contemplated in section 10 of PAIA, explaining the Act, request procedures and available assistance. Obtain the current guide from the Regulator and confirm how a copy is available from the company."
  },
  {
    "title": "4. Records automatically available",
    "body": "Confirm which records, if any, are available without a formal PAIA request, how to obtain them and any reproduction charges. Public website content does not mean every underlying business record is automatically accessible."
  },
  {
    "title": "5. Records held under legislation",
    "body": "Compile a verified list of applicable legislation and records actually held under it. Depending on operations, relevant laws may include the Companies Act, tax legislation, employment legislation, POPIA and PAIA. Applicability must be confirmed, not assumed."
  },
  {
    "title": "6. Subjects and categories of records",
    "body": "Review and confirm records actually held in these potential categories: corporate administration, finance and tax, personnel and recruitment, client contracts, service delivery, supplier agreements, information security, privacy and source verification. Listing a category does not guarantee access to every record."
  },
  {
    "title": "7. Request procedure",
    "body": "Use the prescribed Form 2 for access to a record and submit it to the confirmed Information Officer contact. Identify the record, the requested form of access, the right to be exercised or protected and why the record is required. Supply evidence of authority when acting for someone else. Assistance should be available where a requester cannot complete the form."
  },
  {
    "title": "8. Fees, decisions and remedies",
    "body": "Any request, access or reproduction fee must follow the current prescribed fee schedule and applicable exemptions. The company must provide the required notice, including any applicable deposit and decision details. PAIA generally requires a decision within 30 days, subject to lawful extensions. Access may be refused only on applicable statutory grounds. A requester may use the Information Regulator complaint process or seek court relief as provided by PAIA."
  },
  {
    "title": "9. Personal information processing",
    "body": "Confirm processing purposes, categories of data subjects and information, recipient categories, planned transfers outside South Africa and a general description of security measures. Potential activities include enquiries, recruitment, client services and technical operations, but the final manual must reflect actual practices."
  },
  {
    "title": "10. Availability and updates",
    "body": "Confirm arrangements for inspection at the company premises, website publication and copies on request, including any prescribed fees. Record the approval date and review this manual when particulars, procedures or processing activities change. Approval date: pending."
  }
];

function Page() {
  return <CompanyPage title="PAIA Manual" intro="Draft private body manual prepared for review under section 51 of the Promotion of Access to Information Act, 2000." sections={sections} legal={true}><OfficialLink href="https://inforegulator.org.za/">Information Regulator South Africa</OfficialLink></CompanyPage>;
}
