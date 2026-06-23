import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Beverage, VendingSlot, VendingOperation } from "./types";
import VendingMachine from "./components/VendingMachine";
import CanModal from "./components/CanModal";
import MachineCatalog from "./components/MachineCatalog";
import MachineCustomizerPreview from "./components/MachineCustomizerPreview";
import CostCalculator from "./components/CostCalculator";
import QuoteRequestModal from "./components/QuoteRequestModal";
import WhatsAppSupport from "./components/WhatsAppSupport";

// B2B Procurement Suite Modular Components
import AIRecommendation from "./components/AIRecommendation";
import ARPreview from "./components/ARPreview";
import IndustryCases from "./components/IndustryCases";
import CustomerReviews from "./components/CustomerReviews";
import VideoDemo from "./components/VideoDemo";
import WishlistManager from "./components/WishlistManager";
import { LanguageCode } from "./utils/languages";
import {
  Sparkles,
  Coins,
  Cpu,
  Layers,
  Activity,
  Compass,
  ArrowRight,
  TrendingUp,
  Info,
  Layers3,
  Flame,
  Zap,
  Droplets,
  Coffee,
  CheckCircle,
  HelpCircle,
  Code,
  Github,
  Laptop,
  AlertCircle,
  RefreshCw,
  Users,
  Brain,
  Network,
  Palette,
  Sliders,
  Volume2,
  VolumeX,
  Radio,
  Award,
  Trophy,
  Key,
  Lock,
  Unlock,
  Check
} from "lucide-react";

import { 
  playCoinChime, 
  playDispensingSound, 
  playSuccessChime, 
  startAmbientHum, 
  stopAmbientHum, 
  updateAmbientHumFreq,
  playConsumptionSound
} from "./utils/audio";

// Default preset beverages, coffees, and snacks to populate our smart vending machine
const PRESET_DRINKS: Beverage[] = [
  // --- ROW A: COLD SPARKLING & HYDRATION ELIXIRS ---
  {
    id: "A1",
    name: "Quantum Spark",
    tagline: "Hyper-fizz molecular speed fuel",
    description: "An intense, sparkling infusion of blue raspberry active adaptogens, paired with a molecular energy-matrix containing organic taurine and custom neural spark particles to trigger instantaneous cognitive clarity.",
    primaryColor: "#06B6D4", // Neon Cyan
    secondaryColor: "#3B82F6", // Power Blue
    theme: "cyberpunk",
    ingredients: ["Synthesized Taurine Matrix", "Adaptogenic Ginseng Core", "Hyper-Fizz Carbonated H2O", "Glow-Dust Electrolytes"],
    benefits: ["+45% Neural Response", "L-Theanine Neuroprotection"],
    nutrients: {
      energy: "12 kcal",
      caffeine: "120 mg",
      sparkle: "Extreme Fizz",
      aiOptimization: "98.4%"
    },
    imageUrl: "/src/assets/images/quantum_spark_can_1782105708738.jpg"
  },
  {
    id: "A2",
    name: "Solar Dew",
    tagline: "Zesty solar lime battery",
    description: "A dynamic citrus infusion bursting with yuzu and kaffir lime extracts to instantly refresh dry taste buds.",
    primaryColor: "#84CC16", // Lime Green
    secondaryColor: "#4D7C0F", // Deep Lime
    theme: "light-aurora",
    ingredients: ["Yuzu Citrus Extract", "Kaffir Lime Concentrate", "Micro-Buffered Potassium Ions"],
    benefits: ["Vitamin C Saturation", "Instant Core Refreshed Vibe"],
    nutrients: {
      energy: "18 kcal",
      caffeine: "0 mg",
      sparkle: "Medium Buzz",
      aiOptimization: "92.0%"
    },
    imageUrl: "/src/assets/images/solar_dew_can_1782106108587.jpg"
  },
  {
    id: "A3",
    name: "Hydra Surge Blue",
    tagline: "Rapid cellular ion saturation",
    description: "Premium electrolyte complex utilizing key minerals and active trace trace salts flavored with high-altitude blue orchid botanical extracts to restore full body hydration variables.",
    primaryColor: "#3B82F6", // Cobalt Blue
    secondaryColor: "#1D4ED8", // Royal Navy
    theme: "chrome-luxe",
    ingredients: ["Pure Blue Orchid Botanicals", "Buffered Magnesium Ions", "Trace Seaweed Salts"],
    benefits: ["Cellular Osmosis Acceleration", "Instant Core Heat Cooling"],
    nutrients: {
      energy: "2 kcal",
      caffeine: "0 mg",
      sparkle: "Light Sparkle",
      aiOptimization: "94.8%"
    },
    imageUrl: "/src/assets/images/hydra_surge_blue_can_1782106097588.jpg"
  },
  {
    id: "A4",
    name: "Neon Citrus Shock",
    tagline: "Tangy hyper-drive blast",
    description: "An explosive blast of dynamic sour tangerines and mental stimulants to instantly shock fatigue away.",
    primaryColor: "#F97316", // Hyper Orange
    secondaryColor: "#EA580C", // Red-Orange
    theme: "synthwave",
    ingredients: ["Sour Tangerine Extract", "Mental Stimulator Complex", "Trace Minerals"],
    benefits: ["Anti-Fatigue Cellular Shock", "Adrenaline Regulation Factor"],
    nutrients: {
      energy: "20 kcal",
      caffeine: "85 mg",
      sparkle: "Violent Fizz",
      aiOptimization: "94.2%"
    },
    imageUrl: "/src/assets/images/neon_citrus_shock_can_1782106139041.jpg"
  },

  // --- ROW B: HOT & COLD BREWED COFFEES & TEAS ---
  {
    id: "B1",
    name: "Cyber Mocha Drive",
    tagline: "Double-shot jitterless energy",
    description: "Cold-brewed Highland espresso blended with non-destructive active cacao nanobots to stabilize caffeine absorption curves while optimizing blood-flow characteristics.",
    primaryColor: "#EAB308", // Golden Yellow Accent
    secondaryColor: "#78350F", // Cocoa Brown
    theme: "mocha-synth",
    ingredients: ["Highland Arabica Cold Brew", "Bioactive Cocoa Peptides", "Nano-filtered Organic Collagen"],
    benefits: ["Extended Physical Stamina", "Caffeine Spike Dampener"],
    nutrients: {
      energy: "35 kcal",
      caffeine: "160 mg",
      sparkle: "Cream Nitro",
      aiOptimization: "97.2%"
    },
    imageUrl: "/src/assets/images/cyber_mocha_can_1782105735976.jpg"
  },
  {
    id: "B2",
    name: "Zen Matcha Wave",
    tagline: "Ultra-clean calm focus flow",
    description: "Ceremonial Kyoto matcha micro-whipped with lavender essences and trace brainwood amino acids, delivering prolonged concentration spikes without an energy crash.",
    primaryColor: "#10B981", // Matcha Green
    secondaryColor: "#059669", // Dark Emerald
    theme: "naturalist",
    ingredients: ["Kyoto Matcha Extract (99.8%)", "L-Theanine Peptide Complex", "Hydrolyzed Lavender Minerals"],
    benefits: ["Alpha Brain Wave Inducer", "Heart-Rate Stabilization"],
    nutrients: {
      energy: "4 kcal",
      caffeine: "45 mg",
      sparkle: "Still Silk",
      aiOptimization: "96.1%"
    },
    imageUrl: "/src/assets/images/zen_matcha_can_1782105722280.jpg"
  },
  {
    id: "B3",
    name: "Neo-Espresso Volt",
    tagline: "High-altitude hot crema booster",
    description: "A super premium high-altitude coffee pod double-shot nitrogen-enriched for peak muscular coordination and explosive brain focus multipliers.",
    primaryColor: "#CA8A04", // Bronze crema
    secondaryColor: "#27272A", // Dark Slate Coffee
    theme: "espresso-luxe",
    ingredients: ["Kyoto Nitrogen Arabica", "Ginseng Cordyceps Complex", "Oat Collagen Factor"],
    benefits: ["Peak Oxygen Resorption", "Zero Caffeine crash stabilizer"],
    nutrients: {
      energy: "15 kcal",
      caffeine: "180 mg",
      sparkle: "Hot Crema",
      aiOptimization: "98.9%"
    },
    imageUrl: "/src/assets/images/neo_espresso_volt_1782106632230.jpg"
  },
  {
    id: "B4",
    name: "Obsidian Brew",
    tagline: "Stealth dark ginseng infusion",
    description: "A dark, robust herbal tea utilizing Siberian black ginseng and roasted dandelion root variables for complete stress relief.",
    primaryColor: "#475569", // Slate Dark
    secondaryColor: "#0F172A", // Midnight Blue-Gray
    theme: "obsidian",
    ingredients: ["Siberian Black Ginseng", "Roasted Dandelion Root Extract", "Deionized Spring Water"],
    benefits: ["Stress Molecule Defense", "Adrenal Restoration"],
    nutrients: {
      energy: "0 kcal",
      caffeine: "30 mg",
      sparkle: "Zero Fizz",
      aiOptimization: "95.5%"
    },
    imageUrl: "/src/assets/images/obsidian_brew_can_1782106122934.jpg"
  },

  // --- ROW C: PERFORMANCE NOOTROPIC SNACKS & CUSTOM SYNTH ---
  {
    id: "C1",
    name: "Quantum Protein Bar",
    tagline: "Adaptogenic performance fudge bar",
    description: "A luxury performance fudge core infused with cognitive-boosting adaptogens, raw Himalayan sea salt, and smart organic fibers to maximize gut flora wellness.",
    primaryColor: "#3B82F6", // Power Blue
    secondaryColor: "#1E3A8A", // Deep Navy
    theme: "cyberpunk-snack",
    ingredients: ["Organic Dark Chocolate", "Himalayan Sea Salt Crystals", "Cordyceps Adaptogens", "Whey Peptide Concentrate"],
    benefits: ["+32% Muscular Endurance", "Immediate Satiety Stabilization"],
    nutrients: {
      energy: "185 kcal",
      caffeine: "30 mg",
      sparkle: "Solid Crunch",
      aiOptimization: "96.5%"
    },
    imageUrl: "/src/assets/images/quantum_protein_bar_1782106575570.jpg"
  },
  {
    id: "C2",
    name: "Cyber Matcha Wafers",
    tagline: "Kyoto green tea biscuit crisps",
    description: "Multi-layered crispy wheat wafer wafers loaded with active matcha cream and calming amino acids for balanced crunching.",
    primaryColor: "#10B981", // Matcha Green
    secondaryColor: "#065F46", // Dark Jade
    theme: "naturalist-snack",
    ingredients: ["Stone-Ground Kyoto Matcha", "Calming Amino Peptide", "Organic Cane Crystals", "Whole Wheat Wafer Sheets"],
    benefits: ["Calm Focused Nibbling", "Antioxidant Protective Factors"],
    nutrients: {
      energy: "90 kcal",
      caffeine: "25 mg",
      sparkle: "Crisp Wafer",
      aiOptimization: "94.0%"
    },
    imageUrl: "/src/assets/images/cyber_matcha_wafers_1782106592373.jpg"
  },
  {
    id: "C3",
    name: "Astro Berry Gummies",
    tagline: "Immunology stellar berry drops",
    description: "Sweet, chewy botanical elderberry jellies fortified with active organic honey factors and trace melatonin to ease mental tension.",
    primaryColor: "#A855F7", // Purple Wave
    secondaryColor: "#4C1D95", // Deep Velvet
    theme: "cosmic-snack",
    ingredients: ["Active Elderberry Extract", "Huckleberry Juice", "Siberian Honey Solids", "Immunology Beta-Glucans"],
    benefits: ["Cellular Stress Absorption", "Calm Circadian Rest"],
    nutrients: {
      energy: "25 kcal",
      caffeine: "0 mg",
      sparkle: "Soft Chewy",
      aiOptimization: "98.2%"
    },
    imageUrl: "/src/assets/images/astro_berry_gummies_1782106610315.jpg"
  },
  {
    id: "C4",
    name: "Neural Pulse Crisps",
    tagline: "Spicy synaptogenetic crunch",
    description: "Crisp, air-puffed active protein chips loaded with natural synaptogenetic active complexes, mild wasabi fire, and vitamin B12 for explosive thinking blocks.",
    primaryColor: "#F97316", // Power Orange Accent
    secondaryColor: "#B91C1C", // Deep Crimson
    theme: "cyberpunk-snack",
    ingredients: ["Dehydrated Potato Flakes", "Active Cyanocobalamin (B12)", "Wasabi Rhizome Mustard Extract", "L-Tyrosine Cognitive Complex"],
    benefits: ["+40% Syntactical Splicing Speed", "Somatic Temperature Elevation"],
    nutrients: {
      energy: "110 kcal",
      caffeine: "0 mg",
      sparkle: "Spicy Crunch",
      aiOptimization: "97.8%"
    },
    imageUrl: "/src/assets/images/neural_pulse_crisps_1782109561910.jpg"
  }
];

