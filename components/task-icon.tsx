import {
  type LucideIcon,
  Layers,
  Hammer,
  Shovel,
  BrickWall,
  CircleDot,
  Route,
  Bomb,
  Droplets,
  PaintBucket,
  Landmark,
  Link2,
  Building,
  Axe,
  Home,
  Droplet,
  Wrench,
  Thermometer,
  AppWindow,
  GripVertical,
  Radio,
  Cog,
  Pipette,
  Zap,
  Flame,
  Snowflake,
  FireExtinguisher,
  Building2,
  DoorOpen,
  Paintbrush,
  Grid3x3,
  LayoutGrid,
  Ruler,
  TreeDeciduous,
  KeyRound,
  Fence,
  ChevronsUp,
  Truck,
  ArrowUpDown,
  TowerControl,
  Waves,
  Compass,
  Construction,
  ShieldAlert,
  HardHat,
  DoorClosed,
  Sun,
  Package,
  Moon,
  Volume2,
  AlertTriangle,
  Plug,
} from "lucide-react";

const taskIcons: Record<string, LucideIcon> = {
  // Gros œuvre
  "coffrage": Layers,
  "coulage-beton": BrickWall,
  "demolition": Hammer,
  "terrassement": Shovel,
  "maconnerie": Building,
  "sciage-forage": CircleDot,
  "asphaltage": Route,
  "dynamitage": Bomb,
  "drainage": Droplets,
  "cimentier": PaintBucket,
  "fondations-pieux": Landmark,

  // Structure & Armature
  "ferraillage": Link2,
  "montage-acier": Building2,
  "charpente-menuiserie": Axe,

  // Enveloppe & Toiture
  "couverture-toiture": Home,
  "etancheite": Droplet,
  "ferblanterie": Wrench,
  "calorifugeage": Thermometer,
  "vitrage": AppWindow,
  "monteur-vitrier": GripVertical,

  // Mécanique & Électricité
  "securite-electronique": Radio,
  "mecanicien-industriel": Cog,
  "mecanicien-machines": Wrench,
  "tuyauteur-industriel": Pipette,
  "electricite": Zap,
  "plomberie-tuyauterie": Pipette,
  "soudage": Flame,
  "refrigeration": Snowflake,
  "protection-incendie": FireExtinguisher,

  // Finition & Revêtements
  "revetement-exterieur": Building2,
  "portes-fenetres": DoorOpen,
  "peinture": Paintbrush,
  "carrelage": Grid3x3,
  "platrage": LayoutGrid,
  "tireur-joints": Ruler,
  "parqueteur": TreeDeciduous,
  "serrurier": KeyRound,
  "clotures": Fence,

  // Équipement & Levage
  "levage-grutage": ChevronsUp,
  "echafaudage": Construction,
  "equipement-lourd": Truck,
  "ascenseur": ArrowUpDown,
  "grue-tour": TowerControl,
  "scaphandrier": Waves,
  "arpentage": Compass,

  // Situations transversales
  "travaux-routiers": Construction,
  "froid": Snowflake,
  "amiante": ShieldAlert,
  "travaux-hauteur": HardHat,
  "espace-clos": DoorClosed,
  "chaleur": Sun,
  "manutention": Package,
  "travail-nuit": Moon,
  "bruit": Volume2,
  "simdut": AlertTriangle,
  "milieu-aquatique": Waves,
  "lignes-aeriennes": Plug,
};

interface TaskIconProps {
  taskId: string;
  className?: string;
  fallback?: string;
}

export function TaskIcon({ taskId, className = "h-5 w-5", fallback }: TaskIconProps) {
  const Icon = taskIcons[taskId];
  if (Icon) return <Icon className={className} />;
  if (fallback) return <span>{fallback}</span>;
  return <Construction className={className} />;
}
