"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createComplaint } from "@/lib/api/complaints";
import { useToast } from "@/components/shared/Toast";
import type { Complaint, RwandaSector, RwandaProvince } from "@/types";

const INPUT  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";

const SECTORS: RwandaSector[]   = ["Telecom", "Energy", "Water", "Transport"];
const PROVINCES: RwandaProvince[] = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];
const CATEGORIES = ["Billing Dispute", "Service Quality", "Network Coverage", "Overcharging", "Service Outage", "Customer Service", "Contract Dispute", "Other"];

interface Props { open: boolean; onClose: () => void; onCreated: (c: Complaint) => void }

export function FileComplaintModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: "", category: "Billing Dispute", sector: "Telecom" as RwandaSector,
    respondentOperator: "", description: "",
    complainantName: "", complainantPhone: "", province: "Kigali City" as RwandaProvince,
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
    if (!form.subject || !form.respondentOperator || !form.complainantName) {
      toast("Please fill in all required fields.", "error"); return;
    }
    setLoading(true);
    try {
      const created = await createComplaint({
        subject: form.subject, category: form.category as Complaint["category"],
        sector: form.sector, respondentOperator: form.respondentOperator,
        description: form.description,
        complainantName: form.complainantName, complainantPhone: form.complainantPhone,
        province: form.province, status: "open",
      });
      onCreated(created);
      toast("Complaint filed successfully.");
      onClose();
    } catch {
      toast("Failed to file complaint. Please try again.", "error");
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
            <motion.div className="w-full max-w-lg rounded-2xl bg-card shadow-2xl max-h-[90vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}>
              <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
                <h2 className="text-base font-semibold text-foreground">File Complaint</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className={LABEL}>Subject <span className="text-danger">*</span></label>
                  <input className={INPUT} placeholder="Brief description of the issue" value={form.subject}
                    onChange={(e) => set("subject", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <label className={LABEL}>Sector <span className="text-danger">*</span></label>
                  <select className={SELECT} value={form.sector}
                    onChange={(e) => set("sector", e.target.value)} disabled={loading}>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Province <span className="text-danger">*</span></label>
                  <select className={SELECT} value={form.province}
                    onChange={(e) => set("province", e.target.value)} disabled={loading}>
                    {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Category</label>
                    <select className={SELECT} value={form.category}
                      onChange={(e) => set("category", e.target.value)} disabled={loading}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Respondent Operator <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="e.g. MTN Rwanda" value={form.respondentOperator}
                      onChange={(e) => set("respondentOperator", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Complainant Name <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="Full name" value={form.complainantName}
                      onChange={(e) => set("complainantName", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Complainant Phone</label>
                    <input type="tel" className={INPUT} placeholder="+250 7XX XXX XXX" value={form.complainantPhone}
                      onChange={(e) => set("complainantPhone", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Description</label>
                  <textarea className={INPUT} rows={3} placeholder="Detailed description..."
                    value={form.description} onChange={(e) => set("description", e.target.value)} disabled={loading} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    File Complaint
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
