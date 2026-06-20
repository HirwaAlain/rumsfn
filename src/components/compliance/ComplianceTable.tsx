import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { ComplianceRecord, RwandaSector } from "@/types";

const TODAY_MS = new Date("2026-03-22").getTime();

const SECTOR_CHIP: Record<RwandaSector, string> = {
  Telecom:   "bg-accent/10 text-accent",
  Energy:    "bg-warning-bg text-warning-fg",
  Water:     "bg-info-bg text-info-fg",
  Transport: "bg-success-bg text-success-fg",
};

const SCORE_BAR: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
};

function scoreColour(score: number) {
  return score >= 80 ? "success" : score >= 60 ? "warning" : "danger";
}

const COLUMNS: ColumnDef<ComplianceRecord, unknown>[] = [
  {
    accessorKey: "operatorName",
    header: "Operator",
    cell: ({ getValue }) => (
      <span className="font-medium text-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "checkType",
    header: "Check Type",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="block max-w-[180px] truncate text-sm text-muted-foreground">
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
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ getValue }) => {
      const score = getValue<number>();
      const key   = scoreColour(score);
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
            {/* dynamic width requires inline style — purely presentational */}
            <div className={cn("h-full rounded-full", SCORE_BAR[key])} style={{ width: `${score}%` }} />
          </div>
          <span className="text-sm font-medium tabular-nums text-foreground">{score}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ getValue }) => {
      const d = getValue<string>();
      const overdue = new Date(d).getTime() < TODAY_MS;
      return (
        <span className={cn("text-sm", overdue ? "font-medium text-danger" : "text-foreground")}>
          {overdue && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-danger" />}
          {formatDate(d)}
        </span>
      );
    },
  },
  {
    accessorKey: "lastAuditDate",
    header: "Last Audit",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: "auditor",
    header: "Auditor",
    cell: ({ getValue }) => {
      const v = getValue<string | { id: string; name: string }>();
      const label = typeof v === "object" && v !== null ? v.name : v;
      return <span className="text-sm text-muted-foreground">{label ?? "—"}</span>;
    },
  },
  {
    accessorKey: "findings",
    header: "Findings",
    enableSorting: false,
    cell: ({ getValue }) => {
      const f = getValue<string | undefined>();
      return f ? (
        <span className="block max-w-[220px] truncate text-xs italic text-muted-foreground">{f}</span>
      ) : (
        <span className="text-xs text-muted-foreground/40">—</span>
      );
    },
  },
];

export function ComplianceTable({ records }: { records: ComplianceRecord[] }) {
  return (
    <DataTable
      data={records}
      columns={COLUMNS}
      searchPlaceholder="Search by operator or check type…"
      emptyTitle="No records found"
      emptyDescription="Try adjusting the status or sector filters."
    />
  );
}
