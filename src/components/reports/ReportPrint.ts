import type { Report, ReportType, ReportFormat, ReportStatus } from "@/types";

const TYPE_LABEL: Record<ReportType, string> = {
  monthly:   "Monthly Report",
  quarterly: "Quarterly Report",
  annual:    "Annual Report",
  ad_hoc:    "Ad Hoc Report",
};

const FORMAT_LABEL: Record<ReportFormat, string> = {
  pdf:  "PDF Document",
  xlsx: "Excel Spreadsheet",
  csv:  "CSV Data Export",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  draft:     "Draft",
  published: "Published",
  archived:  "Archived",
};

function formatDt(iso: string) {
  return new Date(iso).toLocaleDateString("en-RW", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function buildReportHTML(report: Report, generatedBy: string, generatedByRole: string): string {
  const now = new Date();
  const generatedAt = now.toLocaleDateString("en-RW", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const createdByName =
    typeof report.createdBy === "object" && report.createdBy !== null
      ? (report.createdBy as { id: string; name: string }).name
      : (report.createdBy as string) ?? "—";

  const statusClass = {
    draft:     "status-draft",
    published: "status-published",
    archived:  "status-archived",
  }[report.status] ?? "status-draft";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${report.title} — RURA Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Inter, Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 32px; max-width: 800px; margin: 0 auto; }

  /* Header */
  .report-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
  .logo-block { display: flex; align-items: center; gap: 16px; }
  .logo-box { width: 72px; height: 72px; border: 2px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .logo-inner { font-size: 11px; font-weight: 800; color: #0D1B2A; text-align: center; line-height: 1.2; }
  .org-name { font-size: 22px; font-weight: 700; color: #0D1B2A; letter-spacing: -0.5px; }
  .org-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .report-title-block { text-align: right; }
  .report-kind { font-size: 18px; font-weight: 700; color: #b59500; }
  .report-meta { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.6; }
  .report-meta strong { color: #1e293b; }

  .divider { height: 2px; background: linear-gradient(to right, #0D1B2A, #b59500); border-radius: 2px; margin: 18px 0; }
  .page-ts { font-size: 10.5px; color: #94a3b8; margin-bottom: 24px; }

  /* Title banner */
  .title-banner { background: #0D1B2A; color: #fff; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; }
  .title-banner h1 { font-size: 17px; font-weight: 700; line-height: 1.3; }
  .title-banner p { font-size: 12px; color: #94a3b8; margin-top: 4px; }

  /* Section heading */
  .section-title { font-size: 14px; font-weight: 700; color: #0D1B2A; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 14px; margin-top: 28px; }

  /* Details grid */
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 40px; margin-bottom: 20px; }
  .detail-row label { display: block; font-size: 10.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .detail-row span { font-size: 13px; color: #1e293b; }

  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .status-draft     { background: #f1f5f9; color: #475569; }
  .status-published { background: #d1fae5; color: #065f46; }
  .status-archived  { background: #fef3c7; color: #92400e; }

  /* Summary box */
  .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 60px; margin-top: 6px; }
  .summary-row { display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12.5px; }
  .summary-label { color: #64748b; }
  .summary-value { font-weight: 600; color: #0D1B2A; }

  /* Footer signatures */
  .signatures { display: flex; justify-content: space-between; margin-top: 56px; gap: 40px; }
  .sig-block { flex: 1; }
  .sig-title { font-size: 10.5px; font-weight: 700; color: #0D1B2A; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 32px; }
  .sig-line { border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 11px; color: #64748b; }

  @media print {
    body { padding: 20px; }
    .no-print { display: none; }
    @page { margin: 20mm; }
  }
</style>
</head>
<body>

<!-- Print / Close bar -->
<div class="no-print" style="margin-bottom:20px;display:flex;gap:10px;align-items:center;">
  <button onclick="window.print()" style="background:#0D1B2A;color:#fff;border:none;padding:8px 18px;border-radius:6px;font-size:12px;cursor:pointer;font-family:Inter,Arial,sans-serif;">
    Print / Save as PDF
  </button>
  <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:8px 18px;border-radius:6px;font-size:12px;cursor:pointer;font-family:Inter,Arial,sans-serif;">
    Close
  </button>
</div>

<!-- Report Header -->
<div class="report-header">
  <div class="logo-block">
    <div class="logo-box">
      <div class="logo-inner">RURA</div>
    </div>
    <div>
      <div class="org-name">RURA</div>
      <div class="org-sub">Rwanda Utilities Regulatory Authority</div>
    </div>
  </div>
  <div class="report-title-block">
    <div class="report-kind">${TYPE_LABEL[report.type]}</div>
    <div class="report-meta">
      Generated: <strong>${generatedAt}</strong><br/>
      By: <strong>${generatedBy}</strong> (<strong>${generatedByRole.toUpperCase()}</strong>)
    </div>
  </div>
</div>

<div class="divider"></div>
<div class="page-ts">${now.toLocaleDateString("en-RW", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} &nbsp;|&nbsp; ${report.period}</div>

<!-- Title Banner -->
<div class="title-banner">
  <h1>${report.title}</h1>
  <p>Period: ${report.period} &nbsp;·&nbsp; Sector: ${report.sector} &nbsp;·&nbsp; Format: ${FORMAT_LABEL[report.format]}</p>
</div>

<!-- Report Details -->
<div class="section-title">Report Details</div>
<div class="details-grid">
  <div class="detail-row"><label>Report Title</label><span>${report.title}</span></div>
  <div class="detail-row"><label>Report Type</label><span>${TYPE_LABEL[report.type]}</span></div>
  <div class="detail-row"><label>Period</label><span>${report.period}</span></div>
  <div class="detail-row"><label>Sector</label><span>${report.sector}</span></div>
  <div class="detail-row"><label>Status</label><span class="status-badge ${statusClass}">${STATUS_LABEL[report.status]}</span></div>
  <div class="detail-row"><label>Format</label><span>${FORMAT_LABEL[report.format]}</span></div>
  <div class="detail-row"><label>Prepared By</label><span>${createdByName}</span></div>
  <div class="detail-row"><label>Date Created</label><span>${formatDt(report.createdAt)}</span></div>
  ${report.publishedAt ? `<div class="detail-row"><label>Published</label><span>${formatDt(report.publishedAt)}</span></div>` : ""}
  ${report.sizeKb ? `<div class="detail-row"><label>File Size</label><span>${report.sizeKb >= 1024 ? (report.sizeKb / 1024).toFixed(1) + " MB" : report.sizeKb + " KB"}</span></div>` : ""}
</div>

<!-- Summary -->
<div class="section-title">Report Summary</div>
<div class="summary-grid">
  <div>
    <div class="summary-row"><span class="summary-label">Generated By:</span><span class="summary-value">${generatedBy}</span></div>
    <div class="summary-row"><span class="summary-label">Role:</span><span class="summary-value">${generatedByRole.toUpperCase()}</span></div>
    <div class="summary-row"><span class="summary-label">Report Type:</span><span class="summary-value">${TYPE_LABEL[report.type]}</span></div>
  </div>
  <div>
    <div class="summary-row"><span class="summary-label">Period Covered:</span><span class="summary-value">${report.period}</span></div>
    <div class="summary-row"><span class="summary-label">Sector:</span><span class="summary-value">${report.sector}</span></div>
    <div class="summary-row"><span class="summary-label">Status:</span><span class="summary-value">${STATUS_LABEL[report.status]}</span></div>
  </div>
</div>

<!-- Signatures -->
<div class="signatures">
  <div class="sig-block">
    <div class="sig-title">Prepared By</div>
    <div class="sig-line">Name: ___________________________</div>
    <br/>
    <div class="sig-line">Signature: _______________________</div>
    <br/>
    <div class="sig-line">Date: ____________________________</div>
  </div>
  <div class="sig-block">
    <div class="sig-title">Approved By</div>
    <div class="sig-line">Name: ___________________________</div>
    <br/>
    <div class="sig-line">Signature: _______________________</div>
    <br/>
    <div class="sig-line">Date: ____________________________</div>
  </div>
</div>

</body>
</html>`;
}

export function printReport(
  report: Report,
  generatedBy = "System Administrator",
  generatedByRole = "ADMIN",
) {
  const html = buildReportHTML(report, generatedBy, generatedByRole);
  const win = window.open("", "_blank", "width=900,height=800,scrollbars=yes,resizable=yes");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
