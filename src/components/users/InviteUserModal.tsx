"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, AlertTriangle } from "lucide-react";
import { inviteUser } from "@/lib/api/users";
import { useToast } from "@/components/shared/Toast";
import type { User, UserRole, UserDepartment } from "@/types";

const INPUT  = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent disabled:opacity-50 transition-colors";
const LABEL  = "block text-xs font-medium text-foreground mb-1";
const SELECT = "w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent disabled:opacity-50 transition-colors";

const ROLES: UserRole[] = ["admin", "supervisor", "analyst", "auditor", "viewer"];
const DEPARTMENTS: UserDepartment[] = [
  "Executive", "Licensing", "Compliance", "Complaints",
  "Fraud & Investigations", "Legal", "ICT", "Finance", "Human Resources", "Communications",
];

interface Props { open: boolean; onClose: () => void; onCreated: (u: User) => void }

export function InviteUserModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", contactEmail: "", phone: "",
    role: "analyst" as UserRole, department: "ICT" as UserDepartment,
  });

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setForm({ name: "", contactEmail: "", phone: "", role: "analyst", department: "ICT" });
  }, [open]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contactEmail) {
      toast("Name and email are required.", "error"); return;
    }
    setLoading(true);
    try {
      const result = await inviteUser({
        name: form.name,
        contactEmail: form.contactEmail,
        phone: form.phone || undefined,
        role: form.role,
        department: form.department,
      });
      onCreated(result.user);
      if (result.inviteSent) {
        toast(`User created. Credentials sent to ${form.contactEmail}.`);
      } else {
        toast(`User created, but invite email failed. Admin must share credentials manually.`, "error");
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user. Please try again.";
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-purple-dark/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div className="w-full max-w-md rounded-2xl bg-card shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}>
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">Create New User</h2>
                <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 pt-4">
                <div className="rounded-xl bg-accent/8 border border-accent/20 px-4 py-3 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A system email (<span className="font-medium text-foreground">@rura.rw</span>) will be auto-generated. Login credentials will be sent to the contact email you provide.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className={LABEL}>Full Name <span className="text-danger">*</span></label>
                  <input className={INPUT} placeholder="e.g. Jean Bosco Nkurunziza" value={form.name}
                    onChange={(e) => set("name", e.target.value)} disabled={loading} />
                </div>
                <div>
                  <label className={LABEL}>Contact Email <span className="text-danger">*</span></label>
                  <input type="email" className={INPUT} placeholder="personal or work email for invite" value={form.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)} disabled={loading} />
                  <p className="mt-1 text-[11px] text-muted-foreground">Credentials will be sent here. Not used as the login email.</p>
                </div>
                <div>
                  <label className={LABEL}>Phone</label>
                  <input type="tel" className={INPUT} placeholder="+250 7XX XXX XXX" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)} disabled={loading} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Role</label>
                    <select className={SELECT} value={form.role}
                      onChange={(e) => set("role", e.target.value)} disabled={loading}>
                      {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL}>Department</label>
                    <select className={SELECT} value={form.department}
                      onChange={(e) => set("department", e.target.value)} disabled={loading}>
                      {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} disabled={loading}
                    className="flex-1 rounded-xl border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-sm">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create User
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
