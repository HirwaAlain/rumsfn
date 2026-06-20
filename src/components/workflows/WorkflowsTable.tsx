import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { Workflow, WorkflowTrigger, RwandaSector } from "@/types";

const SECTOR_CHIP: Record<string, string> = {
  Telecom:     "bg-accent/10 text-accent",
  Energy:      "bg-warning-bg text-warning-fg",
  Water:       "bg-info-bg text-info-fg",
  Transport:   "bg-success-bg text-success-fg",
  "All Sectors": "bg-muted text-muted-foreground",
};

const TRIGGER_LABEL: Record<WorkflowTrigger, string> = {
  license_application: "Licence Application",
  complaint_filed:     "Complaint Filed",
  compliance_due:      "Compliance Due",
  fraud_alert:         "Fraud Alert",
  renewal_due:         "Renewal Due",
  manual:              "Manual",
};

function progressBar(workflow: Workflow) {
  const total     = workflow.steps.length;
  const completed = workflow.steps.filter((s) => s.status === "completed" || s.status === "skipped").length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { pct, completed, total };
}

function getColumns(onView: (w: Workflow) => void): ColumnDef<Workflow, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: "Workflow",
      cell: ({ row }) => (
        <div>
          <p className="max-w-[180px] truncate font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{TRIGGER_LABEL[row.original.trigger]}</p>
        </div>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ getValue }) => {
        const s = getValue<RwandaSector | "All Sectors">();
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
      id: "progress",
      header: "Progress",
      enableSorting: false,
      cell: ({ row }) => {
        const { pct, completed, total } = progressBar(row.original);
        return (
          <div className="flex items-center gap-2 min-w-[100px]">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">{completed}/{total}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
      cell: ({ getValue }) => {
        const v = getValue<string | { id: string; name: string }>();
        const label = typeof v === "object" && v !== null ? v.name : v;
        return <span className="text-sm text-muted-foreground">{label ?? "—"}</span>;
      },
    },
    {
      accessorKey: "startedAt",
      header: "Started",
      cell: ({ getValue }) => {
        const v = getValue<string | undefined>();
        return v
          ? <span className="text-sm text-muted-foreground">{formatDate(v)}</span>
          : <span className="text-xs text-muted-foreground/40 italic">Not started</span>;
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <button type="button" onClick={() => onView(row.original)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-accent hover:bg-accent/10 transition-colors">
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];
}

export function WorkflowsTable({ workflows, onView }: { workflows: Workflow[]; onView: (w: Workflow) => void }) {
  return (
    <DataTable
      data={workflows}
      columns={getColumns(onView)}
      searchPlaceholder="Search by name, trigger or creator…"
      emptyTitle="No workflows found"
      emptyDescription="Try adjusting the status or trigger filters."
    />
  );
}
