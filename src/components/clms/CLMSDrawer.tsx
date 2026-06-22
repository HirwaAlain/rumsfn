"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, XCircle, RotateCcw, Loader2, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateCLMSStatus } from "@/lib/api/clms";
import { useToast } from "@/components/shared/Toast";
import { CLMSDrawerDetails } from "./CLMSDrawerDetails";
import { printCLMSCaseReport } from "./CLMSReportPrint";
import type { CLMSCase } from "@/types";

const BTN = "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";

interface Props {
  caseItem: CLMSCase | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: CLMSCase) => void;
}

export function CLMSDrawer({ caseItem, open, onClose, onUpdate }: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  async function transition(newStatus: CLMSCase["status"], label: string) {
    if (!caseItem) return;
    setBusy(true);
    try {
      const updated = await updateCLMSStatus(caseItem.id, newStatus);
      onUpdate(updated);
      toast(`Case ${label} successfully.`);
      onClose();
    } catch {
      toast(`Failed to ${label.toLowerCase()} case.`, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && caseItem && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-card shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}>
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-xs font-mono text-muted-foreground">{caseItem.caseNumber}</p>
                <h2 className="mt-0.5 text-base font-semibold text-foreground leading-snug line-clamp-2">
                  {caseItem.title}
                </h2>
              </div>
              <button type="button" onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <CLMSDrawerDetails c={caseItem} />
            <div className="flex items-center justify-end border-b border-border px-6 py-2">
              <button type="button"
                onClick={() => caseItem && printCLMSCaseReport(caseItem)}
                className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors">
                <FileDown className="h-3.5 w-3.5" /> Download Report
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
              {caseItem.status === "submitted" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("under_review", "moved to review")}
                    className={cn(BTN, "bg-accent text-white hover:bg-accent/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Begin Review
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("rejected", "rejected")}
                    className={cn(BTN, "border border-border text-foreground hover:bg-muted")}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
              {caseItem.status === "under_review" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("approved", "approved")}
                    className={cn(BTN, "bg-success text-white hover:bg-success/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Approve
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("rejected", "rejected")}
                    className={cn(BTN, "bg-danger text-white hover:bg-danger/90")}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </>
              )}
              {caseItem.status === "rejected" && (
                <button type="button" disabled={busy} onClick={() => transition("submitted", "reopened")}
                  className={cn(BTN, "border border-border text-foreground hover:bg-muted")}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Reopen
                </button>
              )}
              {caseItem.status === "appealed" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("approved", "appeal upheld")}
                    className={cn(BTN, "bg-success text-white hover:bg-success/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Uphold Appeal
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("rejected", "appeal dismissed")}
                    className={cn(BTN, "bg-danger text-white hover:bg-danger/90")}>
                    <XCircle className="h-3.5 w-3.5" /> Dismiss Appeal
                  </button>
                </>
              )}
              {caseItem.status === "approved" && (
                <p className="text-xs text-muted-foreground italic">Case approved — licence will be issued.</p>
              )}
              {caseItem.status === "closed" && (
                <p className="text-xs text-muted-foreground italic">Case closed — no further action required.</p>
              )}
              {caseItem.status === "draft" && (
                <button type="button" disabled={busy} onClick={() => transition("submitted", "submitted")}
                  className={cn(BTN, "bg-accent text-white hover:bg-accent/90")}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Submit Case
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
