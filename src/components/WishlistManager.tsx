import React, { useState } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { Heart, Trash2, Share2, Clipboard, Printer, ExternalLink, CalendarDays, Coins, HelpCircle, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WishlistManagerProps {
  language: LanguageCode;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectConfigure: (machine: Machine) => void;
  onGoToCatalog: () => void;
}

export default function WishlistManager({
  language,
  wishlistIds,
  onToggleWishlist,
  onSelectConfigure,
  onGoToCatalog
}: WishlistManagerProps) {
  const t = TRANSLATIONS[language];
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);

  // Filter based on selected IDs
  const wishlistItems = COMMERICAL_MACHINES.filter((m) => wishlistIds.includes(m.id));

  // Cumulative budget parameters
  const cumulativePurchaseCost = wishlistItems.reduce((acc, current) => acc + current.purchaseCost, 0);
  const cumulativeMonthlyRent = wishlistItems.reduce((acc, current) => acc + current.monthlyRent, 0);

  // Generate shareable link
  const handleGenerateShareLink = () => {
    if (wishlistIds.length === 0) return;
    
    // Create query parameters with selected IDs
    const currentOrigin = window.location.origin;
    const idsString = wishlistIds.join(",");
    const shareUrl = `${currentOrigin}?wishlist=${encodeURIComponent(idsString)}`;
    
    // Use navigator clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }).catch((err) => {
      console.error("Clipboard copy failed:", err);
    });
  };

  // Trigger print specification layout
  const handlePrintSpecs = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Structural Headers */}
      <div className="space-y-2 border-b border-white/5 pb-5">
        <span className="text-[10px] font-mono tracking-widest text-[#EC4899] uppercase font-extrabold flex items-center gap-1">
          <Heart className="h-4 w-4 text-pink-400 animate-pulse" />
          {t.wishlist}
        </span>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          {t.wishlist_title}
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
          {t.wishlist_desc}
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        /* EMPTY STATE VIEWPORT */
        <div className="border border-white/5 bg-slate-950/40 p-12 text-center rounded-3xl space-y-4 max-w-xl mx-auto">
          <Heart className="h-10 w-10 text-slate-700 mx-auto" />
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest font-mono">Procurement Wishlist Empty</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto pt-1 font-light leading-relaxed">
              Explore our fleet of robotic coffee pods, glass-front snacks kiosks and unmanned touch smart-fridges to begin compiling your corporate deployment proposal.
            </p>
          </div>
          <button
            onClick={onGoToCatalog}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] font-bold uppercase tracking-widest border border-white/10 rounded-xl transition-colors"
          >
            Visit Hardware Catalog
          </button>
        </div>
      ) : (
        /* WISH LIST CONTAINER LAYOUT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SECURE ITEM LISTING COLUMN (8/12) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-white/5 text-xs">
              <span className="text-slate-400 font-mono text-[10px]">Saved Kiosks: <span className="text-white font-bold">{wishlistItems.length}</span></span>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePrintSpecs}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-[10px] font-mono flex items-center gap-1 border border-white/5 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print RFQ proposal</span>
                </button>
                
                <button
                  onClick={handleGenerateShareLink}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-all ${
                    copyFeedback
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-[#EC4899]/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/15"
                  }`}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>{copyFeedback ? "Copied Link!" : t.share_wishlist}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {wishlistItems.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900 border border-white/5 rounded-3xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center hover:border-white/10 transition-colors"
                  >
                    {/* Machine visual representation */}
                    <div className="md:col-span-3 rounded-2xl overflow-hidden aspect-video md:aspect-square border border-white/5">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Specifications parameters */}
                    <div className="md:col-span-6 space-y-3">
                      <div>
                        <span className="text-[8px] font-mono text-pink-400 uppercase tracking-widest block font-extrabold">{item.categoryLabel}</span>
                        <h4 className="text-md font-bold text-white mt-0.5">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 font-light line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>

                      {/* Dimensions tags */}
                      <div className="flex gap-2 text-[9px] font-mono text-slate-500">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-white/5">Dim: {item.dimensions}</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-white/5">Weight: {item.weight} kg</span>
                      </div>
                    </div>

                    {/* Operational controls */}
                    <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-3 p-3 bg-slate-950/60 rounded-2xl border border-white/5 h-full">
                      <div className="text-left md:text-right font-mono space-y-0.5">
                        <p className="text-[9px] text-slate-500 uppercase">Est. Lease monthly</p>
                        <p className="text-md font-bold text-white">${item.monthlyRent} <span className="text-[10px] text-slate-500 font-light">/mo</span></p>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto">
                        <button
                          onClick={() => onSelectConfigure(item)}
                          className="flex-1 md:flex-none px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-mono border border-white/5 transition-colors"
                        >
                          Configure
                        </button>
                        
                        <button
                          onClick={() => onToggleWishlist(item.id)}
                          className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* PROCUREMENT COMBINED ESTIMATE REPORT SIDEBAR (4/12) */}
          <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-5">
            <h3 className="text-xs font-mono font-extrabold text-white uppercase tracking-widest border-b border-white/5 pb-2.5">
              Stakeholder Proposal Summary
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>Joint fleet count:</span>
                <span className="text-white font-bold">{wishlistItems.length} units</span>
              </div>

              {/* Purchase outlay summary */}
              <div className="p-3 bg-slate-950 rounded-xl space-y-1 relative overflow-hidden">
                <p className="text-[8px] text-slate-500 uppercase">Aggregate Outright CapEx:</p>
                <p className="text-xl font-bold text-white">${cumulativePurchaseCost.toLocaleString()}</p>
                <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
              </div>

              {/* Monthly lease aggregate */}
              <div className="p-3 bg-slate-950 rounded-xl space-y-1 relative overflow-hidden">
                <p className="text-[8px] text-slate-500 uppercase">Aggregate Monthly Lease OpEx:</p>
                <p className="text-xl font-bold text-pink-400">${cumulativeMonthlyRent.toLocaleString()} <span className="text-xs text-slate-400">/ month</span></p>
                <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-pink-400" />
              </div>
            </div>

            {/* Procurement details */}
            <div className="p-3 bg-pink-950/20 rounded-xl border border-pink-500/10 text-[9px] font-mono leading-relaxed text-slate-400 space-y-1">
              <p className="font-bold text-pink-300 uppercase">RFQ stakeholders notes:</p>
              <p>Printing this proposal saves the individual vending machinery physical and mechanical parameters specs, heat configuration constants, and UPI scan rules as a standard formatted quote.</p>
            </div>

            {/* Sharing instructions */}
            <div className="text-center font-mono text-[9px] text-slate-500 pt-1">
              <p>Click share to copy stakeholders link. Decision-makers opening that URL will pre-load the matched machinery fleet automatically on startup.</p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
