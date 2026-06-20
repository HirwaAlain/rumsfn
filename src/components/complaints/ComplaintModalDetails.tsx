import { formatDate } from "@/lib/utils";
import type { Complaint } from "@/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ComplaintModalDetails({ complaint }: { complaint: Complaint }) {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto p-6">
      {/* Description */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </h3>
        <p className="text-sm leading-relaxed text-foreground">{complaint.description}</p>
      </section>

      {/* Details grid */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h3>
        <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-8">
          <DetailRow label="Respondent Operator" value={complaint.respondentOperator} />
          <DetailRow label="Sector"              value={complaint.sector}             />
          <DetailRow label="Province"            value={complaint.province}           />
          <DetailRow label="Category"            value={complaint.category}           />
          <DetailRow label="Complainant"         value={complaint.complainantName}    />
          <DetailRow label="Phone"               value={complaint.complainantPhone}   />
          <DetailRow label="Filed"               value={formatDate(complaint.filedAt)}    />
          <DetailRow label="Last Updated"        value={formatDate(complaint.updatedAt)}  />
          <DetailRow
            label="Assigned To"
            value={(() => { const v = complaint.assignedTo; return (typeof v === "object" && v !== null ? (v as { id: string; name: string }).name : v) ?? "Unassigned"; })()}
          />
          {complaint.resolvedAt && (
            <DetailRow label="Resolved On" value={formatDate(complaint.resolvedAt)} />
          )}
        </dl>
      </section>
    </div>
  );
}
