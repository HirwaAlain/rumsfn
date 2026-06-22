"use client";

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

function formatDt(iso: string) {
  return new Date(iso).toLocaleDateString("en-RW", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function buildReportHTML(c: CLMSCase, generatedBy: string, generatedByRole: string): string {
  const now = new Date();
  const generatedAt = now.toLocaleDateString("en-RW", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const assignedTo = typeof c.assignedTo === "object" && c.assignedTo !== null
    ? (c.assignedTo as { id: string; name: string }).name
    : (c.assignedTo ?? "—");

  const docsRows = c.documents.length > 0
    ? c.documents.map((d) => `
      <tr>
        <td>${d.name}</td>
        <td>${formatDt(d.uploadedAt)}</td>
        <td>${d.uploadedBy}</td>
        <td>${d.sizeKb >= 1024 ? (d.sizeKb / 1024).toFixed(1) + " MB" : d.sizeKb + " KB"}</td>
      </tr>`).join("")
    : `<tr><td colspan="4" style="text-align:center;color:#94a3b8;font-style:italic;">No documents attached</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CLMS Case Report — ${c.caseNumber}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Inter, Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; padding: 32px; max-width: 800px; margin: 0 auto; }

  /* Header */
  .report-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
  .logo-block { display: flex; align-items: center; gap: 16px; }
  .logo-box { width: 72px; height: 72px; border: 2px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .logo-inner { font-size: 11px; font-weight: 800; color: #0D1B2A; text-align: center; line-height: 1.2; }
  .org-block { }
  .org-name { font-size: 22px; font-weight: 700; color: #0D1B2A; letter-spacing: -0.5px; }
  .org-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
  .report-title-block { text-align: right; }
  .report-title { font-size: 18px; font-weight: 700; color: #b59500; }
  .report-meta { font-size: 11px; color: #64748b; margin-top: 4px; line-height: 1.6; }
  .report-meta strong { color: #1e293b; }

  .divider { height: 2px; background: linear-gradient(to right, #0D1B2A, #b59500); border-radius: 2px; margin: 18px 0; }

  /* Page timestamp */
  .page-ts { font-size: 10.5px; color: #94a3b8; margin-bottom: 20px; }

  /* Section heading */
  .section-title { font-size: 14px; font-weight: 700; color: #0D1B2A; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 14px; margin-top: 28px; }

  /* Details grid */
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 40px; margin-bottom: 20px; }
  .detail-row label { display: block; font-size: 10.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .detail-row span { font-size: 13px; color: #1e293b; }

  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
  .status-approved { background: #d1fae5; color: #065f46; }
  .status-rejected { background: #fee2e2; color: #991b1b; }
  .status-under_review { background: #fef3c7; color: #92400e; }
  .status-submitted { background: #dbeafe; color: #1e40af; }
  .status-draft { background: #f1f5f9; color: #475569; }
  .status-appealed { background: #ede9fe; color: #5b21b6; }
  .status-closed { background: #f1f5f9; color: #475569; }

  /* Notes */
  .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; font-size: 12.5px; color: #334155; line-height: 1.6; }

  /* Documents table */
  table { width: 100%; border-collapse: collapse; margin-top: 4px; }
  thead th { background: #0D1B2A; color: #fff; font-size: 11px; font-weight: 600; text-align: left; padding: 8px 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody td { padding: 9px 12px; font-size: 12px; color: #334155; border-bottom: 1px solid #e2e8f0; }

  /* Summary */
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
    <div class="org-block">
      <div class="org-name">RURA</div>
      <div class="org-sub">Rwanda Utilities Regulatory Authority</div>
    </div>
  </div>
  <div class="report-title-block">
    <div class="report-title">CLMS Case Report</div>
    <div class="report-meta">
      Generated: <strong>${generatedAt}</strong><br/>
      By: <strong>${generatedBy}</strong> (<strong>${generatedByRole.toUpperCase()}</strong>)
    </div>
  </div>
</div>

<div class="divider"></div>
<div class="page-ts">${now.toLocaleDateString("en-RW", { weekday:"long", year:"numeric", month:"long", day:"numeric" })} &nbsp;|&nbsp; ${c.caseNumber}</div>

<!-- Case Details -->
<div class="section-title">Case Details</div>
<div class="details-grid">
  <div class="detail-row"><label>Case Number</label><span>${c.caseNumber}</span></div>
  <div class="detail-row"><label>Case Type</label><span>${TYPE_LABEL[c.type]}</span></div>
  <div class="detail-row"><label>Applicant</label><span>${c.applicantName}</span></div>
  <div class="detail-row"><label>Contact Email</label><span>${c.applicantEmail ?? "—"}</span></div>
  <div class="detail-row"><label>Sector</label><span>${c.sector}</span></div>
  <div class="detail-row"><label>Province</label><span>${c.province}</span></div>
  <div class="detail-row"><label>Status</label><span class="status-badge status-${c.status}">${c.status.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}</span></div>
  <div class="detail-row"><label>Assigned To</label><span>${assignedTo}</span></div>
  <div class="detail-row"><label>Submitted</label><span>${formatDt(c.submittedAt)}</span></div>
  <div class="detail-row"><label>Last Updated</label><span>${formatDt(c.updatedAt)}</span></div>
</div>

${c.notes ? `
<!-- Notes -->
<div class="section-title">Notes</div>
<div class="notes-box">${c.notes}</div>
` : ""}

<!-- Documents -->
<div class="section-title">Documents (${c.documents.length})</div>
<table>
  <thead>
    <tr>
      <th>Document Name</th>
      <th>Uploaded Date</th>
      <th>Uploaded By</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    ${docsRows}
  </tbody>
</table>

<!-- Report Summary -->
<div class="section-title">Report Summary</div>
<div class="summary-grid">
  <div>
    <div class="summary-row"><span class="summary-label">Generated By:</span><span class="summary-value">${generatedBy}</span></div>
    <div class="summary-row"><span class="summary-label">Role:</span><span class="summary-value">${generatedByRole.toUpperCase()}</span></div>
    <div class="summary-row"><span class="summary-label">Case Number:</span><span class="summary-value">${c.caseNumber}</span></div>
  </div>
  <div>
    <div class="summary-row"><span class="summary-label">Total Documents:</span><span class="summary-value">${c.documents.length}</span></div>
    <div class="summary-row"><span class="summary-label">Case Status:</span><span class="summary-value">${c.status.replace(/_/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}</span></div>
    <div class="summary-row"><span class="summary-label">Date Range:</span><span class="summary-value">${formatDt(c.submittedAt)} – Present</span></div>
  </div>
</div>

<!-- Signatures -->
<div class="signatures">
  <div class="sig-block">
    <div class="sig-title">Report Generated By</div>
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

export function printCLMSCaseReport(
  caseItem: CLMSCase,
  generatedBy = "System Administrator",
  generatedByRole = "ADMIN",
) {
  const html = buildReportHTML(caseItem, generatedBy, generatedByRole);
  const win = window.open("", "_blank", "width=900,height=800,scrollbars=yes,resizable=yes");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
