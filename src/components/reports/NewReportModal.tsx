"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createReport } from "@/lib/api/reports";
import { useToast } from "@/components/shared/Toast";
import type { Report, ReportType, ReportFormat, RwandaSector } from "@/types";

const INPUT  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";

const TYPES: { value: ReportType; label: string }[] = [
  { value: "monthly",   label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual",    label: "Annual" },
  { value: "ad_hoc",   label: "Ad Hoc" },
];
const FORMATS: ReportFormat[] = ["pdf", "xlsx", "csv"];
const SECTORS = ["All Sectors", "Telecom", "Energy", "Water", "Transport"];

interface Props { open: boolean; onClose: () => void; onCreated: (r: Report) => void }

export function NewReportModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", type: "ad_hoc" as ReportType, sector: "All Sectors" as RwandaSector | "All Sectors",
    period: "", format: "pdf" as ReportFormat,
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
    if (!form.title || !form.period) {
      toast("Title and period are required.", "error"); return;
    }
    setLoading(true);
    try {
      const created = await createReport({
        title: form.title, type: form.type,
        sector: form.sector, period: form.period,
        format: form.format, status: "draft",
        createdBy: "Current User",
      });
      onCreated(created);
      toast("Report created as draft.");
      onClose();
    } catch {
      toast("Failed to create report. Please try again.", "error");
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
            <motion.div className="w-full max-w-md rounded-2xl bg-card shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}>
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">New Report</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={LABEL}>Report Title <span className="text-danger">*</span></label>
                  <input className={INPUT} placeholder="e.g. Q1 2026 Telecom Compliance Report" value={form.title}
                    onChange={(e) => set("title", e.target.value)} disabled={loading} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Type</label>
                    <select className={SELECT} value={form.type}
                      onChange={(e) => set("type", e.target.value)} disabled={loading}>
                      {TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Format</label>
                    <select className={SELECT} value={form.format}
                      onChange={(e) => set("format", e.target.value)} disabled={loading}>
                      {FORMATS.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                    </select>
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
                    <label className={LABEL}>Period <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="e.g. Q1 2026" value={form.period}
                      onChange={(e) => set("period", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Report
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
