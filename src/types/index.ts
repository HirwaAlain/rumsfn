// =============================================================================
// RUMS – Rwanda Utilities Regulatory Authority
// Central type definitions for all 10 modules
// Strict mode: no `any` types permitted
// =============================================================================

// ─── Shared / Primitives ─────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc";

export type RwandaSector = "Telecom" | "Energy" | "Water" | "Transport";

export type RwandaProvince =
  | "Kigali City"
  | "Northern Province"
  | "Southern Province"
  | "Eastern Province"
  | "Western Province";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface NavItem {
  label: string;
  href: string;
  iconName: string;
  badge?: number;
}

// ─── 1. Dashboard ─────────────────────────────────────────────────────────────

export interface KPIData {
  label: string;
  value: string | number;
  delta: number;
  deltaLabel: string;
  trend: "up" | "down" | "neutral";
}

export type ActivityType =
  | "license_issued"
  | "license_suspended"
  | "license_revoked"
  | "complaint_filed"
  | "complaint_resolved"
  | "compliance_check"
  | "compliance_breach"
  | "fraud_flagged"
  | "fraud_resolved"
  | "workflow_triggered"
  | "alert_raised"
  | "user_login"
  | "user_created"
  | "audit_completed"
  | "report_published";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  actor: string;
  module: string;
  timestamp: string;
  entityId?: string;
}

// ─── 2. CLMS – Converged Licensing Management System ─────────────────────────

export type CLMSCaseStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "appealed"
  | "closed";

export type CLMSCaseType =
  | "new_license"
  | "license_renewal"
  | "license_amendment"
  | "license_revocation"
  | "tariff_review"
  | "spectrum_assignment"
  | "type_approval"
  | "dispute_resolution";

export interface CLMSDocument {
  id: string;
  name: string;
  uploadedAt: string;
  uploadedBy: string;
  sizeKb: number;
}

export interface CLMSCase {
  id: string;
  caseNumber: string;
  title: string;
  type: CLMSCaseType;
  status: CLMSCaseStatus;
  applicantName: string;
  applicantEmail: string;
  sector: RwandaSector;
  province: RwandaProvince;
  submittedAt: string;
  updatedAt: string;
  assignedTo: string;
  documents: CLMSDocument[];
  notes?: string;
}

// ─── 3. License Management ────────────────────────────────────────────────────

export type LicenseStatus = "active" | "pending" | "suspended" | "revoked" | "expired";

export type LicenseCategory =
  | "Mobile Network Operator"
  | "Fixed Network Operator"
  | "Internet Service Provider"
  | "Public Switched Telephone Network"
  | "Virtual Network Operator"
  | "Spectrum License"
  | "Electricity Distribution"
  | "Electricity Transmission"
  | "Power Generation"
  | "Water Supply"
  | "Sanitation Services"
  | "Road Transport Operator"
  | "Freight & Logistics"
  | "Broadcasting";

export interface License {
  id: string;
  licenseNumber: string;
  operatorName: string;
  contactPerson: string;
  contactEmail: string;
  category: LicenseCategory;
  sector: RwandaSector;
  status: LicenseStatus;
  province: RwandaProvince;
  issuedAt: string;
  expiresAt: string;
  annualFeeRwf: number;
  lastRenewalAt?: string;
}

export interface LicenseTrendPoint {
  month: string;
  issued: number;
  revoked: number;
  expired: number;
}

// ─── 4. Consumer Complaints ───────────────────────────────────────────────────

export type ComplaintStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "closed"
  | "escalated";

export type ComplaintSeverity = "low" | "medium" | "high" | "critical";

export type ComplaintCategory =
  | "Billing Dispute"
  | "Service Interruption"
  | "Poor Quality of Service"
  | "Unauthorized Charges"
  | "Contract Violation"
  | "Customer Service Failure"
  | "Data Privacy Breach"
  | "Tariff Overcharge"
  | "Connection Delay"
  | "Other";

export interface Complaint {
  id: string;
  referenceNumber: string;
  subject: string;
  category: ComplaintCategory;
  complainantName: string;
  complainantPhone: string;
  respondentOperator: string;
  sector: RwandaSector;
  province: RwandaProvince;
  status: ComplaintStatus;
  severity: ComplaintSeverity;
  filedAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  description: string;
}

export interface ComplaintsBySectorPoint {
  sector: string;
  count: number;
}

// ─── 5. Compliance Monitoring ─────────────────────────────────────────────────

export type ComplianceStatus =
  | "compliant"
  | "non_compliant"
  | "under_review"
  | "remediation";

