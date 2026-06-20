"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X, GitBranch } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { WorkflowsTable } from "@/components/workflows/WorkflowsTable";
import { WorkflowDrawer } from "@/components/workflows/WorkflowDrawer";
import { NewWorkflowModal } from "@/components/workflows/NewWorkflowModal";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { Workflow, WorkflowStatus, WorkflowTrigger } from "@/types";

const STATUSES: WorkflowStatus[]  = ["draft", "active", "paused", "completed", "failed"];
const TRIGGERS: WorkflowTrigger[] = [
  "license_application", "complaint_filed", "compliance_due", "fraud_alert", "renewal_due", "manual",
];
const TRIGGER_LABEL: Record<WorkflowTrigger, string> = {
  license_application: "Licence Application", complaint_filed: "Complaint Filed",
  compliance_due: "Compliance Due",          fraud_alert: "Fraud Alert",
  renewal_due: "Renewal Due",                manual: "Manual",
};
const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function WorkflowsClient({ workflows: initial }: { workflows: Workflow[] }) {
  const { permissions } = usePortalPermissions();
  const [workflows, setWorkflows]         = useState(initial);
  const [statusFilter, setStatusFilter]   = useState<WorkflowStatus | "All">("All");
  const [triggerFilter, setTriggerFilter] = useState<WorkflowTrigger | "All">("All");
  const [selected, setSelected]           = useState<Workflow | null>(null);
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [modalOpen, setModalOpen]         = useState(false);

  const handleView    = useCallback((w: Workflow) => { setSelected(w); setDrawerOpen(true); }, []);
  const handleClose   = useCallback(() => setDrawerOpen(false), []);
  const handleUpdate  = useCallback((updated: Workflow) =>
    setWorkflows((prev) => prev.map((w) => w.id === updated.id ? updated : w)), []);
  const handleCreated = useCallback((created: Workflow) =>
    setWorkflows((prev) => [created, ...prev]), []);

  const activeCount    = workflows.filter((w) => w.status === "active").length;
  const completedCount = workflows.filter((w) => w.status === "completed").length;
  const pausedCount    = workflows.filter((w) => w.status === "paused").length;
  const totalSteps     = workflows.reduce((s, w) => s + w.steps.length, 0);

  const KPIS = [
    { label: "Total Workflows", value: workflows.length,   sub: "all workflows",     color: "text-foreground" },
    { label: "Active",          value: activeCount,         sub: "currently running", color: activeCount > 0 ? "text-accent" : "text-foreground" },
    { label: "Paused",          value: pausedCount,         sub: "awaiting action",   color: pausedCount > 0 ? "text-warning" : "text-foreground" },
    { label: "Completed",       value: completedCount,      sub: "finished",          color: "text-success" },
  ];

  const filtered = workflows.filter((w) =>
    (statusFilter  === "All" || w.status  === statusFilter) &&
    (triggerFilter === "All" || w.trigger === triggerFilter)
  );
  const hasFilters = statusFilter !== "All" || triggerFilter !== "All";

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Regulatory Workflow Engine"
          description="Configure and monitor automated multi-step regulatory workflows."
          actions={
            permissions.workflows.create ? (
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
                <GitBranch className="h-4 w-4" /> New Workflow
              </button>
            ) : undefined
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
            <h2 className="text-sm font-semibold text-foreground">Workflows</h2>
            <div className="relative">
              <select className={SELECT} value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | "All")}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <select className={SELECT} value={triggerFilter}
                onChange={(e) => setTriggerFilter(e.target.value as WorkflowTrigger | "All")}>
                <option value="All">All Triggers</option>
                {TRIGGERS.map((t) => <option key={t} value={t}>{TRIGGER_LABEL[t]}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {hasFilters && (
              <button type="button" onClick={() => { setStatusFilter("All"); setTriggerFilter("All"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">
              {filtered.length} of {workflows.length} workflows · {totalSteps} steps total
            </span>
          </div>
          <WorkflowsTable workflows={filtered} onView={handleView} />
        </section>
      </div>

      <WorkflowDrawer workflow={selected} open={drawerOpen} onClose={handleClose} onUpdate={handleUpdate} />

      <NewWorkflowModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </>
  );
}
