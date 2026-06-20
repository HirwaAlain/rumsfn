"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  MessageSquareWarning,
  ShieldCheck,
  AlertTriangle,
  BarChart2,
  Users,
  ClipboardList,
  Bell,
  GitBranch,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RumsLogoIcon } from "@/components/shared/RumsLogoIcon";
import { SidebarNavLink } from "./SidebarNavLink";
import type { NavItemConfig } from "./SidebarNavLink";

// Order matches CLAUDE.md Modules & Routes table
const NAV_ITEMS: NavItemConfig[] = [
  { label: "Dashboard",  href: "/",           icon: LayoutDashboard },
  { label: "CLMS",       href: "/clms",       icon: BookOpen },
  { label: "Licenses",   href: "/licenses",   icon: FileText },
  { label: "Complaints", href: "/complaints", icon: MessageSquareWarning },
  { label: "Compliance", href: "/compliance", icon: ShieldCheck },
  { label: "Fraud",      href: "/fraud",      icon: AlertTriangle },
  { label: "Reports",    href: "/reports",    icon: BarChart2 },
  { label: "Users",      href: "/users",      icon: Users },
  { label: "Audit",      href: "/audit",      icon: ClipboardList },
  { label: "Alerts",     href: "/alerts",     icon: Bell },
  { label: "Workflows",  href: "/workflows",  icon: GitBranch },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar"
    >
      {/* ── Brand ─────────────────────────────────────────── */}
      <div className="flex h-16 shrink-0 items-center gap-3 overflow-hidden border-b border-sidebar-border px-4">
        <RumsLogoIcon className="h-8 w-8 shrink-0" />

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0"
            >
              <p className="truncate text-sm font-semibold leading-none text-white">RUMS</p>
              <p className="mt-0.5 truncate text-[11px] leading-tight text-sidebar-fg">
                RURA Platform
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ────────────────────────────────────── */}
      <nav
        className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3"
        aria-label="Main navigation"
      >
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <SidebarNavLink
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                />
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Collapse toggle ───────────────────────────────── */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg py-2.5 text-sm",
            "text-sidebar-fg transition-colors duration-150",
            "hover:bg-sidebar-hover hover:text-white",
            collapsed ? "justify-center px-0" : "px-3"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
