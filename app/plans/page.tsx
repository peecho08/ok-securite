import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { PlansContent } from "./plans-content";

export const metadata: Metadata = {
  title: "Tarifs — OK Sécurité | Gratuit, Silver et Gold",
  description:
    "Choisissez le forfait OK Sécurité adapté à votre équipe. " +
    "Listes de vérification CNESST gratuites, gestion d'équipe, listes personnalisées et rapports PDF professionnels. " +
    "À partir de 0 $/mois.",
  alternates: { canonical: "https://ok-securite.com/plans" },
  openGraph: {
    title: "Tarifs — OK Sécurité",
    description:
      "Forfaits Gratuit, Silver et Gold pour la sécurité en chantier. Listes CNESST, rapports PDF et gestion d'équipe.",
    url: "https://ok-securite.com/plans",
  },
};

export default function PlansPage() {
  return (
    <MarketingShell>
      <PlansContent />
    </MarketingShell>
  );
}
