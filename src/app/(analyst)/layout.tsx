import { PortalClientShell } from "@/components/layout/PortalClientShell";

export default function AnalystLayout({ children }: { children: React.ReactNode }) {
  return <PortalClientShell role="analyst">{children}</PortalClientShell>;
}
