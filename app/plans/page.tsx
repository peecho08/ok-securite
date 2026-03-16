import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { PlansContent } from "./plans-content";

export const metadata: Metadata = {
  title: "Tarifs — OK Sécurité | Forfaits à partir de 29 $/mois",
  description:
    "Choisissez le forfait OK Sécurité adapté à votre équipe. " +
    "Gratuit, Argent (29 $/mois) ou Or (79 $/mois). Essai gratuit de 14 jours sur tous les forfaits payants.",
  alternates: { canonical: "https://ok-securite.com/plans" },
  openGraph: {
    title: "Tarifs — OK Sécurité | Forfaits à partir de 29 $/mois",
    description:
      "Forfait Gratuit, Argent (29 $/mois) ou Or (79 $/mois). Essai gratuit de 14 jours. Listes CNESST, rapports PDF et gestion d'équipe.",
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
