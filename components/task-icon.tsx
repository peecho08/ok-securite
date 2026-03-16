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
  ClipboardPen,
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

/** Lucide icons available for custom checklist icon picker */
export const customIconOptions: { name: string; Icon: LucideIcon }[] = [
  { name: "Wrench", Icon: Wrench },
  { name: "Cog", Icon: Cog },
  { name: "Hammer", Icon: Hammer },
  { name: "HardHat", Icon: HardHat },
  { name: "Construction", Icon: Construction },
  { name: "Building2", Icon: Building2 },
  { name: "Building", Icon: Building },
  { name: "Home", Icon: Home },
  { name: "Shovel", Icon: Shovel },
  { name: "BrickWall", Icon: BrickWall },
  { name: "Layers", Icon: Layers },
  { name: "Axe", Icon: Axe },
  { name: "Flame", Icon: Flame },
  { name: "Zap", Icon: Zap },
  { name: "Droplet", Icon: Droplet },
  { name: "Droplets", Icon: Droplets },
  { name: "Snowflake", Icon: Snowflake },
  { name: "Thermometer", Icon: Thermometer },
  { name: "Paintbrush", Icon: Paintbrush },
  { name: "Ruler", Icon: Ruler },
  { name: "Compass", Icon: Compass },
  { name: "ShieldAlert", Icon: ShieldAlert },
  { name: "AlertTriangle", Icon: AlertTriangle },
  { name: "FireExtinguisher", Icon: FireExtinguisher },
  { name: "Truck", Icon: Truck },
  { name: "ChevronsUp", Icon: ChevronsUp },
  { name: "TowerControl", Icon: TowerControl },
  { name: "Package", Icon: Package },
  { name: "DoorOpen", Icon: DoorOpen },
  { name: "Fence", Icon: Fence },
  { name: "Plug", Icon: Plug },
  { name: "Waves", Icon: Waves },
  { name: "ClipboardPen", Icon: ClipboardPen },
];

const customIconMap: Record<string, LucideIcon> = Object.fromEntries(
  customIconOptions.map(({ name, Icon }) => [name, Icon]),
);

interface TaskIconProps {
  taskId: string;
  className?: string;
  fallback?: string;
  iconName?: string;
}

export function TaskIcon({ taskId, className = "h-5 w-5", fallback, iconName }: TaskIconProps) {
  const Icon = taskIcons[taskId];
  if (Icon) return <Icon className={className} />;
  if (iconName && customIconMap[iconName]) {
    const CustomIcon = customIconMap[iconName];
    return <CustomIcon className={className} />;
  }
  if (fallback && customIconMap[fallback]) {
    const FallbackIcon = customIconMap[fallback];
    return <FallbackIcon className={className} />;
  }
  if (fallback) return <span>{fallback}</span>;
  return <Construction className={className} />;
}