export type ComplianceCheckType =
  | "Annual Return Filing"
  | "Quality of Service (QoS) Audit"
  | "Universal Access Obligation"
  | "Spectrum Usage Compliance"
  | "Tariff Filing"
  | "Consumer Protection Audit"
  | "Network Rollout Target"
  | "Environmental Compliance"
  | "Financial Reporting"
  | "Security & Data Protection Audit";

export interface ComplianceRecord {
  id: string;
  operatorName: string;
  licenseId: string;
  sector: RwandaSector;
  checkType: ComplianceCheckType;
  status: ComplianceStatus;
  dueDate: string;
  lastAuditDate: string;
  score: number;
  auditor: string;
  findings?: string;
}

export interface ComplianceOverviewItem {
  name: string;
  value: number;
  color: string;
}

// ─── 6. Fraud & Anomaly Detection ─────────────────────────────────────────────

export type FraudRiskLevel = "low" | "medium" | "high" | "critical";

export type FraudCaseStatus =
  | "open"
  | "investigating"
  | "confirmed"
  | "dismissed"
  | "referred";

export type FraudIndicatorType =
  | "Unusual Billing Pattern"
  | "Duplicate Applications"
  | "Identity Misrepresentation"
  | "Revenue Underreporting"
  | "Spectrum Interference"
  | "Unlicensed Operation"
  | "Tariff Manipulation"
  | "Meter Tampering"
  | "SIM Box Fraud"
  | "Ghost Customer Registrations";

export interface FraudCase {
  id: string;
  caseNumber: string;
  description: string;
  indicatorType: FraudIndicatorType;
  reportedBy: string;
  operatorInvolved: string;
  sector: RwandaSector;
  riskLevel: FraudRiskLevel;
  status: FraudCaseStatus;
  reportedAt: string;
  estimatedLossRwf: number;
  investigatingOfficer?: string;
}

// ─── 7. Reports & Dashboards ──────────────────────────────────────────────────

export type ReportStatus = "draft" | "published" | "archived";

export type ReportType = "monthly" | "quarterly" | "annual" | "ad_hoc";

export type ReportFormat = "pdf" | "xlsx" | "csv";

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  sector: RwandaSector | "All Sectors";
  status: ReportStatus;
  format: ReportFormat;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  period: string;
  downloadUrl?: string;
  sizeKb?: number;
}

// ─── 8. User & Role Management ────────────────────────────────────────────────

export type UserRole = "admin" | "analyst" | "auditor" | "supervisor" | "viewer";

export type UserStatus = "active" | "inactive" | "suspended";

export type UserDepartment =
  | "Executive"
  | "Licensing"
  | "Compliance"
  | "Complaints"
  | "Fraud & Investigations"
  | "Legal"
  | "ICT"
  | "Finance"
  | "Human Resources"
  | "Communications";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  department: UserDepartment;
  lastLogin: string;
  createdAt: string;
  mfaEnabled: boolean;
}

// ─── 9. Audit & Activity Log ──────────────────────────────────────────────────

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "suspend"
  | "reinstate"
  | "export"
  | "login"
  | "logout"
  | "password_reset"
  | "permission_change";

export type AuditModule =
  | "Licenses"
  | "Complaints"
  | "Compliance"
  | "Fraud"
  | "Reports"
  | "Users"
  | "Workflows"
  | "Alerts"
  | "CLMS"
  | "System";

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  module: AuditModule;
  entityId: string;
  entityLabel: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  changes?: Record<string, { before: string; after: string }>;
}

// ─── 10. Alert & Notification Center ─────────────────────────────────────────

export type AlertSeverity = "info" | "warning" | "critical";

export type AlertStatus = "unread" | "read" | "dismissed" | "actioned";

export type AlertType =
  | "license_expiry"
  | "compliance_breach"
  | "fraud_detected"
  | "complaint_sla_breach"
  | "workflow_stalled"
  | "system_error"
  | "report_ready"
  | "user_suspended"
  | "threshold_exceeded";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  relatedModule: AuditModule;
  relatedEntityId?: string;
  createdAt: string;
  readAt?: string;
  actionedBy?: string;
}

// ─── 11. Regulatory Workflow Engine ───────────────────────────────────────────

export type WorkflowStatus = "draft" | "active" | "paused" | "completed" | "failed";

export type WorkflowTrigger =
  | "license_application"
  | "complaint_filed"
  | "compliance_due"
  | "fraud_alert"
  | "renewal_due"
  | "manual";

export type WorkflowStepStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped"
  | "failed";

export interface WorkflowStep {
  id: string;
  order: number;
  name: string;
  description: string;
  assignedRole: UserRole;
  status: WorkflowStepStatus;
  dueInDays: number;
  completedAt?: string;
  completedBy?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  status: WorkflowStatus;
  sector: RwandaSector | "All Sectors";
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  relatedEntityId?: string;
}
