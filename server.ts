import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Shared Gemini SDK client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API routes go here FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// API Route for customized beverage design
app.post("/api/vending/generate-drink", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "A valid flavor or mood prompt is required." });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Design an incredibly innovative, futuristic, premium vending machine beverage based on this input: "${prompt}". You should devise its name, a catchy digital catchphrase, a detailed description, color gradients, specific premium or chemical-grade molecular active ingredients, custom physical traits, and cognitive benefits.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Action-oriented name, e.g. Quantum Spark or CyberNectar." },
            tagline: { type: Type.STRING, description: "A catchy energetic tagline." },
            description: { type: Type.STRING, description: "Exotic, high-concept taste description with molecular vibe details." },
            primaryColor: { type: Type.STRING, description: "Primary visual hex code for the can design, e.g. #06B6D4." },
            secondaryColor: { type: Type.STRING, description: "Secondary radiant hex code for can gradient accents, e.g. #3B82F6." },
            theme: { type: Type.STRING, description: "A visual theme description keyword like dark-neon, light-aurora, synthwave, bio-matrix, chrome-luxe." },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3-4 molecular compounds or organic materials (e.g. 'Glow-Dust Electrolytes', 'Siberian Ginseng Extract')"
            },
            benefits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 2 benefits, e.g. '+30% Cognitive Focus' or 'Ultra Cold Core Cooling'"
            },
            nutrients: {
              type: Type.OBJECT,
              properties: {
                energy: { type: Type.STRING, description: "Calories per can estimation, e.g., '14 kcal'" },
                caffeine: { type: Type.STRING, description: "Caffeine presence, e.g., '80 mg' or '0 mg'" },
                sparkle: { type: Type.STRING, description: "Sparkle rate, e.g., 'Hyper Fizz' or 'Fine Bubbles'" },
                aiOptimization: { type: Type.STRING, description: "Custom state optimization level percentage, e.g., '96.2%'" }
              },
              required: ["energy", "caffeine", "sparkle", "aiOptimization"]
            }
          },
          required: ["name", "tagline", "description", "primaryColor", "secondaryColor", "theme", "ingredients", "benefits", "nutrients"]
        }
      }
    });

    const drinkData = JSON.parse(response.text || "{}");
    res.json({ success: true, drink: drinkData });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({
      error: "Failed to synthesize drink using Gemini AI.",
      details: error.message || error
    });
  }
});

// API Route for B2B Intelligent Machine Recommendation
app.post("/api/vending/recommend", async (req, res) => {
  const { businessType, footTraffic, primaryGoal, notes } = req.body || {};
  try {
    if (!businessType || !footTraffic || !primaryGoal) {
      res.status(400).json({ error: "Missing required B2B parameters (businessType, footTraffic, primaryGoal)." });
      return;
    }

    const promptContext = `Analyze this B2B client request and recommend the single most suitable smart vending node model from our catalog of 4 models:

Our catalog contains:
1. "snack-visivibe" (VisiVibe Snack Station): Glass-front snack machine, dual temp, 320 items, great for workplaces, schools, offices.
2. "coffee-aerobrew" (AeroBrew Elite): Speciality automated espresso grinder/brewer system, fresh bean and fresh milk, ideal for white-collar offices, premium hospitals, colleges.
3. "beverage-hydrocell" (HydroCell Max Cold Vender): High throughput beverage/beverage cans chiller with robotics. Excellent for high traffic areas like sports facilities, gyms, transport hubs.
4. "fridge-aura" (Aura AI Smart Fridge): Smart grab-and-go micro-market with vision-tracking and weight sensors. Best for quick meals, salads, protein bars, gourmet options. Suitable for hospitals, corporate premium, health gyms.

Customer Context:
- Business/Venue Category: ${businessType}
- Expected Daily Foot Traffic Density: ${footTraffic}
- Operational Priority/Metric Goal: ${primaryGoal}
- Client constraints / optional notes: "${notes || "None specified"}"

Your output must recommend the single perfect model id from the 4 models listed, estimate a realistic match percentage, write a strategic rationalization for the client, provide a helpful space layout / physical spacing installation advisory tip, estimate a projected monthly net profit, and give a case study tagline.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedMachineId: { 
              type: Type.STRING, 
              description: "Must be exactly one of: 'snack-visivibe', 'coffee-aerobrew', 'beverage-hydrocell', 'fridge-aura'" 
            },
            matchPercentage: { 
              type: Type.INTEGER, 
              description: "System compatibility match score out of 100, e.g., 96" 
            },
            rationale: { 
              type: Type.STRING, 
              description: "Strategic business justification why this machine fits the user goals and daily traffic density perfectly (2-3 sentences)." 
            },
            spacePlanningTip: { 
              type: Type.STRING, 
              description: "Helpful physical clearance or ergonomics advice for placing this specific machine model (e.g. 'requires 10cm rear ventilation space and access to standard 220V power')." 
            },
            estimatedMonthlyProfit: { 
              type: Type.INTEGER, 
              description: "Hypothetical estimated net monthly profit generated in USD based on foot traffic density and average item prices, e.g. 850" 
            },
            successStoryReference: { 
              type: Type.STRING, 
              description: "A short sector successful study tagline reference, e.g., 'Similar to how Inova Tech Hub boosted staff satisfaction by 46%.'" 
            }
          },
          required: ["recommendedMachineId", "matchPercentage", "rationale", "spacePlanningTip", "estimatedMonthlyProfit", "successStoryReference"]
        }
      }
    });

    const recommendation = JSON.parse(response.text || "{}");
    res.json({ success: true, recommendation });
  } catch (error: any) {
    console.error("Gemini Recommendation Error:", error);
    // Graceful fallback for local development or missing keys
    const fallbackMap: Record<string, string> = {
      office: "coffee-aerobrew",
      gym: "beverage-hydrocell",
      hospital: "fridge-aura",
      school: "snack-visivibe",
      retail: "snack-visivibe",
      transit: "beverage-hydrocell"
    };
    
    // Choose fallback
    const fallbackId = fallbackMap[String(businessType).toLowerCase()] || "snack-visivibe";
    res.json({
      success: true,
      isFallback: true,
      recommendation: {
        recommendedMachineId: fallbackId,
        matchPercentage: 92,
        rationale: `Highly optimized configuration suited for ${businessType || "your venue"}. The selected systems minimize wait-times and integrate fast digital cashless scanning.`,
        spacePlanningTip: "Recommend placing in a common break-room or entry plaza with standard 220V power outlets and 15cm side venting buffer clearance.",
        estimatedMonthlyProfit: footTraffic === "20-50" ? 480 : footTraffic === "50-200" ? 1150 : 2300,
        successStoryReference: `Similar to our deployments at leading ${businessType || "corporate offices"} which realized ROI inside 9 months.`
      }
    });
  }
});

// Vite middleware setup
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Vending Platform Server listening on port ${PORT}`);
  });
}

startViteServer().catch((err) => {
  console.error("Vite server initialization failed:", err);
});
