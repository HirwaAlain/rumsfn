import { cn, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ComplianceRecord, ComplianceStatus, RwandaSector } from "@/types";

const SECTOR_CHIP: Record<RwandaSector, string> = {
  Telecom:   "bg-accent/10 text-accent",
  Energy:    "bg-warning-bg text-warning-fg",
  Water:     "bg-info-bg text-info-fg",
  Transport: "bg-success-bg text-success-fg",
};

const CARD_BORDER: Record<ComplianceStatus, string> = {
  compliant:    "border-border",
  under_review: "border-warning/40",
  non_compliant:"border-danger/50",
  remediation:  "border-warning/40",
};

const FINDINGS_STYLE: Partial<Record<ComplianceStatus, string>> = {
  non_compliant: "bg-danger-bg text-danger-fg",
  remediation:   "bg-warning-bg text-warning-fg",
  under_review:  "bg-info-bg text-info-fg",
};

function scoreVariant(score: number) {
  if (score >= 80) return { ring: "stroke-success", label: "text-success" };
  if (score >= 60) return { ring: "stroke-warning", label: "text-warning" };
  return { ring: "stroke-danger", label: "text-danger" };
}

export function ScoreCard({ record }: { record: ComplianceRecord }) {
  const { ring, label } = scoreVariant(record.score);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md",
        CARD_BORDER[record.status]
      )}
    >
      <div className="flex items-start gap-4">
        {/* Score ring — r≈15.9 gives circumference≈100, so dasharray maps 1:1 to score */}
        <div className="relative h-14 w-14 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              className="stroke-muted"
              strokeWidth="3.2"
            />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              className={ring}
              strokeWidth="3.2"
              strokeDasharray={`${record.score} ${100 - record.score}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-sm font-bold tabular-nums", label)}>
              {record.score}
            </span>
          </div>
        </div>

        {/* Operator info */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{record.operatorName}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{record.checkType}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                SECTOR_CHIP[record.sector]
              )}
            >
              {record.sector}
            </span>
            <StatusBadge status={record.status} />
          </div>
        </div>
      </div>

      {/* Findings banner */}
      {record.findings && (
        <div
          className={cn(
            "mt-4 rounded-lg px-3 py-2 text-xs leading-relaxed",
            FINDINGS_STYLE[record.status] ?? "bg-muted text-muted-foreground"
          )}
        >
          {record.findings}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span>Due {formatDate(record.dueDate)}</span>
        <span>{typeof record.auditor === "object" && record.auditor !== null ? (record.auditor as { id: string; name: string }).name : record.auditor}</span>
      </div>
    </div>
  );
}
