import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { PlansContent } from "./plans-content";

export const metadata: Metadata = {
  title: "Tarifs — OK Sécurité | Gratuit pendant le lancement",
  description:
    "OK Sécurité est gratuit pendant la période de lancement. " +
    "Listes de vérification CNESST, gestion d'équipe, listes personnalisées et rapports PDF — tout inclus, sans frais.",
  alternates: { canonical: "https://ok-securite.com/plans" },
  openGraph: {
    title: "Tarifs — OK Sécurité | Gratuit pendant le lancement",
    description:
      "Toutes les fonctionnalités incluses gratuitement pendant l'accès anticipé. Listes CNESST, rapports PDF et gestion d'équipe.",
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
