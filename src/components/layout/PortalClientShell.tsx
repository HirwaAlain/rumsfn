"use client";

import {
  LayoutDashboard, Users, FileText, MessageSquareWarning,
  ShieldCheck, AlertTriangle, BookOpen, GitBranch,
  BarChart2, Bell, ClipboardList, UserCircle,
} from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";
import { PortalPermissionsProvider } from "@/contexts/PortalPermissionsContext";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ROLE_PERMISSIONS, type PortalRole } from "@/lib/permissions";
import type { NavItemConfig } from "@/components/layout/SidebarNavLink";

const ROLE_NAV: Record<PortalRole, NavItemConfig[]> = {
  admin: [
    { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
    { label: "Users",      href: "/admin/users",       icon: Users },
    { label: "Licenses",   href: "/admin/licenses",    icon: FileText },
    { label: "Complaints", href: "/admin/complaints",  icon: MessageSquareWarning },
    { label: "Compliance", href: "/admin/compliance",  icon: ShieldCheck },
    { label: "Fraud",      href: "/admin/fraud",       icon: AlertTriangle },
    { label: "CLMS",       href: "/admin/clms",        icon: BookOpen },
    { label: "Workflows",  href: "/admin/workflows",   icon: GitBranch },
    { label: "Reports",    href: "/admin/reports",     icon: BarChart2 },
    { label: "Alerts",     href: "/admin/alerts",      icon: Bell },
    { label: "Audit Log",  href: "/admin/audit",       icon: ClipboardList },
  ],
  supervisor: [
    { label: "Dashboard",  href: "/supervisor/dashboard",  icon: LayoutDashboard },
    { label: "Licenses",   href: "/supervisor/licenses",   icon: FileText },
    { label: "Complaints", href: "/supervisor/complaints", icon: MessageSquareWarning },
    { label: "Compliance", href: "/supervisor/compliance", icon: ShieldCheck },
    { label: "Fraud",      href: "/supervisor/fraud",      icon: AlertTriangle },
    { label: "CLMS",       href: "/supervisor/clms",       icon: BookOpen },
    { label: "Workflows",  href: "/supervisor/workflows",  icon: GitBranch },
    { label: "Reports",    href: "/supervisor/reports",    icon: BarChart2 },
    { label: "Alerts",     href: "/supervisor/alerts",     icon: Bell },
    { label: "My Profile", href: "/supervisor/profile",    icon: UserCircle },
  ],
  analyst: [
    { label: "Dashboard",  href: "/analyst/dashboard",  icon: LayoutDashboard },
    { label: "Licenses",   href: "/analyst/licenses",   icon: FileText },
    { label: "Complaints", href: "/analyst/complaints", icon: MessageSquareWarning },
    { label: "Compliance", href: "/analyst/compliance", icon: ShieldCheck },
    { label: "Fraud",      href: "/analyst/fraud",      icon: AlertTriangle },
    { label: "CLMS",       href: "/analyst/clms",       icon: BookOpen },
    { label: "Workflows",  href: "/analyst/workflows",  icon: GitBranch },
    { label: "Reports",    href: "/analyst/reports",    icon: BarChart2 },
    { label: "Alerts",     href: "/analyst/alerts",     icon: Bell },
    { label: "My Profile", href: "/analyst/profile",    icon: UserCircle },
  ],
  auditor: [
    { label: "Dashboard",  href: "/auditor/dashboard",  icon: LayoutDashboard },
    { label: "Complaints", href: "/auditor/complaints", icon: MessageSquareWarning },
    { label: "Compliance", href: "/auditor/compliance", icon: ShieldCheck },
    { label: "Licenses",   href: "/auditor/licenses",   icon: FileText },
    { label: "Workflows",  href: "/auditor/workflows",  icon: GitBranch },
    { label: "Alerts",     href: "/auditor/alerts",     icon: Bell },
    { label: "Audit Log",  href: "/auditor/audit",      icon: ClipboardList },
    { label: "My Profile", href: "/auditor/profile",    icon: UserCircle },
  ],
  viewer: [
    { label: "Dashboard",  href: "/viewer/dashboard",  icon: LayoutDashboard },
    { label: "Licenses",   href: "/viewer/licenses",   icon: FileText },
    { label: "Complaints", href: "/viewer/complaints", icon: MessageSquareWarning },
    { label: "Compliance", href: "/viewer/compliance", icon: ShieldCheck },
    { label: "Reports",    href: "/viewer/reports",    icon: BarChart2 },
    { label: "My Profile", href: "/viewer/profile",    icon: UserCircle },
  ],
};

const ROLE_LABEL: Record<PortalRole, string> = {
  admin:      "Admin Portal",
  supervisor: "Supervisor Portal",
  analyst:    "Analyst Portal",
  auditor:    "Auditor Portal",
  viewer:     "Viewer Portal",
};

interface PortalClientShellProps {
  role: PortalRole;
  children: React.ReactNode;
}

export function PortalClientShell({ role, children }: PortalClientShellProps) {
  return (
    <RoleGuard expectedRole={role}>
      <PortalPermissionsProvider role={role} permissions={ROLE_PERMISSIONS[role]}>
        <PortalShell navItems={ROLE_NAV[role]} roleLabel={ROLE_LABEL[role]}>
          {children}
        </PortalShell>
      </PortalPermissionsProvider>
    </RoleGuard>
  );
}
