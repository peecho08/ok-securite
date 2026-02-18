import { Checklist } from "@/types";

// Sources: CNESST, Code de sécurité pour les travaux de construction (CSTC),
// Règlement sur la santé et la sécurité du travail (RSST), CCQ, CCHST
// https://www.cnesst.gouv.qc.ca

export const checklists: Record<string, Checklist> = {
  // ═══════════════════════════════════════════════════════════
  // GROS ŒUVRE
  // ═══════════════════════════════════════════════════════════

  coffrage: {
    taskId: "coffrage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "cof-a1", label: "EPI portés : casque CSA, bottes à embout d'acier, lunettes, gants" },
          { id: "cof-a2", label: "Zone de travail balisée et accès restreint aux personnes autorisées" },
          { id: "cof-a3", label: "Panneaux, étais et accessoires de serrage inspectés — aucun défaut visible" },
          { id: "cof-a4", label: "Plan de coffrage consulté et compris" },
          { id: "cof-a5", label: "Stabilité du sol d'appui vérifiée — soles en place si nécessaire" },
          { id: "cof-a6", label: "Garde-corps installés si risque de chute ≥ 3 m (tolérance zéro CNESST)", critical: true, info: "Tolérance zéro CNESST : chute ≥ 3 m = arrêt des travaux" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "cof-p1", label: "Étais positionnés d'aplomb et verrouillés" },
          { id: "cof-p2", label: "Alignement et verticalité vérifiés au niveau" },
          { id: "cof-p3", label: "Serrage de tous les accessoires confirmé" },
          { id: "cof-p4", label: "Aucun travailleur sous la charge ou la zone de levage" },
          { id: "cof-p5", label: "Contreventement latéral en place" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "cof-f1", label: "Zone nettoyée — clous, débris et chutes de bois ramassés" },
          { id: "cof-f2", label: "Matériel empilé de façon stable et rangé" },
          { id: "cof-f3", label: "Anomalies ou quasi-accidents signalés au contremaître" },
        ],
      },
    ],
  },

  "coulage-beton": {
    taskId: "coulage-beton",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "bet-a1", label: "EPI portés : bottes étanches, gants résistants au pH, lunettes, casque" },
          { id: "bet-a2", label: "Coffrage vérifié, huilé et conforme au plan" },
          { id: "bet-a3", label: "Bon de livraison béton conforme (résistance, affaissement, adjuvants)" },
          { id: "bet-a4", label: "Aiguille vibrante et pervibrateur testés et fonctionnels" },
          { id: "bet-a5", label: "Accès camion-toupie dégagé — signaleur en place si recul nécessaire" },
          { id: "bet-a6", label: "Lignes électriques aériennes repérées — distance sécuritaire respectée", critical: true, info: "Distance minimale d'approche selon la tension — voir tableau CNESST" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "bet-p1", label: "Coulage par couches régulières — hauteur de chute ≤ 1,5 m" },
          { id: "bet-p2", label: "Vibration effectuée sans excès (éviter la ségrégation)" },
          { id: "bet-p3", label: "Niveau et planéité contrôlés pendant la mise en place" },
          { id: "bet-p4", label: "Contact peau-béton frais évité (risque de brûlure chimique)" },
          { id: "bet-p5", label: "Pression sur le coffrage surveillée — aucune déformation" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "bet-f1", label: "Surface talochée / lissée selon les spécifications" },
          { id: "bet-f2", label: "Cure béton appliquée si température > 25 °C ou vent fort" },
          { id: "bet-f3", label: "Matériel et pompe nettoyés immédiatement" },
          { id: "bet-f4", label: "Zone de séchage sécurisée et balisée" },
          { id: "bet-f5", label: "Eaux de lavage récupérées — pas de rejet au sol" },
        ],
      },
    ],
  },

  demolition: {
    taskId: "demolition",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "dem-a1", label: "EPI complets : casque, masque FFP3, lunettes, protections auditives, gants" },
          { id: "dem-a2", label: "Diagnostic amiante et plomb consulté (obligatoire bâtiments pré-1999)", critical: true, info: "Obligatoire pour bâtiments construits avant 1999 (CNESST)" },
          { id: "dem-a3", label: "Réseaux coupés et confirmés hors tension : eau, électricité, gaz, télécom", critical: true, info: "Vérifier la coupure avec les fournisseurs respectifs" },
          { id: "dem-a4", label: "Périmètre de sécurité établi et balisé — panneaux d'interdiction" },
          { id: "dem-a5", label: "Structure porteuse identifiée — ingénieur consulté si doute" },
          { id: "dem-a6", label: "Plan de démolition affiché et expliqué à l'équipe" },
          { id: "dem-a7", label: "Bâtiments mitoyens protégés si nécessaire" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "dem-p1", label: "Démolition du haut vers le bas — jamais par sapement" },
          { id: "dem-p2", label: "Pas de surcharge sur les planchers — matériaux évacués au fur et à mesure" },
          { id: "dem-p3", label: "Arrosage pour limiter la poussière de silice cristalline" },
          { id: "dem-p4", label: "Gravats évacués par goulotte ou benne — jamais par chute libre" },
          { id: "dem-p5", label: "Surveillance continue de la stabilité résiduelle" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "dem-f1", label: "Stabilité de la structure résiduelle vérifiée" },
          { id: "dem-f2", label: "Zone nettoyée, sécurisée et clôturée" },
          { id: "dem-f3", label: "Tri des déchets effectué : bois, métal, béton, matières dangereuses" },
          { id: "dem-f4", label: "Matières contenant de l'amiante entreposées selon la réglementation" },
        ],
      },
    ],
  },

  terrassement: {
    taskId: "terrassement",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "ter-a1", label: "EPI portés : casque CSA, gilet haute visibilité, bottes à embout d'acier" },
          { id: "ter-a2", label: "DICT / Info-Excavation reçue — réseaux souterrains repérés et marqués", critical: true, info: "Info-Excavation : 1-800-663-9228 — obligatoire avant toute excavation" },
          { id: "ter-a3", label: "Engin inspecté : freins, avertisseur de recul, godet, niveaux" },
          { id: "ter-a4", label: "Conditions météo vérifiées — pas de risque d'effondrement après pluie" },
          { id: "ter-a5", label: "Plans d'étançonnement signés par un ingénieur transmis à la CNESST" },
          { id: "ter-a6", label: "Lignes électriques aériennes repérées — distances de sécurité confirmées" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ter-p1", label: "Pente des parois < 45° ou blindage / étançonnement en place (art. 3.15.3 CSTC)", critical: true, info: "Art. 3.15.3 du Code de sécurité pour les travaux de construction" },
          { id: "ter-p2", label: "Étançonnement prolongé de 300 mm hors excavation" },
          { id: "ter-p3", label: "Aucun véhicule stationné à moins de 3 m du sommet des parois", critical: true, info: "Distance minimale réglementaire pour éviter l'effondrement des parois" },
          { id: "ter-p4", label: "Matériaux entreposés à plus de 1,2 m du bord de la tranchée" },
          { id: "ter-p5", label: "Échelles d'accès installées tous les 15 m, dépassant d'au moins 1 m" },
          { id: "ter-p6", label: "Signaleur présent si visibilité du conducteur d'engin est réduite" },
          { id: "ter-p7", label: "Personne expérimentée en surface pour surveiller les parois" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "ter-f1", label: "Fouille protégée : barrières rigides + signalisation la nuit" },
          { id: "ter-f2", label: "Engin stationné en sécurité, godet au sol, clé retirée" },
          { id: "ter-f3", label: "Rapport de fouille rempli et signé" },
        ],
      },
    ],
  },

  maconnerie: {
    taskId: "maconnerie",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "mac-a1", label: "EPI portés : casque, lunettes, gants, bottes, APR si découpe à sec" },
          { id: "mac-a2", label: "Échafaudage conforme et inspecté (voir fiche Échafaudage)" },
          { id: "mac-a3", label: "Matériaux stockés de façon stable — briques sur palettes retenues" },
          { id: "mac-a4", label: "Scie à maçonnerie inspectée — protecteur et alimentation en eau fonctionnels" },
          { id: "mac-a5", label: "Risque silice cristalline évalué — VEMP quartz ≤ 0,05 mg/m³ (depuis 04/2024)", critical: true, info: "Nouvelle VEMP depuis avril 2024 — tolérance zéro CNESST" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "mac-p1", label: "Découpe humide obligatoire ou aspiration avec filtre HEPA", critical: true, info: "Découpe à sec interdite — mouillage ou aspiration HEPA obligatoire" },
          { id: "mac-p2", label: "APR avec filtre P-100 porté si poussière de silice" },
          { id: "mac-p3", label: "Charge de l'échafaudage respectée — pas de stockage excessif" },
          { id: "mac-p4", label: "Mortier manipulé avec gants — éviter contact cutané prolongé" },
          { id: "mac-p5", label: "Rotation des tâches pour limiter les TMS (dos, épaules)" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "mac-f1", label: "Chutes de briques et débris nettoyés — jamais de balayage à sec" },
          { id: "mac-f2", label: "Outils nettoyés et rangés" },
          { id: "mac-f3", label: "Anomalies ou fissures signalées" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // STRUCTURE & ARMATURE
  // ═══════════════════════════════════════════════════════════

  ferraillage: {
    taskId: "ferraillage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "fer-a1", label: "EPI portés : gants anti-coupure, casque CSA, bottes, lunettes" },
          { id: "fer-a2", label: "Armatures conformes au plan — diamètres et quantités vérifiés" },
          { id: "fer-a3", label: "Outils de ligature et cintreuse en bon état" },
          { id: "fer-a4", label: "Aire de stockage de l'acier dégagée et signalisée" },
          { id: "fer-a5", label: "Embouts de barres verticales protégés par des capuchons champignon", critical: true, info: "Capuchons obligatoires pour prévenir l'empalement" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "fer-p1", label: "Calage et espacement respectés selon le plan" },
          { id: "fer-p2", label: "Ligatures serrées et complètes à chaque intersection requise" },
          { id: "fer-p3", label: "Enrobage minimal respecté (cales en place)" },
          { id: "fer-p4", label: "Chutes d'acier évacuées au fur et à mesure — zone dégagée" },
          { id: "fer-p5", label: "Protection antichute en place si travail au-dessus de 3 m" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "fer-f1", label: "Armatures protégées contre les intempéries et la corrosion" },
          { id: "fer-f2", label: "Chutes d'acier triées (récupération des métaux)" },
          { id: "fer-f3", label: "Contrôle visuel final avant coulage — conformité au plan" },
        ],
      },
    ],
  },

  "montage-acier": {
    taskId: "montage-acier",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "mta-a1", label: "EPI portés : harnais complet, casque avec jugulaire, bottes, gants" },
          { id: "mta-a2", label: "Plan de montage et séquence d'érection consultés" },
          { id: "mta-a3", label: "Points d'ancrage et lignes de vie installés par personne qualifiée" },
          { id: "mta-a4", label: "Élingues et manilles inspectées — charge nominale vérifiée" },
          { id: "mta-a5", label: "Zone de levage balisée — interdit sous la charge" },
          { id: "mta-a6", label: "Conditions météo vérifiées — pas de vent fort ou verglas" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "mta-p1", label: "Travailleur attaché 100 % du temps en hauteur", critical: true, info: "Tolérance zéro CNESST — protection antichute continue" },
          { id: "mta-p2", label: "Boulonnage temporaire minimum selon le plan avant détachement de la grue" },
          { id: "mta-p3", label: "Pièces guidées par câble de retenue — jamais à la main sous la charge" },
          { id: "mta-p4", label: "Communication constante avec le grutier (radio ou signaleur)" },
          { id: "mta-p5", label: "Contreventement temporaire installé au fur et à mesure" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "mta-f1", label: "Boulonnage définitif complété et vérifié au couple" },
          { id: "mta-f2", label: "Protections collectives remises en état (garde-corps, filets)" },
          { id: "mta-f3", label: "Harnais et longes inspectés — rangés à l'abri" },
        ],
      },
    ],
  },

  "charpente-menuiserie": {
    taskId: "charpente-menuiserie",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "cha-a1", label: "EPI portés : casque, lunettes, protections auditives, bottes, gants" },
          { id: "cha-a2", label: "Scie circulaire inspectée : protecteur en place, lame affûtée, pas de fissure" },
          { id: "cha-a3", label: "Cloueuse pneumatique vérifiée — sécurité de contact fonctionnelle" },
          { id: "cha-a4", label: "Aspiration ou ventilation en place pour poussière de bois" },
          { id: "cha-a5", label: "Plan de charpente consulté" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "cha-p1", label: "Protecteur de lame en place en tout temps — jamais retiré" },
          { id: "cha-p2", label: "Poussoir utilisé pour pousser le bois (jamais les mains près de la lame)" },
          { id: "cha-p3", label: "Pas de gants près des lames rotatives (risque d'accrochage)" },
          { id: "cha-p4", label: "Bruit > 85 dBA : protections auditives portées (CNESST calculette bruit)" },
          { id: "cha-p5", label: "APR porté si poussière de bois non captée" },
          { id: "cha-p6", label: "Protection antichute si travail ≥ 3 m" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "cha-f1", label: "Outils électriques débranchés et rangés" },
          { id: "cha-f2", label: "Sciure et chutes de bois ramassées (matière combustible)" },
          { id: "cha-f3", label: "Clous et vis au sol ramassés" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ENVELOPPE & TOITURE
  // ═══════════════════════════════════════════════════════════

  "couverture-toiture": {
    taskId: "couverture-toiture",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "toi-a1", label: "EPI portés : harnais complet, casque avec jugulaire, bottes antidérapantes" },
          { id: "toi-a2", label: "Points d'ancrage vérifiés — résistance ≥ 18 kN" },
          { id: "toi-a3", label: "Garde-corps périmétrique installé à ≤ 2 m du bord", critical: true, info: "Garde-corps obligatoire si travail à ≤ 2 m du bord de toit" },
          { id: "toi-a4", label: "Échelle d'accès fixée, dépassant de 900 mm le rebord" },
          { id: "toi-a5", label: "Conditions météo vérifiées — pas de pluie, verglas ou vent fort" },
          { id: "toi-a6", label: "Plan de sauvetage en cas de chute documenté et connu de l'équipe" },
          { id: "toi-a7", label: "Extincteur à portée si chalumeau / travaux à chaud" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "toi-p1", label: "Travailleur attaché en continu — tolérance zéro CNESST > 3 m", critical: true, info: "Tolérance zéro CNESST > 3 m — arrêt immédiat si non conforme" },
          { id: "toi-p2", label: "Bonbonnes de propane debout, attachées et éloignées de la flamme" },
          { id: "toi-p3", label: "Matériaux stockés loin du bord de toit" },
          { id: "toi-p4", label: "Ouvertures (lanterneaux, trappes) protégées par couvercle fixé" },
          { id: "toi-p5", label: "Hydratation régulière si travail au soleil (voir fiche chaleur)" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "toi-f1", label: "Rondes de surveillance incendie si travaux à chaud (60 min min.)" },
          { id: "toi-f2", label: "Protections collectives remises en état" },
          { id: "toi-f3", label: "Débris évacués — rien laissé en vrac sur le toit" },
          { id: "toi-f4", label: "Accès au toit sécurisé pour empêcher l'accès non autorisé" },
        ],
      },
    ],
  },

  etancheite: {
    taskId: "etancheite",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "eta-a1", label: "EPI portés : gants résistants aux produits chimiques, APR si requis" },
          { id: "eta-a2", label: "Support propre, sec et conforme — préparation de surface terminée" },
          { id: "eta-a3", label: "Fiches de données de sécurité (FDS) des produits consultées" },
          { id: "eta-a4", label: "Conditions météo favorables : pas de pluie, T° dans la plage du fabricant" },
          { id: "eta-a5", label: "Protection antichute en place si travail en toiture" },
          { id: "eta-a6", label: "Extincteur à portée si utilisation de flamme nue (chalumeau)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "eta-p1", label: "Application conforme aux prescriptions du fabricant" },
          { id: "eta-p2", label: "Recouvrements et relevés dimensionnels respectés" },
          { id: "eta-p3", label: "Ventilation assurée en espace confiné (RSST section XXVI)" },
          { id: "eta-p4", label: "Points singuliers traités : angles, joints de dilatation, traversées" },
          { id: "eta-p5", label: "Bonbonnes de propane debout et à l'écart de la flamme" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "eta-f1", label: "Test d'étanchéité effectué (mise en eau ou test fumigène)" },
          { id: "eta-f2", label: "Protection mécanique de l'ouvrage posée" },
          { id: "eta-f3", label: "Matériel nettoyé et produits entreposés selon FDS" },
          { id: "eta-f4", label: "Rondes de surveillance feu terminées (min. 1 h après travaux à chaud)" },
        ],
      },
    ],
  },

  ferblanterie: {
    taskId: "ferblanterie",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "feb-a1", label: "EPI portés : gants anti-coupure, lunettes, casque, bottes" },
          { id: "feb-a2", label: "Cisaille et plieuse inspectées — protecteurs en place" },
          { id: "feb-a3", label: "Bords de tôle ébavurés avant manipulation" },
          { id: "feb-a4", label: "Protection antichute en place si travail en toiture ou façade" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "feb-p1", label: "Manipulation de tôles avec gants — attention aux bords tranchants" },
          { id: "feb-p2", label: "Tôles arrimées contre le vent — risque de prise au vent" },
          { id: "feb-p3", label: "Soudure/brasage : permis de travail à chaud si requis" },
          { id: "feb-p4", label: "Protections auditives si découpe mécanique" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "feb-f1", label: "Chutes de tôle ramassées et entreposées en sécurité" },
          { id: "feb-f2", label: "Fixations vérifiées — résistance au vent confirmée" },
          { id: "feb-f3", label: "Outils rangés et zone nettoyée" },
        ],
      },
    ],
  },

  calorifugeage: {
    taskId: "calorifugeage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "cal-a1", label: "EPI portés : gants, APR si fibres ou amiante, lunettes, combinaison" },
          { id: "cal-a2", label: "Diagnostic amiante vérifié si bâtiment existant (pré-1999)" },
          { id: "cal-a3", label: "FDS des produits isolants consultées" },
          { id: "cal-a4", label: "Registre de gestion préventive de l'amiante consulté si applicable" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "cal-p1", label: "Conduites hors tension / hors service avant intervention si possible" },
          { id: "cal-p2", label: "Ventilation en place si travail en espace restreint" },
          { id: "cal-p3", label: "Fibres isolantes mouillées pour limiter la mise en suspension" },
          { id: "cal-p4", label: "Découpe d'isolant avec aspiration locale si requis" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "cal-f1", label: "Déchets d'isolant ensachés et étiquetés (amiante si applicable)" },
          { id: "cal-f2", label: "Zone nettoyée — pas de balayage à sec si fibres" },
          { id: "cal-f3", label: "Combinaison jetable éliminée si contaminée" },
        ],
      },
    ],
  },

  vitrage: {
    taskId: "vitrage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "vit-a1", label: "EPI portés : gants anti-coupure, lunettes, casque, bottes, harnais si hauteur" },
          { id: "vit-a2", label: "Ventouses de préhension inspectées et testées" },
          { id: "vit-a3", label: "Panneaux de verre stockés verticalement sur chevalets stables" },
          { id: "vit-a4", label: "Zone de pose balisée — interdit sous la zone de levage" },
          { id: "vit-a5", label: "Conditions de vent vérifiées — pas de manipulation si rafales fortes" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "vit-p1", label: "Vitrage manipulé à deux personnes minimum si grande dimension" },
          { id: "vit-p2", label: "Ventouses vérifiées entre chaque levage" },
          { id: "vit-p3", label: "Protection antichute en place pour travail en façade" },
          { id: "vit-p4", label: "Mastics et colles : ventilation assurée si solvants" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "vit-f1", label: "Éclats de verre ramassés immédiatement (conteneur rigide)" },
          { id: "vit-f2", label: "Film de protection posé sur les vitrages installés" },
          { id: "vit-f3", label: "Calages et fixations vérifiés" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MÉCANIQUE & ÉLECTRICITÉ
  // ═══════════════════════════════════════════════════════════

  electricite: {
    taskId: "electricite",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "ele-a1", label: "EPI portés : casque, gants isolants, lunettes, bottes diélectriques si requis" },
          { id: "ele-a2", label: "Circuits mis hors tension et confirmés au multimètre", critical: true, info: "Vérification au multimètre obligatoire — ne jamais se fier au disjoncteur seul" },
          { id: "ele-a3", label: "Cadenassage effectué — cadenas individuel à clé unique (RSST)", critical: true, info: "RSST : cadenas individuel à clé unique, un par travailleur" },
          { id: "ele-a4", label: "Fiche de cadenassage affichée au panneau" },
          { id: "ele-a5", label: "Distances minimales d'approche respectées si ligne sous tension (≥ 3 m si < 125 kV)" },
          { id: "ele-a6", label: "Outils isolés et en bon état" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ele-p1", label: "Vérification d'absence de tension avant chaque intervention" },
          { id: "ele-p2", label: "Mise à la terre des conducteurs si requis" },
          { id: "ele-p3", label: "Aucun travail sous tension sauf procédure CSA Z462 approuvée", critical: true, info: "Norme CSA Z462 — analyse de risque d'arc électrique requise" },
          { id: "ele-p4", label: "Câbles temporaires protégés contre l'écrasement et l'humidité" },
          { id: "ele-p5", label: "Arc électrique : vêtements ignifuges si travail à proximité de pièces sous tension" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "ele-f1", label: "Cadenassage retiré selon la procédure — seul le poseur retire son cadenas" },
          { id: "ele-f2", label: "Tests de continuité et d'isolation effectués" },
          { id: "ele-f3", label: "Panneaux refermés et identifiés" },
          { id: "ele-f4", label: "Chutes de câbles et rebuts triés" },
        ],
      },
    ],
  },

  "plomberie-tuyauterie": {
    taskId: "plomberie-tuyauterie",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "plo-a1", label: "EPI portés : casque, gants, lunettes, bottes, APR si brasage" },
          { id: "plo-a2", label: "Réseaux existants repérés et coupés si nécessaire (eau, gaz)" },
          { id: "plo-a3", label: "Chalumeau et bouteilles de gaz inspectés — manodétendeur en bon état" },
          { id: "plo-a4", label: "Permis de travail à chaud obtenu si brasage / soudure" },
          { id: "plo-a5", label: "Extincteur à portée" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "plo-p1", label: "Ventilation assurée si brasage en espace restreint" },
          { id: "plo-p2", label: "Flamme nue éloignée de matériaux combustibles" },
          { id: "plo-p3", label: "Épreuve de pression conforme au Code de plomberie" },
          { id: "plo-p4", label: "Conduites supportées adéquatement — pas de contrainte" },
          { id: "plo-p5", label: "Manutention de tuyaux longs : deux personnes si nécessaire" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "plo-f1", label: "Réseau purgé et testé — aucune fuite" },
          { id: "plo-f2", label: "Bouteilles de gaz fermées et capuchonnées" },
          { id: "plo-f3", label: "Rondes incendie si brasage (60 min min.)" },
          { id: "plo-f4", label: "Chutes de tuyaux et rebuts évacués" },
        ],
      },
    ],
  },

  soudage: {
    taskId: "soudage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "sou-a1", label: "EPI portés : masque de soudeur (verre adapté), gants cuir, tablier ignifuge" },
          { id: "sou-a2", label: "Permis de travail à chaud obtenu et affiché", critical: true, info: "Le permis doit être obtenu AVANT le début des travaux à chaud" },
          { id: "sou-a3", label: "Matières inflammables retirées ou protégées dans un rayon de 11 m" },
          { id: "sou-a4", label: "Extincteur à portée (6 m max)" },
          { id: "sou-a5", label: "Ventilation locale par extraction en place (obligation RSST)" },
          { id: "sou-a6", label: "Écrans de protection installés pour travailleurs adjacents" },
          { id: "sou-a7", label: "Appareil à souder inspecté : câbles, terre, connexions" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "sou-p1", label: "Fumées captées à la source — aspiration fonctionnelle" },
          { id: "sou-p2", label: "APR porté si ventilation insuffisante (filtre P100 min.)" },
          { id: "sou-p3", label: "Pas de soudage sur récipient ayant contenu des matières inflammables" },
          { id: "sou-p4", label: "Bouteilles de gaz debout, attachées et à l'ombre" },
          { id: "sou-p5", label: "Surveillant incendie présent si exigé par le permis" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "sou-f1", label: "Rondes de surveillance incendie : 60 min minimum après fin des travaux", critical: true, info: "60 min minimum — prolonger si matériaux combustibles à proximité" },
          { id: "sou-f2", label: "Bouteilles de gaz fermées et protégées (capuchon en place)" },
          { id: "sou-f3", label: "Zone inspectée — aucun point chaud résiduel" },
          { id: "sou-f4", label: "Permis de travail à chaud fermé et signé" },
        ],
      },
    ],
  },

  refrigeration: {
    taskId: "refrigeration",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "ref-a1", label: "EPI portés : gants isolants (froid/chimique), lunettes, bottes, casque" },
          { id: "ref-a2", label: "FDS des réfrigérants consultées — toxicité et inflammabilité connues" },
          { id: "ref-a3", label: "Détecteur de fuites de réfrigérant fonctionnel" },
          { id: "ref-a4", label: "Système mis hors service et pression relâchée si requis" },
          { id: "ref-a5", label: "Ventilation du local assurée (éviter accumulation de gaz)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ref-p1", label: "Manipulation des réfrigérants avec APR si risque d'inhalation" },
          { id: "ref-p2", label: "Brasage : permis de travail à chaud + extincteur" },
          { id: "ref-p3", label: "Raccords sous pression testés avant remise en service" },
          { id: "ref-p4", label: "Réfrigérant récupéré — jamais rejeté dans l'atmosphère" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "ref-f1", label: "Test d'étanchéité du circuit effectué" },
          { id: "ref-f2", label: "Réfrigérant récupéré entreposé selon la réglementation" },
          { id: "ref-f3", label: "Système remis en service de façon contrôlée" },
          { id: "ref-f4", label: "Zone nettoyée et outils rangés" },
        ],
      },
    ],
  },

  "protection-incendie": {
    taskId: "protection-incendie",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "pin-a1", label: "EPI portés : casque, gants, lunettes, bottes" },
          { id: "pin-a2", label: "Plans du réseau de gicleurs consultés" },
          { id: "pin-a3", label: "Réseau existant purgé et dépressurisé si raccordement" },
          { id: "pin-a4", label: "Permis de travail à chaud si soudure / brasage de conduites" },
          { id: "pin-a5", label: "Échafaudage ou PIR en place si travail en hauteur" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "pin-p1", label: "Conduites supportées adéquatement — espacement des supports conforme" },
          { id: "pin-p2", label: "Épreuve hydrostatique conforme à la norme NFPA" },
          { id: "pin-p3", label: "Aucune obstruction des têtes de gicleurs installées" },
          { id: "pin-p4", label: "Ventilation si brasage en espace restreint" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "pin-f1", label: "Réseau remis sous pression et testé — aucune fuite" },
          { id: "pin-f2", label: "Vannes en position ouverte et scellées" },
          { id: "pin-f3", label: "Rapport d'essai rempli et signé" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FINITION & REVÊTEMENTS
  // ═══════════════════════════════════════════════════════════

  peinture: {
    taskId: "peinture",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "pei-a1", label: "EPI portés : APR avec cartouche vapeurs organiques, lunettes, gants chimiques" },
          { id: "pei-a2", label: "FDS des peintures, solvants et décapants consultées" },
          { id: "pei-a3", label: "Ventilation mécanique installée (obligation RSST si espace fermé)" },
          { id: "pei-a4", label: "Sources d'ignition éliminées si produits inflammables" },
          { id: "pei-a5", label: "Échafaudage / escabeau inspecté si travail en hauteur" },
          { id: "pei-a6", label: "Diagnostic plomb vérifié si bâtiment ancien (décapage de peinture)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "pei-p1", label: "Ventilation continue maintenue pendant l'application" },
          { id: "pei-p2", label: "Pas de pulvérisation à moins de 3 m de travaux à chaud" },
          { id: "pei-p3", label: "Solvants entreposés dans contenants fermés entre les utilisations" },
          { id: "pei-p4", label: "Pauses à l'air frais si application prolongée en milieu fermé" },
          { id: "pei-p5", label: "Chiffons imbibés de solvant dans poubelle métallique fermée" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "pei-f1", label: "Ventilation maintenue jusqu'au séchage complet" },
          { id: "pei-f2", label: "Contenants de peinture et solvants refermés et entreposés selon FDS" },
          { id: "pei-f3", label: "Déchets dangereux (solvants, chiffons) éliminés conformément" },
          { id: "pei-f4", label: "Outils nettoyés — zone rangée" },
        ],
      },
    ],
  },

  carrelage: {
    taskId: "carrelage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "car-a1", label: "EPI portés : genouillères, gants, lunettes, APR si découpe à sec" },
          { id: "car-a2", label: "Scie à céramique inspectée — alimentation en eau fonctionnelle" },
          { id: "car-a3", label: "Risque silice cristalline évalué (céramique, grès, porcelaine)" },
          { id: "car-a4", label: "FDS des colles et mortiers consultées" },
          { id: "car-a5", label: "Ventilation en place si travail en espace fermé" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "car-p1", label: "Découpe humide obligatoire pour limiter la poussière de silice" },
          { id: "car-p2", label: "APR P-100 porté si découpe à sec inévitable" },
          { id: "car-p3", label: "Rotation des postures pour limiter les TMS aux genoux et au dos" },
          { id: "car-p4", label: "Chutes de carreaux ramassées au fur et à mesure" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "car-f1", label: "Nettoyage humide — pas de balayage à sec (poussière de silice)" },
          { id: "car-f2", label: "Outils nettoyés et rangés" },
          { id: "car-f3", label: "Déchets de coulis et colle éliminés correctement" },
        ],
      },
    ],
  },

  platrage: {
    taskId: "platrage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "pla-a1", label: "EPI portés : casque, lunettes, masque anti-poussière, gants, bottes" },
          { id: "pla-a2", label: "Échafaudage ou PIR inspecté si travail en hauteur (plafonds)" },
          { id: "pla-a3", label: "Panneaux de gypse stockés à plat, de façon stable" },
          { id: "pla-a4", label: "Visseuse et outils inspectés" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "pla-p1", label: "Manutention de panneaux à deux personnes si grande dimension" },
          { id: "pla-p2", label: "Poussière de gypse : ventilation ou aspiration en place" },
          { id: "pla-p3", label: "Ponçage de joints avec masque anti-poussière et aspiration" },
          { id: "pla-p4", label: "Posture de travail adaptée — plateforme à hauteur ajustable si possible" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "pla-f1", label: "Poussière de gypse aspirée (pas de balayage à sec)" },
          { id: "pla-f2", label: "Chutes de panneaux triées et évacuées" },
          { id: "pla-f3", label: "Outils rangés et zone dégagée" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ÉQUIPEMENT & LEVAGE
  // ═══════════════════════════════════════════════════════════

  "levage-grutage": {
    taskId: "levage-grutage",
    phases: [
      {
        phase: "avant",
        title: "Avant les opérations",
        items: [
          { id: "lev-a1", label: "EPI portés : casque, gilet haute visibilité, bottes, gants" },
          { id: "lev-a2", label: "Plan de levage établi : poids, rayon, capacité de la grue" },
          { id: "lev-a3", label: "Grue inspectée — certificat de conformité valide" },
          { id: "lev-a4", label: "Élingues et accessoires inspectés — aucune déformation ni usure" },
          { id: "lev-a5", label: "Charge nominale affichée sur l'appareil (obligation CNESST)" },
          { id: "lev-a6", label: "Signaleur désigné, formé et en gilet haute visibilité" },
          { id: "lev-a7", label: "Zone de levage balisée — interdiction de passage sous la charge", critical: true, info: "Tolérance zéro : personne ne doit se trouver sous une charge en mouvement" },
          { id: "lev-a8", label: "Lignes électriques repérées — distance de sécurité respectée" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les opérations",
        items: [
          { id: "lev-p1", label: "Communication signaleur ↔ grutier établie et continue" },
          { id: "lev-p2", label: "Charge ne passe jamais au-dessus de personnes", critical: true, info: "Le signaleur doit diriger la charge pour qu'elle ne survole personne" },
          { id: "lev-p3", label: "Mouvements fluides — pas d'à-coups brusques" },
          { id: "lev-p4", label: "Charge guidée par câble de retenue — jamais à la main" },
          { id: "lev-p5", label: "Signaleur visible du grutier en permanence" },
          { id: "lev-p6", label: "Vent surveillé — arrêt si rafales > limite du fabricant" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des opérations",
        items: [
          { id: "lev-f1", label: "Grue sécurisée : flèche dégagée, crochet relevé, frein serré" },
          { id: "lev-f2", label: "Élingues et accessoires rangés à l'abri" },
          { id: "lev-f3", label: "Carnet de bord de la grue rempli" },
          { id: "lev-f4", label: "Zone de travail libérée et sécurisée" },
        ],
      },
    ],
  },

  echafaudage: {
    taskId: "echafaudage",
    phases: [
      {
        phase: "avant",
        title: "Avant le montage",
        items: [
          { id: "ech-a1", label: "EPI portés : casque, harnais si montage > 3 m, bottes, gants" },
          { id: "ech-a2", label: "Sol d'assise stable — soles / madriers + vérins à vis en place" },
          { id: "ech-a3", label: "Composants inspectés : cadres, croisillons, verrous, planchers" },
          { id: "ech-a4", label: "Périmètre de montage balisé — interdit sous l'échafaudage" },
          { id: "ech-a5", label: "Plans d'ingénieur disponibles si hauteur > 18 m (CNESST)", critical: true, info: "Plans d'ingénieur obligatoires et à transmettre à la CNESST" },
        ],
      },
      {
        phase: "pendant",
        title: "Utilisation",
        items: [
          { id: "ech-p1", label: "Contreventement (croisillons) de chaque côté des cadres" },
          { id: "ech-p2", label: "Verrous verticaux fixés si > 2 cadres de hauteur (> 3 m)" },
          { id: "ech-p3", label: "Amarrage au mur si hauteur > 3× la largeur minimale de la base" },
          { id: "ech-p4", label: "Garde-corps complets : lisse haute (1 m), intermédiaire, plinthe (100 mm)", critical: true, info: "Lisse haute à 1 m, lisse intermédiaire, plinthe de 100 mm minimum" },
          { id: "ech-p5", label: "Plancher à ≤ 350 mm de la construction, largeur libre ≥ 480 mm" },
          { id: "ech-p6", label: "Charge d'utilisation respectée — pas de stockage excessif" },
          { id: "ech-p7", label: "Accès par échelle intérieure ou escalier — jamais par les croisillons" },
        ],
      },
      {
        phase: "fin",
        title: "Démontage",
        items: [
          { id: "ech-f1", label: "Démontage du haut vers le bas — méthode inverse du montage" },
          { id: "ech-f2", label: "Pièces descendues — aucune chute libre de composants" },
          { id: "ech-f3", label: "Composants inspectés, triés et rangés pour réutilisation" },
          { id: "ech-f4", label: "Zone libérée et nettoyée" },
        ],
      },
    ],
  },

  "equipement-lourd": {
    taskId: "equipement-lourd",
    phases: [
      {
        phase: "avant",
        title: "Avant les opérations",
        items: [
          { id: "eql-a1", label: "EPI portés : casque, gilet haute visibilité, bottes, protections auditives" },
          { id: "eql-a2", label: "Inspection pré-opérationnelle : freins, direction, niveaux, avertisseur de recul" },
          { id: "eql-a3", label: "Structure ROPS/FOPS intacte (protection anti-retournement / anti-chute d'objets)" },
          { id: "eql-a4", label: "Ceinture de sécurité fonctionnelle et portée" },
          { id: "eql-a5", label: "Zone de travail reconnue : pentes, obstacles, réseaux souterrains" },
          { id: "eql-a6", label: "Signaleur désigné si visibilité réduite" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les opérations",
        items: [
          { id: "eql-p1", label: "Distance de sécurité maintenue entre engin et personnel au sol" },
          { id: "eql-p2", label: "Pas de transport de personnes sauf poste prévu à cet effet" },
          { id: "eql-p3", label: "Travail en pente : godet ou lame côté amont" },
          { id: "eql-p4", label: "Avertisseur de recul fonctionnel — vérifier zone arrière avant recul" },
          { id: "eql-p5", label: "Aucun travail à moins de 3 m du bord d'une excavation" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des opérations",
        items: [
          { id: "eql-f1", label: "Engin stationné sur terrain plat, godet/lame au sol" },
          { id: "eql-f2", label: "Frein de stationnement serré, clé retirée" },
          { id: "eql-f3", label: "Rapport d'utilisation et anomalies consignés" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SITUATIONS TRANSVERSALES
  // ═══════════════════════════════════════════════════════════

  "travaux-hauteur": {
    taskId: "travaux-hauteur",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "hau-a1", label: "EPI portés : harnais complet, longe + absorbeur d'énergie, casque avec jugulaire", critical: true, info: "Obligatoire dès 3 m de hauteur — tolérance zéro CNESST" },
          { id: "hau-a2", label: "Points d'ancrage vérifiés — résistance ≥ 18 kN (CNESST)", critical: true, info: "Résistance minimale de l'ancrage selon la norme CSA Z259" },
          { id: "hau-a3", label: "Ligne de vie horizontale installée par personne qualifiée" },
          { id: "hau-a4", label: "Garde-corps périmétrique installé à ≤ 2 m du bord si possible" },
          { id: "hau-a5", label: "Plan de sauvetage en cas de chute documenté et connu de l'équipe" },
          { id: "hau-a6", label: "Conditions météo vérifiées — pas de vent fort, verglas ou orage" },
          { id: "hau-a7", label: "Ouvertures dans les planchers protégées (couvercles fixés ou garde-corps)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "hau-p1", label: "Travailleur attaché en continu — 100 % du temps en hauteur", critical: true, info: "Tolérance zéro : travailleur non attaché > 3 m = arrêt immédiat" },
          { id: "hau-p2", label: "Distance de chute libre ≤ 1,8 m (longe + absorbeur)" },
          { id: "hau-p3", label: "Dégagement sous le travailleur suffisant pour l'arrêt de chute" },
          { id: "hau-p4", label: "Échelle dépassant d'au moins 900 mm (35 po) le point d'accès" },
          { id: "hau-p5", label: "Outils attachés ou rangés — aucun objet libre en hauteur" },
          { id: "hau-p6", label: "Zone au sol sous les travaux balisée et interdite" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux",
        items: [
          { id: "hau-f1", label: "Harnais et longes inspectés — aucun dommage ni usure anormale" },
          { id: "hau-f2", label: "Protections collectives remises en état (garde-corps, filets)" },
          { id: "hau-f3", label: "Équipement antichute rangé à l'abri (UV, humidité)" },
          { id: "hau-f4", label: "Incidents ou presqu'accidents signalés" },
        ],
      },
    ],
  },

  "espace-clos": {
    taskId: "espace-clos",
    phases: [
      {
        phase: "avant",
        title: "Avant l'entrée",
        items: [
          { id: "ecl-a1", label: "EPI portés : harnais de sauvetage, APR si requis, casque, détecteur de gaz" },
          { id: "ecl-a2", label: "Permis d'entrée en espace clos rempli et signé" },
          { id: "ecl-a3", label: "Atmosphère testée : O₂ ≥ 19,5 %, explosivité < 10 % LIE, contaminants < VEMP", critical: true, info: "Valeurs minimales RSST : O₂ ≥ 19,5 %, LIE < 10 %" },
          { id: "ecl-a4", label: "Ventilation mécanique installée et fonctionnelle" },
          { id: "ecl-a5", label: "Cadenassage des sources d'énergie effectué (RSST)" },
          { id: "ecl-a6", label: "Surveillant posté à l'entrée — communication continue avec l'intérieur", critical: true, info: "Le surveillant ne doit jamais quitter son poste ni entrer dans l'espace" },
          { id: "ecl-a7", label: "Plan de sauvetage documenté — équipement de secours à portée" },
          { id: "ecl-a8", label: "Travailleurs habilités (≥ 18 ans, formés RSST section XXVI)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ecl-p1", label: "Détecteur de gaz portatif en fonctionnement continu" },
          { id: "ecl-p2", label: "Ventilation maintenue pendant toute la durée du travail" },
          { id: "ecl-p3", label: "Communication régulière avec le surveillant (aux 5 min minimum)" },
          { id: "ecl-p4", label: "Évacuation immédiate si alarme du détecteur de gaz", critical: true, info: "Évacuation immédiate — ne jamais tenter de secourir seul" },
          { id: "ecl-p5", label: "Aucune source d'ignition si atmosphère explosive possible" },
        ],
      },
      {
        phase: "fin",
        title: "Fin des travaux / Sortie",
        items: [
          { id: "ecl-f1", label: "Tout le personnel sorti — comptage confirmé" },
          { id: "ecl-f2", label: "Outils et matériel retirés de l'espace clos" },
          { id: "ecl-f3", label: "Accès refermé ou condamné pour empêcher l'entrée non autorisée" },
          { id: "ecl-f4", label: "Permis d'entrée fermé et archivé" },
          { id: "ecl-f5", label: "Cadenassage retiré selon la procédure" },
        ],
      },
    ],
  },

  chaleur: {
    taskId: "chaleur",
    phases: [
      {
        phase: "avant",
        title: "Avant la journée de travail",
        items: [
          { id: "cht-a1", label: "Indice humidex / température corrigée vérifié (outil CNESST)" },
          { id: "cht-a2", label: "Eau potable fraîche en quantité suffisante sur le chantier" },
          { id: "cht-a3", label: "Zone d'ombre ou abri disponible pour les pauses" },
          { id: "cht-a4", label: "Tâches les plus ardues planifiées aux heures fraîches (tôt le matin)" },
          { id: "cht-a5", label: "Équipe informée des symptômes de coup de chaleur" },
          { id: "cht-a6", label: "Trousse de premiers soins accessible" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "cht-p1", label: "Boire 250 ml d'eau toutes les 20 min (max 1,5 L/h)", info: "À 41,7 °C+ : boire 250 ml toutes les 10 min (max 1,5 L/h)" },
          { id: "cht-p2", label: "Pauses à l'ombre selon le régime travail-repos CNESST" },
          { id: "cht-p3", label: "Surveillance mutuelle entre collègues (système de jumelage)" },
          { id: "cht-p4", label: "Vêtements légers, pâles et respirants sous les EPI" },
          { id: "cht-p5", label: "Attention aux signes : crampes, étourdissements, fatigue inhabituelle" },
        ],
      },
      {
        phase: "fin",
        title: "Fin de la période chaude",
        items: [
          { id: "cht-f1", label: "Tout malaise signalé et documenté" },
          { id: "cht-f2", label: "En cas de confusion, perte d'équilibre ou perte de conscience : appeler le 911" },
          { id: "cht-f3", label: "Personne affectée déplacée à l'ombre et rafraîchie en attendant les secours" },
        ],
      },
    ],
  },

  manutention: {
    taskId: "manutention",
    phases: [
      {
        phase: "avant",
        title: "Avant la manutention",
        items: [
          { id: "man-a1", label: "EPI portés : gants de manutention, bottes à embout d'acier" },
          { id: "man-a2", label: "Poids de la charge évalué — aide mécanique si > 23 kg (recommandation CNESST)", info: "Recommandation CNESST — utiliser aide mécanique dès que possible" },
          { id: "man-a3", label: "Trajet dégagé et exempt d'obstacles — sol nivelé et non glissant" },
          { id: "man-a4", label: "Aide mécanique disponible : diable, chariot, potence, palan" },
          { id: "man-a5", label: "Charge stable et préhensible — poignées ou prises identifiées" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant la manutention",
        items: [
          { id: "man-p1", label: "Dos droit, flexion des genoux, charge près du corps" },
          { id: "man-p2", label: "Pas de torsion du tronc — pivoter avec les pieds" },
          { id: "man-p3", label: "Charges longues (tuyaux, barres) : deux personnes coordonnées" },
          { id: "man-p4", label: "Alterner les tâches pour réduire la fatigue musculaire" },
          { id: "man-p5", label: "Visibilité assurée — ne pas obstruer la vue avec la charge" },
        ],
      },
      {
        phase: "fin",
        title: "Après la manutention",
        items: [
          { id: "man-f1", label: "Charge déposée de façon stable et sécuritaire" },
          { id: "man-f2", label: "Douleur ou inconfort signalé rapidement (prévention TMS)" },
          { id: "man-f3", label: "Zone de dépose dégagée et accessible" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // NOUVEAUX MÉTIERS
  // ═══════════════════════════════════════════════════════════

  "sciage-forage": {
    taskId: "sciage-forage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "sf-a1", label: "EPI portés : casque, lunettes anti-projection, protecteurs auditifs, gants anti-vibrations" },
          { id: "sf-a2", label: "Vérifier l'absence de conduits électriques / gaz / eau dans la zone de coupe (détecteur ou plans)", critical: true, info: "Perforer une conduite sous tension = risque d'électrocution mortelle" },
          { id: "sf-a3", label: "Lame ou couronne de forage inspectée — pas de segments manquants ou fissurés" },
          { id: "sf-a4", label: "Alimentation en eau de refroidissement fonctionnelle et raccordée" },
          { id: "sf-a5", label: "Zone de travail balisée — protéger les passants des projections" },
          { id: "sf-a6", label: "Équipement de sciage fixé ou ancré solidement au support" },
          { id: "sf-a7", label: "Protection respiratoire N95/P100 si sciage à sec ou poussière de silice", critical: true, info: "VEMP silice cristalline : 0,025 mg/m³ — tolérance zéro CNESST depuis 2024" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "sf-p1", label: "Arrosage continu de la lame pour supprimer la poussière et refroidir" },
          { id: "sf-p2", label: "Ne jamais forcer la lame — laisser l'outil travailler à son rythme" },
          { id: "sf-p3", label: "Surveiller la fumée ou surchauffe — arrêter immédiatement si odeur anormale" },
          { id: "sf-p4", label: "Boues de sciage récupérées — ne pas laisser couler dans les égouts" },
          { id: "sf-p5", label: "Maintenir une distance sécuritaire avec la lame en rotation" },
          { id: "sf-p6", label: "Vérifier la stabilité de la pièce découpée avant la fin du trait de scie" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "sf-f1", label: "Équipement nettoyé, lame retirée et rangée" },
          { id: "sf-f2", label: "Boues et débris de béton ramassés et éliminés correctement" },
          { id: "sf-f3", label: "Ouvertures créées protégées ou balisées si risque de chute" },
          { id: "sf-f4", label: "Inspection des bords de coupe — ébavurer si arêtes coupantes" },
        ],
      },
    ],
  },

  asphaltage: {
    taskId: "asphaltage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "asp-a1", label: "EPI portés : bottes à semelle résistante à la chaleur, gants isolants, lunettes, vêtements longs" },
          { id: "asp-a2", label: "Vérifier la température de l'asphalte (140–160 °C typique) — risque de brûlure grave", critical: true, info: "L'asphalte chaud cause des brûlures au 3e degré instantanément" },
          { id: "asp-a3", label: "Signalisation et balisage du chantier conforme au Tome V (travaux routiers)" },
          { id: "asp-a4", label: "Plan de circulation des camions et finisseur établi — signaleur en place", critical: true, info: "Signaleur obligatoire lors de manœuvres de recul (CSTC art. 10.4)" },
          { id: "asp-a5", label: "Vérifier les services souterrains — plaques d'égout et regards identifiés" },
          { id: "asp-a6", label: "Extincteur accessible à proximité de la zone de coulée" },
          { id: "asp-a7", label: "Crème solaire / hydratation disponible — travail en plein soleil + chaleur radiante" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "asp-p1", label: "Ne jamais marcher dans l'asphalte frais — risque de brûlure et d'enfoncement" },
          { id: "asp-p2", label: "Maintenir une distance de sécurité avec la vis du finisseur" },
          { id: "asp-p3", label: "Porter un masque avec filtre vapeurs organiques si exposition aux fumées d'asphalte", info: "Les fumées de bitume contiennent des HAP — surveillance recommandée (RSST)" },
          { id: "asp-p4", label: "Rouler compacteur à vitesse réduite — aucun piéton dans la zone de compactage" },
          { id: "asp-p5", label: "Pauses fréquentes à l'ombre — appliquer le protocole chaleur si > 30 °C" },
          { id: "asp-p6", label: "Communication constante entre opérateurs de finisseur, camionneurs et râteleurs" },
          { id: "asp-p7", label: "Vérifier le niveau de la surface — joints de reprise bien réalisés" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "asp-f1", label: "Zone fraîchement pavée balisée — interdire la circulation jusqu'au refroidissement" },
          { id: "asp-f2", label: "Équipement nettoyé (raclettes, lisses) avec agent de décollage" },
          { id: "asp-f3", label: "Signalisation temporaire maintenue jusqu'à ouverture sécuritaire" },
          { id: "asp-f4", label: "Réservoir et conduites d'asphalte purgés si fin de journée" },
        ],
      },
    ],
  },

  dynamitage: {
    taskId: "dynamitage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "dyn-a1", label: "Permis de sautage obtenu et plan de tir approuvé par un ingénieur", critical: true, info: "CSTC art. 4.3 — plan de tir obligatoire signé par un ingénieur" },
          { id: "dyn-a2", label: "Boutefeu certifié présent sur le site (carte de compétence valide)", critical: true, info: "Seul un boutefeu certifié peut manipuler des explosifs (CSTC art. 4.2)" },
          { id: "dyn-a3", label: "Périmètre de sécurité établi et balisé selon le plan de tir" },
          { id: "dyn-a4", label: "Avertissement donné aux travailleurs et au voisinage — sirène / corne" },
          { id: "dyn-a5", label: "Matières explosives entreposées conformément — distance et magazine réglementaires" },
          { id: "dyn-a6", label: "Vérifier l'absence d'orage — aucun sautage si risque de foudre", critical: true, info: "Foudre = détonation spontanée — arrêt obligatoire si orage à < 10 km" },
          { id: "dyn-a7", label: "EPI portés : casque, lunettes balistiques, protecteurs auditifs, gilet haute visibilité" },
          { id: "dyn-a8", label: "Radio / communication fonctionnelle entre boutefeu et sentinelles" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "dyn-p1", label: "Tout le personnel évacué au-delà du périmètre AVANT la mise à feu" },
          { id: "dyn-p2", label: "Sentinelles en poste à chaque accès pour interdire l'entrée" },
          { id: "dyn-p3", label: "Signal sonore de mise à feu donné (code : 3 coups longs)" },
          { id: "dyn-p4", label: "Boutefeu vérifie que tous les trous ont sauté après le tir" },
          { id: "dyn-p5", label: "Attente minimum avant retour sur zone — temps selon le type d'explosif" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "dyn-f1", label: "Inspection de la zone — identifier les ratés de tir", critical: true, info: "Un raté de tir = explosif non détoné encore en place — danger extrême" },
          { id: "dyn-f2", label: "Ratés de tir traités uniquement par le boutefeu selon la procédure" },
          { id: "dyn-f3", label: "Explosifs non utilisés retournés au magazine — inventaire mis à jour" },
          { id: "dyn-f4", label: "Signal de fin de sautage donné — autorisation de retour sur zone" },
          { id: "dyn-f5", label: "Rapport de sautage rempli et consigné (date, quantités, résultats)" },
        ],
      },
    ],
  },

  drainage: {
    taskId: "drainage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "dra-a1", label: "EPI portés : casque, bottes imperméables à embout d'acier, gants, gilet haute visibilité" },
          { id: "dra-a2", label: "Info-Excavation contacté — localisation des services souterrains confirmée", critical: true, info: "Obligatoire avant toute excavation — 1-800-663-9228" },
          { id: "dra-a3", label: "Plan de tranchée consulté — profondeur, pente et étançonnement définis" },
          { id: "dra-a4", label: "Étançonnement ou talutage prévu si tranchée > 1,2 m de profondeur", critical: true, info: "CSTC art. 3.15.3 — étançonnement obligatoire > 1,2 m" },
          { id: "dra-a5", label: "Pompe d'assèchement disponible si nappe phréatique élevée" },
          { id: "dra-a6", label: "Matériaux de remblai (pierre concassée, géotextile) disponibles sur site" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "dra-p1", label: "Aucun travailleur dans la tranchée sans protection contre l'effondrement" },
          { id: "dra-p2", label: "Échelle d'accès disponible à moins de 8 m dans la tranchée" },
          { id: "dra-p3", label: "Pentes et niveau des conduites vérifiés régulièrement" },
          { id: "dra-p4", label: "Raccords testés étanches avant remblaiement" },
          { id: "dra-p5", label: "Matériaux empilés à min. 1,2 m du bord de la tranchée", info: "Surcharge au bord = risque d'effondrement des parois" },
          { id: "dra-p6", label: "Circulation d'engins interdite à proximité du bord de tranchée" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "dra-f1", label: "Conduites testées (pression ou vidéo) avant fermeture de la tranchée" },
          { id: "dra-f2", label: "Remblai compacté par couches selon les spécifications" },
          { id: "dra-f3", label: "Surface remise à niveau — signalisation temporaire si non pavé" },
          { id: "dra-f4", label: "Plan as-built mis à jour avec les tracés réels" },
        ],
      },
    ],
  },

  "revetement-exterieur": {
    taskId: "revetement-exterieur",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "rex-a1", label: "EPI portés : casque, lunettes, gants, protection antichute si > 3 m" },
          { id: "rex-a2", label: "Échafaudage ou plateforme élévatrice inspecté et conforme" },
          { id: "rex-a3", label: "Matériaux entreposés de façon stable — panneaux attachés contre le vent" },
          { id: "rex-a4", label: "Conditions météo vérifiées — pas de pose par vents forts (> 40 km/h)" },
          { id: "rex-a5", label: "Pare-vapeur et membrane installés selon les plans" },
          { id: "rex-a6", label: "Outils de coupe inspectés — protecteurs en place sur les scies" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "rex-p1", label: "Fixations conformes au devis — espacement et type respectés" },
          { id: "rex-p2", label: "Joints de dilatation respectés selon les spécifications du fabricant" },
          { id: "rex-p3", label: "Chutes et retailles ramassées régulièrement — ne pas laisser traîner" },
          { id: "rex-p4", label: "Protection antichute maintenue en tout temps en bordure", critical: true, info: "Tolérance zéro CNESST — harnais obligatoire > 3 m" },
          { id: "rex-p5", label: "Vérifier l'alignement et le niveau régulièrement" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "rex-f1", label: "Calfeutrage et scellant appliqués aux joints et pourtours" },
          { id: "rex-f2", label: "Inspection visuelle — aucun panneau mal fixé ou voilé" },
          { id: "rex-f3", label: "Chutes triées et récupérées — nettoyage du périmètre" },
        ],
      },
    ],
  },

  "portes-fenetres": {
    taskId: "portes-fenetres",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "pf-a1", label: "EPI portés : gants anti-coupure, lunettes, chaussures de sécurité" },
          { id: "pf-a2", label: "Ouvertures vérifiées — dimensions conformes aux plans" },
          { id: "pf-a3", label: "Matériaux de pose disponibles (mousse, vis, cales, membrane)" },
          { id: "pf-a4", label: "Protection antichute en place si installation en hauteur" },
          { id: "pf-a5", label: "Vitrage manipulé avec ventouses — gants anti-coupure obligatoires", info: "Bris de verre = coupures graves — toujours manipuler avec ventouses" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "pf-p1", label: "Cadre d'aplomb et de niveau vérifié avant fixation définitive" },
          { id: "pf-p2", label: "Calage adéquat pour maintenir le cadre en place pendant le vissage" },
          { id: "pf-p3", label: "Mousse expansive appliquée sans excès — ne pas déformer le cadre" },
          { id: "pf-p4", label: "Membrane d'étanchéité installée autour du cadre (solin)" },
          { id: "pf-p5", label: "Vitrage posé avec cales d'assise — ne repose pas sur le cadre seul" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "pf-f1", label: "Ouverture et fermeture testées — quincaillerie fonctionnelle" },
          { id: "pf-f2", label: "Calfeutrage extérieur appliqué — étanchéité à l'eau et à l'air" },
          { id: "pf-f3", label: "Protection temporaire posée sur les vitrages neufs" },
          { id: "pf-f4", label: "Emballages et retailles récupérés — zone nettoyée" },
        ],
      },
    ],
  },

  ascenseur: {
    taskId: "ascenseur",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "asc-a1", label: "EPI portés : casque, harnais, chaussures de sécurité, gants" },
          { id: "asc-a2", label: "Cage d'ascenseur protégée par garde-corps à chaque palier", critical: true, info: "Tolérance zéro — cage ouverte = risque de chute mortelle" },
          { id: "asc-a3", label: "Cadenassage de l'alimentation électrique si travail sur la machinerie", critical: true, info: "RSST art. 185 — cadenassage obligatoire lors de maintenance" },
          { id: "asc-a4", label: "Communication radio fonctionnelle entre la cage et la salle des machines" },
          { id: "asc-a5", label: "Plan d'urgence en cas de coincement affiché et connu" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "asc-p1", label: "Protection antichute obligatoire sur le toit de cabine", critical: true, info: "Travail sur le toit de cabine = espace confiné + hauteur — double risque" },
          { id: "asc-p2", label: "Aucun travail sous la cabine sans blocage mécanique en place" },
          { id: "asc-p3", label: "Rails et guides inspectés — fixations conformes" },
          { id: "asc-p4", label: "Essais de déplacement à vitesse réduite uniquement lors du réglage" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "asc-f1", label: "Essais de charge et de sécurité réalisés selon le Code CSA B44" },
          { id: "asc-f2", label: "Portes palières verrouillées — aucun accès public avant certification" },
          { id: "asc-f3", label: "Rapport d'installation complété — prêt pour inspection RBQ" },
        ],
      },
    ],
  },

  "travaux-routiers": {
    taskId: "travaux-routiers",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "tr-a1", label: "EPI portés : gilet haute visibilité classe 2 minimum, casque, chaussures de sécurité" },
          { id: "tr-a2", label: "Plan de signalisation conforme au Tome V du MTQ installé", critical: true, info: "Signalisation obligatoire selon le Tome V — normes du MTQ" },
          { id: "tr-a3", label: "Signaleurs certifiés en poste (formation ASP Construction)", critical: true, info: "Signaleur = formation obligatoire ASP Construction" },
          { id: "tr-a4", label: "Atténuateur d'impact (TMA) déployé si travaux sur route à haute vitesse", info: "Obligatoire sur autoroute et routes > 70 km/h" },
          { id: "tr-a5", label: "Balises, cônes et panneaux installés en séquence de fermeture progressive" },
          { id: "tr-a6", label: "Zone tampon clairement délimitée entre la circulation et la zone de travail" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "tr-p1", label: "Toujours faire face à la circulation — ne jamais tourner le dos aux véhicules" },
          { id: "tr-p2", label: "Véhicules de chantier avec gyrophare et drapeau allumés en tout temps" },
          { id: "tr-p3", label: "Signalisation maintenue en bon état — remplacer les cônes déplacés" },
          { id: "tr-p4", label: "Vitesse réduite pour tous les véhicules dans la zone de chantier" },
          { id: "tr-p5", label: "Aucun travailleur seul — toujours en binôme près de la circulation" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "tr-f1", label: "Signalisation retirée dans l'ordre inverse de la pose" },
          { id: "tr-f2", label: "Chaussée propre — pas de débris laissés sur la voie de circulation" },
          { id: "tr-f3", label: "Marquage temporaire en place si travaux non terminés" },
          { id: "tr-f4", label: "Rapport de signalisation complété et archivé" },
        ],
      },
    ],
  },

  froid: {
    taskId: "froid",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "frd-a1", label: "Vêtements multicouches : sous-vêtement technique, couche isolante, coupe-vent imperméable" },
          { id: "frd-a2", label: "Extrémités protégées : tuque sous le casque, cache-cou, gants isolés, couvre-bottes" },
          { id: "frd-a3", label: "Vérifier l'indice de refroidissement éolien — adapter les pauses", info: "À −27 °C (refroidissement éolien) : pause chaude aux 55 min" },
          { id: "frd-a4", label: "Abri chauffé accessible à proximité pour les pauses obligatoires" },
          { id: "frd-a5", label: "Boissons chaudes disponibles — éviter le café (déshydratation)" },
          { id: "frd-a6", label: "Système de surveillance par binôme — reconnaître les signes d'hypothermie" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "frd-p1", label: "Alterner entre tâches physiques et légères pour maintenir la chaleur" },
          { id: "frd-p2", label: "Pauses en abri chauffé selon la charte du refroidissement éolien", critical: true, info: "CNESST : pauses obligatoires selon indice de refroidissement éolien" },
          { id: "frd-p3", label: "Surveiller les signes d'engelure : peau blanche, engourdissement, picotement" },
          { id: "frd-p4", label: "Surveiller les signes d'hypothermie : frissons, confusion, somnolence", critical: true, info: "Hypothermie sévère = urgence médicale — appeler le 911 immédiatement" },
          { id: "frd-p5", label: "Changer les vêtements mouillés immédiatement" },
          { id: "frd-p6", label: "Surfaces glacées traitées — sel, sable ou tapis antidérapant" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "frd-f1", label: "Vêtements séchés pour le lendemain — ne pas les laisser dans le véhicule" },
          { id: "frd-f2", label: "Signaler tout signe persistant d'engelure ou d'engourdissement" },
          { id: "frd-f3", label: "Équipements protégés du gel (batteries, fluides hydrauliques)" },
        ],
      },
    ],
  },

  amiante: {
    taskId: "amiante",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "ami-a1", label: "Analyse de laboratoire confirmant la présence d'amiante (rapport d'expertise)", critical: true, info: "RSST art. 69.1 — analyse obligatoire avant tout travail sur matériaux suspectés" },
          { id: "ami-a2", label: "Niveau de risque déterminé (faible, modéré, élevé) — plan de travail adapté", critical: true, info: "RSST Annexe I — le niveau de risque détermine les mesures à prendre" },
          { id: "ami-a3", label: "Travailleurs formés pour les travaux d'amiante (formation ASP Construction)" },
          { id: "ami-a4", label: "EPI portés : combinaison jetable type Tyvek, respirateur P100 ou PAPR", critical: true, info: "Minimum P100 pour risque modéré — appareil à adduction d'air si risque élevé" },
          { id: "ami-a5", label: "Zone de confinement installée avec polyéthylène si risque modéré/élevé" },
          { id: "ami-a6", label: "Extracteur d'air avec filtre HEPA en dépression dans la zone confinée" },
          { id: "ami-a7", label: "Sas de décontamination à 3 étapes installé (sale → douche → propre)" },
          { id: "ami-a8", label: "Signalisation « DANGER — AMIANTE » affichée à toutes les entrées" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ami-p1", label: "Matériaux mouillés en continu pour supprimer les fibres en suspension" },
          { id: "ami-p2", label: "Aucun outil électrique rotatif (scie, meuleuse) — utiliser outils manuels ou basse vitesse", critical: true, info: "Sciage/meulage génère des fibres en très haute concentration" },
          { id: "ami-p3", label: "Débris placés directement dans des sacs étanches identifiés « AMIANTE »" },
          { id: "ami-p4", label: "Aspiration HEPA en continu — ne jamais balayer à sec" },
          { id: "ami-p5", label: "Vérification régulière de la dépression dans la zone confinée" },
          { id: "ami-p6", label: "Aucune nourriture ou boisson dans la zone de travail" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "ami-f1", label: "Décontamination complète du travailleur au sas avant de sortir" },
          { id: "ami-f2", label: "Combinaison jetable retirée à l'envers et mise en sac étanche" },
          { id: "ami-f3", label: "Analyse d'air finale réalisée — taux < 0,01 fibre/cm³ pour libérer la zone", critical: true, info: "Zone non libérable tant que l'analyse d'air ne confirme pas la conformité" },
          { id: "ami-f4", label: "Sacs de déchets d'amiante transportés vers un site d'enfouissement autorisé" },
          { id: "ami-f5", label: "Rapport de fin de travaux rempli et transmis (registre amiante)" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // GROS ŒUVRE — COMPLÉMENTS
  // ═══════════════════════════════════════════════════════════

  cimentier: {
    taskId: "cimentier",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "cim-a1", label: "EPI portés : casque, lunettes anti-projection, gants résistants aux alcalis, bottes imperméables" },
          { id: "cim-a2", label: "Protection respiratoire N95 si mélange de ciment sec ou sablage", critical: true, info: "Ciment Portland = silice cristalline — VEMP 0,025 mg/m³ (CNESST)" },
          { id: "cim-a3", label: "Produits chimiques (adjuvants, accélérateurs) identifiés avec fiche SIMDUT" },
          { id: "cim-a4", label: "Surfaces à traiter propres, exemptes de poussière et d'huile" },
          { id: "cim-a5", label: "Échafaudage ou plateforme en place si application en hauteur" },
          { id: "cim-a6", label: "Machine à projeter inspectée — buses, tuyaux et compresseur vérifiés" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "cim-p1", label: "Éviter tout contact prolongé peau-ciment humide — rincer immédiatement", info: "Le ciment humide cause des brûlures chimiques (pH > 12)" },
          { id: "cim-p2", label: "Porter un écran facial si projection de béton (shotcrete)" },
          { id: "cim-p3", label: "Zone de rebond balisée lors du béton projeté — éclats dangereux" },
          { id: "cim-p4", label: "Maintenir la ventilation si application en intérieur" },
          { id: "cim-p5", label: "Vérifier l'épaisseur d'application régulièrement" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "cim-f1", label: "Machine à projeter nettoyée — tuyaux purgés avant séchage" },
          { id: "cim-f2", label: "Résidus de ciment récupérés — ne pas rejeter dans les égouts" },
          { id: "cim-f3", label: "Mains et peau lavées soigneusement — crème hydratante appliquée" },
          { id: "cim-f4", label: "Cure du béton/crépi assurée selon le devis (membrane, arrosage)" },
        ],
      },
    ],
  },

  "fondations-pieux": {
    taskId: "fondations-pieux",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "fpx-a1", label: "EPI portés : casque, protecteurs auditifs (bouchons + coquilles), bottes à embout, lunettes" },
          { id: "fpx-a2", label: "Info-Excavation contacté — localisation des services confirmée", critical: true, info: "1-800-663-9228 — obligatoire avant tout enfoncement dans le sol" },
          { id: "fpx-a3", label: "Plan de fondation consulté — emplacement, profondeur et capacité portante" },
          { id: "fpx-a4", label: "Sonnette / marteau hydraulique ou foreuse inspecté et stabilisé" },
          { id: "fpx-a5", label: "Périmètre de sécurité balisé autour de l'équipement de battage" },
          { id: "fpx-a6", label: "Vérifier la distance aux lignes aériennes — dégagement selon le voltage", critical: true, info: "Distance min. 3 m (< 125 kV) à 12 m (> 345 kV) — voir tableau CNESST" },
          { id: "fpx-a7", label: "Pieux inspectés — intégrité, longueur et diamètre conformes" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "fpx-p1", label: "Personne ne se tient sous le pieu ou le marteau pendant le battage", critical: true, info: "Tolérance zéro — chute de pieu ou de mouton = risque mortel" },
          { id: "fpx-p2", label: "Communication par signaux entre l'opérateur et l'équipe au sol" },
          { id: "fpx-p3", label: "Vérifier le refus et la capacité portante selon les spécifications" },
          { id: "fpx-p4", label: "Vibrations surveillées — vérifier l'impact sur structures adjacentes" },
          { id: "fpx-p5", label: "Pieux mal alignés signalés immédiatement à l'ingénieur" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "fpx-f1", label: "Pieux recépés à la bonne hauteur si requis" },
          { id: "fpx-f2", label: "Rapport de battage rempli (profondeur, refus, nombre de coups)" },
          { id: "fpx-f3", label: "Essais de charge réalisés selon le devis (statique ou dynamique)" },
          { id: "fpx-f4", label: "Têtes de pieux protégées avant coulage des semelles" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ENVELOPPE — COMPLÉMENT
  // ═══════════════════════════════════════════════════════════

  "monteur-vitrier": {
    taskId: "monteur-vitrier",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "mv-a1", label: "EPI portés : casque, harnais, gants anti-coupure, lunettes, chaussures de sécurité" },
          { id: "mv-a2", label: "Protection antichute vérifiée — harnais, longe et ancrage conforme", critical: true, info: "Tolérance zéro CNESST > 3 m — murs-rideaux = toujours en hauteur" },
          { id: "mv-a3", label: "Plan d'installation et séquence de pose consultés" },
          { id: "mv-a4", label: "Panneaux et vitrages inspectés — aucun éclat, fissure ou défaut" },
          { id: "mv-a5", label: "Ventouses mécaniques ou à vide testées et chargées" },
          { id: "mv-a6", label: "Conditions météo vérifiées — vent < 40 km/h pour pose de vitrage", info: "Effet voile : vent + grand panneau = prise au vent dangereuse" },
          { id: "mv-a7", label: "Grue ou treuil de levage inspecté si panneaux lourds" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "mv-p1", label: "Panneau sécurisé mécaniquement AVANT de relâcher la ventouse" },
          { id: "mv-p2", label: "Aucun travailleur sous la zone de levage des panneaux", critical: true, info: "Chute de vitrage = risque mortel — zone interdite sous le levage" },
          { id: "mv-p3", label: "Fixations structurales installées selon le plan d'ingénieur" },
          { id: "mv-p4", label: "Joints d'étanchéité posés progressivement — ne pas laisser d'ouverture" },
          { id: "mv-p5", label: "Retailles de verre ramassées immédiatement — conteneur dédié" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "mv-f1", label: "Étanchéité vérifiée — test d'arrosage si requis" },
          { id: "mv-f2", label: "Protection temporaire posée sur les vitrages" },
          { id: "mv-f3", label: "Ventouses et outils nettoyés et rangés" },
          { id: "mv-f4", label: "Rapport de pose complété (numéros de panneaux, positions)" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // MÉCANIQUE — COMPLÉMENTS
  // ═══════════════════════════════════════════════════════════

  "securite-electronique": {
    taskId: "securite-electronique",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "sel-a1", label: "EPI portés : casque, lunettes, gants, chaussures de sécurité" },
          { id: "sel-a2", label: "Plans électriques et de câblage consultés — parcours identifiés" },
          { id: "sel-a3", label: "Tension des circuits vérifiée — travail hors tension si possible", critical: true, info: "Même basse tension (24V) peut être dangereuse en milieu humide" },
          { id: "sel-a4", label: "Outils isolés et multimètre calibré disponibles" },
          { id: "sel-a5", label: "Coordination avec les autres corps de métier — pas de conflit de parcours" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "sel-p1", label: "Câblage identifié et étiqueté à chaque extrémité" },
          { id: "sel-p2", label: "Percements dans les murs/planchers scellés au coupe-feu", info: "Code du bâtiment — maintien de l'intégrité coupe-feu obligatoire" },
          { id: "sel-p3", label: "Détecteurs et dispositifs installés aux emplacements du plan" },
          { id: "sel-p4", label: "Échelle ou plateforme utilisée pour les travaux en hauteur — jamais sur une chaise" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "sel-f1", label: "Tests fonctionnels réalisés sur chaque zone et dispositif" },
          { id: "sel-f2", label: "Centrale programmée et testée — communication avec le poste de surveillance confirmée" },
          { id: "sel-f3", label: "Plans as-built mis à jour et remis au client" },
          { id: "sel-f4", label: "Formation de base donnée à l'occupant sur le système" },
        ],
      },
    ],
  },

  "mecanicien-industriel": {
    taskId: "mecanicien-industriel",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "mi-a1", label: "EPI portés : casque, lunettes, gants, chaussures de sécurité, protecteurs auditifs" },
          { id: "mi-a2", label: "Cadenassage de toutes les sources d'énergie (électrique, pneumatique, hydraulique)", critical: true, info: "RSST art. 185 — cadenassage individuel obligatoire, un cadenas par travailleur" },
          { id: "mi-a3", label: "Énergie résiduelle purgée — vérification zéro énergie" },
          { id: "mi-a4", label: "Plans d'installation et manuels du fabricant consultés" },
          { id: "mi-a5", label: "Équipement de levage vérifié si déplacement de pièces lourdes" },
          { id: "mi-a6", label: "Zone de travail balisée et accès restreint" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "mi-p1", label: "Alignement des arbres et accouplements vérifié avec instruments de précision" },
          { id: "mi-p2", label: "Boulonnage au couple spécifié — clé dynamométrique utilisée" },
          { id: "mi-p3", label: "Aucune pièce en rotation exposée — protecteurs de machine en place avant essai" },
          { id: "mi-p4", label: "Lubrification effectuée selon les spécifications du fabricant" },
          { id: "mi-p5", label: "Tuyauterie raccordée vérifiée — aucune fuite sous pression" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "mi-f1", label: "Essai de fonctionnement réalisé — sens de rotation, vibrations, température vérifiés" },
          { id: "mi-f2", label: "Tous les protecteurs de machine remis en place avant la mise en service" },
          { id: "mi-f3", label: "Cadenas retirés dans l'ordre — dernier cadenas = responsable de l'essai" },
          { id: "mi-f4", label: "Rapport d'installation complété avec relevés d'alignement" },
        ],
      },
    ],
  },

  "mecanicien-machines": {
    taskId: "mecanicien-machines",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "mm-a1", label: "EPI portés : casque, lunettes, gants, bottes à embout, protecteurs auditifs" },
          { id: "mm-a2", label: "Machine immobilisée sur surface stable et de niveau" },
          { id: "mm-a3", label: "Moteur éteint, clé retirée, frein de stationnement engagé", critical: true, info: "Machine non sécurisée = risque d'écrasement — tolérance zéro" },
          { id: "mm-a4", label: "Équipements hydrauliques abaissés au sol ou bloqués mécaniquement" },
          { id: "mm-a5", label: "Fluides hydrauliques et carburant — fiches SIMDUT disponibles" },
          { id: "mm-a6", label: "Extincteur accessible à proximité si travaux à chaud" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "mm-p1", label: "Ne jamais travailler sous un équipement supporté uniquement par l'hydraulique", critical: true, info: "Perte de pression = chute de l'équipement — blocage mécanique obligatoire" },
          { id: "mm-p2", label: "Circuits hydrauliques dépressurisés avant ouverture des raccords" },
          { id: "mm-p3", label: "Pièces chaudes (turbo, collecteur) refroidies avant manipulation" },
          { id: "mm-p4", label: "Huiles et fluides usés récupérés dans des contenants appropriés" },
          { id: "mm-p5", label: "Tuyaux hydrauliques inspectés — remplacer si gonflés, fissurés ou abîmés" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "mm-f1", label: "Essai de fonctionnement réalisé — vérifier les fuites et le bon fonctionnement" },
          { id: "mm-f2", label: "Protecteurs et panneaux d'accès remis en place" },
          { id: "mm-f3", label: "Fluides usés éliminés selon les normes environnementales" },
          { id: "mm-f4", label: "Rapport d'entretien complété au carnet de la machine" },
        ],
      },
    ],
  },

  "tuyauteur-industriel": {
    taskId: "tuyauteur-industriel",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "ti-a1", label: "EPI portés : casque, lunettes, gants résistants à la chaleur, chaussures de sécurité" },
          { id: "ti-a2", label: "Plan de tuyauterie (P&ID) consulté — diamètres, matériaux et pressions identifiés" },
          { id: "ti-a3", label: "Système dépressurisé, vidangé et cadenassé", critical: true, info: "Vapeur/fluide sous pression = risque de brûlure ou de projection mortelle" },
          { id: "ti-a4", label: "Permis de travail à chaud obtenu si soudure ou brasage requis" },
          { id: "ti-a5", label: "Fiches SIMDUT des produits véhiculés consultées" },
          { id: "ti-a6", label: "Supports et ancrages vérifiés — capacité suffisante pour le poids de la tuyauterie" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "ti-p1", label: "Raccords filetés ou soudés selon les spécifications — couple de serrage respecté" },
          { id: "ti-p2", label: "Pentes d'écoulement vérifiées régulièrement" },
          { id: "ti-p3", label: "Soudures réalisées par un soudeur certifié selon le code applicable (ASME, CSA)" },
          { id: "ti-p4", label: "Ventilation adéquate si travaux de brasage ou soudure en espace restreint" },
          { id: "ti-p5", label: "Joints de dilatation installés aux emplacements prévus" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "ti-f1", label: "Test de pression hydrostatique réalisé selon le code — résultat conforme" },
          { id: "ti-f2", label: "Soudures radiographiées ou contrôlées si requis par le devis" },
          { id: "ti-f3", label: "Système purgé et prêt pour mise en service" },
          { id: "ti-f4", label: "Calorifuge installé sur les sections qui le requièrent" },
          { id: "ti-f5", label: "Plans as-built mis à jour — isométriques finaux remis" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FINITION — COMPLÉMENTS
  // ═══════════════════════════════════════════════════════════

  "tireur-joints": {
    taskId: "tireur-joints",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "tj-a1", label: "EPI portés : lunettes, masque anti-poussière N95 (sablage), gants" },
          { id: "tj-a2", label: "Surfaces de gypse inspectées — vis enfoncées, joints bien alignés" },
          { id: "tj-a3", label: "Composé à joints, rubans et outils prêts (couteaux, banjo, ponceuse)" },
          { id: "tj-a4", label: "Échafaudage ou échasses inspectés si travail en hauteur", info: "Échasses : formation requise, max 76 cm, sol stable et de niveau" },
          { id: "tj-a5", label: "Ventilation assurée si utilisation de composé à séchage rapide" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "tj-p1", label: "Poussière de sablage contrôlée — ponceuse avec aspiration ou sablage humide", critical: true, info: "Poussière de composé contient du talc et parfois de la silice — VEMP à respecter" },
          { id: "tj-p2", label: "Protection respiratoire portée EN TOUT TEMPS pendant le sablage" },
          { id: "tj-p3", label: "Chaque couche séchée avant l'application de la suivante" },
          { id: "tj-p4", label: "Éclairage rasant utilisé pour repérer les imperfections" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "tj-f1", label: "Poussière nettoyée — aspiration, pas de balayage à sec" },
          { id: "tj-f2", label: "Surface prête pour l'apprêt et la peinture — pas de marques de couteau" },
          { id: "tj-f3", label: "Outils nettoyés — composé retiré avant séchage" },
        ],
      },
    ],
  },

  parqueteur: {
    taskId: "parqueteur",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "prq-a1", label: "EPI portés : genouillères, lunettes, protecteurs auditifs, masque N95" },
          { id: "prq-a2", label: "Taux d'humidité du sous-plancher vérifié (hygromètre)" },
          { id: "prq-a3", label: "Bois acclimaté au site pendant minimum 72 h" },
          { id: "prq-a4", label: "Outils inspectés — cloueuse pneumatique, scie à onglets, ponceuse" },
          { id: "prq-a5", label: "Fiches SIMDUT des produits de finition consultées (vernis, teinture, adhésifs)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "prq-p1", label: "Sablage avec système d'aspiration intégré — minimiser la poussière", critical: true, info: "Poussière de bois = cancérigène — VEMP 1 mg/m³ bois dur (RSST)" },
          { id: "prq-p2", label: "Ventilation maximale lors de l'application de vernis/teinture", critical: true, info: "COV et isocyanates — ventilation + respirateur vapeurs organiques obligatoire" },
          { id: "prq-p3", label: "Aucune flamme nue à proximité des produits de finition" },
          { id: "prq-p4", label: "Genouillères portées en tout temps pour prévenir les bursite" },
          { id: "prq-p5", label: "Coupes effectuées dans un endroit ventilé ou à l'extérieur" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "prq-f1", label: "Zone ventilée pendant minimum 24 h après application du vernis" },
          { id: "prq-f2", label: "Chiffons imbibés de produits placés dans un contenant métallique fermé", info: "Risque d'auto-combustion — ne jamais jeter en boule dans la poubelle" },
          { id: "prq-f3", label: "Protection du plancher posée avant passage des autres corps de métier" },
          { id: "prq-f4", label: "Sciure et poussière nettoyées par aspiration" },
        ],
      },
    ],
  },

  serrurier: {
    taskId: "serrurier",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "srr-a1", label: "EPI portés : lunettes, gants anti-coupure, chaussures de sécurité" },
          { id: "srr-a2", label: "Plans de quincaillerie architecturale consultés — groupe et fonction de chaque porte" },
          { id: "srr-a3", label: "Quincaillerie triée par porte et vérifiée contre la liste" },
          { id: "srr-a4", label: "Outils disponibles : perceuse, gabarits, clés Allen, tournevis" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "srr-p1", label: "Percements réalisés avec gabarit du fabricant — pas de perçage à l'oeil" },
          { id: "srr-p2", label: "Portes coupe-feu : quincaillerie certifiée ULC installée selon le certificat", critical: true, info: "Quincaillerie non conforme sur porte coupe-feu = violation du Code du bâtiment" },
          { id: "srr-p3", label: "Ferme-porte ajusté — vitesse et force de fermeture conformes" },
          { id: "srr-p4", label: "Serrures maîtrisées programmées selon l'organigramme des clés" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "srr-f1", label: "Chaque porte testée — ouverture, fermeture, verrouillage fonctionnels" },
          { id: "srr-f2", label: "Portes de sortie d'urgence : quincaillerie panique vérifiée (ouverture en poussant)" },
          { id: "srr-f3", label: "Clés remises au responsable avec registre de remise" },
          { id: "srr-f4", label: "Liste de quincaillerie as-built remise" },
        ],
      },
    ],
  },

  clotures: {
    taskId: "clotures",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "clt-a1", label: "EPI portés : casque, gants anti-coupure, lunettes, bottes de sécurité" },
          { id: "clt-a2", label: "Info-Excavation contacté si poteaux enfoncés dans le sol", critical: true, info: "Creuser sans localiser = risque de perforer conduite de gaz ou câble électrique" },
          { id: "clt-a3", label: "Tracé de la clôture piquetée — respect des limites de propriété" },
          { id: "clt-a4", label: "Matériaux inspectés — poteaux, panneaux, grillage et quincaillerie" },
          { id: "clt-a5", label: "Foreuse ou tarière inspectée si trous mécanisés" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "clt-p1", label: "Poteaux d'aplomb et à la bonne profondeur avant bétonnage" },
          { id: "clt-p2", label: "Bords de grillage et tôle protégés — arêtes coupantes signalées" },
          { id: "clt-p3", label: "Tension du grillage uniforme — pas de zone affaissée" },
          { id: "clt-p4", label: "Béton de scellement en quantité suffisante par poteau" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "clt-f1", label: "Barrières et portails testés — ouverture et fermeture sans obstruction" },
          { id: "clt-f2", label: "Fils de fer et retailles métalliques ramassés — risque de coupure et crevaison" },
          { id: "clt-f3", label: "Trous remblayés et terrain nivelé au pied de la clôture" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ÉQUIPEMENT — COMPLÉMENTS
  // ═══════════════════════════════════════════════════════════

  "grue-tour": {
    taskId: "grue-tour",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "gt-a1", label: "Opérateur certifié grue à tour (carte CCQ valide)", critical: true, info: "Opérer sans carte = infraction pénale (Loi R-20)" },
          { id: "gt-a2", label: "Inspection quotidienne réalisée — câbles, crochets, limiteurs de charge" },
          { id: "gt-a3", label: "Anémomètre vérifié — limite de vent selon les spécifications du fabricant", critical: true, info: "Arrêt obligatoire typiquement à 65–70 km/h — consulter le manuel" },
          { id: "gt-a4", label: "Avis de grue transmis à la CNESST si requis" },
          { id: "gt-a5", label: "Zone de balayage de la flèche dégagée — interférences avec autres grues vérifiées" },
          { id: "gt-a6", label: "Signaleur désigné et en communication radio avec le grutier" },
          { id: "gt-a7", label: "Tableau de charges affiché en cabine — capacité selon la portée" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "gt-p1", label: "Personne ne se tient sous une charge en mouvement", critical: true, info: "Tolérance zéro CNESST — zone sous la charge toujours interdite" },
          { id: "gt-p2", label: "Charges élingées par un élingueur compétent — noeud et angle vérifiés" },
          { id: "gt-p3", label: "Vent surveillé en continu — arrêt immédiat si limite atteinte" },
          { id: "gt-p4", label: "Grue en girouette si non utilisée plus de 30 min (laisser la flèche libre)" },
          { id: "gt-p5", label: "Communication radio claire — répéter les commandes pour confirmation" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "gt-f1", label: "Crochet remonté, flèche mise en girouette, alimentation coupée" },
          { id: "gt-f2", label: "Carnet de bord complété — heures, incidents, charges maximales" },
          { id: "gt-f3", label: "Anomalies signalées au responsable de la maintenance" },
        ],
      },
    ],
  },

  scaphandrier: {
    taskId: "scaphandrier",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "sca-a1", label: "Plongeur certifié en plongée commerciale (norme CSA Z275.2)", critical: true, info: "Plongée commerciale = certification spécifique obligatoire — aucune plongée récréative" },
          { id: "sca-a2", label: "Plan de plongée établi — profondeur, durée, tâches, paliers de décompression" },
          { id: "sca-a3", label: "Équipement de plongée inspecté — alimentation en air, combinaison, communication" },
          { id: "sca-a4", label: "Plongeur de secours prêt sur place avec équipement complet", critical: true, info: "CSA Z275.2 — plongeur de secours obligatoire, prêt à intervenir en tout temps" },
          { id: "sca-a5", label: "Chambre hyperbare accessible si profondeur > 12 m", info: "Obligatoire si risque de maladie de décompression" },
          { id: "sca-a6", label: "Courant et visibilité évalués — conditions acceptables pour la plongée" },
          { id: "sca-a7", label: "Communication plongeur-surface testée et fonctionnelle" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "sca-p1", label: "Surveillance continue du plongeur depuis la surface" },
          { id: "sca-p2", label: "Temps de plongée et profondeur surveillés — tables de décompression respectées" },
          { id: "sca-p3", label: "Aucune opération de levage ou de dynamitage pendant la plongée" },
          { id: "sca-p4", label: "Navigation fluviale interdite dans le périmètre de plongée" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "sca-f1", label: "Paliers de décompression respectés intégralement" },
          { id: "sca-f2", label: "Plongeur surveillé pendant min. 1 h après la remontée" },
          { id: "sca-f3", label: "Équipement rincé, inspecté et rangé" },
          { id: "sca-f4", label: "Rapport de plongée rempli (profondeur, durée, travaux réalisés)" },
        ],
      },
    ],
  },

  arpentage: {
    taskId: "arpentage",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "arp-a1", label: "EPI portés : gilet haute visibilité, casque, chaussures de sécurité" },
          { id: "arp-a2", label: "Plan de chantier consulté — zones de circulation et dangers identifiés" },
          { id: "arp-a3", label: "Équipement calibré — station totale, GPS RTK, niveau" },
          { id: "arp-a4", label: "Coordination avec les opérateurs d'engins — se signaler avant d'entrer dans la zone" },
          { id: "arp-a5", label: "Points de référence (benchmark) localisés et vérifiés" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "arp-p1", label: "Contact visuel maintenu avec les opérateurs de machinerie en tout temps" },
          { id: "arp-p2", label: "Ne jamais se positionner entre un mur et un engin en mouvement" },
          { id: "arp-p3", label: "Piquets et repères bien identifiés — ruban de couleur visible" },
          { id: "arp-p4", label: "Données enregistrées et sauvegardées régulièrement" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "arp-f1", label: "Piquets solidement enfoncés — protégés contre le déplacement accidentel" },
          { id: "arp-f2", label: "Données transférées et vérifiées — rapport d'implantation produit" },
          { id: "arp-f3", label: "Écarts signalés immédiatement si hors tolérance" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SITUATIONS TRANSVERSALES — COMPLÉMENTS
  // ═══════════════════════════════════════════════════════════

  "travail-nuit": {
    taskId: "travail-nuit",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "tn-a1", label: "Éclairage temporaire installé — min. 50 lux pour circulation, 200 lux pour travaux détaillés", info: "RSST annexe IV — niveaux d'éclairage minimaux selon le type de tâche" },
          { id: "tn-a2", label: "Éclairage d'urgence fonctionnel en cas de panne" },
          { id: "tn-a3", label: "Gilets haute visibilité classe 3 portés (bandes réfléchissantes)", critical: true, info: "Classe 3 obligatoire la nuit — plus grande surface réfléchissante" },
          { id: "tn-a4", label: "Signalisation lumineuse du chantier vérifiée — visible depuis la route" },
          { id: "tn-a5", label: "Plan de gestion de la fatigue en place — rotations et pauses planifiées", info: "Travailler la nuit augmente le risque d'accident de 30 % (CNESST)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "tn-p1", label: "Pauses régulières respectées — 15 min toutes les 2 h minimum" },
          { id: "tn-p2", label: "Zones d'ombre et angles morts éliminés — éclairage repositionné si nécessaire" },
          { id: "tn-p3", label: "Bruit limité selon le règlement municipal — travaux bruyants planifiés en début de quart" },
          { id: "tn-p4", label: "Système de jumelage — personne ne travaille seul dans une zone isolée" },
          { id: "tn-p5", label: "Vigilance accrue lors des manœuvres d'engins — visibilité réduite" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "tn-f1", label: "Éclairage de sécurité maintenu jusqu'au dernier départ" },
          { id: "tn-f2", label: "Chantier sécurisé pour la nuit — clôtures, barricades et signalisation" },
          { id: "tn-f3", label: "Relève informée des travaux réalisés et des risques en cours" },
        ],
      },
    ],
  },

  bruit: {
    taskId: "bruit",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "brt-a1", label: "Niveau de bruit évalué — sonomètre ou estimation par tâche", info: "Marteau-piqueur ~110 dB, scie circulaire ~105 dB, cloueuse ~100 dB" },
          { id: "brt-a2", label: "Protection auditive sélectionnée selon le niveau : bouchons (NRR 25+) et/ou coquilles", critical: true, info: "RSST : limite de 85 dBA sur 8 h — doublement du bruit à chaque +3 dB" },
          { id: "brt-a3", label: "Travailleurs formés sur l'utilisation correcte des protecteurs auditifs" },
          { id: "brt-a4", label: "Zone de bruit élevé identifiée et signalée (pictogramme)" },
          { id: "brt-a5", label: "Audiogramme de référence réalisé pour les travailleurs exposés régulièrement", info: "Programme de surveillance auditive recommandé par la CNESST" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "brt-p1", label: "Protecteurs auditifs portés EN TOUT TEMPS dans la zone identifiée" },
          { id: "brt-p2", label: "Rotation des travailleurs si exposition prolongée > 85 dBA" },
          { id: "brt-p3", label: "Outils à faible bruit utilisés si disponibles (scie avec silencieux, etc.)" },
          { id: "brt-p4", label: "Pauses dans une zone calme pour limiter la dose quotidienne" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "brt-f1", label: "Acouphènes ou baisse d'audition signalés immédiatement" },
          { id: "brt-f2", label: "Protecteurs auditifs nettoyés et inspectés — remplacer les bouchons usés" },
          { id: "brt-f3", label: "Durée d'exposition consignée si programme de surveillance en place" },
        ],
      },
    ],
  },

  simdut: {
    taskId: "simdut",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "sim-a1", label: "Formation SIMDUT 2015 à jour pour tous les travailleurs exposés", critical: true, info: "RSST art. 62.1 — formation obligatoire avant toute manipulation de produit contrôlé" },
          { id: "sim-a2", label: "Fiches de données de sécurité (FDS) disponibles et accessibles sur le chantier" },
          { id: "sim-a3", label: "Étiquetage conforme sur tous les contenants — pictogrammes SGH visibles" },
          { id: "sim-a4", label: "EPI sélectionnés selon la FDS du produit (gants, lunettes, respirateur, combinaison)" },
          { id: "sim-a5", label: "Kit de déversement disponible à proximité de la zone d'utilisation" },
          { id: "sim-a6", label: "Entreposage conforme — produits incompatibles séparés (acide vs base, comburant vs combustible)" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "sim-p1", label: "Produit utilisé dans un endroit ventilé — hotte ou ventilation locale si nécessaire" },
          { id: "sim-p2", label: "Aucun transvasement dans un contenant non étiqueté", info: "Exception : utilisation immédiate par le même travailleur dans le même quart" },
          { id: "sim-p3", label: "Aucune nourriture ou boisson dans la zone de manipulation" },
          { id: "sim-p4", label: "Procédure de premiers soins connue — section 4 de la FDS" },
          { id: "sim-p5", label: "Douche d'urgence et rince-yeux accessibles si produits corrosifs utilisés" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "sim-f1", label: "Contenants fermés et rangés dans l'aire d'entreposage dédiée" },
          { id: "sim-f2", label: "Résidus et contenants vides éliminés selon les instructions de la FDS" },
          { id: "sim-f3", label: "Mains lavées soigneusement — aucun produit sur la peau" },
          { id: "sim-f4", label: "Déversement nettoyé correctement — matière absorbante récupérée et éliminée" },
        ],
      },
    ],
  },

  "milieu-aquatique": {
    taskId: "milieu-aquatique",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "maq-a1", label: "EPI portés : VFI (veste de flottaison individuelle) si travail à < 2 m de l'eau", critical: true, info: "CSTC art. 2.8.2 — VFI obligatoire si risque de noyade" },
          { id: "maq-a2", label: "Bouée de sauvetage avec corde accessible à max. 15 m de la zone de travail" },
          { id: "maq-a3", label: "Travailleur formé en sauvetage aquatique présent sur site", info: "Recommandation CNESST — au moins un secouriste formé en sauvetage" },
          { id: "maq-a4", label: "Niveau d'eau et courant évalués — conditions sécuritaires confirmées" },
          { id: "maq-a5", label: "Batardeau ou enceinte installé si requis — pompage planifié" },
          { id: "maq-a6", label: "Autorisation du MELCCFP obtenue si travaux en milieu hydrique", info: "Certificat d'autorisation obligatoire selon la LQE" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "maq-p1", label: "VFI porté en tout temps près de l'eau — jamais retiré" },
          { id: "maq-p2", label: "Niveau d'eau surveillé — montée soudaine = évacuation immédiate" },
          { id: "maq-p3", label: "Aucun travailleur seul près de l'eau — système de jumelage" },
          { id: "maq-p4", label: "Équipement électrique protégé contre l'eau — GFCI (disjoncteur de fuite à la terre)" },
          { id: "maq-p5", label: "Mesures de contrôle de l'érosion et des sédiments en place" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "maq-f1", label: "Batardeau retiré de façon contrôlée — pas de relargage brusque" },
          { id: "maq-f2", label: "Berges restaurées selon les conditions du certificat d'autorisation" },
          { id: "maq-f3", label: "Aucun déchet ou matériau laissé dans le cours d'eau" },
          { id: "maq-f4", label: "VFI inspectés, séchés et rangés correctement" },
        ],
      },
    ],
  },

  "lignes-aeriennes": {
    taskId: "lignes-aeriennes",
    phases: [
      {
        phase: "avant",
        title: "Avant les travaux",
        items: [
          { id: "la-a1", label: "Lignes aériennes identifiées sur le site — voltage déterminé (HQ ou compagnie)", critical: true, info: "Contact avec une ligne = électrocution mortelle instantanée" },
          { id: "la-a2", label: "Distance d'approche minimale déterminée selon le voltage", critical: true, info: "< 125 kV = 3 m, 125–250 kV = 5 m, 250–550 kV = 8 m (CSTC art. 5.2)" },
          { id: "la-a3", label: "Demande de mise hors tension ou de protection soumise à Hydro-Québec si nécessaire" },
          { id: "la-a4", label: "Signaleur désigné si engins ou charges à proximité des lignes" },
          { id: "la-a5", label: "Balises visuelles (fanions, rubans) installées pour marquer la zone de danger" },
          { id: "la-a6", label: "Plan de travail approuvé — parcours des engins planifié pour éviter les lignes" },
        ],
      },
      {
        phase: "pendant",
        title: "Pendant les travaux",
        items: [
          { id: "la-p1", label: "Distance d'approche respectée en TOUT TEMPS — inclut les outils et matériaux", critical: true, info: "L'arc électrique peut se former AVANT le contact physique — respecter la distance" },
          { id: "la-p2", label: "Grue et équipement en hauteur : flèche + charge + élingue dans la zone de dégagement" },
          { id: "la-p3", label: "Échafaudage et échelle : extrémité haute à distance sécuritaire de la ligne" },
          { id: "la-p4", label: "En cas de contact accidentel : rester dans la cabine, ne pas descendre", info: "Descendre = créer un chemin de fuite à la terre — risque d'électrocution" },
          { id: "la-p5", label: "Si évacuation nécessaire : sauter pieds joints, loin de la machine, sans toucher le sol et la machine simultanément" },
        ],
      },
      {
        phase: "fin",
        title: "Après les travaux",
        items: [
          { id: "la-f1", label: "Balises et signalisation retirées si travaux terminés" },
          { id: "la-f2", label: "Confirmation à Hydro-Québec si mise hors tension était en place — réalimentation autorisée" },
          { id: "la-f3", label: "Incidents ou quasi-contacts signalés obligatoirement" },
        ],
      },
    ],
  },
};