export interface NeuralNode {
  id: string;
  name: string;
  chemical: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  prompt: string;
}

export const NEURAL_NODES: NeuralNode[] = [
  {
    id: "node-1",
    name: "Focus Blast",
    chemical: "α-GPC + L-Theanine",
    x: 25,
    y: 20,
    color: "#3B82F6", // Power blue
    prompt: "A neon blue high-focus elixir flavored with mountain blueberries, loaded with 150mg of L-Theanine and 300mg of Alpha-GPC to enter a state of immaculate coding productivity."
  },
  {
    id: "node-2",
    name: "Somatic Calm",
    chemical: "Lavender + Magnesium",
    x: 75,
    y: 25,
    color: "#A855F7", // Purple Wave
    prompt: "An atmospheric lavender-infused calm tea, structured with active Magnesium Glycinate and chamomile molecules to relax tense muscles and quiet brain jitters instantly."
  },
  {
    id: "node-3",
    name: "Muscular Surge",
    chemical: "Nitrates + Taurine",
    x: 18,
    y: 65,
    color: "#EF4444", // Energy Red
    prompt: "A tart blood-orange physical battery fluid loaded with natural beets, taurine, and nitrates to accelerate oxygen delivery and support dynamic endurance spikes."
  },
  {
    id: "node-4",
    name: "Circadian Rest",
    chemical: "Melatonin + Ashwagandha",
    x: 50,
    y: 80,
    color: "#06B6D4", // Cyan
    prompt: "A cryo-chilled blackberry adaptogen cloud, blended with organic honey, melatonin micro-doses, and ashwagandha extract to settle your nervous system for perfect sleep preparation."
  },
  {
    id: "node-5",
    name: "Tangerine Shock",
    chemical: "Vitamin C + Ginseng",
    x: 82,
    y: 70,
    color: "#F97316", // Tangerine Orange
    prompt: "An explosive, sparkling double-shot tangerine blast, loaded with 1000mg of Vitamin C and Siberian Ginseng root to instantly shock daytime fatigue away."
  }
];

export interface LifestylePersona {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
  formulation: string;
  tagColor: string;
  metrics: {
    label: string;
    value: number; // percentage
    color: string;
  }[];
  beverageName: string;
  beveragePrompt: string;
}

