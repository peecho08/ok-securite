import type { Metadata } from "next";
import { MarketingHomeContent } from "./marketing-home-content";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "OK Sécurité — Listes de vérification CNESST pour la sécurité en chantier",
  description:
    "Application mobile de listes de vérification CNESST pour la construction au Québec. " +
    "Complétez vos inspections de sécurité sur le terrain, générez des rapports PDF et gérez votre équipe. " +
    "Gratuit pour commencer.",
  alternates: { canonical: "https://ok-securite.com" },
  openGraph: {
    title: "OK Sécurité — Sécurité chantier simplifiée",
    description:
      "50+ listes de vérification CNESST, rapports PDF professionnels et gestion d'équipe — tout dans une seule app.",
    url: "https://ok-securite.com",
  },
};

export default function MarketingHome() {
  return (
    <MarketingShell>
      <MarketingHomeContent />
    </MarketingShell>
  );
}
