import { ReportsClient } from "@/components/reports/ReportsClient";
import { serverFetch } from "@/lib/api/server";
import { reports as mockReports } from "@/lib/mock-data/mock-reports";
import type { Report } from "@/types";

interface Page<T> { content: T[] }

async function getReports(): Promise<Report[]> {
  try {
    const data = await serverFetch<Page<Report>>("/reports?page=0&size=100&sort=createdAt,desc");
    return data.content;
  } catch {
    return mockReports;
  }
}

export default async function AnalystReportsPage() {
  const reports = await getReports();
  return <ReportsClient reports={reports} />;
}
