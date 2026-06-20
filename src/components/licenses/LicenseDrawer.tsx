"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LicenseDrawerDetails } from "@/components/licenses/LicenseDrawerDetails";
import { updateLicenseStatus } from "@/lib/api/licenses";
import { useToast } from "@/components/shared/Toast";
import type { License } from "@/types";

const TODAY_MS = new Date("2026-03-22").getTime();
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function getExpiryStatus(dateStr: string): "expired" | "soon" | "ok" {
  const ms = new Date(dateStr).getTime();
  if (ms < TODAY_MS) return "expired";
  if (ms < TODAY_MS + NINETY_DAYS_MS) return "soon";
  return "ok";
}

interface LicenseDrawerProps {
  license: License | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: License) => void;
  canChangeStatus?: boolean;
  canRevoke?: boolean;
}

export function LicenseDrawer({ license, open, onClose, onUpdate, canChangeStatus = true, canRevoke = true }: LicenseDrawerProps) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function transition(newStatus: License["status"], label: string) {
    if (!license) return;
    setBusy(true);
    try {
      const updated = await updateLicenseStatus(license.id, newStatus);
      onUpdate(updated);
      toast(`Licence ${label} successfully.`);
      onClose();
    } catch {
      toast("Failed to update licence.", "error");
    } finally {
      setBusy(false);
    }
  }

  const expiryStatus = license ? getExpiryStatus(license.expiresAt) : "ok";

  return (
    <AnimatePresence>
      {open && license && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            key="drawer"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div className="min-w-0">
                <span className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {license.licenseNumber}
                </span>
                <h2 className="mt-2 text-lg font-semibold leading-tight text-foreground">
                  {license.operatorName}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{license.category}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2 pt-1">
                <StatusBadge status={license.status} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <LicenseDrawerDetails license={license} expiryStatus={expiryStatus} />

            <div className="flex gap-3 border-t border-border p-6">
              {(!canChangeStatus || license.status === "revoked") && (
                <p className="flex-1 py-2 text-center text-sm text-muted-foreground">
                  {license.status === "revoked" ? "No actions available for revoked licences." : "Read-only view."}
                </p>
              )}
              {canChangeStatus && (license.status === "active" || license.status === "expired") && (
                <button type="button" disabled={busy}
                  onClick={() => transition("active", "renewed")}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-50">
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Renew Licence
                </button>
              )}
              {canChangeStatus && license.status === "active" && (
                <button type="button" disabled={busy}
                  onClick={() => transition("suspended", "suspended")}
                  className="flex-1 rounded-lg border border-danger py-2 text-sm font-medium text-danger hover:bg-danger-bg transition-colors disabled:opacity-50">
                  Suspend
                </button>
              )}
              {canChangeStatus && license.status === "suspended" && (
                <>
                  <button type="button" disabled={busy}
                    onClick={() => transition("active", "renewed")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-50">
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Renew Licence
                  </button>
                  <button type="button" disabled={busy}
                    onClick={() => transition("active", "reinstated")}
                    className="flex-1 rounded-lg border border-success py-2 text-sm font-medium text-success hover:bg-success-bg transition-colors disabled:opacity-50">
                    Reinstate
                  </button>
                </>
              )}
              {canChangeStatus && license.status === "pending" && (
                <>
                  <button type="button" disabled={busy}
                    onClick={() => transition("active", "approved")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    Approve
                  </button>
                  {canRevoke && (
                    <button type="button" disabled={busy}
                      onClick={() => transition("revoked", "rejected")}
                      className="flex-1 rounded-lg border border-danger py-2 text-sm font-medium text-danger hover:bg-danger-bg transition-colors disabled:opacity-50">
                      Reject
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
