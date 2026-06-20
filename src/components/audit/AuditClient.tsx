"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AuditTable } from "@/components/audit/AuditTable";
import { cn } from "@/lib/utils";
import type { AuditLogEntry, AuditAction, AuditModule } from "@/types";

const ACTIONS: AuditAction[] = [
  "create", "update", "delete", "approve", "reject",
  "suspend", "reinstate", "export", "login", "logout",
  "password_reset", "permission_change",
];
const MODULES: AuditModule[] = [
  "Licenses", "Complaints", "Compliance", "Fraud", "Reports",
  "Users", "Workflows", "Alerts", "CLMS", "System",
];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function AuditClient({ entries }: { entries: AuditLogEntry[] }) {
  const [moduleFilter, setModuleFilter] = useState<AuditModule | "All">("All");
  const [actionFilter, setActionFilter] = useState<AuditAction | "All">("All");

  const filtered = entries.filter((e) =>
    (moduleFilter === "All" || e.module === moduleFilter) &&
    (actionFilter === "All" || e.action === actionFilter)
  );
  const hasFilters = moduleFilter !== "All" || actionFilter !== "All";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audit & Activity Log"
        description="Immutable record of all platform actions for compliance and accountability."
      />

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">Audit Trail</h2>

          <div className="relative">
            <select className={SELECT} value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value as AuditModule | "All")}>
              <option value="All">All Modules</option>
              {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative">
            <select className={SELECT} value={actionFilter} onChange={(e) => setActionFilter(e.target.value as AuditAction | "All")}>
              <option value="All">All Actions</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>{a.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {hasFilters && (
            <button type="button" onClick={() => { setModuleFilter("All"); setActionFilter("All"); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}

          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {entries.length} entries</span>
        </div>

        <AuditTable entries={filtered} />
      </section>
    </div>
  );
}
