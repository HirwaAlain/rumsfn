"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play, Pause, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateWorkflowStatus } from "@/lib/api/workflows";
import { useToast } from "@/components/shared/Toast";
import { WorkflowDrawerDetails } from "./WorkflowDrawerDetails";
import type { Workflow } from "@/types";

const BTN = "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50";

interface Props {
  workflow: Workflow | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: Workflow) => void;
}

export function WorkflowDrawer({ workflow, open, onClose, onUpdate }: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) { document.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  async function transition(newStatus: Workflow["status"], label: string) {
    if (!workflow) return;
    setBusy(true);
    try {
      const updated = await updateWorkflowStatus(workflow.id, newStatus);
      onUpdate(updated);
      toast(`Workflow ${label}.`);
      onClose();
    } catch {
      toast(`Failed to update workflow.`, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && workflow && (
        <>
          <motion.div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-card shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}>
            <div className="flex items-start justify-between border-b border-border px-6 py-4">
              <div className="min-w-0 flex-1 pr-4">
                <h2 className="text-base font-semibold text-foreground leading-snug line-clamp-2">
                  {workflow.name}
                </h2>
              </div>
              <button type="button" onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <WorkflowDrawerDetails w={workflow} />
            <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
              {workflow.status === "draft" && (
                <button type="button" disabled={busy} onClick={() => transition("active", "started")}
                  className={cn(BTN, "bg-accent text-white hover:bg-accent/90")}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Start Workflow
                </button>
              )}
              {workflow.status === "active" && (
                <>
                  <button type="button" disabled={busy} onClick={() => transition("paused", "paused")}
                    className={cn(BTN, "bg-warning text-white hover:bg-warning/90")}>
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pause className="h-3.5 w-3.5" />} Pause
                  </button>
                  <button type="button" disabled={busy} onClick={() => transition("completed", "marked complete")}
                    className={cn(BTN, "bg-success text-white hover:bg-success/90")}>
                    <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                  </button>
                </>
              )}
              {workflow.status === "paused" && (
                <button type="button" disabled={busy} onClick={() => transition("active", "resumed")}
                  className={cn(BTN, "bg-accent text-white hover:bg-accent/90")}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Resume
                </button>
              )}
              {workflow.status === "completed" && (
                <p className="text-xs text-muted-foreground italic">Workflow completed successfully.</p>
              )}
              {workflow.status === "failed" && (
                <button type="button" disabled={busy} onClick={() => transition("active", "restarted")}
                  className={cn(BTN, "border border-border text-foreground hover:bg-muted")}>
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Restart
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
