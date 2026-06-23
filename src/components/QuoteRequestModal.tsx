import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COMMERICAL_MACHINES, Machine } from "../data/machines";
import { 
  X, 
  FileText, 
  CheckCircle, 
  ShieldCheck, 
  ChevronRight, 
  Coins, 
  Building, 
  Mail, 
  Phone, 
  User, 
  Download, 
  Printer, 
  Send 
} from "lucide-react";

interface QuoteRequestModalProps {
  initialMachine: Machine | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteRequestModal({ initialMachine, isOpen, onClose }: QuoteRequestModalProps) {
  // Form input states
  const [selectedModelId, setSelectedModelId] = useState<string>(
    initialMachine?.id || COMMERICAL_MACHINES[0].id
  );
  const [clientName, setClientName] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [clientCompany, setClientCompany] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [fleetSize, setFleetSize] = useState<number>(1);
  const [acquisitionType, setAcquisitionType] = useState<"purchase" | "rental">("rental");
  const [installationSite, setInstallationSite] = useState<string>("Corporate Headquarters");
  const [clientMessage, setClientMessage] = useState<string>("");

  // Submission / proposal states
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [quoteReference, setQuoteReference] = useState<string>("");

  const selectedMachine = COMMERICAL_MACHINES.find((m) => m.id === selectedModelId) || COMMERICAL_MACHINES[0];

  // Pricing math Based on inputs and machine selected
  const unitPrice = acquisitionType === "purchase" ? selectedMachine.purchaseCost : selectedMachine.monthlyRent;
  const initialSetupCost = (acquisitionType === "purchase" ? 450 : 150) * fleetSize;
  const lineItemSubtotal = unitPrice * fleetSize;
  
  // Security deposit for rentals
  const securityDeposit = acquisitionType === "rental" ? (selectedMachine.monthlyRent * fleetSize) : 0;
  
  const totalAmountDue = lineItemSubtotal + initialSetupCost + securityDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientCompany) return;

