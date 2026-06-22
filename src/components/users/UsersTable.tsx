"use client";

import { useState, useRef, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ShieldCheck, ShieldOff, Ban, RefreshCw, Trash2, UserCog, ChevronDown } from "lucide-react";
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

const ROLES: UserRole[] = ["admin", "supervisor", "analyst", "auditor", "viewer"];

function ActionMenu({
  user,
  onStatusChange,
  onRoleChange,
  onDelete,
  canManage,
  canChangeStatus,
}: {
  user: User;
  onStatusChange: (id: string, status: UserStatus) => void;
  onRoleChange: (id: string, role: UserRole) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
  canChangeStatus: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowRoles(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // No permissions at all → render nothing
  if (!canManage && !canChangeStatus) return null;

  // Limited: can change status but not full management → show a simple toggle button
  if (!canManage && canChangeStatus) {
    if (user.status === "active") {
      return (
        <button type="button" onClick={() => onStatusChange(user.id, "suspended")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/20">
          <Ban className="h-3.5 w-3.5" /> Suspend
        </button>
      );
    }
    if (user.status === "suspended") {
      return (
        <button type="button" onClick={() => onStatusChange(user.id, "active")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-2.5 py-1 text-xs font-medium text-success transition-colors hover:bg-success/20">
          <RefreshCw className="h-3.5 w-3.5" /> Reactivate
        </button>
      );
    }
    return null;
  }

  // Full management: Actions dropdown
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen((o) => !o); setShowRoles(false); }}
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted">
        Actions <ChevronDown className="h-3 w-3" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
          {/* Status actions — only shown when canChangeStatus */}
          {canChangeStatus && (
            <>
              {user.status === "active" && (
                <button type="button"
                  onClick={() => { onStatusChange(user.id, "suspended"); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors">
                  <Ban className="h-3.5 w-3.5" /> Suspend User
                </button>
              )}
              {user.status === "suspended" && (
                <button type="button"
                  onClick={() => { onStatusChange(user.id, "active"); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-success hover:bg-success/10 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Reactivate User
                </button>
              )}
              {user.status === "inactive" && (
                <button type="button"
                  onClick={() => { onStatusChange(user.id, "active"); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-success hover:bg-success/10 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Activate User
                </button>
              )}
            </>
          )}

          {/* Role submenu */}
          <div className={canChangeStatus ? "border-t border-border" : ""}>
            <button type="button"
              onClick={() => setShowRoles((s) => !s)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted transition-colors">
              <span className="flex items-center gap-2"><UserCog className="h-3.5 w-3.5" /> Change Role</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showRoles ? "rotate-180" : ""}`} />
            </button>
            {showRoles && (
              <div className="border-t border-border bg-muted/30">
                {ROLES.filter((r) => r !== user.role).map((r) => (
                  <button key={r} type="button"
                    onClick={() => { onRoleChange(user.id, r); setOpen(false); setShowRoles(false); }}
                    className="flex w-full items-center gap-2 px-5 py-2 text-xs text-foreground hover:bg-accent/10 hover:text-accent transition-colors capitalize">
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete */}
          <div className="border-t border-border">
            <button type="button"
              onClick={() => { onDelete(user.id); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function makeColumns(
  onStatusChange: (id: string, newStatus: UserStatus) => void,
  onRoleChange: (id: string, role: UserRole) => void,
  onDelete: (id: string) => void,
  canManageUsers: boolean,
  canChangeStatus: boolean,
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
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <ActionMenu
          user={row.original}
          onStatusChange={onStatusChange}
          onRoleChange={onRoleChange}
          onDelete={onDelete}
          canManage={canManageUsers}
          canChangeStatus={canChangeStatus}
        />
      ),
    },
  ];
}

export function UsersTable({
  users,
  onStatusChange,
  onRoleChange,
  onDelete,
  canManageUsers = false,
  canChangeStatus = false,
}: {
  users: User[];
  onStatusChange: (id: string, newStatus: UserStatus) => void;
  onRoleChange: (id: string, role: UserRole) => void;
  onDelete: (id: string) => void;
  canManageUsers?: boolean;
  canChangeStatus?: boolean;
}) {
  return (
    <DataTable
      data={users}
      columns={makeColumns(onStatusChange, onRoleChange, onDelete, canManageUsers, canChangeStatus)}
      searchPlaceholder="Search by name, email or department…"
      emptyTitle="No users found"
      emptyDescription="Try adjusting the role or status filters."
    />
  );
}
