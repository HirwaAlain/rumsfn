import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import type { FraudCase, RwandaSector } from "@/types";

const SECTOR_CHIP: Record<RwandaSector, string> = {
  Telecom:   "bg-accent/10 text-accent",
  Energy:    "bg-warning-bg text-warning-fg",
  Water:     "bg-info-bg text-info-fg",
  Transport: "bg-success-bg text-success-fg",
};

function getColumns(onView: (c: FraudCase) => void): ColumnDef<FraudCase, unknown>[] {
  return [
    {
      accessorKey: "caseNumber",
      header: "Case No.",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "indicatorType",
      header: "Indicator",
      cell: ({ getValue }) => (
        <span className="block max-w-[160px] truncate text-sm text-foreground">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "operatorInvolved",
      header: "Operator",
      cell: ({ getValue }) => (
        <span className="block max-w-[160px] truncate text-sm text-muted-foreground">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ getValue }) => {
        const s = getValue<RwandaSector>();
        return (
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", SECTOR_CHIP[s])}>
            {s}
          </span>
        );
      },
    },
    {
      accessorKey: "riskLevel",
      header: "Risk",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      accessorKey: "estimatedLossRwf",
      header: "Est. Loss",
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <span className={cn("text-sm tabular-nums", v > 0 ? "font-medium text-danger" : "text-muted-foreground/50")}>
            {v > 0 ? formatCurrency(v) : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "reportedAt",
      header: "Reported",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: "investigatingOfficer",
      header: "Officer",
      enableSorting: false,
      cell: ({ getValue }) => {
        const v = getValue<string | { id: string; name: string } | undefined>();
        const label = typeof v === "object" && v !== null ? v.name : v;
        return label
          ? <span className="text-sm text-muted-foreground">{label}</span>
          : <span className="text-xs text-muted-foreground/40 italic">Unassigned</span>;
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-accent hover:bg-accent/10 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      ),
    },
  ];
}

export function FraudTable({
  cases,
  onView,
}: {
  cases: FraudCase[];
  onView: (c: FraudCase) => void;
}) {
  return (
    <DataTable
      data={cases}
      columns={getColumns(onView)}
      searchPlaceholder="Search by case number, indicator or operator…"
      emptyTitle="No cases found"
      emptyDescription="Try adjusting the risk level or status filters."
    />
  );
}
