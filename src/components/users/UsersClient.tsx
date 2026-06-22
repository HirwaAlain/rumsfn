"use client";

import { useState, useCallback } from "react";
import { ChevronDown, X, UserPlus, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { InviteUserModal } from "@/components/users/InviteUserModal";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import { updateUserStatus, updateUserRole, deleteUser } from "@/lib/api/users";
import { useToast } from "@/components/shared/Toast";
import type { User, UserRole, UserStatus } from "@/types";

const ROLES: UserRole[]      = ["admin", "supervisor", "auditor", "analyst", "viewer"];
const STATUSES: UserStatus[] = ["active", "inactive", "suspended"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

interface DeleteConfirmProps {
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({ user, onConfirm, onCancel }: DeleteConfirmProps) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-card border border-border p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Delete User</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{user.name}</span>?
              This action cannot be undone. The user will lose all access immediately.
            </p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onCancel}
            className="flex-1 rounded-lg border border-border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            className="flex-1 rounded-lg bg-danger py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors">
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

export function UsersClient({ users: initial }: { users: User[] }) {
  const { permissions } = usePortalPermissions();
  const { toast } = useToast();
  const [users, setUsers]               = useState(initial);
  const [roleFilter, setRoleFilter]     = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [modalOpen, setModalOpen]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const handleStatusChange = useCallback(async (id: string, newStatus: UserStatus) => {
    try {
      await updateUserStatus(id, newStatus);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
      const label = newStatus === "suspended" ? "suspended" : "reactivated";
      toast(`User ${label} successfully.`);
    } catch {
      toast("Failed to update user status.", "error");
    }
  }, [toast]);

  const handleRoleChange = useCallback(async (id: string, role: UserRole) => {
    try {
      await updateUserRole(id, role);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
      toast(`Role changed to ${role} successfully.`);
    } catch {
      toast("Failed to change user role.", "error");
    }
  }, [toast]);

  const handleDeleteRequest = useCallback((id: string) => {
    const user = users.find((u) => u.id === id) ?? null;
    setDeleteTarget(user);
  }, [users]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast(`User ${deleteTarget.name} deleted successfully.`);
    } catch {
      toast("Failed to delete user.", "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, toast]);

  const activeCount    = users.filter((u) => u.status === "active").length;
  const mfaCount       = users.filter((u) => u.mfaEnabled).length;
  const adminCount     = users.filter((u) => u.role === "admin" || u.role === "supervisor").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  const KPIS = [
    { label: "Total Users",     value: users.length,    sub: "registered accounts",     color: "text-foreground" },
    { label: "Active",          value: activeCount,     sub: "currently active",         color: "text-success" },
    { label: "MFA Enabled",     value: mfaCount,        sub: "with 2-factor auth",       color: "text-accent" },
    { label: "Elevated Access", value: adminCount,      sub: "admin or supervisor role", color: suspendedCount > 0 ? "text-warning" : "text-foreground" },
  ];

  const filtered = users.filter((u) =>
    (roleFilter   === "All" || u.role   === roleFilter) &&
    (statusFilter === "All" || u.status === statusFilter)
  );
  const hasFilters = roleFilter !== "All" || statusFilter !== "All";

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="User & Role Management"
          description="Manage RUMS user accounts, roles, and access permissions."
          actions={
            permissions.users.create ? (
              <button type="button" onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors">
                <UserPlus className="h-4 w-4" /> New User
              </button>
            ) : undefined
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {KPIS.map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className={cn("mt-2 text-3xl font-bold tabular-nums", color)}>{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {suspendedCount > 0 && (
          <div className="rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 flex items-center gap-2 text-sm text-warning-fg">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span><span className="font-semibold">{suspendedCount} user{suspendedCount > 1 ? "s" : ""}</span> currently suspended and cannot access the system.</span>
          </div>
        )}

        <section>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground">All Users</h2>
            <div className="relative">
              <select className={SELECT} value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}>
                <option value="All">All Roles</option>
                {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="relative">
              <select className={SELECT} value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | "All")}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {hasFilters && (
              <button type="button" onClick={() => { setRoleFilter("All"); setStatusFilter("All"); }}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} of {users.length} users</span>
          </div>
          <UsersTable
            users={filtered}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onDelete={handleDeleteRequest}
            canManageUsers={permissions.users.delete || permissions.users.changeRole}
          />
        </section>
      </div>

      <InviteUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(u) => setUsers((prev) => [u, ...prev])}
      />

      <DeleteConfirmDialog
        user={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
