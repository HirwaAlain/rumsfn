"use client";

import { useState } from "react";
import {
  AlertTriangle, ShieldAlert, Clock, TrendingUp, Wifi,
  FileText, User, AlertCircle, CheckCircle2, Loader2,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { markAlertRead, dismissAlert, actionAlert } from "@/lib/api/alerts";
import { useToast } from "@/components/shared/Toast";
import type { Alert, AlertType, AlertSeverity } from "@/types";

const TYPE_CONFIG: Record<AlertType, { icon: React.ElementType; label: string }> = {
  license_expiry:       { icon: Clock,         label: "Licence Expiry" },
  compliance_breach:    { icon: AlertTriangle,  label: "Compliance Breach" },
  fraud_detected:       { icon: ShieldAlert,    label: "Fraud Detected" },
  complaint_sla_breach: { icon: AlertCircle,    label: "SLA Breach" },
  workflow_stalled:     { icon: Wifi,           label: "Workflow Stalled" },
  system_error:         { icon: AlertCircle,    label: "System Error" },
  report_ready:         { icon: FileText,       label: "Report Ready" },
  user_suspended:       { icon: User,           label: "User Suspended" },
  threshold_exceeded:   { icon: TrendingUp,     label: "Threshold Exceeded" },
};

const SEVERITY_STYLE: Record<AlertSeverity, string> = {
  critical: "border-l-danger bg-danger-bg",
  warning:  "border-l-warning bg-warning-bg",
  info:     "border-l-accent  bg-info-bg",
};

const SEVERITY_ICON: Record<AlertSeverity, string> = {
  critical: "text-danger",
  warning:  "text-warning",
  info:     "text-accent",
};

const STATUS_BADGE: Record<Alert["status"], string> = {
  unread:    "bg-danger-bg text-danger-fg",
  read:      "bg-muted text-muted-foreground",
  dismissed: "bg-muted text-muted-foreground/60",
  actioned:  "bg-success-bg text-success-fg",
};

interface Props {
  alert: Alert;
  onUpdate: (updated: Alert) => void;
  canMarkRead?: boolean;
  canDismiss?: boolean;
  canAction?: boolean;
}

export function AlertCard({ alert, onUpdate, canMarkRead = true, canDismiss = true, canAction = true }: Props) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const { icon: Icon, label } = TYPE_CONFIG[alert.type];

  async function handle(action: "read" | "dismiss" | "action") {
    setBusy(action);
    try {
      let updated: Alert;
      if (action === "read")    updated = await markAlertRead(alert.id);
      else if (action === "dismiss") updated = await dismissAlert(alert.id);
      else updated = await actionAlert(alert.id);
      onUpdate(updated);
      if (action === "read")    toast("Alert marked as read.", "info");
      if (action === "dismiss") toast("Alert dismissed.");
      if (action === "action")  toast("Alert actioned.");
    } catch {
      toast("Failed to update alert.", "error");
    } finally {
      setBusy(null);
    }
  }

  const actionedBy = alert.actionedBy
    ? (typeof alert.actionedBy === "object"
        ? (alert.actionedBy as { id: string; name: string }).name
        : alert.actionedBy)
    : null;

  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border border-border border-l-4 p-4 shadow-sm transition-shadow hover:shadow-md",
        SEVERITY_STYLE[alert.severity],
        alert.status === "dismissed" && "opacity-60"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card/80">
        <Icon className={cn("h-4 w-4", SEVERITY_ICON[alert.severity])} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase", STATUS_BADGE[alert.status])}>
            {alert.status}
          </span>
          {alert.status === "actioned" && actionedBy && (
            <span className="text-xs text-muted-foreground">by {actionedBy}</span>
          )}
        </div>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{alert.title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted-foreground">{formatDateTime(alert.createdAt)}</span>
          <span className="text-xs text-muted-foreground">· {alert.relatedModule}</span>
        </div>
      </div>

      {(alert.status === "unread" || alert.status === "read") && (canMarkRead || canDismiss || canAction) && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {alert.status === "unread" && canMarkRead && (
            <button type="button" disabled={!!busy} onClick={() => handle("read")}
              className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium bg-card border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-50">
              {busy === "read" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Mark read
            </button>
          )}
          {canDismiss && (
            <button type="button" disabled={!!busy} onClick={() => handle("dismiss")}
              className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {busy === "dismiss" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Dismiss
            </button>
          )}
          {canAction && alert.severity === "critical" && (
            <button type="button" disabled={!!busy} onClick={() => handle("action")}
              className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium bg-danger text-white hover:bg-danger/90 transition-colors disabled:opacity-50">
              {busy === "action"
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <CheckCircle2 className="h-3 w-3" />}
              Action
            </button>
          )}
        </div>
      )}
    </div>
  );
}
