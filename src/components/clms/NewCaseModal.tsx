"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { createCLMSCase } from "@/lib/api/clms";
import { apiFetch } from "@/lib/api/client";
import { useToast } from "@/components/shared/Toast";
import type { CLMSCase, CLMSCaseType, RwandaSector, RwandaProvince } from "@/types";

const INPUT  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50";

const SECTORS: RwandaSector[]    = ["Telecom", "Energy", "Water", "Transport"];
const PROVINCES: RwandaProvince[] = ["Kigali City", "Northern Province", "Southern Province", "Eastern Province", "Western Province"];
const CASE_TYPES: { value: CLMSCaseType; label: string }[] = [
  { value: "new_license",          label: "New Licence" },
  { value: "license_renewal",      label: "Licence Renewal" },
  { value: "license_amendment",    label: "Licence Amendment" },
  { value: "license_revocation",   label: "Licence Revocation" },
  { value: "tariff_review",        label: "Tariff Review" },
  { value: "spectrum_assignment",  label: "Spectrum Assignment" },
  { value: "type_approval",        label: "Type Approval" },
  { value: "dispute_resolution",   label: "Dispute Resolution" },
];

interface UserOption { id: string; name: string }
interface PageResponse<T> { content: T[] }

interface Props { open: boolean; onClose: () => void; onCreated: (c: CLMSCase) => void }

export function NewCaseModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading]   = useState(false);
  const [users, setUsers]       = useState<UserOption[]>([]);
  const [form, setForm] = useState({
    title: "", type: "new_license" as CLMSCaseType,
    sector: "Telecom" as RwandaSector, province: "Kigali City" as RwandaProvince,
    applicantName: "", applicantEmail: "", notes: "", assignedToId: "",
  });

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    apiFetch<PageResponse<UserOption>>("/users?page=0&size=100&sort=name,asc")
      .then((p) => setUsers(p.content))
      .catch(() => {});
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.applicantName) {
      toast("Please fill in all required fields.", "error"); return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title, type: form.type, sector: form.sector,
        province: form.province, applicantName: form.applicantName,
        applicantEmail: form.applicantEmail || undefined,
        notes: form.notes || undefined,
      };
      if (form.assignedToId) payload.assignedToId = form.assignedToId;
      const created = await createCLMSCase(payload as Parameters<typeof createCLMSCase>[0]);
      onCreated(created);
      toast("Case created successfully.");
      onClose();
    } catch {
      toast("Failed to create case. Please try again.", "error");
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
                <h2 className="text-base font-semibold text-foreground">New CLMS Case</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className={LABEL}>Case Title <span className="text-danger">*</span></label>
                  <input className={INPUT} placeholder="e.g. MTN Rwanda — New ISP Licence" value={form.title}
                    onChange={(e) => set("title", e.target.value)} disabled={loading} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Case Type</label>
                    <select className={SELECT} value={form.type}
                      onChange={(e) => set("type", e.target.value)} disabled={loading}>
                      {CASE_TYPES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Sector</label>
                    <select className={SELECT} value={form.sector}
                      onChange={(e) => set("sector", e.target.value)} disabled={loading}>
                      {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Province</label>
                    <select className={SELECT} value={form.province}
                      onChange={(e) => set("province", e.target.value)} disabled={loading}>
                      {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Assigned To</label>
                    <select className={SELECT} value={form.assignedToId}
                      onChange={(e) => set("assignedToId", e.target.value)} disabled={loading}>
                      <option value="">Unassigned</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Applicant Name <span className="text-danger">*</span></label>
                    <input className={INPUT} placeholder="Full name or entity" value={form.applicantName}
                      onChange={(e) => set("applicantName", e.target.value)} disabled={loading} />
                  </div>
                  <div>
                    <label className={LABEL}>Applicant Email</label>
                    <input type="email" className={INPUT} placeholder="email@example.com" value={form.applicantEmail}
                      onChange={(e) => set("applicantEmail", e.target.value)} disabled={loading} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Notes</label>
                  <textarea className={INPUT} rows={2} placeholder="Additional notes..."
                    value={form.notes} onChange={(e) => set("notes", e.target.value)} disabled={loading} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Case
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
