import React, { useState } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { Building2, HeartPulse, GraduationCap, Dumbbell, Quote, ArrowUpRight, Check, Award, FlameKindling, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IndustryCasesProps {
  language: LanguageCode;
}

interface CaseStudy {
  id: string;
  sector: "office" | "hospital" | "school" | "gym";
  sectorName: string;
  clientName: string;
  location: string;
  challenge: string;
  solution: string;
  image: string;
  metrics: { label: string; value: string; prefix?: string; suffix?: string }[];
  quote: string;
  author: string;
  role: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "case-office-tech",
    sector: "office",
    sectorName: "Corporate Office Hub",
    clientName: "Apex FinTech Headquarters",
    location: "Mumbai, BKC",
    challenge: "Over 800 employees working in 24/7 shifts had delayed access to fresh specialty ground coffee and healthy midnight snack selections, causing long coffee-queue line blockages during peak hours.",
    solution: "Provisioned a dual-node cluster comprising 2x AeroBrew Elite specialty brewers and 1x Aura AI Smart grab-and-go Fridge. Standardized seamless UPI dynamic QR scan code transactions.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600",
    metrics: [
      { label: "Employee Engagement", value: "94", suffix: "% rating" },
      { label: "Peak Break Delay Cut", value: "11", suffix: " minutes" },
      { label: "AeroBrew cup servings", value: "620", suffix: " / daily" }
    ],
    quote: "Bypassing the traditional cafeteria queues changed our late-night developer productivity completely. Getting an artisanal bean-to-cup espresso in under 18 seconds feels like magic.",
    author: "Rohan Singhal",
    role: "Chief Workplace Officer"
  },
  {
    id: "case-hospital-care",
    sector: "hospital",
    sectorName: "Healthcare & Critical Medicine",
    clientName: "Fortis Care Specialty Center",
    location: "Bangalore, IN",
    challenge: "ICU staff, visiting doctors, and patients families require nutritious hot meals and probiotic drinks at 3 AM. Traditional food courts are locked, and delivery options aren't sterile or immediate.",
    solution: "Installed 2x Aura AI Smart Fridges with embedded computer-vision arrays and weight sensors alongside sterile lab white custom coatings.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    metrics: [
      { label: "Starlight Grade Hygiene", value: "100", suffix: "% sterile" },
      { label: "Healthy meals supplied", value: "480", suffix: " / month" },
      { label: "Staff Midnight Energy", value: "2.5", prefix: "+" , suffix: "x boost" }
    ],
    quote: "Aura smart fridges operate autonomously in our ER waiting bay with extreme surgical precision. Standard meals are charged with zero friction upon door closure.",
    author: "Dr. Ananya Iyer",
    role: "Chief Medical Administrator"
  },
  {
    id: "case-school-academy",
    sector: "school",
    sectorName: "Schools & Colleges",
    clientName: "Greenwood Global University",
    location: "New Delhi, NCR",
    challenge: "A massive campus sprawl with 4,000 students required quick, pocket-friendly snack selections during brief 10-minute lecture intervals across multiple academic wings.",
    solution: "Deployed a campus fleet of 6x VisiVibe Snack Stations equipped with drop-sensor product guarantees, robotic soft-drop lifts, and high-opacity polycarbonate impact glass covers.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600",
    metrics: [
      { label: "Drop-Sensor Guarantee", value: "100", suffix: "% success" },
      { label: "Student transaction count", value: "1850", suffix: " / daily" },
      { label: "Carbon Offset (EcoMode)", value: "220", suffix: " kg CO2 / mo" }
    ],
    quote: "Students love the robotic dual-zone cooling delivery. It satisfies energy demands instantly and our operations team tracks live inventory via the telemetry dashboard with ease.",
    author: "Prof. Vikram Sen",
    role: "Provost of Facilities"
  },
  {
    id: "case-fitness-gym",
    sector: "gym",
    sectorName: "Sports & High Performance Gyms",
    clientName: "Olympians Elite Wellness Club",
    location: "Mumbai, Bandra West",
    challenge: "Athletes needed immediate post-workout isotonic protein formulations, pre-workout matrix shots, and cold zero-sugar hydrolysed electrolytes without queuing up at physical protein shakes counters.",
    solution: "Integrated 2x HydroCell Max Cold Venders with anti-shake carousel lifts supporting delicate pre-shake glass bottles directly.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    metrics: [
      { label: "Protein Bars/Shakes Sold", value: "320", suffix: " / daily" },
      { label: "Client Return Loyalty", value: "32", prefix: "+", suffix: "%" },
      { label: "Uptime guarantee", value: "99.96", suffix: "% rate" }
    ],
    quote: "Our gym operates 24/7. Placing the cold-vender next to the sauna allows members to fetch vital recovery liquids seamlessly with a single tap of their RFID sports wristbands.",
    author: "Sarah D'Souza",
    role: "Lead Fitness Consultant"
  }
];

