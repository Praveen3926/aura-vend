import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { 
  Search, 
  Layers, 
  Cpu, 
  Coins, 
  Scaling, 
  Info, 
  ArrowRight, 
  X, 
  HelpCircle,
  Plus, 
  FileText, 
  Check,
  Zap,
  Tag,
  Gauge,
  Thermometer,
  ShieldCheck,
  Smile,
  Heart
} from "lucide-react";

interface MachineCatalogProps {
  onSelectConfigure: (machine: Machine) => void;
  onRequestQuote: (machine: Machine) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (id: string) => void;
}

export default function MachineCatalog({ 
  onSelectConfigure, 
  onRequestQuote,
  wishlistIds,
  onToggleWishlist
}: MachineCatalogProps) {
  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [selectedPayment, setSelectedPayment] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [ecoRatingFilter, setEcoRatingFilter] = useState<string>("all");

  // Comparison State
  const [compareList, setCompareList] = useState<Machine[]>([]);
  const [isComparingOpen, setIsComparingOpen] = useState<boolean>(false);

  // Filtered Machines
  const filteredMachines = COMMERICAL_MACHINES.filter((machine) => {
    const categoryMatches = selectedCategory === "all" || machine.category === selectedCategory;
    const searchMatches = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          machine.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          machine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const capacityMatches = machine.capacity >= minCapacity;
    const paymentMatches = selectedPayment === "all" || machine.paymentTypes.includes(selectedPayment as any);
    const priceMatches = machine.purchaseCost <= maxPrice;
    const ecoMatches = ecoRatingFilter === "all" || machine.ecoRating === ecoRatingFilter;

    return categoryMatches && searchMatches && capacityMatches && paymentMatches && priceMatches && ecoMatches;
  });

  const toggleCompare = (machine: Machine) => {
    setCompareList((prev) => {
      const isAlreadyIn = prev.some((m) => m.id === machine.id);
      if (isAlreadyIn) {
        return prev.filter((m) => m.id !== machine.id);
      } else {
        if (prev.length >= 2) {
          // Max 2 machines compare. Swap first
          return [prev[1], machine];
        }
        return [...prev, machine];
      }
    });
  };

  const removeCompare = (id: string) => {
    setCompareList((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Search and Filters Controller Accent Header */}
      <section className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-5 w-5 text-teal-400" />
              Machine Fleet Catalog
            </h2>
            <p className="text-xs text-slate-400">
              Browse and search our premier series of high-throughput automated retail nodes.
            </p>
          </div>
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search specifications or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 active:border-teal-500 transition-all font-mono"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Categories Tab Selectors */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-5">
          {[
            { id: "all", label: "All Hardware Platforms" },
            { id: "snack", label: "Smart Snack" },
            { id: "coffee", label: "Specialty Coffee" },
            { id: "beverage", label: "Chilled Beverage" },
            { id: "fridge", label: "Smart Grab & Go" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-teal-500 text-slate-950 shadow-[0_4px_20px_rgba(45,212,191,0.3)] scale-[1.02]"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Detailed Advanced Multi-filter Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 text-slate-300">
          {/* Slider: Capacity */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              Min Capacity ({minCapacity || "Any"} items)
            </label>
            <input
              type="range"
              min="0"
              max="500"
              step="50"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>0 items</span>
              <span>500 items</span>
            </div>
          </div>

          {/* Selector: Payment Tech */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              Payment Standard
            </label>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
            >
              <option value="all">Any payment type</option>
              <option value="UPI & Wallet">UPI & Wallet Accepted</option>
              <option value="Card NFC">Card NFC Enabled</option>
              <option value="RFID Tap">RFID Kiosk Tap</option>
              <option value="Cash">Cash Acceptor</option>
            </select>
          </div>

          {/* Slider: Purchase Price Limit */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              Max Purchase Cost (${maxPrice.toLocaleString()})
            </label>
            <input
              type="range"
              min="3005"
              max="8000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>$3,000</span>
              <span>$8,000</span>
            </div>
          </div>

          {/* Selector: Eco Power Rating */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              Energy Efficiency
            </label>
            <select
              value={ecoRatingFilter}
              onChange={(e) => setEcoRatingFilter(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
            >
              <option value="all">Any Eco Tier</option>
              <option value="A++">A++ (Ultra Savings)</option>
              <option value="A+">A+ (Premium Eff.)</option>
              <option value="A">Standard Green</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {(selectedCategory !== "all" || searchQuery !== "" || minCapacity > 0 || selectedPayment !== "all" || maxPrice < 8000 || ecoRatingFilter !== "all") && (
          <div className="flex justify-start text-[11px] text-teal-400">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setMinCapacity(0);
                setSelectedPayment("all");
                setMaxPrice(8000);
                setEcoRatingFilter("all");
              }}
              className="hover:underline flex items-center gap-1 bg-teal-400/5 px-3 py-1 rounded-full border border-teal-400/10"
            >
              <X className="h-3 w-3" />
              Reset filters and display all ({COMMERICAL_MACHINES.length}) models
            </button>
          </div>
        )}
      </section>

      {/* Inline Hardware Comparator Panel */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/20 border border-teal-500/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-teal-400 animate-pulse shrink-0" />
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">Compare Queue ({compareList.length}/2)</p>
                <p className="text-[11px] text-slate-300">Select two automated retail hubs to benchmark side-by-side specs.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {compareList.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 bg-slate-950/90 border border-teal-500/20 rounded-full px-3 py-1.5 text-xs text-white">
                  <span className="font-mono text-[10px] text-teal-300 font-semibold">{m.name}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCompare(m.id);
                    }} 
                    className="text-red-400 hover:text-red-300 cursor-pointer p-0.5"
                    title="Remove item"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <button
                disabled={compareList.length < 2}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsComparingOpen(true);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  compareList.length === 2
                    ? "bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-lg cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                {compareList.length === 2 ? "Compare Now" : "Select 2 items"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredMachines.length === 0 ? (
            <div className="col-span-2 py-16 text-center bg-slate-900/20 rounded-3xl border border-white/5 space-y-2">
              <HelpCircle className="h-10 w-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 font-mono text-sm uppercase">No units match your current filter parameters</p>
              <p className="text-slate-500 text-xs">Try resetting or broadening your search options.</p>
            </div>
          ) : (
            filteredMachines.map((machine) => {
              const isSelectedForVerify = compareList.some((m) => m.id === machine.id);
              return (
                <motion.div
                  key={machine.id}
                  layoutId={`card-${machine.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-950/40 border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.6)] duration-300 relative flex flex-col h-full group"
                >
                  {/* Category Stamp & Compare action corner */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/25 text-white/90 text-[10px] font-mono uppercase tracking-widest backdrop-blur-md">
                      {machine.categoryLabel}
                    </span>
                    {onToggleWishlist && wishlistIds && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onToggleWishlist(machine.id);
                        }}
                        className={`h-7 w-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all border shrink-0 cursor-pointer ${
                          wishlistIds.includes(machine.id)
                            ? "bg-pink-500/20 text-pink-500 border-pink-500/30 shadow-md"
                            : "bg-slate-950/85 text-white/50 border-white/10 hover:text-pink-400"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${wishlistIds.includes(machine.id) ? "fill-current" : ""}`} />
                      </button>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCompare(machine);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-all duration-200 border ${
                        isSelectedForVerify
                          ? "bg-teal-500 text-slate-950 border-teal-500 font-bold shadow-md animate-pulse"
                          : "bg-slate-950/80 text-white/70 border-white/10 hover:text-white"
                      }`}
                    >
                      {isSelectedForVerify ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Marked Compare
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 text-teal-400" />
                          Compare
                        </>
                      )}
                    </button>
                  </div>

                  {/* Machine Cover Photo with subtle zoom */}
                  <div className="relative h-56 overflow-hidden bg-slate-900 flex justify-center items-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                    <img
                      src={machine.imageUrl}
                      alt={machine.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute bottom-4 left-5 right-5 z-20">
                      <p className="text-stone-300 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1">
                        <Tag className="h-3 w-3 text-teal-400" />
                        Commercial Smart Series
                      </p>
                      <h3 className="text-xl font-extrabold text-white tracking-tight">{machine.name}</h3>
                    </div>
                  </div>

                  {/* Specs Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <p className="text-slate-400 text-xs leading-relaxed font-light">{machine.tagline}</p>
                      
                      {/* Specs Row */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">ECO Power</span>
                          <p className="text-xs text-white uppercase font-bold flex items-center justify-center gap-1 text-emerald-400">
                            <Zap className="h-3 w-3" />
                            {machine.ecoRating}
                          </p>
                        </div>
                        <div className="space-y-0.5 border-x border-white/5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Capacity</span>
                          <p className="text-xs text-white font-bold">{machine.capacity} items</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Temp Range</span>
                          <p className="text-xs text-white font-semibold font-mono">{machine.temperatureSpan}</p>
                        </div>
                      </div>

                      {/* Bullet Highlights */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">Node Highlights:</span>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          {machine.features.slice(0, 4).map((f, i) => (
                            <div key={i} className="flex gap-1.5 items-center text-[10px] text-slate-300 font-light truncate">
                              <span className="text-teal-400 font-bold">✓</span>
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Lease vs Buy Indicators and CTA Buttons */}
                    <div className="pt-5 space-y-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">Purchase Price</span>
                          <p className="text-lg font-bold text-white font-mono">${machine.purchaseCost.toLocaleString()}</p>
                        </div>
                        <div className="text-right border-l border-white/10 pl-6">
                          <span className="text-[9px] font-mono text-slate-500 uppercase">Lease / Month</span>
                          <p className="text-lg font-bold text-teal-400 font-mono">${machine.monthlyRent}/<span className="text-[10px] text-teal-500 font-sans">mo</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={() => onSelectConfigure(machine)}
                          className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs text-white uppercase tracking-wider flex items-center justify-center gap-1.5 group/btn"
                        >
                          <Gauge className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform text-teal-400" />
                          Custom Design
                        </button>
                        <button
                          onClick={() => onRequestQuote(machine)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:opacity-90 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(45,212,191,0.2)] flex items-center justify-center gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Rent/Buy Quote
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Floating Compare Drawer Ribbon */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-slate-900 border border-teal-500/30 backdrop-blur-xl rounded-full px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                  Compare Queue ({compareList.length}/2 selected)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {compareList.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-1.5 bg-slate-950 border border-white/10 rounded-full px-2.5 py-1 text-[10px] text-slate-300 font-mono"
                  >
                    <span className="max-w-[120px] truncate">{m.name}</span>
                    <button onClick={() => removeCompare(m.id)} className="text-red-400 hover:text-red-300">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                disabled={compareList.length < 2}
                onClick={() => setIsComparingOpen(true)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  compareList.length === 2
                    ? "bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-[0_4px_14px_rgba(45,212,191,0.4)] cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Compare Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side Comparison Big Modal */}
      <AnimatePresence>
        {isComparingOpen && compareList.length === 2 && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[100] overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-[32px] max-w-4xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-auto"
            >
              <button
                onClick={() => setIsComparingOpen(false)}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors hover:scale-105 duration-100"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1.5 border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-extrabold">Side-by-Side Spec Matrix</span>
                <h3 className="text-2xl font-extrabold text-white">Compare Automated Platforms</h3>
              </div>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 font-mono uppercase tracking-widest text-slate-500 font-bold">Specification</th>
                      <th className="py-3 px-4 text-teal-400 font-extrabold text-sm">{compareList[0].name}</th>
                      <th className="py-3 px-4 text-emerald-400 font-extrabold text-sm">{compareList[1].name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Category</td>
                      <td className="py-4 px-4 font-semibold text-white">{compareList[0].categoryLabel}</td>
                      <td className="py-4 px-4 font-semibold text-white">{compareList[1].categoryLabel}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Item Capacity</td>
                      <td className="py-4 px-4 font-mono text-white font-bold">{compareList[0].capacity} item units</td>
                      <td className="py-4 px-4 font-mono text-white font-bold">{compareList[1].capacity} item units</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Outright Purchase</td>
                      <td className="py-4 px-4 font-mono font-bold text-white">${compareList[0].purchaseCost.toLocaleString()} USD</td>
                      <td className="py-4 px-4 font-mono font-bold text-white">${compareList[1].purchaseCost.toLocaleString()} USD</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Monthly Rental Lease</td>
                      <td className="py-4 px-4 font-mono font-bold text-teal-400">${compareList[0].monthlyRent} / mo</td>
                      <td className="py-4 px-4 font-mono font-bold text-emerald-400">${compareList[1].monthlyRent} / mo</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Integrated Payments</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {compareList[0].paymentTypes.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 font-mono">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {compareList[1].paymentTypes.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-slate-400 font-mono">{p}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Eco Save Tier</td>
                      <td className="py-4 px-4 text-emerald-400 font-extrabold font-mono">{compareList[0].ecoRating} Class</td>
                      <td className="py-4 px-4 text-emerald-400 font-extrabold font-mono">{compareList[1].ecoRating} Class</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Thermal Parameters</td>
                      <td className="py-4 px-4 font-mono">{compareList[0].temperatureSpan}</td>
                      <td className="py-4 px-4 font-mono">{compareList[1].temperatureSpan}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Size / Footprint</td>
                      <td className="py-4 px-4 font-mono">{compareList[0].dimensions}</td>
                      <td className="py-4 px-4 font-mono">{compareList[1].dimensions}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Weight Class</td>
                      <td className="py-4 px-4 font-mono">{compareList[0].weight} kg</td>
                      <td className="py-4 px-4 font-mono">{compareList[1].weight} kg</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-400 uppercase">Unique Innovations</td>
                      <td className="py-4 px-4">
                        <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px] font-light">
                          {compareList[0].features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-4 px-4">
                        <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px] font-light">
                          {compareList[1].features.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons inside comparison matrix */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Proceed with Model A:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsComparingOpen(false);
                        onSelectConfigure(compareList[0]);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase transition-all font-mono text-white"
                    >
                      Customize Branding
                    </button>
                    <button
                      onClick={() => {
                        setIsComparingOpen(false);
                        onRequestQuote(compareList[0]);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs uppercase"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-l border-white/10 pl-4">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Proceed with Model B:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsComparingOpen(false);
                        onSelectConfigure(compareList[1]);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase transition-all font-mono text-white"
                    >
                      Customize Branding
                    </button>
                    <button
                      onClick={() => {
                        setIsComparingOpen(false);
                        onRequestQuote(compareList[1]);
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
