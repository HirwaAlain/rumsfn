import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { FraudCase } from "@/types";

const RISK_BANNER: Partial<Record<FraudCase["riskLevel"], string>> = {
  critical: "bg-danger-bg text-danger-fg",
  high:     "bg-warning-bg text-warning-fg",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{children}</p>
    </div>
  );
}

export function FraudDrawerDetails({ c }: { c: FraudCase }) {
  const banner = RISK_BANNER[c.riskLevel];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
      {banner && (
        <div className={cn("rounded-lg px-3 py-2.5 text-sm leading-relaxed", banner)}>
          {c.riskLevel === "critical"
            ? "Critical risk — immediate escalation required."
            : "High risk — active investigation warranted."}
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          Description
        </p>
        <p className="text-sm text-foreground leading-relaxed">{c.description}</p>
      </div>

      {/* Case details grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Case Details
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Row label="Case Number">{c.caseNumber}</Row>
          <Row label="Indicator Type">{c.indicatorType}</Row>
          <Row label="Operator Involved">{c.operatorInvolved}</Row>
          <Row label="Sector">{c.sector}</Row>
          <Row label="Risk Level">
            <StatusBadge status={c.riskLevel} />
          </Row>
          <Row label="Status">
            <StatusBadge status={c.status} />
          </Row>
          <Row label="Reported At">{formatDate(c.reportedAt)}</Row>
          <Row label="Reported By">{typeof c.reportedBy === "object" && c.reportedBy !== null ? (c.reportedBy as { id: string; name: string }).name : c.reportedBy}</Row>
          <Row label="Est. Loss (RWF)">
            <span className={cn("font-medium", c.estimatedLossRwf > 0 ? "text-danger" : "text-muted-foreground")}>
              {c.estimatedLossRwf > 0 ? formatCurrency(c.estimatedLossRwf) : "Not quantified"}
            </span>
          </Row>
          <Row label="Investigating Officer">
            {(() => {
              const v = c.investigatingOfficer;
              const name = typeof v === "object" && v !== null ? (v as { id: string; name: string }).name : v;
              return name ?? <span className="italic text-muted-foreground">Unassigned</span>;
            })()}
          </Row>
        </div>
      </div>
    </div>
  );
}
