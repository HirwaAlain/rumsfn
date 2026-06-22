"use client";

import { useState, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, AlertCircle, AlertTriangle, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api/client";
import type { Alert, AlertSeverity } from "@/types";

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: LucideIcon; dot: string; iconColor: string; bg: string }> = {
  critical: { icon: AlertCircle,   dot: "bg-danger",  iconColor: "text-danger",  bg: "bg-danger/10"  },
  warning:  { icon: AlertTriangle, dot: "bg-warning", iconColor: "text-warning", bg: "bg-warning/10" },
  info:     { icon: Info,          dot: "bg-info",    iconColor: "text-info",    bg: "bg-info/10"    },
};

interface PageResponse<T> { content: T[]; }

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function HeaderNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    apiFetch<PageResponse<Alert>>("/alerts?page=0&size=10&sort=createdAt,desc&status=unread")
      .then((data) => setAlerts(data.content))
      .catch(() => {/* silently ignore – fallback to empty */});
  }, []);

  const unread = alerts.filter((a) => a.status === "unread").length;

  const markAllRead = async () => {
    try {
      await apiFetch<void>("/alerts/mark-all-read", { method: "PATCH" });
      setAlerts((prev) => prev.map((a) => ({ ...a, status: "read" as const })));
    } catch {/* ignore */}
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={`Notifications — ${unread} unread`}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          {unread > 0 && (
            <span aria-hidden="true" className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-border bg-card shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="text-xs text-accent hover:text-accent-hover transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto py-1">
            {alerts.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">No unread notifications</p>
            ) : (
              alerts.map((alert) => {
                const { icon: Icon, dot, iconColor, bg } = SEVERITY_CONFIG[alert.severity];
                const isUnread = alert.status === "unread";
                return (
                  <DropdownMenu.Item
                    key={alert.id}
                    onSelect={(e) => e.preventDefault()}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 px-4 py-3 text-left outline-none",
                      "transition-colors data-[highlighted]:bg-muted",
                      isUnread && "bg-accent/[0.04]"
                    )}
                  >
                    <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", bg)}>
                      <Icon className={cn("h-3.5 w-3.5", iconColor)} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">{formatTime(alert.createdAt)}</p>
                    </div>
                    {isUnread && (
                      <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", dot)} aria-label="Unread" />
                    )}
                  </DropdownMenu.Item>
                );
              })
            )}
          </div>

          <div className="border-t border-border px-4 py-2.5">
            <button type="button" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
              View all alerts →
            </button>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
