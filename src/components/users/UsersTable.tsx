import type { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, ShieldOff, Ban, RefreshCw } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types";

const ROLE_CHIP: Record<UserRole, string> = {
  admin:      "bg-danger-bg text-danger-fg",
  supervisor: "bg-warning-bg text-warning-fg",
  auditor:    "bg-info-bg text-info-fg",
  analyst:    "bg-accent/10 text-accent",
  viewer:     "bg-muted text-muted-foreground",
};

function makeColumns(
  onStatusChange: (id: string, newStatus: UserStatus) => void
): ColumnDef<User, unknown>[] {
  return [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
          {row.original.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const r = getValue<UserRole>();
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_CHIP[r]}`}>
          {r.charAt(0).toUpperCase() + r.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
  },
  {
    accessorKey: "mfaEnabled",
    header: "MFA",
    enableSorting: false,
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <span className="inline-flex items-center gap-1 text-xs text-success">
          <ShieldCheck className="h-3.5 w-3.5" /> Enabled
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldOff className="h-3.5 w-3.5" /> Off
        </span>
      ),
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{formatDateTime(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      const { id, status } = row.original;
      if (status === "active") {
        return (
          <button
            type="button"
            onClick={() => onStatusChange(id, "suspended")}
            className="inline-flex items-center gap-1.5 rounded-md border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
          >
            <Ban className="h-3.5 w-3.5" /> Suspend
          </button>
        );
      }
      if (status === "suspended") {
        return (
          <button
            type="button"
            onClick={() => onStatusChange(id, "active")}
            className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success/20"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reactivate
          </button>
        );
      }
      return null;
    },
  },
];}

export function UsersTable({
  users,
  onStatusChange,
}: {
  users: User[];
  onStatusChange: (id: string, newStatus: UserStatus) => void;
}) {
  return (
    <DataTable
      data={users}
      columns={makeColumns(onStatusChange)}
      searchPlaceholder="Search by name, email or department…"
      emptyTitle="No users found"
      emptyDescription="Try adjusting the role or status filters."
    />
  );
}
