import { DashboardShell } from "@/components/layout/DashboardShell";

// No "use client" — this is a server component.
// All interactive state (sidebar, theme, navigation) lives in DashboardShell.
// Next.js renders this once and caches it across client-side navigations;
// `children` (the page) is still server-rendered independently.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
