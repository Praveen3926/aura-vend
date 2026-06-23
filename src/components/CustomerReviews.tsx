import React, { useState } from "react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { Star, MessageSquare, Plus, Check, UserCheck, Calendar, Filter, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomerReviewsProps {
  language: LanguageCode;
}

interface Review {
  id: string;
  machineId: string;
  machineName: string;
  reviewerName: string;
  companyName: string;
  stars: number;
  date: string;
  comment: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    machineId: "coffee-aerobrew",
    machineName: "AeroBrew Elite",
    reviewerName: "Amrita Dev",
    companyName: "Siemens Corporate Tech",
    stars: 5,
    date: "2026-05-18",
    comment: "This bean-to-cup machine has been running continuously for our IT office layout for 4 months. Exceptional uptime, espresso flavor profiles are incredibly balanced. Highly recommended for premium hospitality.",
    verified: true
  },
  {
    id: "rev-2",
    machineId: "snack-visivibe",
    machineName: "VisiVibe Snack Station",
    reviewerName: "Kabir Mehta",
    companyName: "Pioneer Global Academy",
    stars: 4,
    date: "2026-06-02",
    comment: "Robotic soft-conveyor lifters drop delicate baked goods smoothly without crushing them. The students love scanning their Google Pay barcodes. Minor calibration needed in heat zone 2, but service was stellar.",
    verified: true
  },
  {
    id: "rev-3",
    machineId: "fridge-aura",
    machineName: "Aura AI Smart Fridge",
    reviewerName: "Dr. Rachel Green",
    companyName: "City Heart Diagnostics",
    stars: 5,
    date: "2026-06-11",
    comment: "Outstanding technological innovation. Computer-vision cameras track grab-and-go actions with near 100% precision. Keeps fresh salads at a steady 3°C, helping our medical crew stay fueled overnight.",
    verified: true
  },
  {
    id: "rev-4",
    machineId: "beverage-hydrocell",
    machineName: "HydroCell Max Cold Vender",
    reviewerName: "Viktor Petrov",
    companyName: "Metro Transit Authority",
    stars: 5,
    date: "2026-06-20",
    comment: "High throughput canister capacity is perfect for train subway lines. Very low power rating (EcoMode active). The payment terminal has worked seamlessly across UPI, credit card, and contactless RFID wrists.",
    verified: true
  }
];

