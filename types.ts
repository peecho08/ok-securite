export type Phase = "avant" | "pendant" | "fin";

export type TaskCategory =
  | "gros-oeuvre"
  | "structure"
  | "enveloppe"
  | "mecanique"
  | "finition"
  | "equipement"
  | "situation";

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
  icon: string;
  description: string;
  category: TaskCategory;
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
};
