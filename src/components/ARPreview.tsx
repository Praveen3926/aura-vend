import React, { useState, useRef, useEffect } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { Camera, Upload, RotateCw, ZoomIn, Sliders, Play, Trash2, Eye, Layout, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface ARPreviewProps {
  language: LanguageCode;
}

const PRESET_BG_IMAGES = [
  {
    id: "office-hub",
    name: "Tech Office Lounge",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "cozy-lobby",
    name: "Coworking Breakroom",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "fitness-gym",
    name: "Elite Wellness Gym",
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: "school-plaza",
    name: "University Cafeteria",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
  }
];

export default function ARPreview({ language }: ARPreviewProps) {
  const t = TRANSLATIONS[language];

  // Selected Machine & Theme settings
  const [selectedMachineId, setSelectedMachineId] = useState<string>(COMMERICAL_MACHINES[0].id);
  const activeMachine = COMMERICAL_MACHINES.find((m) => m.id === selectedMachineId) || COMMERICAL_MACHINES[0];

  // Background state
  const [backgroundType, setBackgroundType] = useState<"preset" | "uploaded" | "camera">("preset");
  const [presetBg, setPresetBg] = useState<string>(PRESET_BG_IMAGES[0].imageUrl);
  const [uploadedBgUrl, setUploadedBgUrl] = useState<string | null>(null);
  
  // Camera variables
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Overlay spatial adjustments
  const [scale, setScale] = useState<number>(85); // %
  const [rotation, setRotation] = useState<number>(0); // deg
  const [verticalPos, setVerticalPos] = useState<number>(50); // % from top
  const [horizontalPos, setHorizontalPos] = useState<number>(50); // % from left
  const [brightness, setBrightness] = useState<number>(100); // %
  const [shadowBlur, setShadowBlur] = useState<number>(15); // px

  // Interactive Dragging of the Vending Machine inside container
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handlePresetSelect = (url: string) => {
    setBackgroundType("preset");
    setPresetBg(url);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedBgUrl(event.target.result as string);
          setBackgroundType("uploaded");
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedBgUrl(event.target.result as string);
          setBackgroundType("uploaded");
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera permissions and stream integration
  const startCamera = async () => {
    try {
      setCameraActive(false);
      const constraints = { video: { facingMode: "environment", width: 1280, height: 720 } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setBackgroundType("camera");
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Could not access environment camera. Please allow permission or select a preset background picture.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Update video element src when camera is chosen
  useEffect(() => {
    if (backgroundType === "camera" && !cameraActive) {
      startCamera();
    } else if (backgroundType !== "camera" && cameraActive) {
      stopCamera();
    }
  }, [backgroundType]);

  // Touch and mouse coordinate drag updates for machine overlay
  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate new percentage positions
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Bounds limit 5-95%
    setHorizontalPos(Math.max(5, Math.min(95, xPct)));
    setVerticalPos(Math.max(5, Math.min(95, yPct)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Reset spatial parameters
  const handleResetParameters = () => {
    setScale(85);
    setRotation(0);
    setVerticalPos(50);
    setHorizontalPos(50);
    setBrightness(100);
    setShadowBlur(15);
  };

  return (
    <div className="space-y-6">
      
      {/* Structural Headers */}
      <div className="space-y-2 border-b border-white/5 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-[#22D3EE] uppercase font-extrabold flex items-center gap-1">
          <Camera className="h-4 w-4 text-cyan-400" />
          {t.ar_preview}
        </span>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {t.ar_title}
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
          {t.ar_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* AR EDITOR VIEWPORT CANVAS AREA */}
        <div className="lg:col-span-8 space-y-4">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="w-full aspect-[16/10] bg-slate-950 border border-white/10 rounded-2xl relative overflow-hidden select-none cursor-crosshair"
          >
            {/* Background elements based on selected mode */}
            {backgroundType === "preset" && (
              <img
                src={presetBg}
                alt="Workspace Preset"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            )}

            {backgroundType === "uploaded" && uploadedBgUrl && (
              <img
                src={uploadedBgUrl}
                alt="Custom uploaded interior map"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            )}

            {backgroundType === "camera" && (
              <div className="absolute inset-0 w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform rotate-0"
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 space-y-3">
                    <Camera className="h-8 w-8 text-cyan-400 animate-spin" />
                    <p className="text-xs text-slate-400">Requesting local camera clearance...</p>
                  </div>
                )}
              </div>
            )}

            {/* Standard drag drop guidance dropzone helper */}
            {backgroundType === "uploaded" && !uploadedBgUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950 text-center text-slate-500">
                <Upload className="h-10 w-10 text-slate-600 mb-2 animate-bounce" />
                <p className="text-xs text-slate-300 font-bold uppercase font-mono tracking-widest mb-1">Drop Workspace Picture Here</p>
                <p className="text-[10px] text-slate-600">Supports JPEG, PNG or drag files directly onto canvas</p>
              </div>
            )}

            {/* THE ROBOTIC KIOSK OVERLAY IMAGE */}
            {(!backgroundType || backgroundType !== "uploaded" || uploadedBgUrl) && (
              <motion.div
                className="absolute origin-center cursor-move"
                style={{
                  top: `${verticalPos}%`,
                  left: `${horizontalPos}%`,
                  transform: "translate(-50%, -50%)",
                  width: `${scale / 2.2}%`, // Scaled projection width
                  filter: `brightness(${brightness}%)`,
                }}
              >
                <img
                  src={activeMachine.imageUrl}
                  alt={activeMachine.name}
                  onPointerDown={handlePointerDown}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    filter: `drop-shadow(0px ${shadowBlur * 0.75}px ${shadowBlur}px rgba(0, 0, 0, 0.85))`,
                  }}
                  className="w-full h-auto pointer-events-auto rounded-xl border border-white/5 bg-slate-950/20"
                />
                
                {/* Visual marker helper inside overlay */}
                {isDragging && (
                  <div className="absolute inset-0 border border-teal-400 rounded-xl pointer-events-none animate-pulse flex items-center justify-center">
                    <span className="text-[9px] font-mono bg-teal-400 text-slate-900 px-1.5 py-0.5 rounded opacity-90">XYZ CLEARANCE</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Floor depth guide projection lines */}
            <div className="absolute bottom-4 left-4 bg-slate-950/75 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5 text-[9px] font-mono text-slate-400 space-y-1 z-10 pointer-events-none">
              <p className="text-cyan-400 font-bold uppercase tracking-wider">Spatial Estimator</p>
              <p>Height: <span className="text-white">{activeMachine.dimensions}</span></p>
              <p>Position: <span className="text-white">X:{horizontalPos.toFixed(0)}% | Y:{verticalPos.toFixed(0)}%</span></p>
              <p>Rotation Angle: <span className="text-white">{rotation}°</span></p>
            </div>

            {/* Drag helper alert banner */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-mono text-slate-400 pointer-events-none text-center">
              {t.ar_overlay_instructions}
            </div>
          </div>

          {/* Quick preset selector rail & upload buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-extrabold block">PresBg:</span>
              <div className="flex gap-2">
                {PRESET_BG_IMAGES.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.imageUrl)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] text-white border transition-all ${
                      backgroundType === "preset" && presetBg === preset.imageUrl
                        ? "bg-cyan-500/10 border-cyan-400 font-bold"
                        : "bg-slate-950/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* File upload connector */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/20 bg-slate-950/40 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors text-[10px] font-mono">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Room Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Real-time WebCam activator */}
              <button
                onClick={startCamera}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono transition-colors ${
                  backgroundType === "camera"
                    ? "bg-red-500/15 border-red-500/50 text-red-300"
                    : "bg-[#22D3EE]/10 border-cyan-400/30 text-cyan-300"
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Activate Camera</span>
              </button>
            </div>
          </div>

        </div>

        {/* SPATIAL LAYOUT COORDINATES CONTROL AND ADJUSTERS PANEL */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-6">
          <div className="space-y-1 border-b border-white/5 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block">Spatial Editor</span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Projection Deck</h4>
            </div>
            
            <button
              onClick={handleResetParameters}
              className="text-[9px] font-mono text-slate-500 hover:text-white border border-white/5 px-2 py-1 rounded"
            >
              Reset
            </button>
          </div>

          {/* Model active selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-extrabold">
              Select Overlay Kiosk
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMMERICAL_MACHINES.map((machine) => (
                <button
                  key={machine.id}
                  onClick={() => setSelectedMachineId(machine.id)}
                  className={`text-left p-2.5 rounded-xl border text-[10px] transition-all flex flex-col justify-between ${
                    selectedMachineId === machine.id
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold"
                      : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="font-bold block tracking-tight line-clamp-1">{machine.name}</span>
                  <span className="text-[8px] opacity-75">{machine.categoryLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Scale control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px] flex items-center gap-1"><ZoomIn className="h-3 w-3 text-cyan-400" /> Scale Adjustment</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{scale}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="150"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px] flex items-center gap-1"><RotateCw className="h-3 w-3 text-yellow-400" /> Rotation Degree</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Depth Clearance (Y Position) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px]">Placement Height (Y)</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{verticalPos.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={verticalPos}
                onChange={(e) => setVerticalPos(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Horizontal sweep (X Position) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px]">Placement Width (X)</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{horizontalPos.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={horizontalPos}
                onChange={(e) => setHorizontalPos(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Overlay Brightness adjustment to match background shadows */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px]">Kiosk Lux (Match room light)</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Floor Shadow blur */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span className="uppercase text-[9px]">Floor Shadows Blend</span>
                <span className="text-white bg-slate-950 px-1.5 py-0.5 rounded">{shadowBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={shadowBlur}
                onChange={(e) => setShadowBlur(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

          </div>

          {/* Physical specification warnings alert checklist */}
          <div className="p-3 bg-cyan-950/20 border border-[#22D3EE]/20 rounded-xl space-y-1.5 text-[10px]">
            <p className="font-bold text-cyan-400 font-mono tracking-wider flex items-center gap-1 uppercase">
              <Eye className="h-3.5 w-3.5" /> Size Clearance Checklist:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-300 font-light font-mono">
              <li>Dimensions: {activeMachine.dimensions}</li>
              <li>Estimated Cabinet Weight: {activeMachine.weight} kg</li>
              <li>Standard 220-240V Socket Required</li>
              <li>150-320 Watts Power peak active cycles</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
