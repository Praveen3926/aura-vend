import React, { useState } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { Sparkles, ArrowRight, CheckCircle, HelpCircle, ArrowRightLeft, Sliders, TrendingUp, Cpu, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIRecommendationProps {
  language: LanguageCode;
  onSelectConfigure: (machine: Machine) => void;
  onRequestQuote: (machine: Machine) => void;
}

export default function AIRecommendation({ language, onSelectConfigure, onRequestQuote }: AIRecommendationProps) {
  const t = TRANSLATIONS[language];

  // Inputs
  const [businessType, setBusinessType] = useState<string>("office");
  const [footTraffic, setFootTraffic] = useState<string>("50-200");
  const [primaryGoal, setPrimaryGoal] = useState<string>("uptime-speed");
  const [notes, setNotes] = useState<string>("");

  // Loading & Outputs
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  const businessOptions = [
    { value: "office", label: "Corporate Healdquarters / Offices" },
    { value: "gym", label: "Athletic Clubs / Gyms" },
    { value: "hospital", label: "Hospitals & Healthcare Center" },
    { value: "school", label: "High Schools & University Campus" },
    { value: "retail", label: "Department Stores / Retail Plazas" },
    { value: "transit", label: "Transit Terminals / Train & Metro Hubs" }
  ];

  const trafficOptions = [
    { value: "20-50", label: "Low Density (20 - 50 staff/visitors daily)" },
    { value: "50-200", label: "Moderate Density (50 - 200 staff/visitors daily)" },
    { value: "200+", label: "High Density (200+ staff/visitors daily)" }
  ];

  const goalOptions = [
    { value: "uptime-speed", label: "Maximize Speed / 2.8s Instant Pay Releases" },
    { value: "healthy-micro", label: "Gourmet Salads, Fresh Food & High Nutrition" },
    { value: "beverage-caffeine", label: "High Specialty Caffeine & Morning Warm Vibes" },
    { value: "max-profit-margin", label: "Maximize Net Profit Margins & ROI speed" }
  ];

  const handleFetchRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendationResult(null);

    try {
      const response = await fetch("/api/vending/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          footTraffic,
          primaryGoal,
          notes
        })
      });

      const data = await response.json();
      if (data.success && data.recommendation) {
        setRecommendationResult(data.recommendation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find recommended machine object
  const recommendedMachine = recommendationResult
    ? COMMERICAL_MACHINES.find((m) => m.id === recommendationResult.recommendedMachineId) || COMMERICAL_MACHINES[0]
    : null;

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="space-y-2 border-b border-white/5 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-extrabold flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-teal-300 animate-pulse" />
          {t.recommendation_title}
        </span>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {t.recommendation_title}
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
          {t.recommendation_desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT PANEL FOR B2B SCENARIO */}
        <form onSubmit={handleFetchRecommendation} className="lg:col-span-5 bg-slate-900/40 border border-white/5 p-6 rounded-3xl space-y-5">
          
          {/* Business Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              {t.business_type}
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
            >
              {businessOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Foot traffic */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              {t.foot_traffic}
            </label>
            <div className="space-y-2">
              {trafficOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setFootTraffic(opt.value)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    footTraffic === opt.value
                      ? "bg-teal-500/10 border-teal-400 text-teal-300 font-bold"
                      : "bg-slate-950/50 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  {footTraffic === opt.value && <div className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Goals */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              {t.primary_goals}
            </label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400"
            >
              {goalOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Optional notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              Custom site challenges / constraints
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs high aesthetic design integration, compact sizes, or specific vegan menus..."
              rows={2}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                <span>Running Gemini AI Forecaster...</span>
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4 text-slate-950" />
                <span>{t.submit_recommend}</span>
              </>
            )}
          </button>
        </form>

        {/* OUTPUT ANALYSIS REPORT PANEL */}
        <div className="lg:col-span-7 h-full">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-950/40 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[440px]"
              >
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
                  <Cpu className="h-6 w-6 text-teal-400 absolute top-5 left-5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white font-mono uppercase tracking-widest">Compiling Sensory Telemetry</p>
                  <p className="text-xs text-slate-500 max-w-sm font-light">
                    Querying machine capability profiles against daily usage patterns and thermal zones...
                  </p>
                </div>
              </motion.div>
            ) : recommendationResult && recommendedMachine ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border border-teal-500/20 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl relative overflow-hidden"
              >
                {/* Glow decor background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl pointer-events-none" />

                {/* Score badge at top */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-teal-400/10 flex items-center justify-center text-teal-400 border border-teal-400/20">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase">{t.recommendation_results}</span>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recommendation Report</h4>
                    </div>
                  </div>

                  <div className="bg-teal-500/10 border border-teal-400/30 px-3.5 py-1.5 rounded-xl text-center">
                    <span className="text-[8px] font-mono text-teal-400 uppercase tracking-widest block">{t.match_rate}</span>
                    <span className="text-lg font-mono font-black text-teal-300">{recommendationResult.matchPercentage}%</span>
                  </div>
                </div>

                {/* Machine card teaser info */}
                <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-4 rounded-xl overflow-hidden relative group aspect-video md:aspect-square">
                    <img
                      src={recommendedMachine.imageUrl}
                      alt={recommendedMachine.name}
                      className="w-full h-full object-cover group-hover:scale-105 duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-white/95 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 backdrop-blur-md uppercase">
                        {recommendedMachine.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-teal-400 uppercase tracking-widest">Recommended hardware:</p>
                      <h5 className="text-lg font-extrabold text-white">{recommendedMachine.name}</h5>
                      <p className="text-xs text-slate-400 font-light line-clamp-2">{recommendedMachine.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 pt-2 border-t border-white/5">
                      <p>Capacity: <span className="text-white">{recommendedMachine.capacityLabel}</span></p>
                      <p>Temp: <span className="text-white">{recommendedMachine.temperatureSpan}</span></p>
                      <p>Purchase: <span className="text-white font-bold">${recommendedMachine.purchaseCost.toLocaleString()}</span></p>
                      <p>Lease rate: <span className="text-teal-400 font-bold">${recommendedMachine.monthlyRent}/mo</span></p>
                    </div>
                  </div>
                </div>

                {/* Descriptive advice nodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strategic rationale */}
                  <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-extrabold flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-teal-400" />
                      {t.expert_rationale}
                    </span>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {recommendationResult.rationale}
                    </p>
                  </div>

                  {/* Profit estimate and cases */}
                  <div className="bg-[#05060b] p-4 border border-emerald-500/10 rounded-2xl space-y-1.5">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {t.est_profit}
                    </span>
                    <p className="text-xl font-bold font-mono text-white">
                      +${recommendationResult.estimatedMonthlyProfit.toLocaleString()} <span className="text-[10px] text-slate-400 font-light font-mono">/ month</span>
                    </p>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic font-light">
                      {recommendationResult.successStoryReference}
                    </p>
                  </div>
                </div>

                {/* Spacing advice layout */}
                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <Layers className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[9px] uppercase text-indigo-300 tracking-widest font-extrabold pb-0.5">{t.space_tip}</p>
                      <p className="text-slate-300 font-light leading-relaxed">{recommendationResult.spacePlanningTip}</p>
                    </div>
                  </div>
                </div>

                {/* Direct Action hooks to catalog */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => onSelectConfigure(recommendedMachine)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest text-center transition-colors"
                  >
                    {t.configure_now}
                  </button>
                  <button
                    onClick={() => onRequestQuote(recommendedMachine)}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-widest text-center transition-opacity hover:opacity-90 shadow-md"
                  >
                    Request Physical Quote
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[440px]">
                <HelpCircle className="h-12 w-12 text-slate-600" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Awaiting Parameter Telemetry</p>
                  <p className="text-xs text-slate-500 max-w-sm font-light">
                    Select your corporate business sector type, projected daily traffic density, and priority metrics to get instant optimization analytics from Gemini.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
