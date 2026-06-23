import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Beverage, VendingSlot, VendingOperation } from "../types";
import { Coins, HelpCircle, Sparkles, RefreshCw, Layers, Terminal, Database, CheckCircle, Flame, Droplets, Zap, Coffee, Sparkles as SparklesIcon, Heart } from "lucide-react";
import DispenseParticleCanvas from "./DispenseParticleCanvas";
import { playCoinChime, playDispensingSound, playSuccessChime } from "../utils/audio";

interface VendingMachineProps {
  slots: VendingSlot[];
  onSelectSlot: (slotId: string) => void;
  onInsertCoin: () => void;
  onCollectBeverage: () => void;
  credit: number;
  dispensingSlot: string | null;
  dispensedBeverage: Beverage | null;
  lcdMessage: string;
  operationsLog: VendingOperation[];
  activeSlotId: string | null;
  canDispenseState: "idle" | "dispensing" | "ready-to-collect";
  wishlistIds?: string[];
  onToggleWishlist?: (id: string) => void;
  currentMachineId?: string;
}

export default function VendingMachine({
  slots,
  onSelectSlot,
  onInsertCoin,
  onCollectBeverage,
  credit,
  dispensingSlot,
  dispensedBeverage,
  lcdMessage,
  operationsLog,
  activeSlotId,
  canDispenseState,
  wishlistIds,
  onToggleWishlist,
  currentMachineId,
}: VendingMachineProps) {
  const [typedCode, setTypedCode] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle keypad clicks in the visual simulator
  const handleKeypadPress = (char: string) => {
    if (canDispenseState === "dispensing") return;

    if (char === "CLR") {
      setTypedCode("");
      return;
    }
    if (char === "ENT") {
      if (typedCode.length === 2) {
        onSelectSlot(typedCode.toUpperCase());
      }
      setTypedCode("");
      return;
    }
    if (typedCode.length < 2) {
      setTypedCode((prev) => prev + char);
    }
  };

  // Keyboard shortcut support for vending simulator keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if ((key >= "A" && key <= "Z") || (key >= "1" && key <= "9")) {
        if (typedCode.length < 2) {
          setTypedCode((prev) => prev + key);
        }
      } else if (key === "ENTER") {
        if (typedCode.length === 2) {
          onSelectSlot(typedCode);
        }
        setTypedCode("");
      } else if (key === "BACKSPACE" || key === "ESCAPE") {
        setTypedCode("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [typedCode, onSelectSlot]);

  // Play robotic acoustic wave hum on physical dispense sequence
  useEffect(() => {
    if (canDispenseState === "dispensing") {
      playDispensingSound(1.8);
    }
  }, [canDispenseState]);

  // Subtle 3D tilting effect using mouse positions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center py-6 px-2 lg:px-6 relative select-none">
      {/* Decorative Floor Shadow & Ambient Light Base */}
      <div className="absolute -bottom-2 w-[85%] h-12 bg-cyan-950/40 rounded-full blur-2xl z-0" />
      <div className="absolute -bottom-1 w-[70%] h-6 bg-cyan-500/20 rounded-full blur-xl z-0" />

      {/* Floating/Tilting outer container */}
      <motion.div
        id="vending-machine-container"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateY: isHovered ? mousePosition.x * 20 : 0,
          rotateX: isHovered ? -mousePosition.y * 15 : 0,
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotateY: { type: "spring", stiffness: 100, damping: 20 },
          rotateX: { type: "spring", stiffness: 100, damping: 20 },
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        className="w-full max-w-[390px] aspect-[1/2.05] min-h-[680px] bg-gradient-to-b from-[#181820]/95 to-[#0b0b0f]/95 rounded-[36px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.1)] border border-white/10 flex flex-col justify-between relative backdrop-blur-2xl z-10 overflow-hidden"
      >
        {/* Futuristic Glass Top Light Refraction Bar */}
        <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-[36px]" />
        
        {/* Quick Wishlist Toggle */}
        {onToggleWishlist && wishlistIds && currentMachineId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(currentMachineId);
            }}
            className={`absolute top-4.5 right-4.5 z-30 h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all border cursor-pointer hover:scale-110 active:scale-95 ${
              wishlistIds.includes(currentMachineId)
                ? "bg-pink-500/20 text-pink-500 border-pink-500/40 shadow-lg shadow-pink-500/20"
                : "bg-slate-950/80 text-white/50 border-white/10 hover:text-pink-400 hover:border-pink-500/20"
            }`}
            title={wishlistIds.includes(currentMachineId) ? "Remove machine from wishlist" : "Add machine to wishlist"}
          >
            <Heart className={`h-3.5 w-3.5 ${wishlistIds.includes(currentMachineId) ? "fill-current" : ""}`} />
          </button>
        )}
        
        {/* Core Side Neon Light strips */}
        <div className="absolute left-1.5 inset-y-8 w-[2px] bg-gradient-to-b from-blue-500/80 via-indigo-500/80 to-purple-500/80 rounded-full blur-[1px] pointer-events-none" />
        <div className="absolute right-1.5 inset-y-8 w-[2px] bg-gradient-to-b from-blue-500/80 via-purple-500/80 to-blue-500/80 rounded-full blur-[1px] pointer-events-none" />

        {/* --- HEADER LOGO SEGMENT --- */}
        <div className="flex justify-between items-center px-2 pb-3 mb-2 border-b border-white/5 relative z-10 pr-8">
          <div className="flex items-center gap-1.5 font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-blue-400">AURA VEND v4.1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono font-bold text-white/50 uppercase bg-white/5 px-2.5 py-1 rounded border border-white/5">
              Node Active
            </span>
          </div>
        </div>

        {/* --- VENDING CHAMBER (Glass display) --- */}
        <div className="flex-grow shrink-0 min-h-[352px] bg-[#0c0c12]/90 rounded-2xl border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner mb-4">
          {/* Glass glare effect overlays */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.04] to-transparent transform skew-x-12 pointer-events-none" />
          <div className="absolute left-2.5 top-2.5 text-[8px] font-mono text-cyan-400/50 uppercase pointer-events-none select-none">
            Molecular Temp: -2.3°C
          </div>

          {/* Shelves Layout */}
          <div className="flex-1 flex flex-col justify-around gap-2 pt-5 pb-2 relative z-10">
            {/* Shelf 1 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1 mb-0.5">
                <span className="text-[7px] font-mono tracking-wider text-cyan-400 font-extrabold uppercase">A: SODAS & WATER</span>
                <span className="text-[6px] font-mono text-white/30 uppercase">COLD COIL</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {slots.slice(0, 4).map((slot) => (
                  <SlotCard
                    key={slot.slotId}
                    slot={slot}
                    activeSlotId={activeSlotId}
                    onSelectSlot={onSelectSlot}
                    isDispensing={dispensingSlot === slot.slotId}
                  />
                ))}
              </div>
              <div className="h-1 bg-slate-800/80 rounded-full shadow-[0_1px_5px_rgba(0,255,255,0.1)] border-b border-cyan-500/10" />
            </div>

            {/* Shelf 2 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1 mb-0.5">
                <span className="text-[7px] font-mono tracking-wider text-amber-500 font-extrabold uppercase">B: COFFEES & TEAS</span>
                <span className="text-[6px] font-mono text-white/30 uppercase">HOT / COLD</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {slots.slice(4, 8).map((slot) => (
                  <SlotCard
                    key={slot.slotId}
                    slot={slot}
                    activeSlotId={activeSlotId}
                    onSelectSlot={onSelectSlot}
                    isDispensing={dispensingSlot === slot.slotId}
                  />
                ))}
              </div>
              <div className="h-1 bg-slate-800/80 rounded-full shadow-[0_1px_5px_rgba(0,255,255,0.1)] border-b border-cyan-500/10" />
            </div>

            {/* Shelf 3 (Custom blending grid / Preset) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1 mb-0.5">
                <span className="text-[7px] font-mono tracking-wider text-emerald-400 font-extrabold uppercase">C: BIOM-SNACKS & SYNTH</span>
                <span className="text-[6px] font-mono text-white/30 uppercase">SOLID FOOD</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {slots.slice(8, 12).map((slot) => (
                  <SlotCard
                    key={slot.slotId}
                    slot={slot}
                    activeSlotId={activeSlotId}
                    onSelectSlot={onSelectSlot}
                    isDispensing={dispensingSlot === slot.slotId}
                  />
                ))}
              </div>
              <div className="h-1.5 bg-slate-800/80 rounded-full shadow-[0_2px_8px_rgba(0,255,255,0.15)] border-b border-cyan-500/20" />
            </div>
          </div>
        </div>

        {/* --- INTERFACE ZONE & DISPENSER PANEL --- */}
        <div className="grid grid-cols-12 gap-3 relative z-10">
          {/* LEFT SIDE: LED DISPLAY + USER KEYPAD CONTROLS */}
          <div className="col-span-8 flex flex-col gap-2">
            {/* Liquid crystal LCD Screen */}
            <div className="bg-slate-950 border border-emerald-500/20 p-2 rounded-xl flex flex-col justify-between shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <div className="flex justify-between items-center border-b border-emerald-500/10 pb-1 mb-1">
                <span className="text-[8px] font-mono text-emerald-500/60 uppercase tracking-widest">Sys Feed</span>
                <span className="text-[8px] font-mono text-emerald-400">
                  CR: <strong className="text-emerald-300">${credit.toFixed(2)}</strong>
                </span>
              </div>
              {/* Message display banner */}
              <div className="h-7 flex items-center overflow-hidden">
                <p className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide whitespace-nowrap animate-marquee">
                  {lcdMessage}
                </p>
              </div>
            </div>

            {/* Simulated Dispense Pocket Can Drop Bin */}
            <div className="bg-slate-950 border-2 border-slate-800 h-[68px] rounded-2xl relative shadow-inner p-1 overflow-hidden group">
              {/* Metallic flap cover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center transition-all duration-500 z-10 pointer-events-none border-b border-slate-800/50 ${
                  canDispenseState !== "idle"
                    ? "transform -translate-y-[85%] opacity-30 shadow-lg border-b-cyan-500/20"
                    : "transform translate-y-0 opacity-100"
                }`}
              >
                <div className="w-[80%] h-0.5 bg-slate-800 rounded-full mb-1" />
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em]">Dispenser Tray</span>
                <div className="absolute bottom-1 w-2 h-0.5 bg-cyan-500/40 rounded-full" />
              </div>

              {/* Glowing dispense arena underneath flap */}
              <div className="absolute inset-0 h-full w-full bg-cyan-950/25 flex items-center justify-center pointer-events-auto">
                <AnimatePresence mode="wait">
                  {canDispenseState === "ready-to-collect" && dispensedBeverage ? (
                    <motion.button
                      id="collect-beverage-button"
                      initial={{ y: -30, rotate: -15, scale: 0.2, opacity: 0 }}
                      animate={{ y: 0, rotate: [0, 5, -5, 0], scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      onClick={() => {
                        playSuccessChime();
                        onCollectBeverage();
                      }}
                      className="cursor-pointer relative flex flex-col items-center justify-center h-12 aspect-[1/2.1] rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.7)]"
                    >
                      {/* Beverage body simulation */}
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${dispensedBeverage.primaryColor}, ${dispensedBeverage.secondaryColor} 80%)`,
                        }}
                        className="w-full h-full rounded-[6px] border border-white/20 relative overflow-hidden"
                      >
                        {/* Can print */}
                        <div className="absolute inset-x-0 top-1 text-[5px] font-mono font-black text-white/50 text-center leading-none">
                          AI
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[5px] font-bold text-white uppercase text-center leading-tight whitespace-nowrap rotate-90 truncate max-w-[28px]">
                            {dispensedBeverage.name}
                          </span>
                        </div>
                        {/* Metallic glowing can tab rings */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-slate-300/40 rounded-t border-b border-black/10" />
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-slate-400/40 rounded-b border-t border-black/10" />
                      </div>
                      
                      {/* Floating custom spark effect */}
                      <span className="absolute -top-3 text-cyan-400 text-[10px] animate-bounce">
                        ✨
                      </span>
                    </motion.button>
                  ) : null}
                </AnimatePresence>

                {/* Blending animation placeholder with interactive Particle Effects */}
                {canDispenseState === "dispensing" && (
                  <>
                    <DispenseParticleCanvas />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="flex flex-col items-center z-10"
                    >
                      <RefreshCw className="h-4 w-4 text-cyan-400 animate-spin mb-1" />
                      <span className="text-[7px] font-mono text-cyan-400/80 uppercase">Blending Can...</span>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: HARDWARE COIN FEED + METALLIC HARDWARE BUTTONS */}
          <div className="col-span-4 flex flex-col justify-between">
            {/* Keypad selector */}
            <div className="bg-slate-900 border border-white/5 p-1.5 rounded-xl flex flex-col gap-1 items-center justify-center">
              <div className="bg-black/40 text-slate-400 font-mono text-center text-[10px] py-0.5 rounded w-full tracking-wider border border-white/5">
                {typedCode || "--"}
              </div>
              <div className="grid grid-cols-3 gap-1 w-full mt-1">
                {["A", "B", "C", "D"].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleKeypadPress(letter)}
                    className="aspect-square bg-slate-800 active:bg-cyan-600 active:text-white hover:bg-slate-750 text-slate-300 rounded font-mono text-[9px] font-bold border border-white/5 shadow-sm transition-colors flex items-center justify-center"
                  >
                    {letter}
                  </button>
                ))}
                {["1", "2", "3", "4"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    className="aspect-square bg-slate-800 active:bg-cyan-600 active:text-white hover:bg-slate-755 text-slate-300 rounded font-mono text-[9px] font-bold border border-white/5 shadow-sm transition-colors flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleKeypadPress("CLR")}
                  className="aspect-square bg-rose-950 hover:bg-rose-900 active:bg-rose-800 text-rose-300 rounded font-mono text-[8px] border border-rose-500/10 flex items-center justify-center"
                >
                  CLR
                </button>
                <button
                  onClick={() => handleKeypadPress("ENT")}
                  className="aspect-square bg-emerald-950 hover:bg-emerald-900 active:bg-emerald-800 text-emerald-300 rounded font-mono text-[8px] border border-emerald-500/10 flex items-center justify-center col-span-3 pb-0.5"
                >
                  ENT
                </button>
              </div>
            </div>

            {/* Coin Slot Inject Button */}
            <button
              id="insert-coin-button"
              onClick={() => {
                playCoinChime();
                onInsertCoin();
              }}
              className="mt-2 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 active:scale-95 bg-slate-900 border border-white/5 py-1.5 rounded-xl shadow transition-all duration-200 flex flex-col items-center gap-0.5 group cursor-pointer"
            >
              <div className="w-[18px] h-3.5 bg-slate-950 ring-1 ring-white/10 rounded-sm relative flex items-center justify-center overflow-hidden">
                <div className="w-0.5 h-2.5 bg-amber-400 group-hover:bg-amber-300 rounded-full animate-pulse" />
              </div>
              <span className="text-[7px] font-mono text-slate-400 group-hover:text-amber-400 uppercase tracking-widest font-bold">
                +$1.50 Coin
              </span>
            </button>
          </div>
        </div>

        {/* --- SYSTEM LOG FEED IN VENDING SLOTS CONTAINER FOOTER --- */}
        <div className="mt-4 border-t border-white/5 pt-2 mb-1 flex items-center justify-between text-[7px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Coins className="h-2 w-2 text-amber-500" /> Inserts Loaded
          </span>
          <span>SYSTEM AUTO-REPLENISH</span>
        </div>
      </motion.div>
    </div>
  );
}

/* Helper Can Slot Card Element */
interface SlotCardProps {
  key?: string;
  slot: VendingSlot;
  activeSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  isDispensing: boolean;
}

function SlotCard({ slot, activeSlotId, onSelectSlot, isDispensing }: SlotCardProps) {
  const { beverage, stock, slotId } = slot;
  const isSelected = activeSlotId === slotId;

  if (!beverage) {
    return (
      <div className="aspect-[1/1.5] rounded-xl bg-slate-950 border border-dashed border-slate-800 flex flex-col items-center justify-center p-1 opacity-40">
        <span className="text-[7px] font-mono text-slate-600 font-bold">{slotId}</span>
        <span className="text-[6px] text-slate-700 font-mono mt-1">EMPTY</span>
      </div>
    );
  }

  const isLowStock = stock <= 1;
  const isOutOfStock = stock === 0;

  return (
    <motion.button
      id={`slot-${slotId}`}
      onClick={() => !isOutOfStock && onSelectSlot(slotId)}
      whileHover={isOutOfStock ? {} : { scale: 1.05 }}
      whileTap={isOutOfStock ? {} : { scale: 0.95 }}
      className={`aspect-[1/1.32] rounded-xl flex flex-col justify-between items-center p-1 md:p-1.5 border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
        isOutOfStock
          ? "bg-white/[0.01] border-white/5 opacity-25 cursor-not-allowed"
          : isSelected
          ? "bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          : "bg-white/[0.02] hover:bg-white/5 border-white/5 hover:border-white/10"
      }`}
    >
      {/* Beverage Dispensing Vibrating animation */}
      <AnimatePresence>
        {isDispensing && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ rotate: [-3, 3, -3, 3, 0], scale: [1, 1.05, 0.2, 0] }}
            exit={{ scale: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-[#050508] z-20 flex items-center justify-center"
          >
            <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Can Model render */}
      <div className="flex-1 flex items-center justify-center relative w-full mb-1">
        {/* Glowing aura inside glass shelf */}
        <div
          style={{ backgroundColor: beverage.primaryColor }}
          className="absolute w-5 h-5 rounded-full blur-md opacity-20 group-hover:opacity-50 transition-opacity"
        />

        {beverage.imageUrl ? (
          <div className={`${
            slotId.startsWith("C")
              ? "w-[24px] h-[30px] rounded-[4px]" // squarish snack pouch profile
              : "w-[18px] h-[34px] rounded-[4px]" // tall drink can/cup profile
          } border border-white/10 relative overflow-hidden shadow-lg transition-transform group-hover:scale-110`}>
            <img
              src={beverage.imageUrl}
              alt={beverage.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          /* Can cylindrical shape with brand color gradients */
          <div
            style={{
              background: `linear-gradient(to right, ${beverage.primaryColor}, ${beverage.secondaryColor})`,
            }}
            className={`${
              slotId.startsWith("C") 
                ? "w-[24px] h-[22px] rounded-[3px]" // horizontal snack box layout 
                : "w-[18px] h-[34px] rounded-[4px]" // vertical can layout
            } border border-white/10 flex flex-col justify-between relative shadow-lg overflow-hidden group-hover:shadow-blue-500/10 transition-shadow`}
          >
            {/* Can Rim/Lid styling */}
            {!slotId.startsWith("C") && <div className="h-0.5 bg-slate-300/40 rounded-t w-full border-b border-black/10" />}
            {/* Internal diagonal accent */}
            <div className="absolute inset-x-0 top-1/4 h-1/2 bg-white/5 -skew-y-12 pointer-events-none" />
            {/* Vibe icon indicator */}
            <div className="flex items-center justify-center h-full text-white/90">
              {beverage.name.includes("Espr") || beverage.name.includes("Moc") || beverage.name.includes("Coff") || beverage.name.includes("Volt") ? (
                <Coffee className="h-2 w-2" />
              ) : beverage.name.includes("Bar") || beverage.name.includes("Wafer") || beverage.name.includes("Gumm") || beverage.name.includes("Snack") ? (
                <Sparkles className="h-2 w-2 text-cyan-400" />
              ) : beverage.name.includes("Surge") || beverage.name.includes("Ener") ? (
                <Zap className="h-2 w-2" />
              ) : beverage.name.includes("Chill") || beverage.name.includes("Dew") ? (
                <Droplets className="h-2 w-2" />
              ) : (
                <Flame className="h-2 w-2" />
              )}
            </div>
            {!slotId.startsWith("C") && <div className="h-0.5 bg-slate-400/40 rounded-b w-full border-t border-black/10" />}
          </div>
        )}
      </div>

      {/* Text slot label info */}
      <div className="w-full flex flex-col items-center gap-0.5 relative z-10">
        <span className="text-[7.5px] font-mono text-white/60 font-bold tracking-tight bg-[#050508] px-1 py-0.2 rounded w-full text-center border border-white/5">
          {slotId}
        </span>
        <span className={`text-[5px] font-bold uppercase text-center font-mono tracking-tight ${
          isOutOfStock
            ? "text-rose-500"
            : isLowStock
            ? "text-amber-500"
            : "text-white/40"
        }`}>
          {isOutOfStock ? "SOLD OUT" : `${stock} left`}
        </span>
      </div>
    </motion.button>
  );
}