export default function CustomerReviews({ language }: CustomerReviewsProps) {
  const t = TRANSLATIONS[language];

  // States
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [filterMachineId, setFilterMachineId] = useState<string>("all");
  
  // New review form
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newReviewer, setNewReviewer] = useState<string>("");
  const [newCompany, setNewCompany] = useState<string>("");
  const [newMachineId, setNewMachineId] = useState<string>(COMMERICAL_MACHINES[0].id);
  const [newStars, setNewStars] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  // Filtered reviews
  const filteredReviews = filterMachineId === "all"
    ? reviews
    : reviews.filter((r) => r.machineId === filterMachineId);

  // Calculations for aggregate overview
  const totalReviews = reviews.length;
  const averageRating = (reviews.reduce((sum, r) => sum + r.stars, 0) / totalReviews).toFixed(1);
  
  const ratingCounts = [5, 4, 3, 2, 1].map((starNum) => {
    const count = reviews.filter((r) => r.stars === starNum).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { starNum, count, percentage };
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer || !newComment) return;

    const chosenMachine = COMMERICAL_MACHINES.find((m) => m.id === newMachineId);
    const generatedReview: Review = {
      id: `rev-custom-${Date.now()}`,
      machineId: newMachineId,
      machineName: chosenMachine ? chosenMachine.name : "Custom Kiosk Unit",
      reviewerName: newReviewer,
      companyName: newCompany || "Independent Operator",
      stars: newStars,
      date: new Date().toISOString().split("T")[0],
      comment: newComment,
      verified: true
    };

    setReviews([generatedReview, ...reviews]);
    setWasSubmitted(true);
    
    // Clear
    setNewReviewer("");
    setNewCompany("");
    setNewComment("");
    
    setTimeout(() => {
      setWasSubmitted(false);
      setShowForm(false);
    }, 2200);
  };

  return (
    <div className="space-y-8">
      
      {/* Structural Headers */}
      <div className="space-y-2 border-b border-white/5 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#10B981] uppercase font-extrabold flex items-center gap-1">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            {t.reviews_ratings}
          </span>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            {t.reviews_title}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
            {t.reviews_desc}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-[#10B981] to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-1.5 self-start sm:self-center shrink-0 shadow-lg hover:scale-[1.01] transition-transform"
        >
          <Plus className="h-4 w-4 text-slate-950" />
          <span>Write Operator Review</span>
        </button>
      </div>

      {/* RATING BREAKDOWN STATISTICAL BENTO HEADER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Core Big Score */}
        <div className="md:col-span-4 bg-slate-900 border border-white/5 p-6 rounded-3xl text-center space-y-2">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">Total System Rating</span>
          <div className="space-y-1">
            <p className="text-5xl font-mono font-black text-white">{averageRating}</p>
            <div className="flex justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4.5 w-4.5 fill-current ${
                    i < Math.round(Number(averageRating)) ? "text-amber-400" : "text-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Based on {totalReviews} certified deployments</p>
        </div>

        {/* Linear Percentage Bars */}
        <div className="md:col-span-8 bg-slate-900/60 border border-white/5 p-6 rounded-3xl space-y-2.5">
          {ratingCounts.map((row) => (
            <div key={row.starNum} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-[10px] text-slate-400 w-3 text-right">{row.starNum}</span>
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
              <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="font-mono text-[9px] text-slate-400 w-6 text-right">{row.count}</span>
            </div>
          ))}
        </div>

      </div>

      {/* TOGGLED DRAWER: WRITE NEW B2B FEEDBACK FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-slate-950/60 border border-[#10B981]/25 rounded-3xl"
          >
            {wasSubmitted ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 animate-bounce">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white uppercase font-mono">Review Received</h4>
                  <p className="text-xs text-slate-400 font-mono pt-1">Thank you! Your verified performance report has been compiled in client logs.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <h3 className="md:col-span-2 text-xs font-mono font-extrabold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-2">
                  Compile Verified Operator Feedback
                </h3>

                {/* Operator Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewer}
                    onChange={(e) => setNewReviewer(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Corporate Partner Company */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Company / Agency Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Bangalore IT Office Complex"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Target robotic machine */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Vending Model deployed</label>
                  <select
                    value={newMachineId}
                    onChange={(e) => setNewMachineId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    {COMMERICAL_MACHINES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Star rating picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Equipment Reliability Star Rating</label>
                  <div className="flex gap-1.5 items-center pt-1.5">
                    {[1, 2, 3, 4, 5].map((starNum) => (
                      <button
                        type="button"
                        key={starNum}
                        onClick={() => setNewStars(starNum)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`h-5 w-5 fill-current ${
                            starNum <= newStars ? "text-amber-400" : "text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2 font-mono font-bold">({newStars}/5 stars)</span>
                  </div>
                </div>

                {/* Comment */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase block">Deployment Observations & Comment</label>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Provide details on temperature zones, uptime patterns, replenishment feedback, and client reactions..."
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Submit button */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-widest rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Upload Performance Review</span>
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER BUTTON RAIL FOR MODULAR SELECTION */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-extrabold block">Filter Feedbacks:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMachineId("all")}
            className={`px-3 py-1.5 rounded-xl text-[10px] text-white border transition-all ${
              filterMachineId === "all"
                ? "bg-emerald-500/10 border-emerald-400 font-bold"
                : "bg-slate-950/40 border-white/5 hover:border-white/20"
            }`}
          >
            All Hardware
          </button>
          {COMMERICAL_MACHINES.map((machine) => (
            <button
              key={machine.id}
              onClick={() => setFilterMachineId(machine.id)}
              className={`px-3 py-1.5 rounded-xl text-[10px] text-white border transition-all ${
                filterMachineId === machine.id
                  ? "bg-emerald-500/10 border-emerald-400 font-bold"
                  : "bg-slate-950/40 border-white/5 hover:border-white/20"
              }`}
            >
              {machine.name}
            </button>
          ))}
        </div>
      </div>

      {/* CHRONOLOGICAL FEED LIST OF OPERATOR REVIEWS */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/30 border border-white/5 rounded-3xl">
            <MessageSquare className="h-8 w-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No client reviews registered under this specific machine profile yet.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow hover:border-white/10 transition-colors"
            >
              
              <div className="space-y-2">
                {/* Header card details */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h5 className="text-slate-200 text-xs font-bold leading-none">{rev.reviewerName}</h5>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">{rev.companyName}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stars render */}
                    <div className="flex gap-0.5 text-amber-400 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 fill-current ${
                            i < rev.stars ? "text-amber-400" : "text-slate-800"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Model label tag */}
                    <span className="text-[9px] font-mono bg-slate-950 border border-white/10 text-slate-400 px-2 py-0.5 rounded">
                      {rev.machineName}
                    </span>
                  </div>
                </div>

                {/* Review actual description */}
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified deployment footnote parameters */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Deployed: {rev.date}
                </span>

                {rev.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 rounded">
                    <UserCheck className="h-3 w-3 text-emerald-400" />
                    Verified Operator
                  </span>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
