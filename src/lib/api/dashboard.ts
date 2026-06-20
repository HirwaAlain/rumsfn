import { serverFetch } from "./server";
import type { KPIData, ActivityItem, LicenseTrendPoint, ComplaintsBySectorPoint, ComplianceOverviewItem } from "@/types";

export interface DashboardSummary {
  kpis: KPIData[];
  licenseTrend: LicenseTrendPoint[];
  complaintsBySector: ComplaintsBySectorPoint[];
  complianceOverview: ComplianceOverviewItem[];
  recentActivity: ActivityItem[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return serverFetch<DashboardSummary>("/dashboard/summary");
}
