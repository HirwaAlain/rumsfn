"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createLicense } from "@/lib/api/licenses";
import { useToast } from "@/components/shared/Toast";
import type { License, RwandaSector, RwandaProvince } from "@/types";

const INPUT  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";

const SECTORS: RwandaSector[]   = ["Telecom", "Energy", "Water", "Transport"];
const PROVINCES: RwandaProvince[] = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];
const CATEGORIES: License["category"][] = [
  "Mobile Network Operator", "Fixed Network Operator", "Internet Service Provider",
  "Public Switched Telephone Network", "Virtual Network Operator", "Spectrum License",
  "Electricity Distribution", "Electricity Transmission", "Power Generation",
  "Water Supply", "Sanitation Services", "Road Transport Operator",
  "Freight & Logistics", "Broadcasting",
];

interface Props { open: boolean; onClose: () => void; onCreated: (l: License) => void }

export function IssueLicenceModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    licenseNumber: "",
    operatorName: "",
    category: "Mobile Network Operator" as License["category"],
    sector: "Telecom" as RwandaSector,
    province: "Kigali City" as RwandaProvince,
    contactPerson: "",
    contactEmail: "",
    issuedAt: "",
    expiresAt: "",
    annualFeeRwf: "",
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
    if (!form.operatorName || !form.issuedAt || !form.expiresAt) {
      toast("Please fill in all required fields.", "error"); return;
    }
    setLoading(true);
    try {
      const created = await createLicense({
        ...(form.licenseNumber ? { licenseNumber: form.licenseNumber } : {}),
        operatorName: form.operatorName,
        category: form.category,
        sector: form.sector,
        province: form.province,
        status: "pending",
        issuedAt: form.issuedAt,
        expiresAt: form.expiresAt,
        contactPerson: form.contactPerson || undefined,
        contactEmail: form.contactEmail || undefined,
        annualFeeRwf: form.annualFeeRwf ? Number(form.annualFeeRwf) : 0,
      });
      onCreated(created);
      toast(`Licence for ${created.operatorName} issued successfully.`);
      onClose();
    } catch {
      toast("Failed to issue licence. Please try again.", "error");
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
                <h2 className="text-base font-semibold text-foreground">Issue New Licence</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Licence Number <span className="text-muted-foreground font-normal">(auto-generated)</span></label>
                    <input className={INPUT} placeholder="e.g. RURA-TLC-2026-001 or leave blank" value={form.licenseNumber}
                      onChange={(e) => set("licenseNumber", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Operator Name <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="e.g. MTN Rwanda Ltd" value={form.operatorName}
                      onChange={(e) => set("operatorName", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Sector <span className="text-danger">*</span></label>
                    <select className={SELECT} value={form.sector}
                      onChange={(e) => set("sector", e.target.value)} disabled={loading}>
                      {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Category <span className="text-danger">*</span></label>
                    <select className={SELECT} value={form.category}
                      onChange={(e) => set("category", e.target.value)} disabled={loading}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
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
                    <label className={LABEL}>Contact Person</label>
                    <input className={INPUT} placeholder="Full name" value={form.contactPerson}
                      onChange={(e) => set("contactPerson", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Contact Email</label>
                    <input type="email" className={INPUT} placeholder="contact@operator.rw" value={form.contactEmail}
                      onChange={(e) => set("contactEmail", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Issue Date <span className="text-danger">*</span></label>
                    <input type="date" className={INPUT} value={form.issuedAt}
                      onChange={(e) => set("issuedAt", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Expiry Date <span className="text-danger">*</span></label>
                    <input type="date" className={INPUT} value={form.expiresAt}
                      onChange={(e) => set("expiresAt", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Annual Fee (RWF)</label>
                  <input type="number" min="0" className={INPUT} placeholder="0" value={form.annualFeeRwf}
                    onChange={(e) => set("annualFeeRwf", e.target.value)} disabled={loading} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Issue Licence
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
