import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LicenseStatus, RwandaSector } from "@/types";

const SECTORS: RwandaSector[] = ["Telecom", "Energy", "Water", "Transport"];
const STATUSES: LicenseStatus[] = ["active", "pending", "suspended", "revoked", "expired"];

interface LicenseFilterBarProps {
  sectorFilter: RwandaSector | "All";
  statusFilter: LicenseStatus | "All";
  onSectorChange: (v: RwandaSector | "All") => void;
  onStatusChange: (v: LicenseStatus | "All") => void;
  totalCount: number;
  filteredCount: number;
}

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: T | "All";
  onChange: (v: T | "All") => void;
  options: T[];
  allLabel: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "All")}
        className={cn(
          "w-full appearance-none rounded-md border border-border bg-card",
          "pl-3 pr-8 py-2 text-sm text-foreground cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
          "transition-colors hover:border-accent/50"
        )}
      >
        <option value="All">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1).replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function LicenseFilterBar({
  sectorFilter,
  statusFilter,
  onSectorChange,
  onStatusChange,
  totalCount,
  filteredCount,
}: LicenseFilterBarProps) {
  const hasFilters = sectorFilter !== "All" || statusFilter !== "All";

  function clearFilters() {
    onSectorChange("All");
    onStatusChange("All");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterSelect<RwandaSector>
        value={sectorFilter}
        onChange={onSectorChange}
        options={SECTORS}
        allLabel="All Sectors"
      />
      <FilterSelect<LicenseStatus>
        value={statusFilter}
        onChange={onStatusChange}
        options={STATUSES}
        allLabel="All Statuses"
      />

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear filters
        </button>
      )}

      <span className="ml-auto text-xs text-muted-foreground">
        {filteredCount === totalCount
          ? `${totalCount} licence${totalCount !== 1 ? "s" : ""}`
          : `${filteredCount} of ${totalCount} licences`}
      </span>
    </div>
  );
}
