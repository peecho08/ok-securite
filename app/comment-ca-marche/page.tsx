import type { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";
import { MarketingShell } from "@/components/marketing-shell";

export const metadata: Metadata = {
  title: "Comment ça marche — OK Sécurité",
  description:
    "Découvrez comment OK Sécurité simplifie la gestion de la sécurité sur vos chantiers. " +
    "Guide étape par étape pour les employeurs et les travailleurs.",
  alternates: { canonical: "https://ok-securite.com/comment-ca-marche" },
  openGraph: {
    title: "Comment ça marche — OK Sécurité",
    description:
      "Guide complet pour employeurs et travailleurs : créez votre équipe, assignez des listes, complétez vos inspections.",
    url: "https://ok-securite.com/comment-ca-marche",
  },
};

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <HowItWorksContent />
    </MarketingShell>
  );
}
