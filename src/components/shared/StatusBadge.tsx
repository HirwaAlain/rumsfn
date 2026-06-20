import { cn } from "@/lib/utils";

type Status =
  | "active" | "pending" | "suspended" | "revoked" | "expired"
  | "open" | "under_review" | "resolved" | "closed" | "escalated"
  | "compliant" | "non_compliant" | "remediation"
  | "investigating" | "confirmed" | "dismissed" | "referred"
  | "inactive"
  | "low" | "medium" | "high" | "critical"
  | string;

const BADGE_MAP: Record<string, string> = {
  // Success — green
  active:    "bg-success-bg text-success-fg",
  compliant: "bg-success-bg text-success-fg",
  resolved:  "bg-success-bg text-success-fg",
  confirmed: "bg-success-bg text-success-fg",
  low:       "bg-success-bg text-success-fg",

  // Warning — amber
  pending:       "bg-warning-bg text-warning-fg",
  under_review:  "bg-warning-bg text-warning-fg",
  investigating: "bg-warning-bg text-warning-fg",
  remediation:   "bg-warning-bg text-warning-fg",
  suspended:     "bg-warning-bg text-warning-fg",
  escalated:     "bg-warning-bg text-warning-fg",
  medium:        "bg-warning-bg text-warning-fg",

  // Danger — red
  revoked:      "bg-danger-bg text-danger-fg",
  non_compliant:"bg-danger-bg text-danger-fg",
  high:         "bg-danger-bg text-danger-fg",
  critical:     "bg-danger-bg text-danger-fg",

  // Info — teal/blue
  open:     "bg-info-bg text-info-fg",
  referred: "bg-info-bg text-info-fg",

  // Muted — neutral
  expired:   "bg-muted text-muted-foreground",
  closed:    "bg-muted text-muted-foreground",
  dismissed: "bg-muted text-muted-foreground",
  inactive:  "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = BADGE_MAP[status] ?? "bg-muted text-muted-foreground";
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
