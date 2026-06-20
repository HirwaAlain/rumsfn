"use client";

import { useState } from "react";
import { ChevronDown, X, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { InviteUserModal } from "@/components/users/InviteUserModal";
import { cn } from "@/lib/utils";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { User, UserRole, UserStatus } from "@/types";

const ROLES: UserRole[]     = ["admin", "supervisor", "auditor", "analyst", "viewer"];
const STATUSES: UserStatus[] = ["active", "inactive", "suspended"];

const SELECT = cn(
  "appearance-none rounded-md border border-border bg-card pl-3 pr-8 py-2 text-sm",
  "text-foreground cursor-pointer transition-colors hover:border-accent/50",
  "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
);

export function UsersClient({ users: initial }: { users: User[] }) {
  const { permissions } = usePortalPermissions();
  const [users, setUsers]               = useState(initial);
  const [roleFilter, setRoleFilter]     = useState<UserRole | "All">("All");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");
  const [modalOpen, setModalOpen]       = useState(false);

  function handleStatusChange(id: string, newStatus: UserStatus) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: newStatus } : u));
  }

  const activeCount    = users.filter((u) => u.status === "active").length;
  const mfaCount       = users.filter((u) => u.mfaEnabled).length;
  const adminCount     = users.filter((u) => u.role === "admin" || u.role === "supervisor").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  const KPIS = [
    { label: "Total Users",     value: users.length,   sub: "registered accounts",     color: "text-foreground" },
    { label: "Active",          value: activeCount,    sub: "currently active",         color: "text-success" },
    { label: "MFA Enabled",     value: mfaCount,       sub: "with 2-factor auth",       color: "text-accent" },
    { label: "Elevated Access", value: adminCount,     sub: "admin or supervisor role", color: suspendedCount > 0 ? "text-warning" : "text-foreground" },
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
          <UsersTable users={filtered} onStatusChange={handleStatusChange} />
        </section>
      </div>

      <InviteUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(u) => setUsers((prev) => [u, ...prev])}
      />
    </>
  );
}
