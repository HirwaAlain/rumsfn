"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FraudTable } from "@/components/fraud/FraudTable";
import { FraudDrawer } from "@/components/fraud/FraudDrawer";
import { ReportCaseModal } from "@/components/fraud/ReportCaseModal";
import { cn, formatCurrency } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { FraudCase, FraudCaseStatus, FraudRiskLevel } from "@/types";

const RISK_LEVELS: FraudRiskLevel[]  = ["critical", "high", "medium", "low"];
const STATUSES: FraudCaseStatus[]    = ["open", "investigating", "confirmed", "referred", "dismissed"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

const KPI_VARIANT = {
  danger:  "text-danger",
  warning: "text-warning",
  success: "text-success",
  default: "text-foreground",
} as const;
type KpiVariant = keyof typeof KPI_VARIANT;

export function FraudClient({ cases: initial }: { cases: FraudCase[] }) {
  const { permissions } = usePortalPermissions();
  const [cases, setCases]               = useState(initial);
  const [riskFilter, setRiskFilter]     = useState<FraudRiskLevel | "All">("All");
  const [statusFilter, setStatusFilter] = useState<FraudCaseStatus | "All">("All");
  const [selected, setSelected]         = useState<FraudCase | null>(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);

  const handleView    = useCallback((c: FraudCase) => { setSelected(c); setDrawerOpen(true); }, []);
  const handleClose   = useCallback(() => setDrawerOpen(false), []);
  const handleUpdate  = useCallback((updated: FraudCase) =>
    setCases((prev) => prev.map((c) => c.id === updated.id ? updated : c)), []);
  const handleCreated = useCallback((created: FraudCase) =>
    setCases((prev) => [created, ...prev]), []);

  const activeCases    = cases.filter((c) => c.status === "open" || c.status === "investigating").length;
  const criticalCases  = cases.filter((c) => c.riskLevel === "critical").length;
  const confirmedCases = cases.filter((c) => c.status === "confirmed").length;
  const totalLoss      = cases.reduce((s, c) => s + c.estimatedLossRwf, 0);

  const KPIS: Array<{ label: string; value: string | number; sub: string; variant: KpiVariant; compact?: boolean }> = [
    { label: "Active Cases",    value: activeCases,               sub: "open or investigating",    variant: activeCases > 0 ? "warning" : "success" },
    { label: "Critical Risk",   value: criticalCases,             sub: "require immediate action", variant: criticalCases > 0 ? "danger" : "success" },
    { label: "Confirmed Fraud", value: confirmedCases,            sub: "cases confirmed",          variant: confirmedCases > 0 ? "danger" : "success" },
    { label: "Est. Total Loss", value: formatCurrency(totalLoss), sub: "across all cases",         variant: totalLoss > 0 ? "danger" : "default", compact: true },
  ];

  const filtered = cases.filter((c) =>
    (riskFilter === "All" || c.riskLevel === riskFilter) &&
    (statusFilter === "All" || c.status === statusFilter)
  );
  const hasFilters = riskFilter !== "All" || statusFilter !== "All";

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Fraud & Anomaly Detection"
          description="Investigate flagged cases and monitor risk indicators across regulated sectors."
          actions={
            permissions.fraud.create ? (
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors">
                <ShieldAlert className="h-4 w-4" /> Report Case
              </button>
            ) : undefined
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {KPIS.map(({ label, value, sub, variant, compact }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className={cn(
                "mt-2 font-bold tabular-nums leading-tight break-all",
                compact ? "text-xl sm:text-2xl" : "text-3xl",
                KPI_VARIANT[variant],
              )}>{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
        <section>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground">Fraud Cases</h2>
            <div className="relative">
              <select className={SELECT} value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as FraudRiskLevel | "All")}>
                <option value="All">All Risk Levels</option>
                {RISK_LEVELS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <select className={SELECT} value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FraudCaseStatus | "All")}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {hasFilters && (
              <button type="button" onClick={() => { setRiskFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {cases.length} cases</span>
          </div>
          <FraudTable cases={filtered} onView={handleView} />
        </section>
      </div>

      <FraudDrawer fraudCase={selected} open={drawerOpen} onClose={handleClose} onUpdate={handleUpdate} />

      <ReportCaseModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </>
  );
}
