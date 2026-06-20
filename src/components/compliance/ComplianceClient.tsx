"use client";

import { useState } from "react";
import { ChevronDown, X, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ScoreCard } from "@/components/compliance/ScoreCard";
import { ComplianceTable } from "@/components/compliance/ComplianceTable";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import { cn } from "@/lib/utils";
import type {
  ComplianceRecord, ComplianceStatus,
  ComplianceOverviewItem, RwandaSector,
} from "@/types";

const TODAY_MS = new Date("2026-03-22").getTime();

const STATUSES: ComplianceStatus[] = ["compliant", "non_compliant", "under_review", "remediation"];
const SECTORS: RwandaSector[]      = ["Telecom", "Energy", "Water", "Transport"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

const SUMMARY_VARIANT = {
  success: "text-success",
  warning: "text-warning",
  danger:  "text-danger",
  default: "text-foreground",
} as const;

type Variant = keyof typeof SUMMARY_VARIANT;

interface Props {
  records:  ComplianceRecord[];
  overview: ComplianceOverviewItem[];
}

export function ComplianceClient({ records, overview }: Props) {
  const { permissions } = usePortalPermissions();
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "All">("All");
  const [sectorFilter, setSectorFilter] = useState<RwandaSector | "All">("All");

  // Derived summary stats
  const compliantPct     = overview.find((o) => o.name === "Compliant")?.value ?? 0;
  const nonCompliantPct  = overview.find((o) => o.name === "Non-Compliant")?.value ?? 0;
  const avgScore         = Math.round(records.reduce((s, r) => s + r.score, 0) / records.length);
  const overdueCount     = records.filter(
    (r) => new Date(r.dueDate).getTime() < TODAY_MS && r.status !== "compliant"
  ).length;

  const SUMMARY: Array<{ label: string; value: string | number; sub: string; variant: Variant }> = [
    { label: "Compliance Rate",  value: `${compliantPct}%`,    sub: "of regulated operators",  variant: "success" },
    { label: "Non-Compliant",    value: nonCompliantPct,        sub: "percent of operators",    variant: "danger"  },
    { label: "Avg. Audit Score", value: avgScore,               sub: "out of 100",              variant: avgScore >= 70 ? "success" : "warning" },
    { label: "Overdue Reviews",  value: overdueCount,           sub: "past due date",           variant: overdueCount > 0 ? "warning" : "success" },
  ];

  const filtered = records.filter(
    (r) =>
      (statusFilter === "All" || r.status === statusFilter) &&
      (sectorFilter === "All" || r.sector === sectorFilter)
  );
  const hasFilters = statusFilter !== "All" || sectorFilter !== "All";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compliance Monitoring"
        description="Audit operator compliance against RURA regulatory requirements."
        actions={
          permissions.compliance.create ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
            >
              <Plus className="h-4 w-4" /> New Record
            </button>
          ) : undefined
        }
      />

      {/* ── Summary KPI cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SUMMARY.map(({ label, value, sub, variant }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className={cn("mt-2 text-3xl font-bold tabular-nums", SUMMARY_VARIANT[variant])}>
              {value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Operator scorecards ── */}
      <section>
        <h2 className="mb-4 text-sm font-semibold text-foreground">
          Operator Compliance Scores
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {records.map((r) => <ScoreCard key={r.id} record={r} />)}
        </div>
      </section>

      {/* ── Records table ── */}
      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Compliance Records</h2>

          <div className="relative">
            <select
              className={SELECT}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ComplianceStatus | "All")}
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              className={SELECT}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value as RwandaSector | "All")}
            >
              <option value="All">All Sectors</option>
              {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => { setStatusFilter("All"); setSectorFilter("All"); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {records.length} records
          </span>
        </div>

        <ComplianceTable records={filtered} />
      </section>
    </div>
  );
}
