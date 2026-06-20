"use client";

import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComplaintSeverity, RwandaSector } from "@/types";

const SECTORS: RwandaSector[]           = ["Telecom", "Energy", "Water", "Transport"];
const SEVERITIES: ComplaintSeverity[]   = ["low", "medium", "high", "critical"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card",
  "pl-3 pr-8 py-2 text-sm text-foreground cursor-pointer",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
  "transition-colors hover:border-accent/50"
);

interface Props {
  sectorFilter:    RwandaSector | "All";
  severityFilter:  ComplaintSeverity | "All";
  onSectorChange:  (v: RwandaSector | "All") => void;
  onSeverityChange:(v: ComplaintSeverity | "All") => void;
  total:    number;
  filtered: number;
}

export function ComplaintFilterBar({
  sectorFilter, severityFilter, onSectorChange, onSeverityChange, total, filtered,
}: Props) {
  const hasFilters = sectorFilter !== "All" || severityFilter !== "All";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Sector */}
      <div className="relative">
        <select
          className={SELECT}
          value={sectorFilter}
          onChange={(e) => onSectorChange(e.target.value as RwandaSector | "All")}
        >
          <option value="All">All Sectors</option>
          {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Severity */}
      <div className="relative">
        <select
          className={SELECT}
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value as ComplaintSeverity | "All")}
        >
          <option value="All">All Severities</option>
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => { onSectorChange("All"); onSeverityChange("All"); }}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}

      <span className="ml-auto text-xs text-muted-foreground">
        {filtered === total
          ? `${total} complaint${total !== 1 ? "s" : ""}`
          : `${filtered} of ${total} complaints`}
      </span>
    </div>
  );
}
