import { PortalClientShell } from "@/components/layout/PortalClientShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalClientShell role="admin">{children}</PortalClientShell>;
}
