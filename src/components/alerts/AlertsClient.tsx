"use client";

import { useState } from "react";
import { ChevronDown, X, Bell } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AlertCard } from "@/components/alerts/AlertCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { markAllAlertsRead } from "@/lib/api/alerts";
import { useToast } from "@/components/shared/Toast";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { Alert, AlertSeverity, AlertStatus } from "@/types";

const SEVERITIES: AlertSeverity[] = ["critical", "warning", "info"];
const STATUSES: AlertStatus[]     = ["unread", "read", "actioned", "dismissed"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function AlertsClient({ alerts: initial }: { alerts: Alert[] }) {
  const { permissions } = usePortalPermissions();
  const { toast }                         = useToast();
  const [alerts, setAlerts]               = useState(initial);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "All">("All");
  const [statusFilter, setStatusFilter]   = useState<AlertStatus | "All">("All");
  const [markingAll, setMarkingAll]       = useState(false);

  const unreadCount   = alerts.filter((a) => a.status === "unread").length;
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const actionedCount = alerts.filter((a) => a.status === "actioned").length;

  const KPIS = [
    { label: "Total Alerts", value: alerts.length,   sub: "all time",          color: "text-foreground" },
    { label: "Unread",       value: unreadCount,      sub: "require attention", color: unreadCount > 0 ? "text-danger" : "text-success" },
    { label: "Critical",     value: criticalCount,    sub: "high priority",     color: criticalCount > 0 ? "text-danger" : "text-success" },
    { label: "Actioned",     value: actionedCount,    sub: "resolved",          color: "text-success" },
  ];

  const filtered = alerts.filter((a) =>
    (severityFilter === "All" || a.severity === severityFilter) &&
    (statusFilter   === "All" || a.status   === statusFilter)
  );
  const hasFilters = severityFilter !== "All" || statusFilter !== "All";

  function handleUpdate(updated: Alert) {
    setAlerts((prev) => prev.map((a) => a.id === updated.id ? updated : a));
  }

  async function handleMarkAllRead() {
    setMarkingAll(true);
    try {
      await markAllAlertsRead();
      setAlerts((prev) => prev.map((a) => a.status === "unread" ? { ...a, status: "read" as AlertStatus } : a));
      toast("All alerts marked as read.");
    } catch {
      toast("Failed to mark alerts as read.", "error");
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Alert & Notification Center"
        description="System alerts, SLA breaches, and critical notifications across all modules."
        badge={unreadCount > 0
          ? <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-xs font-bold text-white">{unreadCount}</span>
          : undefined}
        actions={
          <button type="button" onClick={handleMarkAllRead} disabled={markingAll || unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50">
            <Bell className="h-4 w-4" /> Mark All Read
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className={cn("mt-2 text-3xl font-bold tabular-nums", color)}>{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
          <div className="relative">
            <select className={SELECT} value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | "All")}>
              <option value="All">All Severities</option>
              {SEVERITIES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="relative">
            <select className={SELECT} value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | "All")}>
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {hasFilters && (
            <button type="button" onClick={() => { setSeverityFilter("All"); setStatusFilter("All"); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {alerts.length} alerts</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<Bell className="h-8 w-8" />} title="No alerts" description="All clear — no alerts match the selected filters." />
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <AlertCard
                key={a.id}
                alert={a}
                onUpdate={handleUpdate}
                canMarkRead={permissions.alerts.markRead}
                canDismiss={permissions.alerts.dismiss}
                canAction={permissions.alerts.action}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
