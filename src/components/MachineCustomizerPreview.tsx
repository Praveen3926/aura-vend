import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { 
  Upload, 
  Palette, 
  Check, 
  Type, 
  Sparkles, 
  Tv, 
  Volume2, 
  ShieldCheck, 
  Layout, 
  Coffee, 
  Activity, 
  Flame, 
  Leaf,
  RefreshCw,
  Sliders,
  Image as ImageIcon
} from "lucide-react";

interface MachineCustomizerPreviewProps {
  initialMachine?: Machine;
  onModelChange?: (machine: Machine) => void;
}

export default function MachineCustomizerPreview({ initialMachine, onModelChange }: MachineCustomizerPreviewProps) {
  // Select Model
  const [selectedModelId, setSelectedModelId] = useState<string>(
    initialMachine?.id || COMMERICAL_MACHINES[0].id
  );
  
  const selectedModel = COMMERICAL_MACHINES.find((m) => m.id === selectedModelId) || COMMERICAL_MACHINES[0];

  // Customization States
  const [accentColor, setAccentColor] = useState<string>(selectedModel.accentColor);
  const [marqueeText, setMarqueeText] = useState<string>("WELCOME TO FUTURE SMART RETAIL • TAP TO ORDER");
  const [ledGlow, setLedGlow] = useState<string>("cyan"); // cyan, green, pink, amber
  const [selectedDeCal, setSelectedDeCal] = useState<string>("cyber"); // cyber, organic, energy, cup, custom
  const [customLogoBase64, setCustomLogoBase64] = useState<string | null>(null);
  const [customLogoName, setCustomLogoName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const glowStyles: Record<string, string> = {
    cyan: "box-shadow: 0 0 20px rgba(6, 182, 212, 0.6); border-color: #06b6d4;",
    green: "box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); border-color: #10b981;",
    pink: "box-shadow: 0 0 20px rgba(236, 72, 153, 0.6); border-color: #ec4899;",
    amber: "box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); border-color: #f59e0b;",
  };

  const getGlowShadowClass = () => {
    switch (ledGlow) {
      case "cyan": return "shadow-[0_0_25px_rgba(6,182,212,0.45)] border-cyan-400";
      case "green": return "shadow-[0_0_25px_rgba(16,185,129,0.45)] border-emerald-400";
      case "pink": return "shadow-[0_0_25px_rgba(236,72,153,0.45)] border-pink-400";
      case "amber": return "shadow-[0_0_25px_rgba(245,158,11,0.45)] border-amber-400";
      default: return "";
    }
  };

  const getGlowTextClass = () => {
    switch (ledGlow) {
      case "cyan": return "text-cyan-400";
      case "green": return "text-emerald-400";
      case "pink": return "text-pink-400";
      case "amber": return "text-amber-400";
      default: return "";
    }
  };

  const getGlowBgClass = () => {
    switch (ledGlow) {
      case "cyan": return "bg-cyan-500";
      case "green": return "bg-emerald-500";
      case "pink": return "bg-pink-500";
      case "amber": return "bg-amber-500";
      default: return "";
    }
  };

  // Predefined gorgeous logo decals
  const decals = [
    { id: "cyber", label: "Quantum Cyber", icon: Activity, color: "#06B6D4" },
    { id: "organic", label: "Eco Bloom Leaf", icon: Leaf, color: "#10B981" },
    { id: "energy", label: "Hyper Kinetic", icon: Sparkles, color: "#EC4899" },
    { id: "cup", label: "Aura Brew Cup", icon: Coffee, color: "#F59E0B" },
  ];

  // FileReader custom logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomLogoName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCustomLogoBase64(reader.result as string);
        setSelectedDeCal("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  const currentDeCal = decals.find((d) => d.id === selectedDeCal);

  const resetCustomizer = () => {
    setAccentColor(selectedModel.accentColor);
    setMarqueeText("WELCOME TO FUTURE SMART RETAIL • TAP TO ORDER");
    setLedGlow("cyan");
    setSelectedDeCal("cyber");
    setCustomLogoBase64(null);
    setCustomLogoName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: CONTROL & SELECTION FORM (7 / 12) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Customization Panel Wrapper */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-extrabold flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5" />
                Live Design Kiosk Component
              </span>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                Custom Branding Preview
              </h2>
            </div>
            <button
              onClick={resetCustomizer}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Design
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-5">
            {/* Step 1: Select Model */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                1. Select Vending Platform Base
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COMMERICAL_MACHINES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModelId(m.id);
                      setAccentColor(m.accentColor);
                      if (onModelChange) {
                        onModelChange(m);
                      }
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold text-center uppercase tracking-wider transition-all duration-200 ${
                      selectedModelId === m.id
                        ? "bg-white/5 border-teal-400 text-teal-400 scale-[1.02] font-bold"
                        : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.categoryLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Custom Logo Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                2. Upload Custom Brand Logo or Select Decal preset
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Drag-and-drop simulated logo uploader */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer hover:bg-white/5 hover:border-teal-400/50 transition-all space-y-2 flex flex-col items-center justify-center ${
                    selectedDeCal === "custom"
                      ? "border-teal-400 bg-teal-400/5"
                      : "border-white/10"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-teal-400 animate-bounce" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-white uppercase">Upload graphic file</p>
                    <p className="text-[9px] text-slate-400 font-mono">
                      {customLogoName ? `Loaded: ${customLogoName.slice(0, 20)}...` : "Drag/Click PNG or JPEG logo"}
                    </p>
                  </div>
                </div>

                {/* Preset choices */}
                <div className="grid grid-cols-2 gap-2">
                  {decals.map((d) => {
                    const IconComp = d.icon;
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDeCal(d.id);
                          setCustomLogoBase64(null);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          selectedDeCal === d.id
                            ? "bg-white/5 border-teal-400/80 text-white font-bold"
                            : "bg-slate-950/20 border-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        <IconComp className="h-4 w-4" style={{ color: d.color }} />
                        <span className="text-[10px] font-mono uppercase tracking-wider">{d.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Color accent selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                3. Choose Cabinet Primary Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-3 bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                {/* Visual Picker Sliders */}
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 p-0 hover:scale-105 rounded-xl border border-white/20 cursor-pointer overflow-hidden bg-transparent shrink-0"
                />
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Hex Coordinate: {accentColor.toUpperCase()}</span>
                    <span>Direct RGB Match</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { name: "Neon Cyber", hex: "#06B6D4" },
                      { name: "Gold Dust", hex: "#F59E0B" },
                      { name: "Solar Lime", hex: "#84CC16" },
                      { name: "Aurora Rose", hex: "#EC4899" },
                      { name: "Frost White", hex: "#F3F4F6" },
                    ].map((palette) => (
                      <button
                        key={palette.hex}
                        onClick={() => setAccentColor(palette.hex)}
                        title={palette.name}
                        className={`h-5 w-5 rounded-full border border-white/10 transition-transform ${
                          accentColor.toLowerCase() === palette.hex.toLowerCase() ? "scale-125 ring-2 ring-teal-400" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: palette.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: TV Marquee Greeting Text */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                4. Program Ticker Digital Marquee Message
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={55}
                  value={marqueeText}
                  onChange={(e) => setMarqueeText(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 active:border-teal-500 transition-all font-mono"
                />
                <Type className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Step 5: Side LED Cabinet Glow */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                5. Pick Neon Canopy Profile
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "cyan", label: "Aqua Neon", color: "bg-cyan-400" },
                  { id: "green", label: "Emerald Glow", color: "bg-emerald-400" },
                  { id: "pink", label: "Solar Magenta", color: "bg-pink-400" },
                  { id: "amber", label: "Melted Gold", color: "bg-amber-400" },
                ].map((led) => (
                  <button
                    key={led.id}
                    onClick={() => setLedGlow(led.id)}
                    className={`px-2.5 py-2 rounded-xl border text-[9px] font-bold font-mono uppercase tracking-wider text-center transition-all ${
                      ledGlow === led.id
                        ? "bg-slate-950/80 text-white border-white/20 shadow-md ring-1 ring-white/10"
                        : "bg-slate-950/20 border-white/5 text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    <span className={`inline-block h-2 w-2 rounded-full mr-1.5 ${led.color}`} />
                    {led.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Real-time Custom Spec highlights */}
        <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-5 space-y-3">
          <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layout className="h-3.5 w-3.5" />
            Configured Design Blueprint Specifications
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 font-mono text-[11px] text-slate-400">
              <p>Platform Chassis: <span className="text-white font-bold">{selectedModel.name}</span></p>
              <p>Hex Paint Variant: <span className="text-white" style={{ color: accentColor }}>{accentColor.toUpperCase()}</span></p>
              <p>Neon Glow Scheme: <span className="text-white uppercase">{ledGlow} index</span></p>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-400 border-l border-white/5 pl-4">
              <p>Decal Profile: <span className="text-white uppercase">{selectedDeCal === "custom" ? "Custom Graphic File" : currentDeCal?.label}</span></p>
              <p>Capacity Reserved: <span className="text-white font-bold">{selectedModel.capacity} compartments</span></p>
              <p>Thermodynamics: <span className="text-white">{selectedModel.temperatureSpan}</span></p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: 2.5D INTERACTIVE CABINET VISUALIZER RENDER (5 / 12) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24">
        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-4 block">
          Live Cabinet Layout Rendering (2.5D Interactive)
        </span>

        {/* Cabinet Visual Wrapper - matches high-fidelity gloss design */}
        <div
          className={`w-[290px] h-[550px] relative rounded-[32px] bg-slate-950 p-[12px] transition-all duration-300 border-4 ${getGlowShadowClass()}`}
          style={{
            backgroundImage: "linear-gradient(135deg, #090d16 0%, #030406 100%)",
          }}
        >
          {/* Inner chassis border with physical styled highlights */}
          <div className="absolute inset-[6px] border border-white/5 rounded-[26px] pointer-events-none" />

          {/* Top Speaker/Header Marquee Mesh Grid */}
          <div className="h-10 bg-[#0d0f14] rounded-t-[18px] border-b-2 border-slate-900 flex flex-col justify-center px-3 overflow-hidden relative">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 opacity-60 rounded-t-[18px]" />
            
            {/* LED Glow Ticker Ticker Container */}
            <div className="bg-black border border-white/5 h-6 rounded-md flex items-center overflow-hidden px-1 font-mono relative">
              <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-[8px] tracking-wider text-amber-500 whitespace-nowrap animate-marquee flex gap-1 items-center">
                <span className="text-amber-500">{marqueeText}</span>
              </div>
            </div>
          </div>

          {/* Mid Cabinet - Glass Showcase or dispenser door */}
          <div
            className="mt-3 block flex-1 rounded-[14px] p-2 relative overflow-hidden transition-colors duration-300 flex flex-col justify-between"
            style={{
              height: "380px",
              backgroundColor: "rgba(255,255,255,0.01)",
              border: `1.5px solid ${accentColor}15`,
              boxShadow: `inset 0 0 40px ${accentColor}06`,
            }}
          >
            {/* Gloss Reflection Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 transform -translate-y-12 pointer-events-none" />

            {/* Custom Branding Sticker Decal Plate */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 pointer-events-none space-y-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 duration-300"
                style={{
                  backgroundColor: `${accentColor}12`,
                  border: `2px solid ${accentColor}30`,
                  boxShadow: `0 10px 25px ${accentColor}1A`,
                }}
              >
                {selectedDeCal === "custom" && customLogoBase64 ? (
                  <img
                    src={customLogoBase64}
                    alt="Custom Brand Logo"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 object-contain rounded-md"
                  />
                ) : (
                  React.createElement(currentDeCal?.icon || Activity, {
                    className: "w-8 h-8",
                    style: { color: accentColor },
                  })
                )}
              </div>

              {/* Dynamic brand text label printed directly on machine */}
              <div className="text-center space-y-0.5">
                <p className="text-[10px] font-mono tracking-widest text-white font-extrabold uppercase bg-slate-950/60 px-3 py-1 rounded-full border border-white/5">
                  {selectedDeCal === "custom" ? "BRAND PARTNER" : currentDeCal?.label}
                </p>
                <p className="text-[8px] font-mono text-slate-400">INTELLIGENT ECO PLATFORM</p>
              </div>
            </div>

            {/* Physical Shelf lines or display compartment layout */}
            <div className="flex-1 w-full space-y-5 pt-8 pl-1 select-none pointer-events-none">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex justify-between items-center pr-1.5 opacity-25">
                  <div className="h-0.5 bg-slate-800 flex-1" />
                  <div className="flex gap-4 px-2">
                    {[1, 2, 3].map((val) => (
                      <div key={val} className="h-6 w-3 border border-white/50 rounded bg-white/20" />
                    ))}
                  </div>
                  <div className="h-0.5 bg-slate-800 flex-1" />
                </div>
              ))}
            </div>

            {/* Vending/Kiosk UI Touchscreen Plate */}
            <div className="z-10 h-16 bg-slate-950/90 border border-white/10 rounded-xl p-2 flex items-center justify-between relative shadow-lg">
              <div className="flex flex-col gap-1">
                <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: "65%" }} />
                </div>
                <span className="text-[7px] font-mono text-slate-500">PAYMENT PROXIMITY</span>
              </div>
              <div className="h-8 w-12 bg-white/5 border border-white/10 rounded-md flex items-center justify-center flex-col">
                <span className="text-[6px] font-mono text-slate-500 font-bold uppercase">Ready</span>
                <span className="text-[8px] font-mono font-bold text-white tracking-tight" style={{ color: accentColor }}>$1.50</span>
              </div>
            </div>
          </div>

          {/* Bottom Dispenser Slot Tray */}
          <div className="mt-3 h-14 bg-slate-900 border border-white/5 rounded-b-[18px] relative flex justify-center items-center">
            <div className="absolute inset-x-4 top-2 h-6 bg-black border-2 border-slate-950 rounded-sm shadow-inner flex items-center justify-center">
              <div className="h-0.5 bg-[rgba(255,255,255,0.05)] w-full" />
            </div>
            <div className="absolute bottom-1 text-[7px] text-slate-500 font-mono tracking-widest uppercase">
              REVOLVING FLAP ACCUMULATOR
            </div>
          </div>
        </div>

        {/* CSS keyframes directly inserted */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 16s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
