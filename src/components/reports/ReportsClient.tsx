"use client";

import { useState } from "react";
import { ChevronDown, X, FilePlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { NewReportModal } from "@/components/reports/NewReportModal";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { Report, ReportType, ReportStatus } from "@/types";

const TYPES: ReportType[]     = ["monthly", "quarterly", "annual", "ad_hoc"];
const STATUSES: ReportStatus[] = ["draft", "published", "archived"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function ReportsClient({ reports: initial }: { reports: Report[] }) {
  const { permissions } = usePortalPermissions();
  const [reports, setReports]           = useState(initial);
  const [typeFilter, setTypeFilter]     = useState<ReportType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");
  const [modalOpen, setModalOpen]       = useState(false);

  const published    = reports.filter((r) => r.status === "published").length;
  const drafts       = reports.filter((r) => r.status === "draft").length;
  const totalSizeKb  = reports.reduce((s, r) => s + (r.sizeKb ?? 0), 0);
  const totalMb      = (totalSizeKb / 1024).toFixed(1);

  const KPIS = [
    { label: "Total Reports", value: reports.length, sub: "across all modules",  color: "text-foreground" },
    { label: "Published",     value: published,      sub: "available to view",   color: "text-success" },
    { label: "Drafts",        value: drafts,         sub: "pending publication", color: drafts > 0 ? "text-warning" : "text-foreground" },
    { label: "Total Size",    value: `${totalMb} MB`, sub: "combined file size", color: "text-foreground" },
  ];

  const filtered = reports.filter((r) =>
    (typeFilter   === "All" || r.type   === typeFilter) &&
    (statusFilter === "All" || r.status === statusFilter)
  );
  const hasFilters = typeFilter !== "All" || statusFilter !== "All";

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Reports & Dashboards"
          description="Generate, publish, and export regulatory reports across all sectors."
          actions={
            permissions.reports.create ? (
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
                <FilePlus className="h-4 w-4" /> New Report
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
            <h2 className="text-sm font-semibold text-foreground">All Reports</h2>
            <div className="relative">
              <select className={SELECT} value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ReportType | "All")}>
                <option value="All">All Types</option>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <select className={SELECT} value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReportStatus | "All")}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {hasFilters && (
              <button type="button" onClick={() => { setTypeFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {reports.length} reports</span>
          </div>
          <ReportsTable
            reports={filtered}
            canPublish={permissions.reports.publish}
            canArchive={permissions.reports.archive}
            canDownload={permissions.reports.download}
          />
        </section>
      </div>

      <NewReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(r) => setReports((prev) => [r, ...prev])}
      />
    </>
  );
}
