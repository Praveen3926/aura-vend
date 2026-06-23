import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Beverage } from "../types";
import { X, Flame, Droplets, Zap, Coffee, Heart, AlertCircle, ShoppingBag, Stars, RefreshCw } from "lucide-react";
import { playConsumptionSound, playSuccessChime } from "../utils/audio";

interface CanModalProps {
  beverage: Beverage | null;
  onClose: () => void;
  onTakeSip?: () => void;
}

export default function CanModal({ beverage, onClose, onTakeSip }: CanModalProps) {
  if (!beverage) return null;

  const isSnack = beverage.name.toLowerCase().includes("bar") || 
                  beverage.name.toLowerCase().includes("wafer") || 
                  beverage.name.toLowerCase().includes("gumm") || 
                  beverage.name.toLowerCase().includes("snack") || 
                  beverage.name.toLowerCase().includes("bites") || 
                  beverage.name.toLowerCase().includes("crunch");

  const isCoffee = beverage.name.toLowerCase().includes("mocha") || 
                   beverage.name.toLowerCase().includes("espresso") || 
                   beverage.name.toLowerCase().includes("latte") || 
                   beverage.name.toLowerCase().includes("coffee") || 
                   beverage.name.toLowerCase().includes("brew") || 
                   beverage.name.toLowerCase().includes("volt");

  const [fluidLevel, setFluidLevel] = useState<number>(100); // percentage 100% full
  const [sipLogs, setSipLogs] = useState<string[]>(
    isSnack ? ["Fresh snack pack opened!"] : isCoffee ? ["Hot craft brew poured!"] : ["Fresh cold can popped!"]
  );
  const [activeTab, setActiveTab] = useState<"formula" | "telemetry" | "molecular">("formula");

  const handleTakeSip = () => {
    if (fluidLevel <= 0) {
      const emptyMsg = isSnack ? "The packet is totally empty! Synthesize a refill." : "The container is bone dry! Refill required.";
      setSipLogs((prev) => [emptyMsg, ...prev.slice(0, 4)]);
      return;
    }

    let logsArray = ["*Gulp*", "*Ahhh, refreshing*", "*Tingle*", "*Sparkle*", "*Zesty burst*"];
    if (isSnack) {
      logsArray = ["*Crunch*", "*Delicious crispy bite*", "*Munch, sweet active factor*", "*Chewy nutrient blast*", "*Fudge tingle*"];
    } else if (isCoffee) {
      logsArray = ["*Sip, warm intense body*", "*Velvety crema taste*", "*Warm energizing swallow*", "*Steam notes rising*", "*High caffeine rush*"];
    }

    const randomVibe = logsArray[Math.floor(Math.random() * logsArray.length)];
    const dec = Math.min(25, fluidLevel);
    setFluidLevel((prev) => prev - dec);

    // Play tactile synthesized consumption sound effect real-time
    playConsumptionSound(isSnack);

    const logMsg = isSnack 
      ? `Ate 25% - ${randomVibe} (${fluidLevel - dec}% remaining)`
      : `Drank 25ml - ${randomVibe} (${fluidLevel - dec}% left)`;
    setSipLogs((prev) => [logMsg, ...prev.slice(0, 4)]);
    
    if (onTakeSip) {
      onTakeSip();
    }
  };

  const handleRefill = () => {
    setFluidLevel(100);
    // Play success chime upon replenishing
    playSuccessChime();
    const refillMsg = isSnack ? "Molecular snack compound replenished!" : "Molecular reserve re-synthesized!";
    setSipLogs((prev) => [refillMsg, ...prev.slice(0, 4)]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-[#050508]/90 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
        {/* Modal Window Container */}
        <motion.div
          id="item-closeup-modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[#0b0b0f]/95 border border-white/10 rounded-3xl w-full max-w-4xl p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden my-8"
        >
          {/* Subtle background visual highlights */}
          <div
            style={{
              background: `radial-gradient(circle, ${beverage.primaryColor}15 0%, transparent 60%)`,
            }}
            className="absolute -top-30 -left-30 w-96 h-96 pointer-events-none rounded-full"
          />
          <div
            style={{
              background: `radial-gradient(circle, ${beverage.secondaryColor}15 0%, transparent 60%)`,
            }}
            className="absolute -bottom-30 -right-30 w-96 h-96 pointer-events-none rounded-full"
          />

          {/* Close Button Header */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white/55 hover:text-white p-2 rounded-full border border-white/10 transition-all z-55 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* LEFT PANEL: 3D CYLINDRICAL CAN SIMULATOR (6 / 12 col) */}
          <div className="md:col-span-5 flex flex-col items-center justify-between bg-white/[0.02] rounded-2xl p-6 border border-white/5 shadow-inner">
            <div className="w-full text-center mb-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-blue-400 uppercase font-bold">
                ACTIVE DECK COMPILER
              </span>
            </div>

            {/* Simulated 3D Can element */}
            <div className="w-full flex justify-center items-center h-72 py-4 relative perspective-1000">
              {/* Spinning shadows & bubbles in frame container */}
              <div className="absolute w-44 h-64 bg-slate-950/40 rounded-[35px] border border-white/5 shadow-inner flex flex-col justify-end overflow-hidden p-2">
                {/* Bubble / Particle generators */}
                <div className="absolute inset-x-0 bottom-4 overflow-hidden h-4/5 pointer-events-none">
                  {fluidLevel > 0 &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={
                          isSnack
                            ? {
                                y: [160, 40, 160],
                                opacity: [0.2, 0.9, 0.2],
                                scale: [0.8, 1.2, 0.8],
                                rotate: [0, 180, 360],
                              }
                            : {
                                y: [160, -10],
                                opacity: [0, 0.7, 0],
                                x: [Math.sin(i) * 10, -Math.sin(i) * 10, Math.sin(i) * 10],
                              }
                        }
                        transition={{
                          duration: isSnack ? 4 + Math.random() * 3 : 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.45,
                        }}
                        style={{
                          backgroundColor: beverage.primaryColor,
                          left: `${15 + (i * 12) % 70}%`,
                          width: isSnack ? `${6 + (i % 5)}px` : `${3 + (i % 4)}px`,
                          height: isSnack ? `${6 + (i % 5)}px` : `${3 + (i % 4)}px`,
                          borderRadius: isSnack ? (i % 2 === 0 ? "2px" : "50%") : "50%",
                        }}
                        className="absolute"
                      />
                    ))}
                </div>

                {/* Simulated Fluid level backing */}
                <motion.div
                  id="beverage-fluid-level"
                  animate={{ height: `${fluidLevel}%` }}
                  style={{
                    background: `linear-gradient(to top, ${beverage.primaryColor}dd, ${beverage.secondaryColor}aa)`,
                  }}
                  className="w-full rounded-b-[28px] transition-all duration-500 relative flex items-center justify-center overflow-hidden"
                >
                  {/* Froth waving separator */}
                  {fluidLevel > 0 && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-white/30 animate-pulse pointer-events-none" />
                  )}
                  {fluidLevel > 20 && (
                    <span className="text-[12px] font-bold font-mono text-white/20 select-none uppercase tracking-widest block transform -rotate-90">
                      {isSnack ? "NUTRITION INTACT" : "LIQUID ACTIVE"}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Foreground Floating 3D Embossed Can Label */}
              <motion.div
                id="floating-can-front"
                animate={{
                  y: [0, -8, 0],
                  rotateY: [0, 360],
                }}
                transition={{
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 25, repeat: Infinity, ease: "linear" },
                }}
                className="w-36 h-56 rounded-[28px] border-2 border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between p-4 overflow-hidden relative cursor-grab active:cursor-grabbing group"
                style={{
                  background: beverage.imageUrl
                    ? `url(${beverage.imageUrl}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${beverage.primaryColor}, ${beverage.secondaryColor} 90%)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Dark tint gradient over background photograph to maintain complete text contrast */}
                {beverage.imageUrl && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 z-0 pointer-events-none" />
                )}

                {/* Gloss glare lines */}
                <div className="absolute -inset-y-2 inset-x-4 bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 z-10" />

                {/* Metallic rim decorations */}
                <div className="h-2 bg-slate-300/40 rounded-t w-full border-b border-black/10 absolute top-0 inset-x-0" />
                <div className="h-2 bg-slate-400/50 rounded-b w-full border-t border-black/10 absolute bottom-0 inset-x-0" />

                <div className="pt-2 z-10 flex justify-between items-center text-[8px] font-mono text-white/60">
                  <span>AI SPEC</span>
                  <span>{beverage.nutrients.aiOptimization}</span>
                </div>

                <div className="flex flex-col items-center justify-center flex-grow z-10 my-4 text-center">
                  <span className="text-[12px] font-mono text-white/80 font-black tracking-widest bg-black/20 px-2 py-0.5 rounded border border-white/5 mb-1.5 whitespace-nowrap">
                    {beverage.name}
                  </span>
                  <span className="text-[7px] font-medium leading-normal text-white/95 max-w-[100px] italic">
                    "{beverage.tagline}"
                  </span>
                </div>

                <div className="pb-2 w-full flex justify-between items-center z-10 text-[6px] font-mono text-white/50 border-t border-white/10 pt-1.5">
                  <span className="truncate max-w-[50px]">{beverage.theme}</span>
                  <span className="font-bold underline">GEN: 5</span>
                </div>
              </motion.div>
            </div>

            {/* Sip Action buttons */}
            <div className="w-full flex gap-3 mt-4">
              <button
                id="modal-sip-button"
                onClick={handleTakeSip}
                className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-mono text-xs font-semibold py-2.5 px-4 rounded-xl border border-blue-500/30 transition-all shadow-[0_4px_12px_rgba(59,130,246,0.25)] flex items-center justify-center gap-2"
              >
                {fluidLevel > 0 ? (
                  isSnack ? (
                    <>
                      <Stars className="h-4 w-4" />
                      Take a Bite
                    </>
                  ) : (
                    <>
                      <Coffee className="h-4 w-4" />
                      Take a Sip
                    </>
                  )
                ) : (
                  isSnack ? "Empty Pack!" : "Empty Can!"
                )}
              </button>
              <button
                id="modal-refill-button"
                onClick={handleRefill}
                className="cursor-pointer bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 font-mono text-xs py-2.5 px-3 rounded-xl border border-white/10 transition-all flex items-center justify-center"
                title={isSnack ? "Replenish Snack" : "Synthesize Refill"}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: DETAILS, RECIPE, AND MOLECULAR METRICS (7 / 12 col) */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              {/* Product title header */}
              <div className="mb-4">
                <span className="text-[10px] font-mono tracking-widest text-[#3b82f6] font-bold uppercase block mb-1">
                  {isSnack ? "Synthetic Micronutrient Snack" : isCoffee ? "Synthetic Molecule Coffee" : "Synthetic Molecule Beverage"}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                  {beverage.name}
                </h2>
                <p className="text-white/60 text-sm mt-1 mb-2 font-light italic">
                  "{beverage.tagline}"
                </p>
                <div className="h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent rounded-full" />
              </div>

              {/* In-depth Custom Beverage Description */}
              <div className="flex flex-col sm:flex-row gap-5 mb-6">
                {beverage.imageUrl && (
                  <div className="w-24 sm:w-28 h-32 sm:h-36 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-md group relative">
                    <img
                      src={beverage.imageUrl}
                      alt={beverage.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 pointer-events-none">
                      <span className="text-[7.5px] font-bold font-mono tracking-wider text-white/90 uppercase">Active Spec</span>
                    </div>
                  </div>
                )}
                <p className="text-white/70 text-xs lg:text-sm leading-relaxed font-light flex-1">
                  {beverage.description}
                </p>
              </div>

              {/* Navigation Tab links inside closeup details */}
              <div className="flex border-b border-white/10 gap-6 mb-4">
                <button
                  onClick={() => setActiveTab("formula")}
                  className={`pb-2.5 text-xs font-mono tracking-wider font-bold transition-all relative ${
                    activeTab === "formula" ? "text-blue-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  Molecular Formula
                  {activeTab === "formula" && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`pb-2.5 text-xs font-mono tracking-wider font-bold transition-all relative ${
                    activeTab === "telemetry" ? "text-blue-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  System Nutrient Specs
                  {activeTab === "telemetry" && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("molecular")}
                  className={`pb-2.5 text-xs font-mono tracking-wider font-bold transition-all relative ${
                    activeTab === "molecular" ? "text-blue-400" : "text-white/40 hover:text-white"
                  }`}
                >
                  Vibe Consumption Log
                  {activeTab === "molecular" && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-400" />
                  )}
                </button>
              </div>

              {/* TAB 1: FORMULA / INGREDIENTS */}
              {activeTab === "formula" && (
                <div className="space-y-4">
                  {/* Active Components List */}
                  <div>
                    <h4 className="text-[10px] font-mono text-white/45 uppercase tracking-wider mb-2 font-bold">
                      Designate Ingredients
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {beverage.ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="bg-[#050508]/80 border border-white/5 p-2 rounded-xl flex items-center gap-2"
                        >
                          <Stars className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="text-white/80 text-xs font-light">{ing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Programmatic benefits */}
                  <div>
                    <h4 className="text-[10px] font-mono text-white/45 uppercase tracking-wider mb-2 font-bold">
                      Cognitive Optimization Properties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {beverage.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          style={{
                            borderColor: `${beverage.primaryColor}30`,
                            backgroundColor: `${beverage.secondaryColor}10`,
                          }}
                          className="px-3 py-1 rounded-full border text-blue-400 text-[10px] font-mono flex items-center gap-1.5"
                        >
                          <Zap className="h-3 w-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SYSTEM NUTRIENT DETAILS */}
              {activeTab === "telemetry" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <NutritionCard
                      name="Active Energy"
                      val={beverage.nutrients.energy}
                      icon={<Flame className="h-4 w-4 text-orange-400" />}
                    />
                    <NutritionCard
                      name="Caffeine Meter"
                      val={beverage.nutrients.caffeine}
                      icon={<Coffee className="h-4 w-4 text-amber-500" />}
                    />
                    <NutritionCard
                      name="Sparkle Rate"
                      val={beverage.nutrients.sparkle}
                      icon={<Droplets className="h-4 w-4 text-blue-400" />}
                    />
                    <NutritionCard
                      name="AI Match Score"
                      val={beverage.nutrients.aiOptimization}
                      icon={<Stars className="h-4 w-4 text-purple-400" />}
                    />
                  </div>

                  {/* Artificial details */}
                  <div className="bg-[#0c0c12]/65 border border-white/5 p-3 rounded-xl flex gap-3 text-xs text-white/50 mt-2">
                    <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Bio-Safety Evaluation:</strong> This formula complies with standard
                      molecular vending specifications. Stabilized using local dynamic temperature regulation to preserve trace essence variables.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DYNAMIC SIMULATED SIP LOGS */}
              {activeTab === "molecular" && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1.5 font-bold">
                    Holographic Taste Experience Logs
                  </h4>
                  <div className="bg-[#050508]/80 border border-white/5 p-3 rounded-xl h-28 overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col gap-1 shadow-inner">
                    {sipLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-1.5 py-0.5 ${idx === 0 ? "text-blue-400" : "text-white/30"}`}
                      >
                        <span className="shrink-0 text-blue-400/30">[$]</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal action buttons */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-6">
              <div className="mr-auto text-white/30 text-[10px] font-mono">
                Formula stabilized on 2026-06-21.
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer bg-white/5 hover:bg-white/10 active:scale-95 text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-all border border-white/10"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* Helper Card Component for Nutrient metrics */
interface NutritionCardProps {
  name: string;
  val: string;
  icon: React.ReactNode;
}

function NutritionCard({ name, val, icon }: NutritionCardProps) {
  return (
    <div className="bg-[#050508]/60 border border-white/5 p-3 rounded-xl flex flex-col justify-between h-20 shadow-sm relative group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[9px] font-mono font-bold text-white/40 tracking-tight uppercase">
          {name}
        </span>
        <div className="opacity-85">{icon}</div>
      </div>
      <span className="text-lg font-mono font-bold text-white/90 relative z-10">
        {val}
      </span>
    </div>
  );
}