export const LIFESTYLE_PERSONAS: LifestylePersona[] = [
  {
    id: "persona-1",
    name: "Sanjay Praveen",
    role: "Senior Software Engineer",
    quote: "The clean focus-enhancing carbonation burst keeps my fluid concentration peak-optimized during late-night refactoring blocks without any caffeine jitters.",
    image: "/src/assets/images/people_drinking_cola_1782106056863.jpg",
    formulation: "COGNITIVE COLA & NOOTROPICS",
    tagColor: "#3B82F6", // Blue
    metrics: [
      { label: "Alpha-GPC Focus Core", value: 95, color: "bg-blue-500" },
      { label: "L-Theanine Quiet Waves", value: 80, color: "bg-indigo-400" },
      { label: "Hydration Balance Factors", value: 65, color: "bg-cyan-400" },
    ],
    beverageName: "Focus Blast Cola",
    beveragePrompt: "A carbonated, sugar-free cognitive cola infused with 150mg of L-Theanine, 300mg of Alpha-GPC, and organic ginseng for supreme typing endurance and absolute mental clarity."
  },
  {
    id: "persona-2",
    name: "Dr. Clara Mercer",
    role: "Bio-Medical Researcher",
    quote: "Somatic Calm blends lavender and high-absorption magnesium glycinate molecules to quiet deep cognitive load and restore tight neural fatigue post-brainstorm.",
    image: "/src/assets/images/person_drinking_tea_1782106077840.jpg",
    formulation: "ZEN BOTANICAL & MAGNESIUM MESH",
    tagColor: "#10B981", // Emerald Green
    metrics: [
      { label: "Somatic Muscular Calm", value: 90, color: "bg-emerald-500" },
      { label: "Chamomile & Lavender Relax", value: 85, color: "bg-teal-400" },
      { label: "Deep Adaptogens Intake", value: 72, color: "bg-green-400" },
    ],
    beverageName: "Somatic Zen Matcha",
    beveragePrompt: "A premium steamed stone-ground matcha tea infused with lavender oil extras, chamomile botanical extracts, and active Magnesium Glycinate to instantly relax somatic systems."
  },
  {
    id: "persona-3",
    name: "Yuki Takahashi",
    role: "Endurance Athlete & Flow Yogi",
    quote: "Sparkling Tangerine Shock gives me an authentic surge of physical vitality. The natural citric nitrates and Siberian Ginseng are perfect for immediate muscle endurance.",
    image: "/src/assets/images/person_drinking_juice_1782108692202.jpg",
    formulation: "SPARKLING TANGERINE NITRO VITAMINS",
    tagColor: "#F97316", // Orange
    metrics: [
      { label: "Citric Nitrates Endurance", value: 88, color: "bg-orange-500" },
      { label: "Vitamin C Shock & Ginseng", value: 92, color: "bg-amber-400" },
      { label: "Taurine Cellular Battery", value: 78, color: "bg-red-400" },
    ],
    beverageName: "Tangerine Surge Juice",
    beveragePrompt: "An sparkling organic tangerine and cold-pressed citrus juice power booster containing 1000mg of fresh vitamin C, Siberian ginseng root, and physical Taurine salts."
  }
];

const hexToRgb = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "45, 212, 191"; // fallback: 45, 212, 191 (teal)
};

