import type { Metadata } from "next";
import { ChecklistIndex } from "@/components/checklist-landing";

export const metadata: Metadata = {
  title:
    "CNESST Safety Checklists — Construction Québec | OK Sécurité",
  description:
    "Over 50 safety checklists aligned with CNESST standards for construction in Québec. " +
    "Formwork, scaffolding, electrical, work at height and more.",
  alternates: {
    canonical: "https://ok-securite.com/en/checklists",
    languages: {
      "fr-CA": "https://ok-securite.com/checklists",
      "en-CA": "https://ok-securite.com/en/checklists",
    },
  },
  openGraph: {
    title: "50+ CNESST Safety Checklists — OK Sécurité",
    description:
      "Free construction safety checklists for Québec job sites.",
    url: "https://ok-securite.com/en/checklists",
    locale: "en_CA",
  },
};

export default function ChecklistsEnPage() {
  return <ChecklistIndex locale="en" />;
}
