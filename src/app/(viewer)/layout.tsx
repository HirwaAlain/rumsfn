import { PortalClientShell } from "@/components/layout/PortalClientShell";

export default function ViewerLayout({ children }: { children: React.ReactNode }) {
  return <PortalClientShell role="viewer">{children}</PortalClientShell>;
}
