import { Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import type { License, RwandaSector } from "@/types";

// Reference date for expiry calculations (matches project mock date)
const TODAY_MS = new Date("2026-03-22").getTime();
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function getExpiryStatus(dateStr: string): "expired" | "soon" | "ok" {
  const ms = new Date(dateStr).getTime();
  if (ms < TODAY_MS) return "expired";
  if (ms < TODAY_MS + NINETY_DAYS_MS) return "soon";
  return "ok";
}

const SECTOR_CHIP: Record<RwandaSector, string> = {
  Telecom:   "bg-accent/10 text-accent",
  Energy:    "bg-warning-bg text-warning-fg",
  Water:     "bg-info-bg text-info-fg",
  Transport: "bg-success-bg text-success-fg",
};

interface LicenseTableProps {
  licenses: License[];
  onView: (license: License) => void;
}

export function LicenseTable({ licenses, onView }: LicenseTableProps) {
  const columns: ColumnDef<License, unknown>[] = [
    {
      accessorKey: "licenseNumber",
      header: "Licence #",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "operatorName",
      header: "Operator",
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground max-w-[180px] truncate block">
          {getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ getValue }) => {
        const sector = getValue<RwandaSector>();
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              SECTOR_CHIP[sector]
            )}
          >
            {sector}
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
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ getValue }) => {
        const dateStr = getValue<string>();
        const status = getExpiryStatus(dateStr);
        return (
          <span
            className={cn(
              "text-sm",
              status === "expired" && "font-medium text-danger",
              status === "soon"    && "font-medium text-warning",
              status === "ok"      && "text-foreground"
            )}
          >
            {status !== "ok" && (
              <span
                className={cn(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                  status === "expired" ? "bg-danger" : "bg-warning"
                )}
              />
            )}
            {formatDate(dateStr)}
          </span>
        );
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
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      ),
    },
  ];

  return (
    <DataTable
      data={licenses}
      columns={columns}
      searchPlaceholder="Search by operator or licence number…"
      emptyTitle="No licences found"
      emptyDescription="Try adjusting your sector or status filters."
    />
  );
}
