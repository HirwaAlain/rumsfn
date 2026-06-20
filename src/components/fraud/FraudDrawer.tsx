"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle, CheckCircle, XCircle, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateFraudStatus } from "@/lib/api/fraud";
import { useToast } from "@/components/shared/Toast";
import { FraudDrawerDetails } from "./FraudDrawerDetails";
import type { FraudCase } from "@/types";

const BTN = "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";

interface Props {
  fraudCase: FraudCase | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: FraudCase) => void;
}

export function FraudDrawer({ fraudCase, open, onClose, onUpdate }: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  async function transition(newStatus: FraudCase["status"], label: string) {
    if (!fraudCase) return;
    setBusy(true);
    try {
      const updated = await updateFraudStatus(fraudCase.id, newStatus);
      onUpdate(updated);
      toast(`Case ${label}.`);
      onClose();
    } catch {
      toast("Failed to update case.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && fraudCase && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-card shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}>
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-xs font-mono text-muted-foreground">{fraudCase.caseNumber}</p>
                <h2 className="mt-0.5 text-base font-semibold text-foreground leading-snug">
                  {fraudCase.indicatorType}
                </h2>
              </div>
              <button type="button" onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FraudDrawerDetails c={fraudCase} />
            <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
              {fraudCase.status === "open" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("investigating", "moved to investigation")}
                    className={cn(BTN, "bg-accent text-white hover:bg-accent/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertTriangle className="h-3.5 w-3.5" />} Investigate
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("dismissed", "dismissed")}
                    className={cn(BTN, "bg-danger text-white hover:bg-danger/90")}>
                    <XCircle className="h-3.5 w-3.5" /> Dismiss
                  </button>
                </>
              )}
              {fraudCase.status === "investigating" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("confirmed", "confirmed")}
                    className={cn(BTN, "bg-danger text-white hover:bg-danger/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Confirm
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("referred", "referred")}
                    className={cn(BTN, "bg-warning text-white hover:bg-warning/90")}>
                    <Send className="h-3.5 w-3.5" /> Refer
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("dismissed", "dismissed")}
                    className={cn(BTN, "border border-border text-foreground hover:bg-muted")}>
                    <XCircle className="h-3.5 w-3.5" /> Dismiss
                  </button>
                </>
              )}
              {fraudCase.status === "confirmed" && (
                <p className="text-xs text-muted-foreground italic">Case confirmed — refer to enforcement for further action.</p>
              )}
              {fraudCase.status === "referred" && (
                <p className="text-xs text-muted-foreground italic">Case referred. Awaiting response.</p>
              )}
              {fraudCase.status === "dismissed" && (
                <p className="text-xs text-muted-foreground italic">Case dismissed — no further action required.</p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
