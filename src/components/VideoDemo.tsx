import React, { useState, useEffect } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { Play, Pause, RefreshCw, Radio, Layers, Flame, Cpu, Coffee, Thermometer, ShieldCheck, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoDemoProps {
  language: LanguageCode;
}

interface DemoVideo {
  id: string;
  machineId: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string; // loop fallback
  telemetryLogs: string[];
  specs: { label: string; value: string }[];
}

const DEMO_VIDEOS: DemoVideo[] = [
  {
    id: "v-aerobrew",
    machineId: "coffee-aerobrew",
    title: "AeroBrew Elite: Bean Grinding & Frothing Loop",
    duration: "1:42 Min",
    description: "Detailed walk-through of the active twin Italian steel burr grinders, automated oat milk micro-foamer frothing, and self-cleaning cycle logic.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-from-a-thermos-41712-large.mp4",
    telemetryLogs: [
      "[0.2s] Cup release laser triggered",
      "[1.4s] Active Smart grinder grinding premium beans (4.2g/s)",
      "[3.8s] Dual boiler pulse heating reached steady 91.5°C",
      "[5.9s] High-pressure extraction (9.2 bar) initiated",
      "[12.4s] Frother self-rinse sequence complete"
    ],
    specs: [
      { label: "Bean Grind", value: "Active Twin 64mm Steels" },
      { label: "Boiler Temp", value: "91.5°C constant" },
      { label: "Pump pressure", value: "9.2 bar" }
    ]
  },
  {
    id: "v-visivibe",
    machineId: "snack-visivibe",
    title: "VisiVibe: Soft-Drop Robotic Delivery Run",
    duration: "1:15 Min",
    description: "Witness the horizontal conveyor belts and the anti-shaking robotic lift fetch and drop delicate bakery slices without dropping or damage.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-conveyor-belt-carrying-boxes-in-a-warehouse-34440-large.mp4",
    telemetryLogs: [
      "[0.5s] Row 4 belt stepper motors engaged",
      "[1.3s] Robotic conveyor platform rising to Level B",
      "[3.0s] Soft-drop load cell weighs element (84g)",
      "[4.5s] Descending platform back to user output bay",
      "[5.8s] Drop-sensors register terminal dispatch"
    ],
    specs: [
      { label: "Delivery Mode", value: "Soft horizontal belt-lift" },
      { label: "Weight limit", value: "650g max / item" },
      { label: "Drop sensors", value: "Quadratic Infrared IR Array" }
    ]
  },
  {
    id: "v-aura",
    machineId: "fridge-aura",
    title: "Aura Smart Fridge: Computer Vision & Checkout",
    duration: "2:05 Min",
    description: "See the sensory computer vision system and dynamic pricing screen charge the credit card instantly upon closing the magnetic double doors.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-opening-a-refrigerator-at-night-42284-large.mp4",
    telemetryLogs: [
      "[0.1s] Door latch electromagnetic lock disengaged",
      "[1.2s] 3D vision cameras active (Tracking Hand #1)",
      "[2.5s] Load sensor reports Level 3 Shelf delta (-180g)",
      "[4.0s] Door closing trigger registered",
      "[5.2s] Automated checkout routing API: Charged $4.50"
    ],
    specs: [
      { label: "Sensory Matrix", value: "3D camera + high-precision weight coils" },
      { label: "Door lock", value: "Dynamic Magnetic Curtains" },
      { label: "Latency", value: "0.8s Checkout compilation" }
    ]
  },
  {
    id: "v-hydrocell",
    machineId: "beverage-hydrocell",
    title: "HydroCell: Rapid Vortex Cooling Test",
    duration: "1:30 Min",
    description: "Watch the vortex cooling core lower ambient temperatures rapidly to a frosty 2°C inside high-heat environmental humidity tests.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-iced-tea-with-lemon-41586-large.mp4",
    telemetryLogs: [
      "[0.2s] R290 Compressor active loop started",
      "[1.5s] Internal vortex fans reached 2200 RPM",
      "[4.0s] Air flow rate calibrated to 4.2 L/sec",
      "[6.8s] Cabinet temp decreased from 14°C to 2°C",
      "[10s] Eco mode engaged, compressor reduced load"
    ],
    specs: [
      { label: "Compressor", value: "Environmental R290 system" },
      { label: "Fan power", value: "Vortex system 2200 RPM" },
      { label: "Steady temp", value: "2.0°C cabinet" }
    ]
  }
];

export default function VideoDemo({ language }: VideoDemoProps) {
  const t = TRANSLATIONS[language];

  // States
  const [activeVidIdx, setActiveVidIdx] = useState<number>(0);
  const activeVideo = DEMO_VIDEOS[activeVidIdx];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(30); // %
  const [activeLog, setActiveLog] = useState<number>(0);

  // Playback timer effects
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });

        // Rotate logs
        setActiveLog((l) => (l + 1) % activeVideo.telemetryLogs.length);
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeVideo]);

  // Reset progress when changing videos
  const handleVideoSelect = (index: number) => {
    setActiveVidIdx(index);
    setPlaybackProgress(20);
    setIsPlaying(false);
    setActiveLog(0);
  };

  return (
    <div className="space-y-6">
      
      {/* Structural Headers */}
      <div className="space-y-2 border-b border-white/5 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-extrabold flex items-center gap-1.5">
          <Radio className="h-4 w-4 text-indigo-400 animate-pulse" />
          {t.video_demos}
        </span>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {t.demos_title}
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
          {t.demos_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INTERACTIVE VIDEO PLAYER VIEWPORT WITH STATIC PREVIEWMAPS */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black group shadow-2xl">
            {/* The video element itself - uses illustrative background loops or static placeholders */}
            <div className="absolute inset-0 bg-[#0f111a] flex flex-col items-center justify-center">
              {/* Cover mock graphic pattern */}
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
              
              {/* Custom Animated UI showing simulated hardware components since actual video play is restricted */}
              <div className="w-full h-full flex flex-col justify-between p-6 z-10 z-relative">
                {/* Tech bar at top */}
                <div className="flex justify-between items-center bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 font-mono text-[9px] text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 animate-ping" /> FEED: LIVE HARDWARE MONITORS</span>
                  <span className="text-indigo-400 font-extrabold uppercase">Unit: {activeVideo.specs[0].value}</span>
                </div>

                {/* Animated physical mechanic simulation */}
                <div className="flex flex-col items-center justify-center flex-1 space-y-4 text-center">
                  <motion.div
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="h-16 w-16 rounded-full border-4 border-dashed border-indigo-400/30 border-t-indigo-400 flex items-center justify-center bg-indigo-505/10"
                  >
                    <Cpu className="h-6 w-6 text-indigo-400" />
                  </motion.div>
                  
                  <div className="space-y-1">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#22D3EE] font-extrabold">
                      {isPlaying ? "Telemetry Capture Live" : "Walkthrough Paused"}
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto font-light leading-relaxed">
                      {isPlaying 
                        ? `Simulating dynamic mechanical stepper gears, thermal sensor arrays and QR pay codes integrations...`
                        : "Click Play button to run telemetry walkthrough simulation"}
                    </p>
                  </div>
                </div>

                {/* Live ticker status line at bottom */}
                <div className="bg-slate-950/90 border border-white/5 p-3 rounded-xl flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-0.5"><CheckCircle className="h-3 w-3" /> STAT:</span>
                  <p className="truncate text-teal-300 font-light">{activeVideo.telemetryLogs[activeLog]}</p>
                </div>
              </div>

            </div>

            {/* Custom controls panel bottom bar overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-slate-950/90 to-transparent z-20 flex items-center justify-between gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 text-slate-950 flex items-center justify-center shrink-0 shadow-lg"
              >
                {isPlaying ? <Pause className="h-5 w-5 text-slate-950" /> : <Play className="h-5 w-5 text-slate-950 ml-0.5" />}
              </button>

              {/* Progress bar container */}
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>

              {/* Duration timestamp */}
              <span className="text-[10px] font-mono text-slate-400 shrink-0 uppercase">{activeVideo.duration}</span>
            </div>
          </div>

          {/* Description parameters */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">{activeVideo.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{activeVideo.description}</p>
            </div>

            {/* Micro spec tables */}
            <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-3 text-[10px] font-mono">
              {activeVideo.specs.map((sp, idx) => (
                <div key={idx} className="bg-slate-950/50 p-2.5 rounded-xl border border-white/5 text-center">
                  <span className="text-slate-500 uppercase text-[8px] block">{sp.label}</span>
                  <span className="text-slate-300 font-bold block mt-1">{sp.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SIDEPLAYLIST SELECTION */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 p-4 rounded-2xl space-y-4">
          <div className="border-b border-white/5 pb-2">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Available Tours</span>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Telemetry playlist</h4>
          </div>

          <div className="space-y-2">
            {DEMO_VIDEOS.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => handleVideoSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  activeVidIdx === idx
                    ? "bg-indigo-500/10 border-indigo-400 text-indigo-300"
                    : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {/* Visual number tag */}
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs border shrink-0 ${
                  activeVidIdx === idx
                    ? "bg-indigo-500/20 border-indigo-400/30 text-indigo-300"
                    : "bg-slate-900 border-white/5 text-slate-500"
                }`}>
                  0{idx + 1}
                </div>

                <div className="space-y-1 overflow-hidden">
                  <h5 className="text-[11px] font-extrabold text-white leading-normal truncate">{vid.title}</h5>
                  <p className="text-[10px] text-slate-400 font-light line-clamp-1 leading-snug">{vid.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Physical specification warnings alert checklist */}
          <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-1 text-[9px] font-mono text-slate-400">
            <p className="font-bold text-indigo-400 tracking-wider flex items-center gap-1 uppercase">
              <ShieldCheck className="h-3.5 w-3.5" /> Hardware Compliance:
            </p>
            <p>Certified CE / FCC energy grids.</p>
            <p>Self cleaning cycle repeats automatically every 12 operating cycles to maintain pristine food grade safety hygiene.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
