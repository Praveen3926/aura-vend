export interface Machine {
  id: string;
  name: string;
  category: "snack" | "coffee" | "beverage" | "fridge";
  categoryLabel: string;
  tagline: string;
  description: string;
  capacity: number; // item count
  capacityLabel: string;
  paymentTypes: ("UPI & Wallet" | "Card NFC" | "Cash" | "RFID Tap")[];
  dimensions: string; // H x W x D
  weight: number; // in kg
  powerRating: string; // Watts or Energy Rating
  ecoRating: "A++" | "A+" | "A" | "B";
  purchaseCost: number; // in USD
  monthlyRent: number; // in USD
  features: string[];
  imageUrl: string;
  colorOptions: { name: string; hex: string }[];
  accentColor: string; // Default preview hex
  temperatureSpan: string;
}

export const COMMERICAL_MACHINES: Machine[] = [
  {
    id: "snack-visivibe",
    name: "VisiVibe Snack Station",
    category: "snack",
    categoryLabel: "Smart Snack",
    tagline: "Glass-front multi-snack marvel with soft-drop robotic delivery",
    description: "Equipped with custom dual-zone cooling, a 22-inch high-fidelity user touchscreen and direct belt-conveyor assistance to reliably dispense delicate food items without damage.",
    capacity: 320,
    capacityLabel: "320 snack units",
    paymentTypes: ["UPI & Wallet", "Card NFC", "Cash"],
    dimensions: "1832 x 940 x 830 mm",
    weight: 280,
    powerRating: "150W (Eco-Cycle™ active)",
    ecoRating: "A++",
    purchaseCost: 4500,
    monthlyRent: 180,
    features: ["Dual-Temp Zone Optimization", "Robotic Delivery Conveyor", "High-Definition Video Ads Playback", "Drop-sensor product guarantee"],
    imageUrl: "/src/assets/images/visivibe_snack_station_1782129032885.jpg",
    colorOptions: [
      { name: "Carbon Obsidian", hex: "#111827" },
      { name: "Cyber Teal", hex: "#06B6D4" },
      { name: "Arctic Ice White", hex: "#F3F4F6" },
    ],
    accentColor: "#06B6D4",
    temperatureSpan: "4°C to 12°C"
  },
  {
    id: "coffee-aerobrew",
    name: "AeroBrew Elite",
    category: "coffee",
    categoryLabel: "Specialty Coffee",
    tagline: "Premium bean-to-cup automated espresso lab",
    description: "Combines an active dual grinder system with integrated fresh dairy/oat milk frothers. Offers 18 signature warm and cold gourmet recipes tailored to customer tastes on the fly.",
    capacity: 500,
    capacityLabel: "500 hot/cold cups",
    paymentTypes: ["UPI & Wallet", "Card NFC"],
    dimensions: "1680 x 750 x 780 mm",
    weight: 190,
    powerRating: "320W (Pulse heating tech)",
    ecoRating: "A+",
    purchaseCost: 5800,
    monthlyRent: 220,
    features: ["Active Smart grinders", "Automated dairy frother self-rinse", "18 recipe touch selection", "Fresh roast bean-level laser track"],
    imageUrl: "/src/assets/images/aerobrew_elite_1782129051998.jpg",
    colorOptions: [
      { name: "Titanium Silver", hex: "#6B7280" },
      { name: "Tuscan Bronze", hex: "#78350F" },
      { name: "Classic Pitch Black", hex: "#030712" },
    ],
    accentColor: "#F59E0B",
    temperatureSpan: "65°C to 92°C (Brew Temp)"
  },
  {
    id: "beverage-hydrocell",
    name: "HydroCell Max Cold Vender",
    category: "beverage",
    categoryLabel: "Chilled Beverage",
    tagline: "High-throughput rapid-chill modular refrigeration system",
    description: "Designed for premium cold satisfaction, featuring dynamic vortex rapid-chilling and a smooth central robotic lifter to fetch your beverage without shaking.",
    capacity: 400,
    capacityLabel: "400 bottles/cans",
    paymentTypes: ["UPI & Wallet", "Card NFC", "Cash", "RFID Tap"],
    dimensions: "1950 x 880 x 850 mm",
    weight: 310,
    powerRating: "210W (Intelligent R290 Compressor)",
    ecoRating: "A++",
    purchaseCost: 3900,
    monthlyRent: 150,
    features: ["Dynamic vortex rapid-chill", "Robotic anti-shake carousel lift", "Adjustable partition tracks", "Dynamic ambient pricing screens"],
    imageUrl: "/src/assets/images/hydrocell_max_cold_1782129067519.jpg",
    colorOptions: [
      { name: "Ice Cyan Metallic", hex: "#22D3EE" },
      { name: "Deep Navy Sapphire", hex: "#1E3A8A" },
      { name: "Gunmetal Slate", hex: "#374151" },
    ],
    accentColor: "#3B82F6",
    temperatureSpan: "1°C to 6°C"
  },
  {
    id: "fridge-aura",
    name: "Aura AI Smart Fridge",
    category: "fridge",
    categoryLabel: "Smart Grab & Go Kiosk",
    tagline: "Unmanned micro-market powered by sensory computer vision",
    description: "The peak of grab-and-go luxury. Customers tap card or UPI, open the door, take any combinations of fresh salads or meals, close the door, and get charged with perfect precision.",
    capacity: 150,
    capacityLabel: "150 gourmet meals",
    paymentTypes: ["Card NFC", "UPI & Wallet", "RFID Tap"],
    dimensions: "1900 x 900 x 750 mm",
    weight: 220,
    powerRating: "180W (Insulated thermal curtain)",
    ecoRating: "A++",
    purchaseCost: 6500,
    monthlyRent: 260,
    features: ["Weight sensor shelf arrays", "3D computer vision camera array", "Interactive dynamic offer displays", "Automatic expiry-date alert locks"],
    imageUrl: "/src/assets/images/aura_ai_fridge_1782129083411.jpg",
    colorOptions: [
      { name: "Sterile Lab White", hex: "#F9FAFB" },
      { name: "Stealth Graphite Grey", hex: "#1F2937" },
      { name: "Fluor-Green Tech", hex: "#10B981" },
    ],
    accentColor: "#10B981",
    temperatureSpan: "2°C to 5°C"
  }
];
