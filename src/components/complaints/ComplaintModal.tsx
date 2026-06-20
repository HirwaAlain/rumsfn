"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ComplaintModalDetails } from "@/components/complaints/ComplaintModalDetails";
import { updateComplaintStatus } from "@/lib/api/complaints";
import { useToast } from "@/components/shared/Toast";
import { formatDate } from "@/lib/utils";
import type { Complaint } from "@/types";

const BTN_PRIMARY = "flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors disabled:opacity-50";
const BTN_SUCCESS = "flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50";
const BTN_DANGER  = "flex-1 rounded-lg border border-danger py-2 text-sm font-medium text-danger hover:bg-danger-bg transition-colors disabled:opacity-50";
const BTN_MUTED   = "flex-1 rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50";

interface ComplaintModalProps {
  complaint: Complaint | null;
  open:      boolean;
  onClose:   () => void;
  onUpdate:  (updated: Complaint) => void;
}

export function ComplaintModal({ complaint, open, onClose, onUpdate }: ComplaintModalProps) {
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

  async function transition(newStatus: Complaint["status"], label: string) {
    if (!complaint) return;
    setBusy(true);
    try {
      const updated = await updateComplaintStatus(complaint.id, newStatus);
      onUpdate(updated);
      toast(`Complaint ${label}.`);
      onClose();
    } catch {
      toast("Failed to update complaint.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && complaint && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              key="modal"
              className="flex w-full max-w-2xl flex-col rounded-2xl bg-card shadow-2xl max-h-[90vh]"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{    scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 340 }}
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-6">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      {complaint.referenceNumber}
                    </span>
                    <StatusBadge status={complaint.severity} />
                    <StatusBadge status={complaint.status} />
                  </div>
                  <h2 className="text-lg font-semibold leading-snug text-foreground">
                    {complaint.subject}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="mt-1 shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ComplaintModalDetails complaint={complaint} />

              <div className="flex shrink-0 flex-wrap gap-3 border-t border-border p-6">
                {complaint.status === "open" && (
                  <>
                    <button type="button" disabled={busy} onClick={() => transition("under_review", "assigned")}
                      className={BTN_PRIMARY}>
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />} Assign to Me
                    </button>
                    <button type="button" disabled={busy} onClick={() => transition("escalated", "escalated")}
                      className={BTN_DANGER}>Escalate</button>
                  </>
                )}
                {complaint.status === "under_review" && (
                  <>
                    <button type="button" disabled={busy} onClick={() => transition("resolved", "resolved")}
                      className={BTN_SUCCESS}>
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />} Mark Resolved
                    </button>
                    <button type="button" disabled={busy} onClick={() => transition("escalated", "escalated")}
                      className={BTN_DANGER}>Escalate</button>
                    <button type="button" disabled={busy} onClick={() => transition("closed", "closed")}
                      className={BTN_MUTED}>Close</button>
                  </>
                )}
                {complaint.status === "escalated" && (
                  <>
                    <button type="button" disabled={busy} onClick={() => transition("resolved", "resolved")}
                      className={BTN_SUCCESS}>
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />} Mark Resolved
                    </button>
                    <button type="button" disabled={busy} onClick={() => transition("closed", "referred to director")}
                      className={BTN_MUTED}>Refer to Director</button>
                  </>
                )}
                {(complaint.status === "resolved" || complaint.status === "closed") && (
                  <p className="flex-1 py-2 text-center text-sm text-muted-foreground">
                    This complaint has been {complaint.status}.
                    {complaint.resolvedAt && ` Resolved on ${formatDate(complaint.resolvedAt)}.`}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
