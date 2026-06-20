"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X, FolderPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { CLMSTable } from "@/components/clms/CLMSTable";
import { CLMSDrawer } from "@/components/clms/CLMSDrawer";
import { NewCaseModal } from "@/components/clms/NewCaseModal";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { CLMSCase, CLMSCaseStatus, CLMSCaseType } from "@/types";

const STATUSES: CLMSCaseStatus[] = ["draft", "submitted", "under_review", "approved", "rejected", "appealed", "closed"];
const TYPES: CLMSCaseType[] = [
  "new_license", "license_renewal", "license_amendment", "license_revocation",
  "tariff_review", "spectrum_assignment", "type_approval", "dispute_resolution",
];
const TYPE_LABEL: Record<CLMSCaseType, string> = {
  new_license: "New Licence", license_renewal: "Renewal", license_amendment: "Amendment",
  license_revocation: "Revocation", tariff_review: "Tariff Review",
  spectrum_assignment: "Spectrum", type_approval: "Type Approval", dispute_resolution: "Dispute",
};
const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function CLMSClient({ cases: initial }: { cases: CLMSCase[] }) {
  const { permissions } = usePortalPermissions();
  const [cases, setCases]               = useState(initial);
  const [typeFilter, setTypeFilter]     = useState<CLMSCaseType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<CLMSCaseStatus | "All">("All");
  const [selected, setSelected]         = useState<CLMSCase | null>(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);

  const handleView    = useCallback((c: CLMSCase) => { setSelected(c); setDrawerOpen(true); }, []);
  const handleClose   = useCallback(() => setDrawerOpen(false), []);
  const handleUpdate  = useCallback((updated: CLMSCase) =>
    setCases((prev) => prev.map((c) => c.id === updated.id ? updated : c)), []);
  const handleCreated = useCallback((created: CLMSCase) =>
    setCases((prev) => [created, ...prev]), []);

  const openCount     = cases.filter((c) => c.status === "submitted" || c.status === "under_review").length;
  const approvedCount = cases.filter((c) => c.status === "approved").length;
  const pendingDocs   = cases.reduce((s, c) => s + c.documents.length, 0);

  const KPIS = [
    { label: "Total Cases",  value: cases.length,   sub: "all time",            color: "text-foreground" },
    { label: "Active",       value: openCount,       sub: "submitted or review", color: openCount > 0 ? "text-warning" : "text-foreground" },
    { label: "Approved",     value: approvedCount,   sub: "approved cases",      color: "text-success" },
    { label: "Documents",    value: pendingDocs,     sub: "total uploaded",      color: "text-foreground" },
  ];

  const filtered = cases.filter((c) =>
    (typeFilter   === "All" || c.type   === typeFilter) &&
    (statusFilter === "All" || c.status === statusFilter)
  );
  const hasFilters = typeFilter !== "All" || statusFilter !== "All";

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="CLMS Integration"
          description="Converged Licensing Management System — licence applications, reviews, and decisions."
          actions={
            permissions.clms.create ? (
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
                <FolderPlus className="h-4 w-4" /> New Case
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
            <h2 className="text-sm font-semibold text-foreground">Cases</h2>
            <div className="relative">
              <select className={SELECT} value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as CLMSCaseType | "All")}>
                <option value="All">All Types</option>
                {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <select className={SELECT} value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CLMSCaseStatus | "All")}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {hasFilters && (
              <button type="button" onClick={() => { setTypeFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {cases.length} cases</span>
          </div>
          <CLMSTable cases={filtered} onView={handleView} />
        </section>
      </div>

      <CLMSDrawer caseItem={selected} open={drawerOpen} onClose={handleClose} onUpdate={handleUpdate} />

      <NewCaseModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </>
  );
}