    // Generate a beautiful randomized Quote document reference
    const randomId = Math.floor(100000 + Math.random() * 900000);
    setQuoteReference(`AURA-QT-2026-${randomId}`);
    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormSubmitted(false);
    setClientName("");
    setClientEmail("");
    setClientCompany("");
    setClientPhone("");
    setFleetSize(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 z-[120] overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-slate-900 border border-white/10 rounded-[32px] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative my-auto overflow-hidden"
      >
        {/* Glow ambient background mesh */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/5 blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all hover:scale-105 duration-100"
        >
          <X className="h-4 w-4" />
        </button>

        <AnimatePresence mode="wait">
          {!formSubmitted ? (
            /* STATE A: INTENT INQUIRY INPUT FORM */
            <motion.div
              key="quote-form-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-teal-400 uppercase font-extrabold flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Request a Quote form
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Acquisition Proposal</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Submit details to instantly compile and print a dynamic B2B pricing proposal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Target Platform</label>
                    <select
                      value={selectedModelId}
                      onChange={(e) => setSelectedModelId(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-teal-400 font-mono"
                    >
                      {COMMERICAL_MACHINES.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Acquisition Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAcquisitionType("rental")}
                        className={`py-2 px-3 border rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${
                          acquisitionType === "rental"
                            ? "border-teal-400 text-teal-400 bg-teal-400/5 font-extrabold"
                            : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white"
                        }`}
                      >
                        Lease/Rent
                      </button>
                      <button
                        type="button"
                        onClick={() => setAcquisitionType("purchase")}
                        className={`py-2 px-3 border rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${
                          acquisitionType === "purchase"
                            ? "border-emerald-400 text-emerald-400 bg-emerald-400/5 font-extrabold"
                            : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white"
                        }`}
                      >
                        Buy Outright
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fleet qty and install spot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Fleet Quantity Needed</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={fleetSize}
                      onChange={(e) => setFleetSize(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Target Install Arena</label>
                    <select
                      value={installationSite}
                      onChange={(e) => setInstallationSite(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Corporate Headquarters">Corporate Headquarters</option>
                      <option value="Hospitals & Healthcare">Hospitals & Healthcare</option>
                      <option value="Gym & Fitness center">Gym & Fitness center</option>
                      <option value="University Campus">University Campus</option>
                      <option value="Transit Terminal Hub">Transit Terminal Hub</option>
                    </select>
                  </div>
                </div>

                {/* Client contacts */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">Contact Coordinates</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Client Full Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                      />
                      <User className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Business Email Address"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                      />
                      <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Organization / Company"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                      />
                      <Building className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Phone Number (Optional)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                      />
                      <Phone className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Additional messages */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Special Instructions / Custom Logistics</label>
                  <textarea
                    placeholder="Provide customized requests (e.g. customized color wrapping or custom software panel API hookups)..."
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-90 font-bold text-xs uppercase tracking-widest text-slate-950 shadow-lg justify-center flex items-center gap-1.5 mt-2"
                >
                  <Send className="h-4 w-4" />
                  Generate Dynamic Quotation Document
                </button>
              </form>
            </motion.div>
          ) : (
            /* STATE B: DETAILED PRINTABLE QUOTE DOCUMENT */
            <motion.div
              key="quote-document-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Letters Head */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-4 text-emerald-400 justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-mono text-sm uppercase tracking-widest font-extrabold text-white">Quotation Generated</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{quoteReference}</span>
              </div>

              {/* Dynamic Invoice Letterhead layout */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-white/10 font-mono text-xs text-slate-300 space-y-5 relative overflow-hidden">
                
                {/* Background watermarked text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] font-extrabold text-5xl leading-none text-red-500 rotate-12 select-none pointer-events-none text-center">
                  AURA SMART METRIC<br/>OFFICIAL ESTIMATE
                </div>

                <div className="flex justify-between items-start text-[10px] border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <p className="font-bold text-white uppercase text-xs">AURA SMART METRIC CO.</p>
                    <p className="text-slate-500 font-light">Global IoT Vending Headquarters</p>
                    <p className="text-slate-500">Corporate Sales Division</p>
                  </div>
                  <div className="text-right space-y-1 text-slate-400">
                    <p>DATE: 2026-06-22</p>
                    <p>EXPIRES: 2026-09-22</p>
                    <p className="text-white font-bold uppercase">RECIPIENT: {clientCompany}</p>
                  </div>
                </div>

                {/* Client Details section */}
                <div className="grid grid-cols-2 gap-4 text-[11px] bg-white/[0.01] p-3 rounded-xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider">Client Representative:</p>
                    <p className="text-white font-bold">{clientName}</p>
                    <p className="text-slate-400">{clientEmail}</p>
                    {clientPhone && <p className="text-slate-400">T: {clientPhone}</p>}
                  </div>
                  <div className="space-y-1 pl-4 border-l border-white/5">
                    <p className="text-slate-500 uppercase text-[9px] tracking-wider">Installation Destination:</p>
                    <p className="text-white font-bold">{installationSite}</p>
                    <p className="text-slate-400">Acquisition: <span className="text-teal-400 font-bold uppercase">{acquisitionType} lease</span></p>
                  </div>
                </div>

                {/* Invoice calculation line items */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[10px] uppercase font-bold text-slate-500 pb-2 border-b border-white/5 font-mono">
                    <span className="col-span-6">Description / Itemized Specification</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Unit Price</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>

                  {/* Primary Machine row */}
                  <div className="grid grid-cols-12 text-[11px] py-1">
                    <span className="col-span-6 text-white font-bold">{selectedMachine.name} (Chassis)</span>
                    <span className="col-span-2 text-center">{fleetSize}</span>
                    <span className="col-span-2 text-right">${unitPrice.toLocaleString()}</span>
                    <span className="col-span-2 text-right text-white">${lineItemSubtotal.toLocaleString()}</span>
                  </div>

                  {/* System Setup / logistics delivery */}
                  <div className="grid grid-cols-12 text-[11px] py-1">
                    <span className="col-span-6 text-slate-400">Proximity Calibration & Secure Logistics Delivery</span>
                    <span className="col-span-2 text-center">{fleetSize}</span>
                    <span className="col-span-2 text-right">${acquisitionType === "purchase" ? "$450" : "$150"}</span>
                    <span className="col-span-2 text-right text-white">${initialSetupCost.toLocaleString()}</span>
                  </div>

                  {/* Rental Security Deposit row (if applicable) */}
                  {acquisitionType === "rental" && (
                    <div className="grid grid-cols-12 text-[11px] py-1 border-b border-white/5 pb-2">
                      <span className="col-span-6 text-slate-400">Refundable Lease Escrow Deposit (1-Month Security)</span>
                      <span className="col-span-2 text-center">{fleetSize}</span>
                      <span className="col-span-2 text-right">${selectedMachine.monthlyRent}</span>
                      <span className="col-span-2 text-right text-white">${securityDeposit.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Pricing Total */}
                  <div className="flex justify-between items-baseline pt-3 border-t border-white/10 text-right">
                    <span className="text-slate-400">ESTIMATED CAPITAL TOTAL DUE:</span>
                    <span className="text-lg font-bold text-teal-400">${totalAmountDue.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Delivery terms stamp */}
                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-light uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    3-Year Operational Hardware Warranty Included
                  </span>
                  <span className="text-slate-500">Transit: 3-5 Working Days</span>
                </div>
              </div>

              {/* Action columns (print, download, reset) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  Print Proposal
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  Confirm & Restart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
