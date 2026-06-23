export interface NutrientInfo {
  energy: string;
  caffeine: string;
  sparkle: string;
  aiOptimization: string;
}

export interface Beverage {
  id: string; // Unique ID, e.g. presets or dynamic
  name: string;
  tagline: string;
  description: string;
  primaryColor: string; // Hex color code
  secondaryColor: string; // Hex color code
  theme: string;
  ingredients: string[];
  benefits: string[];
  nutrients: NutrientInfo;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface VendingSlot {
  slotId: string; // e.g. "A1", "A2", "B1", "B2"
  beverage: Beverage | null;
  stock: number;
}

export interface VendingOperation {
  id: string;
  timestamp: string; // UTC or human time
  type: "dispense" | "mix" | "refill" | "synth";
  message: string;
  status: "success" | "pending" | "error";
}
