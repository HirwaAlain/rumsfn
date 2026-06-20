"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { User, Settings, LogOut, Shield, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn, capitalize } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLE_BADGE: Record<string, string> = {
  admin:      "bg-danger-bg   text-danger-fg",
  supervisor: "bg-warning-bg  text-warning-fg",
  analyst:    "bg-info-bg     text-info-fg",
  auditor:    "bg-success-bg  text-success-fg",
  viewer:     "bg-muted       text-muted-foreground",
};

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const ITEM_BASE = "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors";

export function HeaderUserMenu() {
  const { user, logout } = useAuth();

  const name = user?.name ?? "RURA User";
  const email = user?.email ?? "";
  const role = (user?.role ?? "viewer") as UserRole;
  const department = user?.department ?? "";
  const initials = getInitials(name);
  const badgeClass = ROLE_BADGE[role] ?? ROLE_BADGE.viewer;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
        >
          <Avatar initials={initials} size="sm" />
          <span className="hidden text-sm font-medium text-foreground sm:block">
            {name.split(" ")[0]}
          </span>
          <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-64 rounded-xl border border-border bg-card shadow-2xl outline-none"
        >
          {/* User info */}
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar initials={initials} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", badgeClass)}>
                <Shield className="h-2.5 w-2.5" aria-hidden="true" />
                {capitalize(role)}
              </span>
              {department && <span className="text-xs text-muted-foreground">{department}</span>}
            </div>
          </div>

          {/* Menu items */}
          <div className="p-1">
            <DropdownMenu.Item className={cn(ITEM_BASE, "text-foreground data-[highlighted]:bg-muted")}>
              <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Profile
            </DropdownMenu.Item>
            <DropdownMenu.Item className={cn(ITEM_BASE, "text-foreground data-[highlighted]:bg-muted")}>
              <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Settings
            </DropdownMenu.Item>
          </div>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <div className="p-1">
            <DropdownMenu.Item
              onSelect={logout}
              className={cn(ITEM_BASE, "text-danger data-[highlighted]:bg-danger-bg")}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// ── Internal avatar primitive ─────────────────────────────────────────────────

interface AvatarProps {
  initials: string;
  size: "sm" | "lg";
}

function Avatar({ initials, size }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-teal font-bold text-navy",
        size === "sm" ? "h-7 w-7 text-[11px]" : "h-10 w-10 text-sm"
      )}
    >
      {initials}
    </span>
  );
}
