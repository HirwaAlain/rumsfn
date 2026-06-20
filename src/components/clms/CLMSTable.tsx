import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { CLMSCase, CLMSCaseType, RwandaSector } from "@/types";

const SECTOR_CHIP: Record<RwandaSector, string> = {
  Telecom:   "bg-accent/10 text-accent",
  Energy:    "bg-warning-bg text-warning-fg",
  Water:     "bg-info-bg text-info-fg",
  Transport: "bg-success-bg text-success-fg",
};

const TYPE_LABEL: Record<CLMSCaseType, string> = {
  new_license:        "New Licence",
  license_renewal:    "Renewal",
  license_amendment:  "Amendment",
  license_revocation: "Revocation",
  tariff_review:      "Tariff Review",
  spectrum_assignment:"Spectrum",
  type_approval:      "Type Approval",
  dispute_resolution: "Dispute",
};

function getColumns(onView: (c: CLMSCase) => void): ColumnDef<CLMSCase, unknown>[] {
  return [
    {
      accessorKey: "caseNumber",
      header: "Case No.",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate text-sm font-medium text-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{TYPE_LABEL[getValue<CLMSCaseType>()]}</span>
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
      accessorKey: "applicantName",
      header: "Applicant",
      cell: ({ getValue }) => (
        <span className="block max-w-[160px] truncate text-sm text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ getValue }) => {
        const v = getValue<string | { id: string; name: string }>();
        const label = typeof v === "object" && v !== null ? v.name : v;
        return <span className="text-sm text-muted-foreground">{label ?? "—"}</span>;
      },
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
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

export function CLMSTable({ cases, onView }: { cases: CLMSCase[]; onView: (c: CLMSCase) => void }) {
  return (
    <DataTable
      data={cases}
      columns={getColumns(onView)}
      searchPlaceholder="Search by case number, title or applicant…"
      emptyTitle="No cases found"
      emptyDescription="Try adjusting the type or status filters."
    />
  );
}
