import { PortalClientShell } from "@/components/layout/PortalClientShell";

export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  return <PortalClientShell role="auditor">{children}</PortalClientShell>;
}
