interface SafetyFact {
  fr: string;
  en: string;
  source: string;
}

const facts: SafetyFact[] = [
  // ── Verified from CNESST 2024 annual report / Radio-Canada ────────
  {
    fr: "En 2024, 246 personnes sont décédées des suites de leur travail au Québec, dont 57 dans le secteur de la construction.",
    en: "In 2024, 246 people died from work-related causes in Québec, including 57 in the construction sector.",
    source: "CNESST, 2024",
  },
  {
    fr: "En 2024, le Québec a enregistré 96 721 accidents du travail — une baisse de 6 % par rapport à 2023.",
    en: "In 2024, Québec recorded 96,721 workplace accidents — a 6% decrease from 2023.",
    source: "CNESST, 2024",
  },

  // ── Verified from CNESST Code de sécurité (CSTC) ─────────────────
  {
    fr: "Tout travailleur à plus de 3 mètres du sol doit être protégé contre les chutes — c'est la loi.",
    en: "Any worker more than 3 metres above ground must be protected against falls — it's the law.",
    source: "CNESST — CSTC",
  },
  {
    fr: "Toute échelle doit dépasser d'au moins 900 mm (3 barreaux) le niveau d'accès supérieur.",
    en: "Every ladder must extend at least 900 mm (3 rungs) above the upper access level.",
    source: "CNESST — CSTC",
  },
  {
    fr: "Une tranchée dont les parois dépassent 1,2 m de profondeur doit être étançonnée ou avoir des parois en pente de moins de 45°.",
    en: "A trench with walls deeper than 1.2 m must be shored or have walls sloped at less than 45°.",
    source: "CNESST — CSTC, art. 3.15.3",
  },
  {
    fr: "Depuis 2025, un plan de sauvetage est obligatoire pour tout travail en hauteur nécessitant un harnais. Le dégagement doit se faire en 15 minutes maximum.",
    en: "Since 2025, a rescue plan is mandatory for any work at height requiring a harness. Rescue must happen within 15 minutes.",
    source: "CNESST — CSTC, 2025",
  },

  // ── Verified from CNESST — Noise regulations (June 2023) ─────────
  {
    fr: "Depuis juin 2023, la limite d'exposition au bruit est de 85 dBA sur 8 heures. Un marteau perforateur atteint 97 dBA.",
    en: "Since June 2023, the noise exposure limit is 85 dBA over 8 hours. A jackhammer reaches 97 dBA.",
    source: "CNESST, 2023",
  },
  {
    fr: "La surdité professionnelle représente environ 86 % des maladies professionnelles acceptées par la CNESST.",
    en: "Occupational hearing loss accounts for about 86% of occupational diseases accepted by the CNESST.",
    source: "CNESST",
  },

  // ── Verified from CNESST — Heat stroke prevention ────────────────
  {
    fr: "Buvez au minimum 250 ml d'eau toutes les 20 minutes sur le chantier, même sans soif. On n'absorbe que 60 % de l'eau nécessaire en buvant selon la soif.",
    en: "Drink at least 250 ml of water every 20 minutes on site, even if you're not thirsty. You only absorb 60% of needed water when drinking based on thirst alone.",
    source: "CNESST",
  },
  {
    fr: "Le risque de coup de chaleur est plus élevé les 5 premiers jours de canicule — le corps a besoin de temps pour s'acclimater.",
    en: "Heat stroke risk is highest in the first 5 days of a heat wave — the body needs time to acclimatize.",
    source: "CNESST",
  },

  // ── Verified from LSST, Article 12 ──────────────────────────────
  {
    fr: "Chaque travailleur a le droit de refuser un travail dangereux, sans perte de salaire ni mesure disciplinaire (art. 12, LSST).",
    en: "Every worker has the right to refuse dangerous work, without loss of pay or disciplinary action (art. 12, LSST).",
    source: "LSST, art. 12",
  },

  // ── Verified from INSPQ / CNESST — TMS stats ────────────────────
  {
    fr: "Les troubles musculosquelettiques représentent un tiers des lésions professionnelles indemnisées par la CNESST.",
    en: "Musculoskeletal disorders account for one third of occupational injuries compensated by the CNESST.",
    source: "INSPQ / CNESST",
  },

  // ── Verified from CSA / CNESST — PPE ─────────────────────────────
  {
    fr: "Un casque de sécurité a une durée de vie de 3 à 5 ans selon le matériau, et doit être remplacé immédiatement après tout impact.",
    en: "A hard hat has a lifespan of 3 to 5 years depending on material, and must be replaced immediately after any impact.",
    source: "CSA Z94.1",
  },
  {
    fr: "Le harnais de sécurité doit être inspecté visuellement avant chaque utilisation et remplacé après une chute.",
    en: "A safety harness must be visually inspected before each use and replaced after a fall.",
    source: "CNESST — CSA Z259.10",
  },
  {
    fr: "Les protections respiratoires doivent être ajustées individuellement — un masque mal ajusté ne protège pas.",
    en: "Respiratory protection must be individually fitted — an ill-fitting mask offers no protection.",
    source: "CNESST",
  },

  // ── Verified from CNESST — Young workers stats ───────────────────
  {
    fr: "Au Québec, 31 jeunes travailleurs se blessent au travail chaque jour. Le risque est plus élevé dans les premières semaines d'embauche.",
    en: "In Québec, 31 young workers are injured at work every day. The risk is highest in the first weeks on the job.",
    source: "CNESST",
  },

  // ── Verified from APCHQ ──────────────────────────────────────────
  {
    fr: "Tout employeur de la construction doit avoir un programme de prévention — c'est une obligation légale.",
    en: "Every construction employer must have a prevention program — it's a legal requirement.",
    source: "APCHQ",
  },
  {
    fr: "L'APCHQ offre plus de 30 capsules de pauses-sécurité gratuites pour outiller les équipes de chantier.",
    en: "The APCHQ offers over 30 free safety-break capsules to equip site teams.",
    source: "APCHQ",
  },

  // ── Verified from ASP Construction ───────────────────────────────
  {
    fr: "La formation Santé et sécurité générale (ASP Construction) de 30 heures est obligatoire pour accéder à tout chantier au Québec.",
    en: "The 30-hour General Health and Safety training (ASP Construction) is mandatory to access any construction site in Québec.",
    source: "ASP Construction",
  },
  {
    fr: "La carte ASP Construction est valide à vie — mais les connaissances doivent être mises à jour régulièrement.",
    en: "The ASP Construction card is valid for life — but knowledge should be regularly updated.",
    source: "ASP Construction",
  },

  // ── Verified from CNESST — Fall stats (2020-2022) ────────────────
  {
    fr: "Entre 2020 et 2022, la CNESST a dénombré 2 928 lésions liées aux chutes de hauteur en construction.",
    en: "Between 2020 and 2022, the CNESST recorded 2,928 injuries from falls at height in construction.",
    source: "CNESST — CSTC, 2025",
  },

  // ── Verified from CNESST — Lockout/Tagout ───────────────────────
  {
    fr: "Le cadenassage est la méthode prioritaire de la CNESST pour contrôler les 6 types d'énergies dangereuses sur un chantier.",
    en: "Lockout/tagout is the CNESST's priority method for controlling 6 types of hazardous energy on a site.",
    source: "CNESST",
  },

  // ── Verified from CNESST — Confined spaces ──────────────────────
  {
    fr: "Un espace clos (réservoir, cuve, puits) nécessite une ventilation, un détecteur de gaz et une formation obligatoire avant toute entrée.",
    en: "A confined space (tank, vat, well) requires ventilation, a gas detector, and mandatory training before entry.",
    source: "CNESST — CSA Z1006",
  },

  // ── Verified from CNESST — WHMIS ────────────────────────────────
  {
    fr: "Le SIMDUT exige que toute matière dangereuse sur le chantier soit identifiée et accompagnée de sa fiche de données de sécurité.",
    en: "WHMIS requires that every hazardous material on site be identified and accompanied by its safety data sheet.",
    source: "CNESST — SIMDUT",
  },

  // ── Verified from CNESST — Construire en santé ───────────────────
  {
    fr: "Construire en santé offre un service d'aide 24/7, gratuit et confidentiel pour les travailleurs de la construction : 1 800 807-2433.",
    en: "Construire en santé offers a free and confidential 24/7 helpline for construction workers: 1-800-807-2433.",
    source: "CNESST",
  },

  // ── Verified from CNESST — Fall protection hierarchy (2025) ──────
  {
    fr: "Depuis 2025, le Code de sécurité exige de suivre une hiérarchie de protection : travail au sol, garde-corps, limitation de déplacement, puis harnais en dernier recours.",
    en: "Since 2025, the Safety Code requires following a protection hierarchy: ground-level work, guardrails, movement limitation, then harness as last resort.",
    source: "CNESST — CSTC, 2025",
  },

  // ── Verified from CNESST — General safety culture ────────────────
  {
    fr: "Depuis octobre 2025, un régime permanent de prévention et de participation en SST s'applique à tous les établissements au Québec.",
    en: "Since October 2025, a permanent prevention and health & safety participation regime applies to all workplaces in Québec.",
    source: "APCHQ / CNESST, 2025",
  },
];

export function getDailyFact(): SafetyFact {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return facts[dayOfYear % facts.length];
}
