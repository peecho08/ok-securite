export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OK Sécurité",
    url: "https://ok-securite.com",
    logo: "https://ok-securite.com/ok-securite.svg",
    description:
      "Application de listes de vérification CNESST pour la sécurité en chantier au Québec.",
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OK Sécurité",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    url: "https://ok-securite.com",
    description:
      "Application mobile de listes de vérification CNESST pour la construction au Québec. " +
      "Inspections de sécurité, rapports PDF et gestion d'équipe.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CAD",
      description: "Forfait gratuit disponible",
    },
    featureList: [
      "50+ listes de vérification CNESST",
      "Rapports PDF professionnels",
      "Gestion d'équipe",
      "Photos et non-conformités",
      "Mode hors-ligne",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
