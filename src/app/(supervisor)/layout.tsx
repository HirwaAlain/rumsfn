import { PortalClientShell } from "@/components/layout/PortalClientShell";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return <PortalClientShell role="supervisor">{children}</PortalClientShell>;
}
