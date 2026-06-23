import React, { useState } from "react";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { Sliders, TrendingUp, HelpCircle, Coins, Award, Zap, Briefcase, ChevronRight, Calculator, RefreshCw } from "lucide-react";
import { TRANSLATIONS, LanguageCode } from "../utils/languages";

interface CostCalculatorProps {
  language: LanguageCode;
}

export default function CostCalculator({ language }: CostCalculatorProps) {
  const t = TRANSLATIONS[language];
  // Configured inputs
  const [selectedMachineId, setSelectedMachineId] = useState<string>(COMMERICAL_MACHINES[0].id);
  const [machineCount, setMachineCount] = useState<number>(3);
  const [dailySalesPerMachine, setDailySalesPerMachine] = useState<number>(45);
  const [leaseDurationMonths, setLeaseDurationMonths] = useState<number>(24);
  const [markupMargin, setMarkupMargin] = useState<number>(0.65); // Net margin per transaction (e.g., $0.65 profit per snack/drink)

  const selectedMachine = COMMERICAL_MACHINES.find((m) => m.id === selectedMachineId) || COMMERICAL_MACHINES[0];

  // Calculations
  // 1. Outright Purchase
  const initialPurchaseCapEx = selectedMachine.purchaseCost * machineCount;
  const purchaseSetupFee = 450 * machineCount;
  const purchaseMonthlyMaintenance = 55 * machineCount;
  const initialPurchaseTotalOutlay = initialPurchaseCapEx + purchaseSetupFee;

  const getCumulativePurchaseCost = (month: number) => {
    return initialPurchaseTotalOutlay + (purchaseMonthlyMaintenance * month);
  };

  // 2. Rental (Lease Route)
  const initialRentalCapEx = selectedMachine.monthlyRent * machineCount; // Security deposit
  const rentalSetupFee = 150 * machineCount;
  const rentalMonthlyFee = selectedMachine.monthlyRent * machineCount;
  const initialRentalTotalOutlay = rentalSetupFee + initialRentalCapEx;

  const getCumulativeRentalCost = (month: number) => {
    return initialRentalTotalOutlay + (rentalMonthlyFee * month);
  };

  // Net Profit projections (Product Sales Revenue)
  // Monthly units sold = dailySalesPerMachine * 30 days * count
  const monthlyUnitsSold = dailySalesPerMachine * 30 * machineCount;
  const monthlySalesRevenueMargin = monthlyUnitsSold * markupMargin;

  // Break-even month calculation (where purchase becomes cheaper than rental)
  // buy_cost + maintenance * m = rent_deposit + rent_setup + rental_monthly * m
  // m * (rental_monthly - maintenance) = buy_cost + setup_buy - rent_deposit - setup_rent
  const costDiffNumerator = initialPurchaseTotalOutlay - initialRentalTotalOutlay;
  const monthlyCostDiffDenominator = rentalMonthlyFee - purchaseMonthlyMaintenance;
  const breakEvenMonth = monthlyCostDiffDenominator > 0 
    ? Math.max(1, Math.round(costDiffNumerator / monthlyCostDiffDenominator)) 
    : 0;

  // Cumulative numbers at selected duration
  const cumulativePurchaseCost = getCumulativePurchaseCost(leaseDurationMonths);
  const cumulativeRentalCost = getCumulativeRentalCost(leaseDurationMonths);
  
  const estimatedRevenueTotal = monthlySalesRevenueMargin * leaseDurationMonths;

  // Let's generate SVG Chart data points
  // We want to generate coordinates for a responsive SVG chart plotting the lines over 36 months
  const chartMonths = [0, 6, 12, 18, 24, 30, 36];
  
  // Find maximum cost for SVG scaling
  const maxCostCoordinate = Math.max(
    getCumulativePurchaseCost(36),
    getCumulativeRentalCost(36)
  );

  const getSvgCoordinates = (lineType: "purchase" | "rental") => {
    const width = 500;
    const height = 180;
    const padding = 25;

    return chartMonths.map((m) => {
      const cost = lineType === "purchase" ? getCumulativePurchaseCost(m) : getCumulativeRentalCost(m);
      const x = padding + (m / 36) * (width - 2 * padding);
      const y = height - padding - (cost / maxCostCoordinate) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(" ");
  };

  const getDotCoordinate = (month: number, lineType: "purchase" | "rental") => {
    const width = 500;
    const height = 180;
    const padding = 25;
    const cost = lineType === "purchase" ? getCumulativePurchaseCost(month) : getCumulativeRentalCost(month);
    const x = padding + (month / 36) * (width - 2 * padding);
    const y = height - padding - (cost / maxCostCoordinate) * (height - 2 * padding);
    return { x, y };
  };

  const selectedDotPurchase = getDotCoordinate(leaseDurationMonths, "purchase");
  const selectedDotRental = getDotCoordinate(leaseDurationMonths, "rental");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT INPUT CONTROLS / SLIDERS (6 / 12) */}
      <div className="lg:col-span-6 space-y-6">
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="border-b border-white/5 pb-4 space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-extrabold flex items-center gap-1.5">
              <Calculator className="h-4 w-4" />
              FINANCIAL CAPEX VS OPEX FORECASTER
            </span>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              Rental vs Purchase Cost
            </h2>
            <p className="text-xs text-slate-400">
              Simulate upfront purchase capital requirements compared to our zero-CapEx monthly leases.
            </p>
          </div>

          <div className="space-y-5">
            {/* Model Target Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase db">
                A. Choose Machine Series Reference
              </label>
              <select
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
              >
                {COMMERICAL_MACHINES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (${m.purchaseCost.toLocaleString()} buy / ${m.monthlyRent} lease)
                  </option>
                ))}
              </select>
            </div>

            {/* Slider: Machine Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                <span>B. Machine Fleet Count</span>
                <span className="text-teal-400 font-extrabold">{machineCount} machines</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={machineCount}
                onChange={(e) => setMachineCount(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>1 machine</span>
                <span>10 machines</span>
              </div>
            </div>

            {/* Slider: Daily Sales Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                <span>C. Est. Daily Sales Per Machine</span>
                <span className="text-teal-400 font-extrabold">{dailySalesPerMachine} items / day</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={dailySalesPerMachine}
                onChange={(e) => setDailySalesPerMachine(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>10 vends/day</span>
                <span>100 vends/day</span>
              </div>
            </div>

            {/* Slider: Projected Contract Length */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                <span>D. Operating Horizon Duration</span>
                <span className="text-teal-400 font-extrabold">{leaseDurationMonths} months</span>
              </div>
              <input
                type="range"
                min="6"
                max="36"
                step="6"
                value={leaseDurationMonths}
                onChange={(e) => setLeaseDurationMonths(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>6 months</span>
                <span>36 months</span>
              </div>
            </div>

            {/* Net Margin Preset */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
                <span>E. Net margin profit per vend</span>
                <span className="text-emerald-400 font-extrabold">${markupMargin.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.30"
                max="1.50"
                step="0.05"
                value={markupMargin}
                onChange={(e) => setMarkupMargin(Number(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>$0.30 profit</span>
                <span>$1.50 profit</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Financial Advice block */}
        <div className={`p-5 rounded-3xl border ${
          leaseDurationMonths >= breakEvenMonth 
            ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-200" 
            : "bg-teal-500/10 border-teal-500/20 text-teal-200"
        }`}>
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold uppercase tracking-wider">
                {leaseDurationMonths >= breakEvenMonth 
                  ? "Recommendation: Direct Outright Purchase" 
                  : "Recommendation: Flexible Monthly Rental"}
              </h4>
              <p className="opacity-80 font-light leading-relaxed">
                {leaseDurationMonths >= breakEvenMonth 
                  ? `Your targeted operational duration (${leaseDurationMonths} months) exceeds the cost break-even point of ${breakEvenMonth} months. Acquiring the machine outright saves you $${Math.round(cumulativeRentalCost - cumulativePurchaseCost).toLocaleString()} in redundant lease fees over time.` 
                  : `For shorter operating horizons (less than ${breakEvenMonth} months), our zero-CapEx Monthly Lease minimizes liquidity risks. You bypass the initial raw investment of $${initialPurchaseCapEx.toLocaleString()} while retaining free maintenance support.`}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT REPORT & GRAPHS COLUMN (6 / 12) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Cost Summary Cards */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Cumulative Spend Projections
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Purchase Row */}
            <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Outright Purchase Outlay</span>
              <p className="text-xl font-bold text-white font-mono mt-0.5">
                ${cumulativePurchaseCost.toLocaleString()}
              </p>
              <div className="mt-2 space-y-1 text-[9px] font-mono text-slate-400">
                <p>Initial CapEx: ${initialPurchaseCapEx.toLocaleString()}</p>
                <p>Maint. total: ${(purchaseMonthlyMaintenance * leaseDurationMonths).toLocaleString()}</p>
              </div>
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-400" />
            </div>

            {/* Rental Row */}
            <div className="bg-slate-950/60 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Monthly Rental Lease</span>
              <p className="text-xl font-bold text-teal-400 font-mono mt-0.5">
                ${cumulativeRentalCost.toLocaleString()}
              </p>
              <div className="mt-2 space-y-1 text-[9px] font-mono text-slate-400 font-light">
                <p>Initial Setup: ${rentalSetupFee.toLocaleString()}</p>
                <p>Rental total: ${(rentalMonthlyFee * leaseDurationMonths).toLocaleString()}</p>
              </div>
              <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-teal-400" />
            </div>
          </div>

          {/* SVG Comparative Chart Area */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
              <span>Financial Cost Curve (36 Months forecast)</span>
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 bg-violet-400 rounded-full" /> Buy</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 bg-teal-400 rounded-full" /> Rent</span>
              </span>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-white/5 relative flex items-center justify-center">
              <svg viewBox="0 0 500 180" className="w-[100%] h-auto">
                {/* Horizontal Guide lines */}
                <line x1="25" y1="25" x2="475" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="25" y1="80" x2="475" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="25" y1="135" x2="475" y2="135" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                {/* Purchase Curve */}
                <polyline
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                  strokeDasharray="0"
                  points={getSvgCoordinates("purchase")}
                />

                {/* Leasing Curve */}
                <polyline
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="2.5"
                  points={getSvgCoordinates("rental")}
                />

                {/* Interactive Current Selection Indicator Dot - Buy */}
                {selectedDotPurchase && (
                  <circle cx={selectedDotPurchase.x} cy={selectedDotPurchase.y} r="5.5" fill="#a78bfa" className="animate-pulse" />
                )}

                {/* Interactive Current Selection Indicator Dot - Rental */}
                {selectedDotRental && (
                  <circle cx={selectedDotRental.x} cy={selectedDotRental.y} r="5.5" fill="#2dd4bf" className="animate-pulse" />
                )}

                {/* X Axis label coordinates */}
                <text x="25" y="170" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">Month 0</text>
                <text x="175" y="170" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">Month 12</text>
                <text x="325" y="170" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">Month 24</text>
                <text x="445" y="170" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">Month 36</text>
              </svg>
            </div>
          </div>

          {/* Break-even KPI */}
          <div className="bg-slate-950/40 p-4 border border-white/5 rounded-2xl flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">ROI Break-Even Threshold:</span>
            <span className="text-white font-bold bg-slate-950/80 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Month {breakEvenMonth}
            </span>
          </div>

          {/* Revenue and Margins Projection card */}
          <div className="bg-[#05060b] border border-emerald-500/10 p-5 rounded-2xl space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-xl pointer-events-none" />
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <h4 className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
                Cumulative Gross Product Margin (Sales ROI)
              </h4>
            </div>
            
            <div className="flex justify-between items-baseline">
              <p className="text-3xl font-extrabold text-white font-mono">
                +${estimatedRevenueTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-slate-400">over {leaseDurationMonths} mo horizon</p>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-light">
              Based on selling <span className="text-white font-mono font-bold">{monthlyUnitsSold.toLocaleString()} drinks/snacks</span> monthly total at an average margin of <span className="font-bold text-white">${markupMargin.toFixed(2)}</span> per ticket.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
