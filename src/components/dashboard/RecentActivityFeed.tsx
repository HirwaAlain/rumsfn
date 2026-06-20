import Link from "next/link";
import {
  FileText, FileMinus, FileX,
  MessageSquareWarning, CheckCircle2,
  ShieldCheck, ShieldAlert,
  AlertTriangle, GitBranch, Bell,
  LogIn, UserPlus, ClipboardList, BarChart2,
} from "lucide-react";
import type { ActivityItem, ActivityType } from "@/types";
import { formatDateTime } from "@/lib/utils";

const ACTIVITY_CONFIG: Record<ActivityType, { icon: React.ElementType; className: string }> = {
  license_issued:     { icon: FileText,            className: "text-accent bg-accent/10"       },
  license_suspended:  { icon: FileMinus,           className: "text-warning bg-warning-bg"     },
  license_revoked:    { icon: FileX,               className: "text-danger bg-danger-bg"       },
  complaint_filed:    { icon: MessageSquareWarning, className: "text-warning bg-warning-bg"    },
  complaint_resolved: { icon: CheckCircle2,        className: "text-success bg-success-bg"     },
  compliance_check:   { icon: ShieldCheck,         className: "text-success bg-success-bg"     },
  compliance_breach:  { icon: ShieldAlert,         className: "text-danger bg-danger-bg"       },
  fraud_flagged:      { icon: AlertTriangle,       className: "text-danger bg-danger-bg"       },
  fraud_resolved:     { icon: CheckCircle2,        className: "text-success bg-success-bg"     },
  workflow_triggered: { icon: GitBranch,           className: "text-accent bg-accent/10"       },
  alert_raised:       { icon: Bell,                className: "text-warning bg-warning-bg"     },
  user_login:         { icon: LogIn,               className: "text-muted-foreground bg-muted" },
  user_created:       { icon: UserPlus,            className: "text-info bg-info-bg"           },
  audit_completed:    { icon: ClipboardList,       className: "text-muted-foreground bg-muted" },
  report_published:   { icon: BarChart2,           className: "text-info bg-info-bg"           },
};

interface Props { items: ActivityItem[]; }

export function RecentActivityFeed({ items }: Props) {
  const recent = items.slice(0, 8);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
        <Link href="/audit" className="text-xs font-medium text-accent hover:text-accent-hover transition-colors">
          View all →
        </Link>
      </div>

      <ul className="divide-y divide-border px-6 pb-4">
        {recent.map((item) => {
          const config = ACTIVITY_CONFIG[item.type as ActivityType] ?? { icon: Bell, className: "text-muted-foreground bg-muted" };
          const Icon   = config.icon;
          return (
            <li key={item.id} className="flex items-start gap-3 py-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.className}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground">{item.description}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.actor} · {formatDateTime(item.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
