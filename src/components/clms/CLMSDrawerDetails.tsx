import { FileText, Download } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { CLMSCase, CLMSCaseType } from "@/types";

const TYPE_LABEL: Record<CLMSCaseType, string> = {
  new_license:        "New Licence Application",
  license_renewal:    "Licence Renewal",
  license_amendment:  "Licence Amendment",
  license_revocation: "Licence Revocation",
  tariff_review:      "Tariff Review",
  spectrum_assignment:"Spectrum Assignment",
  type_approval:      "Type Approval",
  dispute_resolution: "Dispute Resolution",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function CLMSDrawerDetails({ c }: { c: CLMSCase }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
      {/* Details grid */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Case Details</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Row label="Case Number">{c.caseNumber}</Row>
          <Row label="Case Type">{TYPE_LABEL[c.type]}</Row>
          <Row label="Applicant">{c.applicantName}</Row>
          <Row label="Contact Email">
            <a href={`mailto:${c.applicantEmail}`} className="text-accent hover:underline">{c.applicantEmail}</a>
          </Row>
          <Row label="Sector">{c.sector}</Row>
          <Row label="Province">{c.province}</Row>
          <Row label="Status"><StatusBadge status={c.status} /></Row>
          <Row label="Assigned To">{typeof c.assignedTo === "object" && c.assignedTo !== null ? (c.assignedTo as { id: string; name: string }).name : (c.assignedTo ?? "—")}</Row>
          <Row label="Submitted">{formatDate(c.submittedAt)}</Row>
          <Row label="Last Updated">{formatDate(c.updatedAt)}</Row>
        </div>
      </div>

      {/* Notes */}
      {c.notes && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
          <p className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground leading-relaxed">{c.notes}</p>
        </div>
      )}

      {/* Documents */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Documents ({c.documents.length})
        </p>
        <div className="space-y-2">
          {c.documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2.5">
              <FileText className="h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.uploadedBy} · {formatDate(doc.uploadedAt)} · {doc.sizeKb >= 1024 ? `${(doc.sizeKb / 1024).toFixed(1)} MB` : `${doc.sizeKb} KB`}
                </p>
              </div>
              <button type="button" className="shrink-0 rounded p-1 text-muted-foreground hover:text-accent transition-colors">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
