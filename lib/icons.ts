import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Cpu,
  GraduationCap,
  HeartPulse,
  Landmark,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  briefcase: Briefcase,
  building: Building2,
  building2: Building2,
  graduationcap: GraduationCap,
  heartpulse: HeartPulse,
  landmark: Landmark,
  shoppingbag: ShoppingBag,
  sparkles: Sparkles,
};

export function getCategoryIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Building2;
  const key = iconName.replace(/[-_\s]/g, "").toLowerCase();
  return ICON_MAP[key] ?? Building2;
}