export default function IndustryCases({ language }: IndustryCasesProps) {
  const t = TRANSLATIONS[language];
  const [activeSector, setActiveSector] = useState<string>("all");

  const sectors = [
    { id: "all", label: "All Sectors", icon: Award },
    { id: "office", label: "Corporate Offices", icon: Building2 },
    { id: "hospital", label: "Hospitals & Care", icon: HeartPulse },
    { id: "school", label: "Schools & Scholastics", icon: GraduationCap },
    { id: "gym", label: "Fitness & Athletics", icon: Dumbbell }
  ];

  const filteredStudies = activeSector === "all"
    ? CASE_STUDIES
    : CASE_STUDIES.filter((st) => st.sector === activeSector);

  return (
    <div className="space-y-8">
      
      {/* Structural Headers */}
      <div className="space-y-2 border-b border-white/5 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-extrabold flex items-center gap-1">
          <Award className="h-4 w-4 animate-bounce" />
          {t.success_stories}
        </span>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {t.stories_title}
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
          {t.stories_desc}
        </p>
      </div>

      {/* Interactive horizontal sector switches */}
      <div className="flex flex-wrap gap-2">
        {sectors.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSector(sec.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono transition-all border ${
                activeSector === sec.id
                  ? "bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold"
                  : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid portfolio list layout content */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStudies.map((study) => (
            <motion.div
              layout
              key={study.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/60 border border-white/5 hover:border-white/10 rounded-3xl overflow-hidden p-6 space-y-6 flex flex-col justify-between shadow-lg hover:shadow-black/40 group relative"
            >
              
              <div className="space-y-4">
                
                {/* Header title */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block font-extrabold">
                      {study.sectorName}
                    </span>
                    <h3 className="text-md font-bold text-white mt-0.5">{study.clientName}</h3>
                    <p className="text-[10px] text-slate-500 font-mono italic">{study.location}</p>
                  </div>

                  <span className="p-2 bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Cover representation */}
                <div className="aspect-[21/9] rounded-2xl overflow-hidden relative border border-white/5">
                  <img
                    src={study.image}
                    alt={study.clientName}
                    className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Challenge vs Solution layout */}
                <div className="grid grid-cols-2 gap-4 text-[11px] pt-1">
                  <div className="space-y-1 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-wider font-extrabold">Venue Challenge:</p>
                    <p className="text-slate-400 font-light leading-normal line-clamp-4">{study.challenge}</p>
                  </div>

                  <div className="space-y-1 bg-emerald-950/15 p-3 rounded-2xl border border-emerald-500/5">
                    <p className="font-mono text-[9px] text-emerald-400 uppercase tracking-wider font-extrabold">Smart Deployment:</p>
                    <p className="text-slate-300 font-light leading-normal line-clamp-4">{study.solution}</p>
                  </div>
                </div>

                {/* Stats indicators */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  {study.metrics.map((met, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider block leading-tight">{met.label}</span>
                      <p className="text-lg font-mono font-black text-white mt-1">
                        {met.prefix}{met.value}{met.suffix}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Client Quote section */}
              <div className="pt-4 border-t border-white/5 space-y-3 bg-gradient-to-r from-slate-950/20 to-transparent p-3 rounded-2xl">
                <div className="flex gap-2 items-start">
                  <Quote className="h-5 w-5 text-emerald-400 shrink-0 opacity-40" />
                  <p className="text-xs text-slate-300 italic font-light leading-relaxed">
                    {study.quote}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pl-7 justify-between">
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{study.author}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{study.role}</p>
                  </div>
                  
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-400/20 rounded-full text-[9px] font-mono text-emerald-300 font-bold uppercase">
                    <Check className="h-3 w-3" /> Fully Verified
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