export default function App() {
  // Theme Personalization States
  const [primaryAccent, setPrimaryAccent] = useState<string>("#2DD4BF"); // Default is Premium Cyber Teal (#2DD4BF)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState<boolean>(false);

  // Audio Virtual Synthesizer States
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(false);
  const [ambientFreq, setAmbientFreq] = useState<number>(55); // Default 55 Hz

  // Upper navigation view state
  const [activeView, setActiveView] = useState<
    "catalog" | "customizer" | "calculator" | "sandbox" |
    "ai-recommend" | "ar-preview" | "cases" | "reviews" | "video-demo" | "wishlist"
  >("catalog");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const handleToggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const [selectedConfigMachine, setSelectedConfigMachine] = useState<any>(null);
  const [quoteTargetMachine, setQuoteTargetMachine] = useState<any>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);

  // Main Vending Platform States
  const [slots, setSlots] = useState<VendingSlot[]>([]);
  const [credit, setCredit] = useState<number>(0.00);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [dispensingSlot, setDispensingSlot] = useState<string | null>(null);
  const [dispensedBeverage, setDispensedBeverage] = useState<Beverage | null>(null);
  const [lcdMessage, setLcdMessage] = useState<string>("INSERT COIN OR DIAL SLOT TO DISPENSE");
  const [canDispenseState, setCanDispenseState] = useState<"idle" | "dispensing" | "ready-to-collect">("idle");
  const [viewingBeverage, setViewingBeverage] = useState<Beverage | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<string>("persona-1");

  // Dynamic customization form variables
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [customDrinkPreview, setCustomDrinkPreview] = useState<Beverage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Vending Operational Logs
  const [operationsLog, setOperationsLog] = useState<VendingOperation[]>([
    {
      id: "op-1",
      timestamp: "10:02:40",
      type: "refill",
      message: "Pre-cooling activated. Temperature stabilized at -2.3°C",
      status: "success"
    },
    {
      id: "op-2",
      timestamp: "10:02:42",
      type: "refill",
      message: "Initialized Smart Vending slots A1-C4. Slots active.",
      status: "success"
    }
  ]);

  // Scroll metrics trackers for parallax / 3D tilt effects
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // As the user scrolls, the Vending Machine marginally changes position and rotates to maintain an ultra-premium dynamic feel
  const machineY = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0, 15, -15, 0]);
  const machineRotate = useTransform(scrollYProgress, [0, 0.5, 1], [3, -5, 4]);

  // Seed standard slots on startup
  useEffect(() => {
    const initializedSlots: VendingSlot[] = [];
    const idList = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"];

    idList.forEach((slotId) => {
      const preset = PRESET_DRINKS.find((p) => p.id === slotId) || null;
      initializedSlots.push({
        slotId,
        beverage: preset,
        // All presets (including snacks) start with a full inventory stock of 5
        stock: preset ? 5 : 0
      });
    });
    setSlots(initializedSlots);
  }, []);

  // Pre-load wishlist from URL query parameters on start
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wishlistParam = params.get("wishlist");
    if (wishlistParam) {
      const ids = wishlistParam.split(",").filter((id) => id.trim() !== "");
      if (ids.length > 0) {
        setWishlistIds(ids);
        setActiveView("wishlist");
      }
    }
    const langParam = params.get("lang");
    if (langParam === "en" || langParam === "ta" || langParam === "hi" || langParam === "ar") {
      setLanguage(langParam as LanguageCode);
    }
  }, []);

  // Handle dynamically tuning the ambient noise synthesizer engine
  useEffect(() => {
    if (isAmbientOn) {
      startAmbientHum(ambientFreq);
    } else {
      stopAmbientHum();
    }
  }, [isAmbientOn]);

  useEffect(() => {
    if (isAmbientOn) {
      updateAmbientHumFreq(ambientFreq);
    }
  }, [ambientFreq, isAmbientOn]);

  useEffect(() => {
    return () => {
      stopAmbientHum();
    };
  }, []);

  // System timestamp function helper
  const getLogTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(" ")[0];
  };

  const addLogMessage = (type: "dispense" | "mix" | "refill" | "synth", message: string, status: "success" | "pending" | "error" = "success") => {
    const randomHex = Math.random().toString(36).substring(2, 9);
    const newOp: VendingOperation = {
      id: `op-${Date.now()}-${randomHex}`,
      timestamp: getLogTimestamp(),
      type,
      message,
      status
    };
    setOperationsLog((prev) => [newOp, ...prev.slice(0, 15)]);
  };

  // 1. Insert Cash coin simulation handler
  const handleInsertCoin = () => {
    if (canDispenseState !== "idle") return;
    setCredit((val) => val + 1.50);
    setLcdMessage("CREDIT DEPOSITED: $1.50. SELECT SLOT CODE.");
    addLogMessage("refill", "Inserted $1.50 coin credit via physical slot", "success");
  };

  // 2. Select slot to dispense beverage
  const handleSelectSlot = (slotIdCode: string) => {
    if (canDispenseState !== "idle") return;
    const slotId = slotIdCode.toUpperCase();

    // Support secret codes S7 and P9 dynamically
    if (slotId === "S7" || slotId === "P9") {
      // Cost requirement $1.50
      if (credit < 1.50) {
        setLcdMessage(`INSUFFICIENT CREDIT. SECURE SLOT ${slotId} COSTS $1.50.`);
        addLogMessage("dispense", `Secure terminal slot ${slotId} request rejected: cash credit low`, "error");
        return;
      }

      const secretBeverage: Beverage = slotId === "S7" ? {
        id: "S7",
        name: "Phoenix Fire Elixir",
        tagline: "High-Caliber Neon Brew",
        description: "A fiery red-hot cinnamon and wild dragonfruit soda designed to amplify sensory processing precision and speed. Glows with continuous amber power core.",
        primaryColor: "#EF4444",
        secondaryColor: "#F59E0B",
        theme: "cyberpunk",
        ingredients: ["Micro-dosed Capsaicin Isomer", "Neon Dragonfruit Extract", "Serrated Mint Essence"],
        benefits: ["+80% Reflex Cognitive Speed", "Somatic Temperature Elevation"],
        nutrients: {
          energy: "15 kcal",
          caffeine: "150 mg",
          sparkle: "Fiery Fizz",
          aiOptimization: "99.2%"
        }
      } : {
        id: "P9",
        name: "Chrono Star Crunch",
        tagline: "Zero-Gravity Quantum Wafer",
        description: "An airy cosmic space snack seasoned with physical stardust sugar crystals that slow down perceived flow of temporal dimensions inside the room.",
        primaryColor: "#EAB308",
        secondaryColor: "#3B82F6",
        theme: "chrome-luxe",
        ingredients: ["Aerated Wheat Starch Matrix", "Stardust Sugar Crystals", "L-Theanine Neuroprotection"],
        benefits: ["+65% Perceived Time Dilation", "Zero-G Somatic Satiety"],
        nutrients: {
          energy: "120 kcal",
          caffeine: "0 mg",
          sparkle: "Zero Sparkle",
          aiOptimization: "98.5%"
        }
      };

      // Proceed with dispensation override
      setSelectedSlotId(slotId);
      setDispensingSlot(slotId);
      setCanDispenseState("dispensing");
      setCredit((val) => val - 1.50);
      setLcdMessage(`DECRYPTING [${slotId}]... SYSTEM OVERRIDE ACTIVE.`);
      addLogMessage("dispense", `Secure code input decrypted. Dispensing premium compound: ${secretBeverage.name}`, "pending");

      setTimeout(() => {
        setCanDispenseState("ready-to-collect");
        setDispensingSlot(null);
        setDispensedBeverage(secretBeverage);
        setLcdMessage(`SUCCESS! [${slotId}] DISPENSED. DRINK/EAT IN REAL-TIME.`);
        setSelectedSlotId(null);
        addLogMessage("dispense", `Dropped premium formulation ${secretBeverage.name} safely into collection bay.`, "success");
      }, 1.8 * 1000);
      return;
    }

    const matchedSlot = slots.find((s) => s.slotId === slotId);
    if (!matchedSlot) {
      setLcdMessage(`INVALID SLOT [${slotId}] - SELECT A1 TO C4`);
      return;
    }

    if (matchedSlot.stock === 0 || !matchedSlot.beverage) {
      setLcdMessage(`SLOT [${slotId}] IS VACANT - USE AI FORM`);
      addLogMessage("dispense", `Failed to dispense slot ${slotId} - slot vacant`, "error");
      return;
    }

    // Cost requirement $1.50 per drink
    if (credit < 1.50) {
      setLcdMessage(`INSUFFICIENT CREDIT. A1-C4 COSTS $1.50.`);
      addLogMessage("dispense", `Failed to dispense ${matchedSlot.beverage.name} - cash credit too low`, "error");
      
      // Auto pulse slot helper hint UI to direct user
      setSelectedSlotId(slotId);
      setTimeout(() => setSelectedSlotId(null), 1500);
      return;
    }

    // Initiate automatic dispensing sequentials
    setSelectedSlotId(slotId);
    setDispensingSlot(slotId);
    setCanDispenseState("dispensing");
    setCredit((val) => val - 1.50);
    setLcdMessage(`DISPENSING [${slotId}]: ${matchedSlot.beverage.name}...`);
    addLogMessage("dispense", `Initiated robotic dispenser for slot ${slotId} (${matchedSlot.beverage.name})`, "pending");

    // After 1.8 seconds of robotic "clanking & drops", dispense completion
    setTimeout(() => {
      setCanDispenseState("ready-to-collect");
      setDispensingSlot(null);
      setDispensedBeverage(matchedSlot.beverage);
      setLcdMessage("DISPENSE COMPLETE! RETRIEVE CAN AT BOTTOM TRAY.");

      // Deduct stocking quantity from React state
      setSlots((prevSlots) =>
        prevSlots.map((s) =>
          s.slotId === slotId ? { ...s, stock: Math.max(0, s.stock - 1) } : s
        )
      );

      setSelectedSlotId(null);
      addLogMessage("dispense", `Successfully dropped ${matchedSlot.beverage?.name} into the lower collection lock.`, "success");
    }, 1800);
  };

  // 3. Collect/retrieve physical dispensed drink can
  const handleCollectBeverage = () => {
    if (canDispenseState !== "ready-to-collect" || !dispensedBeverage) return;

    setViewingBeverage(dispensedBeverage);
    setCanDispenseState("idle");
    setDispensedBeverage(null);
    setLcdMessage("CAN ENJOYED. ACTIVE NODES STILL MONITORING COLD FEED.");
    addLogMessage("dispense", "Customer retrieved physical beverage can from dispense drawer", "success");
  };

  // Record a virtual sip action inside the Closeup Can modal
  const handleRecordSip = () => {
    addLogMessage("synth", "Registered micro-sampling ingestion wave. Micro-taste logged.", "success");
  };

  // 4. Request dynamic beverage formulation via Express API (Gemini Powered)
  const handleSynthesizeBeverage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsSynthesizing(true);
    setErrorMsg(null);
    setLcdMessage("AI CONTACTING MOLECULAR RECIPE SYNAPSE...");
    addLogMessage("synth", `Transmitting prompt variables to Gemini 3.5: "${customPrompt}"`, "pending");

    try {
      const response = await fetch("/api/vending/generate-drink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: customPrompt }),
      });

      const data = await response.json();
      if (!data.success || !data.drink) {
        throw new Error(data.error || "Failed to compile custom properties.");
      }

      const compiledDrink: Beverage = {
        ...data.drink,
        id: "C4", // Always mount synthesized models on Slot C4
        isCustom: true,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(data.drink.name || "custom")}/600/800`,
      };

      // Set slot C4 custom beverage stock to 3, and load details
      setSlots((prev) =>
        prev.map((s) =>
          s.slotId === "C4"
            ? { ...s, beverage: compiledDrink, stock: 3 }
            : s
        )
      );

      setCustomDrinkPreview(compiledDrink);
      setLcdMessage(`FORMULATION FINISHED! SLOT [C4] CONFIGURED.`);
      addLogMessage("synth", `Gemini synthesized beverage "${compiledDrink.name}" successful. Mounted on slot C4.`, "success");
      setCustomPrompt("");

      // Automatically trigger a purchase sequence for Slot C4 if credit is already loaded
      // Else, prompt the user to load credits
      if (credit >= 1.50) {
        setTimeout(() => {
          handleSelectSlot("C4");
        }, 1200);
      } else {
        setLcdMessage("SLOT [C4] LOADED. INSERT $1.50 COIN TO AUTO-DISPENSE.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Synthesizer failed. Check API key configurations.");
      setLcdMessage("SYNTHESIS TIMEOUT - SYNAPSE API OFFLINE_");
      addLogMessage("synth", `Synthesizer integration failed: ${err.message || err}`, "error");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const rbgVal = hexToRgb(primaryAccent);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#050508] text-slate-100 flex flex-col font-sans relative antialiased overflow-hidden"
      style={{
        "--theme-accent": primaryAccent,
        "--theme-accent-rgb": rbgVal
      } as React.CSSProperties}
    >
      <style>{`
        :root {
          --theme-accent: ${primaryAccent};
          --theme-accent-rgb: ${rbgVal};
        }
        
        .frosted-glass-accent {
          border-color: rgba(${rbgVal}, 0.12) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45), 0 0 25px rgba(${rbgVal}, 0.02) !important;
          transition: all 0.3s ease;
        }
        
        .frosted-glass-accent:hover {
          border-color: rgba(${rbgVal}, 0.32) !important;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.65), 0 0 35px rgba(${rbgVal}, 0.08) !important;
        }

        .text-accent-dynamic {
          color: ${primaryAccent} !important;
        }
        
        .bg-accent-dynamic {
          background-color: ${primaryAccent} !important;
        }
        
        .bg-accent-dynamic-10 {
          background-color: rgba(${rbgVal}, 0.1) !important;
        }

        .border-accent-dynamic {
          border-color: ${primaryAccent} !important;
        }
        
        .border-accent-dynamic-20 {
          border-color: rgba(${rbgVal}, 0.2) !important;
        }

        .shadow-accent-dynamic {
          box-shadow: 0 0 20px rgba(${rbgVal}, 0.3) !important;
        }
      `}</style>
      
      {/* Decorative Background Blobs for the Frosted Glass Theme */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[40%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Atmospheric grid backdrop layers */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e24_1px,transparent_1px),linear-gradient(to_bottom,#1e1e24_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

      {/* --- STICKY NAVIGATION BAR (Glassmorphic) --- */}
      <header className="sticky top-0 z-50 bg-white/[0.02] backdrop-blur-xl border-b border-white/10 transition-all w-full frosted-glass-accent">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 bg-accent-dynamic rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-accent-dynamic">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight uppercase leading-none text-white">
                AURA<span className="text-accent-dynamic underline decoration-2 underline-offset-4">VEND</span>
              </span>
              <span className="text-[9px] font-mono text-white/40 tracking-widest mt-1 uppercase">Aura Intelligent Node</span>
            </div>
          </div>

          {/* Nav Links - Desktop / Interactive Tabs */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-bold text-white/70 uppercase tracking-wider">
            <button
              onClick={() => setActiveView("catalog")}
              className={`pb-1 transition-colors border-b-2 hover:text-white cursor-pointer ${
                activeView === "catalog" ? "text-teal-400 border-teal-400 font-extrabold" : "border-transparent text-white/70"
              }`}
            >
              Machine Catalog
            </button>
            <button
              onClick={() => setActiveView("customizer")}
              className={`pb-1 transition-colors border-b-2 hover:text-white cursor-pointer ${
                activeView === "customizer" ? "text-teal-400 border-teal-400 font-extrabold" : "border-transparent text-white/70"
              }`}
            >
              Customizer Studio
            </button>
            <button
              onClick={() => setActiveView("calculator")}
              className={`pb-1 transition-colors border-b-2 hover:text-white cursor-pointer ${
                activeView === "calculator" ? "text-teal-400 border-teal-400 font-extrabold" : "border-transparent text-white/70"
              }`}
            >
              Lease Rate Calculator
            </button>
            <button
              onClick={() => setActiveView("sandbox")}
              className={`pb-1 transition-colors border-b-2 hover:text-white cursor-pointer ${
                activeView === "sandbox" ? "text-teal-400 border-teal-400 font-extrabold" : "border-transparent text-white/70"
              }`}
            >
              Dispenser Sandbox
            </button>
          </nav>

          {/* Direct CTA */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-2xl p-1 shrink-0">
              {(["en", "ta", "hi", "ar"] as LanguageCode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-mono leading-none font-bold uppercase transition-all ${
                    language === lang
                      ? "bg-emerald-400 text-slate-950 font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setQuoteTargetMachine(null);
                setIsQuoteOpen(true);
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all hover:opacity-90 cursor-pointer shadow-md animate-pulse"
            >
              Inquire Quote
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Tab Selector */}
      <div className="md:hidden sticky top-20 z-40 bg-slate-950/85 border-b border-white/5 py-3 px-4 flex gap-2 overflow-x-auto scrollbar-none w-full backdrop-blur-md">
        {[
          { id: "catalog", label: "Catalog" },
          { id: "customizer", label: "Customizer" },
          { id: "calculator", label: "Calculator" },
          { id: "sandbox", label: "Sandbox" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeView === tab.id
                ? "bg-teal-400 text-slate-950 font-extrabold"
                : "bg-white/5 text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- CORE MASTER CONTENT SECTION --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10 space-y-8">
        
        {/* --- PREMIUM B2B COCKPIT DECK (Horizontal Scroll Selector) --- */}
        <div className="flex overflow-x-auto gap-2 pb-4 border-b border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {[
            { id: "catalog", label: "Catalog" },
            { id: "ai-recommend", label: "AI Recommendation" },
            { id: "ar-preview", label: "AR Spatial Preview" },
            { id: "calculator", label: "ROI Calculator" },
            { id: "customizer", label: "Branding Studio" },
            { id: "cases", label: "Success Stories" },
            { id: "video-demo", label: "Telemetry Demos" },
            { id: "reviews", label: "Client Reviews" },
            { id: "wishlist", label: `Wishlist (${wishlistIds.length})` },
            { id: "sandbox", label: "Live Sandbox" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-[10px] font-mono font-extrabold uppercase tracking-widest whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                activeView === tab.id
                  ? "bg-emerald-400 text-slate-950 border-emerald-300 font-extrabold shadow-lg shadow-emerald-400/20"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeView !== "sandbox" ? (
          <div className="w-full">
            <AnimatePresence mode="wait">
              {activeView === "catalog" && (
                <motion.div
                  key="catalog"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <MachineCatalog
                    onSelectConfigure={(machine) => {
                      setSelectedConfigMachine(machine);
                      setActiveView("customizer");
                    }}
                    onRequestQuote={(machine) => {
                      setQuoteTargetMachine(machine);
                      setIsQuoteOpen(true);
                    }}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </motion.div>
              )}

              {activeView === "customizer" && (
                <motion.div
                  key="customizer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <MachineCustomizerPreview 
                    initialMachine={selectedConfigMachine || undefined} 
                    onModelChange={(machine) => setSelectedConfigMachine(machine)}
                  />
                </motion.div>
              )}

              {activeView === "calculator" && (
                <motion.div
                  key="calculator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <CostCalculator language={language} />
                </motion.div>
              )}

              {activeView === "ai-recommend" && (
                <motion.div
                  key="ai-recommend"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <AIRecommendation
                    language={language}
                    onSelectConfigure={(machine) => {
                      setSelectedConfigMachine(machine);
                      setActiveView("customizer");
                    }}
                    onRequestQuote={(machine) => {
                      setQuoteTargetMachine(machine);
                      setIsQuoteOpen(true);
                    }}
                  />
                </motion.div>
              )}

              {activeView === "ar-preview" && (
                <motion.div
                  key="ar-preview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <ARPreview language={language} />
                </motion.div>
              )}

              {activeView === "cases" && (
                <motion.div
                  key="cases"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <IndustryCases language={language} />
                </motion.div>
              )}

              {activeView === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <CustomerReviews language={language} />
                </motion.div>
              )}

              {activeView === "video-demo" && (
                <motion.div
                  key="video-demo"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <VideoDemo language={language} />
                </motion.div>
              )}

              {activeView === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                >
                  <WishlistManager
                    language={language}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectConfigure={(machine) => {
                      setSelectedConfigMachine(machine);
                      setActiveView("customizer");
                    }}
                    onGoToCatalog={() => setActiveView("catalog")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* LEFT COLUMN: FLOATING STICKY VENDING MACHINE DEVICE SIMULATOR (5 / 12 col) */}
            <div id="vending-physical-simulation" className="md:col-span-12 lg:col-span-5 lg:sticky lg:top-24 h-fit flex flex-col justify-center items-center w-full">
          <motion.div
            style={{
              y: machineY,
              rotateZ: machineRotate
            }}
            className="w-full max-w-[430px]"
          >
            {/* Vending machine controller panel component */}
            <VendingMachine
              slots={slots}
              onSelectSlot={handleSelectSlot}
              onInsertCoin={handleInsertCoin}
              onCollectBeverage={handleCollectBeverage}
              credit={credit}
              dispensingSlot={dispensingSlot}
              dispensedBeverage={dispensedBeverage}
              lcdMessage={lcdMessage}
              operationsLog={operationsLog}
              activeSlotId={selectedSlotId}
              canDispenseState={canDispenseState}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              currentMachineId={selectedConfigMachine?.id || "snack-visivibe"}
            />
          </motion.div>          {/* Instruction bubble under floating device */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl w-full max-w-[360px] text-center text-[10px] font-mono text-slate-400 flex items-center justify-center gap-2"
          >
            <Info className="h-4 w-4 text-accent-dynamic shrink-0" />
            <span>Click coin physical slot to add $1.50 credit, then press slots or type digits on keypad!</span>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: SCROLLING STORY ELEMENTS & AI INTERACTIVE ENGINE (7 / 12 col) */}
        <div className="md:col-span-12 lg:col-span-7 flex flex-col gap-12 lg:gap-16">
          
          {/* A. HERO HEADING PANEL & INTERNSHIP MISSION */}
          <section className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-8 relative overflow-hidden shadow-2xl frosted-glass-accent">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-blue-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-7 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent-dynamic-10 border border-accent-dynamic-20 text-accent-dynamic text-xs font-bold uppercase tracking-[0.2em]">
                      Next Gen Retail Ecosystem
                    </span>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-mono uppercase tracking-widest">
                      Praveen • Day 3 Node
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.95] tracking-tight text-white select-none">
                    Redefining <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                      Automated Space.
                    </span>
                  </h1>
                </div>

                <p className="text-white/50 text-xs sm:text-sm lg:text-base max-w-xl font-light leading-relaxed">
                  Leverage deep-learning algorithms to optimize inventory, predict demand, and deliver personalized user journeys at the touch of a screen. Today's project features a real-time molecular recipe configuration using Gemini AI models.
                </p>

                {/* Design Decisions Highlights */}
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 space-y-3 backdrop-blur-md">
                   <h3 className="text-[10px] font-bold text-accent-dynamic uppercase tracking-[0.2em] flex items-center gap-2">
                    <Compass className="h-3.5 w-3.5 text-accent-dynamic" />
                    Integrated Platform Improvements
                  </h3>
                  <ul className="text-[11px] text-white/60 font-light space-y-2.5">
                    <li className="flex gap-2.5 items-start">
                      <span className="text-accent-dynamic font-bold">✔</span>
                      <span><strong>Minimalist Visual Purity:</strong> Complete glassmorphism layout, incorporating floating ambient back blur layers and dynamic mouse tilt responsive elements.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-accent-dynamic font-bold">✔</span>
                      <span><strong>Interactive Cognitive Mesh:</strong> Run custom molecular recipes by clicking nodes on our AI Neural Map to pre-load targets directly into the synthesizer.</span>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-accent-dynamic font-bold">✔</span>
                      <span><strong>Close-Up Molecular Specs:</strong> Take bites/sips on our full-screen Can Visualizer, supporting custom physical textures for liquid drinks and crunchy snacks.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  <a
                    href="#ai-synthesis-lab"
                    className="cursor-pointer px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-2"
                  >
                    Explore Fleet
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#telemetry-control-center"
                    className="cursor-pointer px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Partner Portal
                  </a>
                </div>
              </div>

              {/* Creative AI-inspired content & visuals on the right side */}
              <div className="xl:col-span-5 flex flex-col bg-[#050508]/50 border border-white/5 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md shadow-inner h-[320px] justify-between w-full">
                <div className="flex justify-between items-center pb-2 border-b border-white/5 w-full z-10">
                  <span className="text-[10px] font-mono tracking-wider text-purple-400 uppercase font-extrabold flex items-center gap-1.5 animate-pulse">
                    <Network className="h-3.5 w-3.5 text-purple-400" />
                    AI Neural flavor Map
                  </span>
                  <span className="text-[8px] font-mono text-white/30 uppercase">SYS SYNAPSE ACTIVATED</span>
                </div>

                {/* Ambient glowing connection graph */}
                <div className="absolute inset-0 top-10 flex items-center justify-center p-2">
                  {/* SVG connection lines linking satellites to center */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    {NEURAL_NODES.map((node) => (
                      <motion.line
                        key={`line-${node.id}`}
                        x1="50%"
                        y1="48%"
                        x2={`${node.x}%`}
                        y2={`${node.y}%`}
                        stroke={selectedNodeId === node.id ? node.color : "rgba(255, 255, 255, 0.08)"}
                        strokeWidth={selectedNodeId === node.id ? "2" : "1"}
                        strokeDasharray={selectedNodeId === node.id ? "4 2" : "none"}
                        animate={selectedNodeId === node.id ? { strokeDashoffset: [0, -20] } : {}}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                    ))}
                  </svg>

                  {/* Central core node: Gemini Core */}
                  <div className="absolute left-[50%] top-[48%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          "0 0 15px rgba(168, 85, 247, 0.4)",
                          "0 0 25px rgba(168, 85, 247, 0.7)",
                          "0 0 15px rgba(168, 85, 247, 0.4)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 border border-white/20 flex items-center justify-center shadow-lg relative cursor-default"
                    >
                      <Brain className="h-5 w-5 text-white animate-pulse" />
                      <span className="absolute -inset-1 rounded-full border border-purple-500/30 animate-ping opacity-45 pointer-events-none" />
                    </motion.div>
                    <span className="text-[7px] font-mono text-purple-400 font-black tracking-widest uppercase mt-1">CORE 3.5</span>
                  </div>

                  {/* Satellite nodes */}
                  {NEURAL_NODES.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <motion.button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setCustomPrompt(node.prompt);
                          setLcdMessage(`COHESION MESH: ${node.name.toUpperCase()} PRE-LOADED_`);
                          addLogMessage(
                            "synth",
                            `Loaded recipe prompt for ${node.name} (${node.chemical}) via Neural Map. Ready to synthesize.`,
                            "success"
                          );
                        }}
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                        }}
                        whileHover={{ scale: 1.2 }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer flex flex-col items-center"
                      >
                        {/* Pulsating core dot */}
                        <div
                          style={{
                            backgroundColor: node.color,
                            boxShadow: isSelected
                              ? `0 0 12px ${node.color}`
                              : `0 0 6px ${node.color}50`
                          }}
                          className={`w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center transition-all ${
                            isSelected ? "scale-110" : "scale-100 group-hover:scale-110"
                          }`}
                        >
                          {isSelected && <div className="w-1 h-1 bg-white rounded-full" />}
                        </div>
                        
                        {/* Tooltip detail tag */}
                        <div className="absolute top-4 scale-0 group-hover:scale-100 transition-transform origin-top z-40 bg-slate-950/95 border border-white/10 rounded-lg py-1 px-2 text-[8px] font-mono text-white text-center shadow-2xl pointer-events-none w-24">
                          <span className="font-bold text-white block truncate">{node.name}</span>
                          <span className="text-white/40 block mt-0.5 truncate">{node.chemical}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Active node presentation */}
                <div className="z-10 bg-[#050508]/80 border border-white/5 rounded-xl p-2 w-full text-center mt-auto min-h-12 flex flex-col justify-center">
                  {selectedNodeId ? (
                    <>
                      <span className="text-[8px] font-mono text-purple-400 font-bold uppercase block tracking-wider leading-none mb-1">
                        Active Selection target
                      </span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {NEURAL_NODES.find((n) => n.id === selectedNodeId)?.name} • <strong className="font-mono text-[10px] text-white/50">{NEURAL_NODES.find((n) => n.id === selectedNodeId)?.chemical}</strong>
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] font-mono text-white/40 animate-pulse">
                      ★ Click a Satellite Node to configure deep neural flavors!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Statistical Details & Grid (From Design HTML) */}
            <div className="grid grid-cols-3 gap-10 border-t border-white/10 pt-8 mt-6 w-full">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white">99.8%</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Uptime SLA</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white">AI-DRVN</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Stock Analytics</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white">INSTANT</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Payout Tech</div>
              </div>
            </div>
          </section>

          {/* B. DYNAMIC AI MOLECULAR SYNTHESIS METER (Form Interface) */}
          <section id="ai-synthesis-lab" className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden shadow-xl frosted-glass-accent">
            {/* Aesthetic element logo line */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#A855F7]/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-[0.2em] text-accent-dynamic font-bold uppercase flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-accent-dynamic" /> Direct Gemini Compilation
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                AI Custom Beverage Constructor
              </h2>
              <p className="text-white/50 text-xs">
                Our active blending technology mixes dynamic extracts at the molecular level in real-time. Describe a flavor profile, mood, or energy requirement to synthesize a custom beverage.
              </p>
            </div>

            <form onSubmit={handleSynthesizeBeverage} className="space-y-4">
              <div className="bg-[#050508]/60 p-3 rounded-2xl border border-white/5 focus-within:border-accent-dynamic transition-all backdrop-blur-md">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Cool peppermint energy cocktail with high electrolytes and low caffeine to power a late night coding sprint..."
                  rows={3}
                  className="w-full bg-transparent text-white outline-none resize-none text-xs sm:text-sm font-medium leading-relaxed placeholder-white/20 p-1"
                />
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                  <div className="flex gap-2 text-white/40 font-mono text-[9px]">
                    <span className="bg-[#050508] px-2.5 py-1 rounded border border-white/5 uppercase">Model: Gemini 3.5 Flash</span>
                    <span className="bg-[#050508] px-2.5 py-1 rounded border border-white/5 uppercase">Output: Verified JSON</span>
                  </div>
                  <button
                    id="submit-synthesis-button"
                    type="submit"
                    disabled={isSynthesizing || !customPrompt.trim()}
                    className="cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:scale-[1.01] transition-transform text-white font-mono text-xs font-bold py-2 px-4 rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.15)] flex items-center gap-1.5"
                  >
                    {isSynthesizing ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Re-formulating Atoms...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        Synthesize can
                      </>
                    )}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-950/40 border border-rose-500/20 text-rose-350 p-3 rounded-xl text-xs font-mono flex items-start gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-450 shrink-0 mt-0.5" />
                  <div>
                    <strong>Synthesis Fault:</strong> {errorMsg}
                  </div>
                </div>
              )}
            </form>

            {/* Simulated Live status feedback if custom can exists */}
            <AnimatePresence>
              {customDrinkPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-center"
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, ${customDrinkPreview.primaryColor}, ${customDrinkPreview.secondaryColor})`,
                    }}
                    className="w-16 h-28 rounded-2xl shrink-0 flex items-center justify-center shadow-lg relative border border-white/10"
                  >
                    <div className="absolute inset-x-0 top-1 text-[4px] font-mono text-white/40 text-center">AI DESIGN</div>
                    <span className="text-[6px] font-black font-mono text-white tracking-widest uppercase rotate-90 truncate max-w-[24px]">
                      {customDrinkPreview.name}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 p-0.5">
                      <span className="text-[8px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded font-bold tracking-wider">
                        SLOT C4 RETAILER ACTIVATED
                      </span>
                      <span className="text-[8px] font-mono bg-purple-500/15 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded font-bold tracking-wider">
                        STOCK: {slots.find((s) => s.slotId === "C4")?.stock || 0} CAN UNITS
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      "{customDrinkPreview.name}" Available now!
                    </h3>
                    <p className="text-white/60 text-[11px] leading-relaxed select-none font-light">
                      {customDrinkPreview.description}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1 justify-center sm:justify-start">
                      {customDrinkPreview.benefits.map((b, i) => (
                        <span key={i} className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                          {b}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action trigger option */}
                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                      <span className="text-[10px] font-mono text-white/50">
                        Total cost: <strong className="text-white font-bold">$1.50</strong>
                      </span>
                      <button
                        onClick={() => handleSelectSlot("C4")}
                        className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold py-1.5 px-3 rounded-lg border border-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-500/10"
                      >
                        <Coins className="h-3.5 w-3.5 text-white" />
                        Purchase Custom Can Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* C. DYNAMIC TELEMETRY PERFORMANCE DASHBOARD (Live telemetry, custom stock charts) */}
          <section id="telemetry-control-center" className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden shadow-xl frosted-glass-accent">
            <div className="space-y-1">
              <span className="inline-block bg-accent-dynamic-10 border border-accent-dynamic-20 text-accent-dynamic text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-1">
                <Activity className="h-3 w-3 inline-block mr-1 align-middle animate-pulse" /> Telemetry Control Node
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Live Vending Machine Platform metrics
              </h2>
              <p className="text-white/50 text-xs font-light">
                Real-time data synchronization directly from our simulated mechanical layers to monitor carbonation loads, active chilling coefficients, and client query volume logs.
              </p>
            </div>

            {/* Custom Responsive SVG Telemetry Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Temperature & Power Gauge (SVG) */}
              <div className="bg-[#0c0c12]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-44 shadow-lg backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                  Active Cooling Temp Control
                </span>
                
                {/* SVG Gauge visualization */}
                <div className="flex items-center justify-around my-2">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" className="stroke-white/5 fill-none" strokeWidth="6" />
                      {/* Active temperature gauge showing near-freezing -2.3°C */}
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        className="fill-none"
                        style={{ stroke: "var(--theme-accent)" }}
                        strokeWidth="6"
                        strokeDasharray="201"
                        strokeDashoffset="145" // stable
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                      <span className="text-sm font-black text-accent-dynamic">-2.3°</span>
                      <span className="text-[7px] text-white/30 uppercase">Celsius</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-accent-dynamic animate-pulse" style={{ backgroundColor: "var(--theme-accent)" }} />
                      <span className="text-white/60 text-[10px]">Compressor: ON</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full opacity-70" style={{ backgroundColor: "var(--theme-accent)" }} />
                      <span className="text-white/60 text-[10px]">Fan Grid: Stable</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-400 opacity-60" />
                      <span className="text-white/60 text-[10px]">Defrost: Standby</span>
                    </div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-white/30 flex justify-between border-t border-white/5 pt-2">
                  <span>Sensor: Core Block-IV</span>
                  <span className="text-accent-dynamic">99.8% Core Safety</span>
                </div>
              </div>

              {/* Carbonation Sparkle Volume level (SVG) */}
              <div className="bg-[#0c0c12]/80 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-44 shadow-lg backdrop-blur-md">
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                  Molecular stocks Level
                </span>

                {/* Stock capacity visual bar graphics */}
                <div className="space-y-3 my-2">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                      <span>Carbonation Gasses (CO2)</span>
                      <span>84% Capacity</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-dynamic" style={{ width: "84%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                      <span>Concentrate Reserve Stocks</span>
                      <span>68% Capacity</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "68%" }} />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-white/30 flex justify-between border-t border-white/5 pt-2">
                  <span>Refill Cadence: 30 days</span>
                  <span className="text-blue-400 font-bold">Auto-Replenish ON</span>
                </div>
              </div>
            </div>

            {/* --- REAL-TIME PLATFORM TRANSACTION LOGS FEED --- */}
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-1 border-b border-white/5">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest font-bold">
                  Telemetry transaction Log Feed
                </span>
                <span className="text-[8px] font-mono text-white/30 uppercase">
                  UTC ISO-8601 Compliance
                </span>
              </div>
              
              <div className="bg-[#050508]/90 border border-white/5 rounded-2xl p-3 h-40 overflow-y-auto space-y-1.5 font-mono text-[10px] shadow-sm flex flex-col scrollbar-thin">
                {operationsLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 border-b border-white/[0.01] pb-1.5 last:border-0">
                    <span className="text-white/30 shrink-0 select-none">
                      [{log.timestamp}]
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tight uppercase shrink-0 ${
                      log.status === "success"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : log.status === "pending"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-rose-500/15 text-rose-450 border border-rose-500/20"
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-white/70 leading-normal">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* D. CONSUMER LIFESTYLE EXPERIENCES SHOWROOM */}
          <section className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden shadow-xl frosted-glass-accent">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="inline-block bg-accent-dynamic-10 border border-accent-dynamic-20 text-accent-dynamic text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-1">
                  <Users className="h-3 w-3 inline-block mr-1 align-middle" /> Experience Showroom
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Authentic Taste & Lifestyle Integrator
                </h2>
                <p className="text-white/50 text-xs font-light">
                  See how real developers, clinical researchers, and physical builders utilize our molecular formulations for supreme focus and recovery.
                </p>
              </div>

              {/* Instant selector tabs at the header */}
              <div className="flex bg-[#050508]/60 p-1 rounded-xl border border-white/5 self-start sm:self-center">
                {LIFESTYLE_PERSONAS.map((persona) => {
                  const isSelected = activePersonaId === persona.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => setActivePersonaId(persona.id)}
                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all whitespace-nowrap ${
                        isSelected
                          ? "bg-accent-dynamic-10 text-accent-dynamic border border-accent-dynamic-20 shadow-inner"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {persona.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Display Grid */}
            <div>
              {LIFESTYLE_PERSONAS.map((persona) => {
                if (persona.id !== activePersonaId) return null;
                return (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    {/* Visual Photo column with label banner */}
                    <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 shadow-2xl group w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[320px] xl:h-full min-h-[240px]">
                      <img
                        src={persona.image}
                        alt={`${persona.name} lifestyle`}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Interactive overlay tag */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[9px] font-mono font-extrabold text-[#050508] bg-white border border-white px-2 py-0.5 rounded shadow-lg uppercase tracking-wider">
                          {persona.name}
                        </span>
                        <span className="text-[8px] font-mono font-bold text-teal-300 bg-[#050508]/80 backdrop-blur-md border border-teal-500/20 px-2 py-0.5 rounded">
                          {persona.role}
                        </span>
                      </div>
                    </div>

                    {/* Molecular stats, quotes & sync controls column */}
                    <div className="lg:col-span-7 flex flex-col justify-between self-stretch space-y-6">
                      {/* Quote layout block */}
                      <div className="space-y-3">
                        <span className="text-white/20 text-4xl block leading-none font-serif">“</span>
                        <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed italic -mt-2">
                          {persona.quote}
                        </p>
                        
                        <div className="flex items-center gap-2 pt-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          <span className="text-[10px] font-mono font-extrabold tracking-wider text-teal-400 uppercase">
                            PREFERRED FLAVOR CORES: {persona.formulation}
                          </span>
                        </div>
                      </div>

                      {/* Bio-marker/Molecular Level Indicator sliders */}
                      <div className="bg-[#050508]/50 border border-white/5 rounded-2xl p-4 space-y-3.5 shadow-inner backdrop-blur-sm">
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">
                          Active formulation Bio-Response Multipliers
                        </span>
                        
                        <div className="space-y-2.5">
                          {persona.metrics.map((metric) => (
                            <div key={metric.label} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-mono text-white/70">
                                <span>{metric.label}</span>
                                <span className="font-extrabold">{metric.value}% Target saturation</span>
                              </div>
                              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`h-full rounded-full ${metric.color} shadow-lg`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Direct Recipe Synchronization module */}
                      <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-white/30 uppercase block font-bold leading-none">Preset target custom recipe</span>
                          <span className="text-xs font-bold text-white uppercase">{persona.beverageName}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setCustomPrompt(persona.beveragePrompt);
                            setLcdMessage(`VIBE INTEGRATOR: ${persona.beverageName.toUpperCase()} MOLECULAR SHAPE PRE-LOADED_`);
                            addLogMessage(
                              "synth",
                              `Injected formula registers for ${persona.beverageName} into real-time constructor. Recipe targets ready to compile.`,
                              "success"
                            );
                            document.getElementById("ai-synthesis-lab")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          style={{
                            boxShadow: `0 4px 20px ${persona.tagColor}20`
                          }}
                          className="cursor-pointer px-5 py-3 rounded-xl bg-white hover:scale-[1.01] transition-transform text-black font-mono text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-black animate-spin-slow" />
                          Compile Vibe Formula now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* D. HARDWARE SPECS ACCENT CARD */}
          <section className="bg-white/[0.01] backdrop-blur-md border border-white/5 rounded-3xl p-6 lg:p-8 space-y-4 shadow-sm frosted-glass-accent">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Code className="h-4.5 w-4.5 text-white/60" />
              Technical platform specs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-white/70">
              <div className="bg-[#0c0c12]/50 p-3.5 rounded-xl border border-white/5">
                <strong className="text-white">Device Model No:</strong> AV-4100-MOL
              </div>
              <div className="bg-[#0c0c12]/50 p-3.5 rounded-xl border border-white/5">
                <strong className="text-white">Core Refrigerant:</strong> Dynamic R600a eco-liquid
              </div>
              <div className="bg-[#0c0c12]/50 p-3.5 rounded-xl border border-white/5">
                <strong className="text-white">Payment Ingress:</strong> NFC tap, crypto, credit coin
              </div>
              <div className="bg-[#0c0c12]/50 p-3.5 rounded-xl border border-white/5">
                <strong className="text-white">Formulation API:</strong> Aura Molecular Synthesis Engine v2.4
              </div>
            </div>
          </section>

        </div>
          </div>
        )}
      </main>

      {/* --- FLOATING CLOSE-UP BEVERAGE CANVAS MODAL --- */}
      <AnimatePresence>
        {viewingBeverage && (
          <CanModal
            beverage={viewingBeverage}
            onClose={() => setViewingBeverage(null)}
            onTakeSip={handleRecordSip}
          />
        )}
      </AnimatePresence>

      {/* --- B2B CORPORATE AND CHAT OVERLAYS --- */}
      <QuoteRequestModal
        initialMachine={quoteTargetMachine}
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />
      <WhatsAppSupport />

      {/* --- FLOATING THEME ACCENT COLOR TUNER PICKER --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-mono">
        <AnimatePresence>
          {isColorMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ cubicBezier: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="bg-slate-950/95 border border-white/10 rounded-2xl p-4 w-64 shadow-2xl backdrop-blur-2xl text-left frosted-glass-accent"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
                <span className="text-[9px] font-bold text-accent-dynamic flex items-center gap-1.5 uppercase tracking-widest">
                  <Sliders className="h-3 w-3 text-accent-dynamic" /> Accent tuner freq
                </span>
                <span className="text-[8px] text-white/30 font-bold">SYSTEM v2</span>
              </div>
              
              <div className="space-y-4">
                {/* Custom system description */}
                <div className="text-[9px] text-white/50 leading-relaxed font-sans mt-1">
                  Dynamically adjust the refractive light accents across all glassmorphic components in real-time.
                </div>

                {/* Grid of professional cyberpunk high-contrast presets */}
                <div className="space-y-1.5">
                  <span className="text-[8px] text-white/40 uppercase tracking-wider block font-bold">Preset matrix nodes:</span>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { name: "Teal", val: "#2DD4BF" },
                      { name: "Blue", val: "#3B82F6" },
                      { name: "Purple", val: "#A855F7" },
                      { name: "Pink", val: "#EC4899" },
                      { name: "Orange", val: "#F97316" },
                      { name: "Green", val: "#10B981" }
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setPrimaryAccent(item.val)}
                        style={{ backgroundColor: item.val }}
                        title={item.name}
                        className={`cursor-pointer w-6 h-6 rounded-full relative transition-transform hover:scale-125 focus:outline-none flex items-center justify-center ${
                          primaryAccent.toLowerCase() === item.val.toLowerCase() 
                            ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900 border border-slate-900" 
                            : "border border-white/10"
                        }`}
                      >
                        {primaryAccent.toLowerCase() === item.val.toLowerCase() && (
                          <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic custom HTML native spectrum pick container */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-white/40 uppercase tracking-wider font-bold">Custom spectrum:</span>
                    <span className="text-[9px] font-mono text-white/80 uppercase">{primaryAccent}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 shrink-0 shadow-lg">
                      <input 
                        type="color" 
                        value={primaryAccent}
                        onChange={(e) => setPrimaryAccent(e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer bg-transparent scale-150"
                      />
                    </div>
                    <span className="text-[9px] text-white/50 leading-tight">Click box to tuning spectrum manual</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger button */}
        <motion.button
          onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer w-12 h-12 rounded-full border border-white/10 bg-slate-950/90 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all relative group frosted-glass-accent"
          style={{ 
            boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px ${primaryAccent}30`,
            borderColor: `${primaryAccent}40`
          }}
        >
          <Palette className="h-5 w-5 text-accent-dynamic transition-transform group-hover:rotate-12" />
          
          {/* Tooltip text when resting */}
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[8px] font-bold tracking-widest uppercase border border-white/10 rounded px-2.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Accent tuner node
          </span>
        </motion.button>
      </div>

      {/* --- FOOTER / INTRO CREDITS (From Design HTML) --- */}
      <footer className="px-12 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium mt-16 relative z-10 w-full">
        <span>Project S-VEND [Alpha 2.0] • Praveen Node</span>
        <div className="flex flex-wrap justify-center gap-8">
          <span>Terms of Deployment</span>
          <span>Global Grid Status: Active</span>
        </div>
      </footer>
    </div>
  );
}
