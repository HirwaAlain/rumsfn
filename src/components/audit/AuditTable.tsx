import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { cn, formatDateTime } from "@/lib/utils";
import type { AuditLogEntry, AuditAction, AuditModule } from "@/types";

const ACTION_CHIP: Record<AuditAction, string> = {
  create:           "bg-success-bg text-success-fg",
  update:           "bg-info-bg text-info-fg",
  delete:           "bg-danger-bg text-danger-fg",
  approve:          "bg-success-bg text-success-fg",
  reject:           "bg-danger-bg text-danger-fg",
  suspend:          "bg-warning-bg text-warning-fg",
  reinstate:        "bg-info-bg text-info-fg",
  export:           "bg-accent/10 text-accent",
  login:            "bg-muted text-muted-foreground",
  logout:           "bg-muted text-muted-foreground",
  password_reset:   "bg-warning-bg text-warning-fg",
  permission_change:"bg-danger-bg text-danger-fg",
};

const MODULE_CHIP: Record<AuditModule, string> = {
  Licenses:   "bg-accent/10 text-accent",
  Complaints: "bg-warning-bg text-warning-fg",
  Compliance: "bg-info-bg text-info-fg",
  Fraud:      "bg-danger-bg text-danger-fg",
  Reports:    "bg-success-bg text-success-fg",
  Users:      "bg-muted text-muted-foreground",
  Workflows:  "bg-accent/10 text-accent",
  Alerts:     "bg-warning-bg text-warning-fg",
  CLMS:       "bg-info-bg text-info-fg",
  System:     "bg-muted text-muted-foreground",
};

const COLUMNS: ColumnDef<AuditLogEntry, unknown>[] = [
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ getValue }) => (
      <span className="text-xs text-muted-foreground tabular-nums">{formatDateTime(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: "userName",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-foreground">{row.original.userName}</p>
        <p className="text-xs text-muted-foreground">{row.original.ipAddress}</p>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ getValue }) => {
      const a = getValue<AuditAction>();
      return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", ACTION_CHIP[a])}>
          {a.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ getValue }) => {
      const m = getValue<AuditModule>();
      return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", MODULE_CHIP[m])}>
          {m}
        </span>
      );
    },
  },
  {
    accessorKey: "entityLabel",
    header: "Entity",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="block max-w-[220px] truncate text-sm text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "changes",
    header: "Changes",
    enableSorting: false,
    cell: ({ getValue }) => {
      const changes = getValue<AuditLogEntry["changes"]>();
      if (!changes) return <span className="text-xs text-muted-foreground/40">—</span>;
      const entries = Object.entries(changes);
      return (
        <div className="space-y-0.5">
          {entries.map(([field, { before, after }]) => (
            <p key={field} className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{field}:</span>{" "}
              <span className="line-through opacity-60">{before}</span> → {after}
            </p>
          ))}
        </div>
      );
    },
  },
];

export function AuditTable({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <DataTable
      data={entries}
      columns={COLUMNS}
      searchPlaceholder="Search by user, entity or module…"
      emptyTitle="No audit entries found"
      emptyDescription="Try adjusting the module or action filters."
    />
  );
}
