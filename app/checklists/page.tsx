import type { Metadata } from "next";
import { ChecklistIndex } from "@/components/checklist-landing";

export const metadata: Metadata = {
  title:
    "Listes de vérification CNESST — Sécurité construction Québec | OK Sécurité",
  description:
    "Plus de 50 listes de vérification conformes aux normes CNESST pour la sécurité en construction au Québec. " +
    "Coffrage, échafaudage, électricité, travaux en hauteur et plus.",
  alternates: {
    canonical: "https://ok-securite.com/checklists",
    languages: {
      "fr-CA": "https://ok-securite.com/checklists",
      "en-CA": "https://ok-securite.com/en/checklists",
    },
  },
  openGraph: {
    title: "50+ listes de vérification CNESST — OK Sécurité",
    description:
      "Listes de vérification gratuites pour la sécurité en chantier au Québec.",
    url: "https://ok-securite.com/checklists",
  },
};

export default function ChecklistsPage() {
  return <ChecklistIndex locale="fr" />;
}
