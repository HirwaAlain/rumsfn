import { AlertTriangle, User, Mail, Calendar, Banknote } from "lucide-react";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import type { License } from "@/types";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

interface LicenseDrawerDetailsProps {
  license: License;
  expiryStatus: "expired" | "soon" | "ok";
}

export function LicenseDrawerDetails({ license, expiryStatus }: LicenseDrawerDetailsProps) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-6">
      {/* Expiry warning banner */}
      {expiryStatus !== "ok" && (
        <div
          className={cn(
            "flex items-start gap-2.5 rounded-lg p-3 text-sm",
            expiryStatus === "expired"
              ? "bg-danger-bg text-danger-fg"
              : "bg-warning-bg text-warning-fg"
          )}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {expiryStatus === "expired"
              ? `This licence expired on ${formatDate(license.expiresAt)}. Immediate renewal action required.`
              : `This licence expires on ${formatDate(license.expiresAt)} — within 90 days. Renewal recommended.`}
          </span>
        </div>
      )}

      {/* Details grid */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Licence Details
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <DetailRow label="Sector"   value={license.sector}   />
          <DetailRow label="Province" value={license.province} />
          <DetailRow label="Issued"   value={formatDate(license.issuedAt)} />
          <div>
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" /> Expires
            </dt>
            <dd
              className={cn(
                "mt-0.5 text-sm font-medium",
                expiryStatus === "expired" && "text-danger",
                expiryStatus === "soon"    && "text-warning",
                expiryStatus === "ok"      && "text-foreground"
              )}
            >
              {formatDate(license.expiresAt)}
            </dd>
          </div>
          {license.lastRenewalAt && (
            <DetailRow label="Last Renewal" value={formatDate(license.lastRenewalAt)} />
          )}
          <div>
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <Banknote className="h-3 w-3" /> Annual Fee
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">
              {formatCurrency(license.annualFeeRwf)}
            </dd>
          </div>
        </dl>
      </section>

      {/* Contact */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contact Person
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-foreground">{license.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <a
              href={`mailto:${license.contactEmail}`}
              className="text-accent hover:text-accent-hover transition-colors"
            >
              {license.contactEmail}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
