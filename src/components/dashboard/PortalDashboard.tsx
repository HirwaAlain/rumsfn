import { FileText, MessageSquareWarning, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LicenseTrendChart } from "@/components/dashboard/LicenseTrendChart";
import { ComplaintsBySectorChart } from "@/components/dashboard/ComplaintsBySectorChart";
import { ComplianceDonut } from "@/components/dashboard/ComplianceDonut";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { serverFetch } from "@/lib/api/server";
import { licenseTrend as mockTrend } from "@/lib/mock-data/mock-licenses";
import { complaintsBySector as mockComplaints } from "@/lib/mock-data/mock-complaints";
import { complianceOverview as mockOverview } from "@/lib/mock-data/mock-compliance";
import { recentActivity as mockActivity } from "@/lib/mock-data/mock-dashboard";
import type { KPIData, LicenseTrendPoint, ComplaintsBySectorPoint, ComplianceOverviewItem, ActivityItem } from "@/types";

interface DashboardKPIs {
  activeLicenses: number;
  activeComplaints: number;
  complianceRate: number;
  openFraudCases: number;
}

interface DashboardData {
  kpis: DashboardKPIs;
  licenseTrend: LicenseTrendPoint[];
  complaintsBySector: ComplaintsBySectorPoint[];
  complianceOverview: ComplianceOverviewItem[];
  recentActivity: ActivityItem[];
}

async function fetchDashboard(): Promise<DashboardData> {
  try {
    const [kpis, licenseTrend, complaintsBySector, complianceOverview, recentActivity] =
      await Promise.all([
        serverFetch<DashboardKPIs>("/dashboard/kpis"),
        serverFetch<LicenseTrendPoint[]>("/dashboard/license-trend"),
        serverFetch<ComplaintsBySectorPoint[]>("/dashboard/complaints-by-sector"),
        serverFetch<ComplianceOverviewItem[]>("/dashboard/compliance-overview"),
        serverFetch<ActivityItem[]>("/dashboard/activity?limit=10"),
      ]);
    return { kpis, licenseTrend, complaintsBySector, complianceOverview, recentActivity };
  } catch {
    return {
      kpis: { activeLicenses: 1284, activeComplaints: 38, complianceRate: 82, openFraudCases: 7 },
      licenseTrend: mockTrend,
      complaintsBySector: mockComplaints,
      complianceOverview: mockOverview,
      recentActivity: mockActivity,
    };
  }
}

interface PortalDashboardProps {
  roleLabel: string;
}

export async function PortalDashboard({ roleLabel }: PortalDashboardProps) {
  const { kpis, licenseTrend, complaintsBySector, complianceOverview, recentActivity } =
    await fetchDashboard();

  const KPI_ITEMS: { data: KPIData; icon: React.ElementType; iconVariant: "default" | "success" | "warning" | "danger" }[] = [
    {
      data: { label: "Active Licenses",    value: kpis.activeLicenses,        delta: 4.2,  deltaLabel: "vs last month",   trend: "up"      },
      icon: FileText, iconVariant: "default",
    },
    {
      data: { label: "Open Complaints",    value: kpis.activeComplaints,      delta: -12,  deltaLabel: "vs last month",   trend: "down"    },
      icon: MessageSquareWarning, iconVariant: "warning",
    },
    {
      data: { label: "Compliance Rate",    value: `${kpis.complianceRate}%`,  delta: 2.1,  deltaLabel: "vs last quarter", trend: "up"      },
      icon: ShieldCheck, iconVariant: "success",
    },
    {
      data: { label: "Fraud Cases (Active)", value: kpis.openFraudCases,      delta: 0,    deltaLabel: "no change",       trend: "neutral" },
      icon: AlertTriangle, iconVariant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" description={`${roleLabel} — Regulatory Unified Management System`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_ITEMS.map(({ data, icon, iconVariant }) => (
          <KPICard key={data.label} data={data} icon={icon} iconVariant={iconVariant} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LicenseTrendChart data={licenseTrend} />
        <ComplianceDonut data={complianceOverview} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComplaintsBySectorChart data={complaintsBySector} />
        <RecentActivityFeed items={recentActivity} />
      </div>
    </div>
  );
}
