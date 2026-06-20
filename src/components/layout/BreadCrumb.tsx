"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Full module labels from CLAUDE.md
const LABEL_MAP: Record<string, string> = {
  clms:       "CLMS",
  licenses:   "License Management",
  complaints: "Consumer Complaints",
  compliance: "Compliance Monitoring",
  fraud:      "Fraud & Anomaly Detection",
  reports:    "Reports & Dashboards",
  users:      "User Management",
  audit:      "Audit & Activity Log",
  alerts:     "Alert Center",
  workflows:  "Workflow Engine",
};

function segmentLabel(seg: string): string {
  return LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
}

export function BreadCrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Nothing to show on the root dashboard page
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: segmentLabel(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs">
      <Link
        href="/"
        aria-label="Home"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>

      {crumbs.map(({ label, href, isLast }) => (
        <span key={href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
          {isLast ? (
            <span className="font-medium text-foreground" aria-current="page">
              {label}
            </span>
          ) : (
            <Link href={href} className="text-muted-foreground transition-colors hover:text-foreground">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
