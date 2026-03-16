export type Phase = "avant" | "pendant" | "fin";

export type TaskCategory =
  | "gros-oeuvre"
  | "structure"
  | "enveloppe"
  | "mecanique"
  | "finition"
  | "equipement"
  | "situation"
  | "custom";

export interface ChecklistItem {
  id: string;
  label: string;
  critical?: boolean;
  info?: string;
}

export interface PhaseGroup {
  phase: Phase;
  title: string;
  items: ChecklistItem[];
}

export interface Task {
  id: string;
  title: string;
  titleEn?: string;
  icon: string;
  description: string;
  descriptionEn?: string;
  category: TaskCategory;
  keywords?: string[];
  custom?: boolean;
}

export interface Checklist {
  taskId: string;
  phases: PhaseGroup[];
}

export const categoryLabels: Record<TaskCategory, string> = {
  "gros-oeuvre": "Gros œuvre",
  structure: "Structure & Armature",
  enveloppe: "Enveloppe & Toiture",
  mecanique: "Mécanique & Électricité",
  finition: "Finition & Revêtements",
  equipement: "Équipement & Levage",
  situation: "Situations transversales",
  custom: "Listes personnalisées",
};

export const categoryLabelsEn: Record<TaskCategory, string> = {
  "gros-oeuvre": "Heavy Work",
  structure: "Structure & Reinforcement",
  enveloppe: "Building Envelope & Roofing",
  mecanique: "Mechanical & Electrical",
  finition: "Finishing & Cladding",
  equipement: "Equipment & Hoisting",
  situation: "Cross-cutting Situations",
  custom: "Custom Checklists",
};
