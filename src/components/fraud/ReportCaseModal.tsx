"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createFraudCase } from "@/lib/api/fraud";
import { useToast } from "@/components/shared/Toast";
import type { FraudCase, FraudIndicatorType, FraudRiskLevel, RwandaSector } from "@/types";

const INPUT  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";

const SECTORS: RwandaSector[]        = ["Telecom", "Energy", "Water", "Transport"];
const RISK_LEVELS: FraudRiskLevel[]  = ["low", "medium", "high", "critical"];
const INDICATOR_TYPES: FraudIndicatorType[] = [
  "SIM Box Fraud", "Tariff Manipulation", "Meter Tampering", "Revenue Underreporting",
  "Unusual Billing Pattern", "Duplicate Applications", "Identity Misrepresentation",
  "Spectrum Interference", "Unlicensed Operation", "Ghost Customer Registrations",
];

interface Props { open: boolean; onClose: () => void; onCreated: (c: FraudCase) => void }

export function ReportCaseModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    indicatorType: "SIM Box Fraud" as FraudIndicatorType, operatorInvolved: "",
    sector: "Telecom" as RwandaSector, riskLevel: "medium" as FraudRiskLevel,
    description: "", estimatedLossRwf: "", reportedBy: "", reportedAt: today,
  });

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.operatorInvolved || !form.reportedBy) {
      toast("Operator and reporter name are required.", "error"); return;
    }
    setLoading(true);
    try {
      const created = await createFraudCase({
        indicatorType: form.indicatorType as FraudIndicatorType, operatorInvolved: form.operatorInvolved,
        sector: form.sector, riskLevel: form.riskLevel, status: "open",
        description: form.description, reportedBy: form.reportedBy,
        reportedAt: form.reportedAt,
        estimatedLossRwf: form.estimatedLossRwf ? Number(form.estimatedLossRwf) : 0,
      });
      onCreated(created);
      toast("Fraud case reported successfully.", "info");
      onClose();
    } catch {
      toast("Failed to report case. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="w-full max-w-lg rounded-2xl bg-card shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}>
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">Report Fraud Case</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Reported By <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="Your full name" value={form.reportedBy}
                      onChange={(e) => set("reportedBy", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Report Date <span className="text-danger">*</span></label>
                    <input type="date" className={INPUT} value={form.reportedAt}
                      onChange={(e) => set("reportedAt", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Indicator Type</label>
                    <select className={SELECT} value={form.indicatorType}
                      onChange={(e) => set("indicatorType", e.target.value)} disabled={loading}>
                      {INDICATOR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Operator Involved <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="e.g. MTN Rwanda" value={form.operatorInvolved}
                      onChange={(e) => set("operatorInvolved", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Sector</label>
                    <select className={SELECT} value={form.sector}
                      onChange={(e) => set("sector", e.target.value)} disabled={loading}>
                      {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Risk Level</label>
                    <select className={SELECT} value={form.riskLevel}
                      onChange={(e) => set("riskLevel", e.target.value)} disabled={loading}>
                      {RISK_LEVELS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Estimated Loss (RWF)</label>
                  <input type="number" min="0" className={INPUT} placeholder="0"
                    value={form.estimatedLossRwf} onChange={(e) => set("estimatedLossRwf", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <label className={LABEL}>Description</label>
                  <textarea className={INPUT} rows={3} placeholder="Describe the suspected fraud..."
                    value={form.description} onChange={(e) => set("description", e.target.value)} disabled={loading} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-danger py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Report Case
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
