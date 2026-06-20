import { ComplianceClient } from "@/components/compliance/ComplianceClient";
import { serverFetch } from "@/lib/api/server";
import { complianceRecords as mockRecords, complianceOverview as mockOverview } from "@/lib/mock-data/mock-compliance";
import type { ComplianceRecord, ComplianceOverviewItem } from "@/types";

interface Page<T> { content: T[] }

async function getData() {
  try {
    const [recordsPage, overview] = await Promise.all([
      serverFetch<Page<ComplianceRecord>>("/compliance?page=0&size=100&sort=dueDate,desc"),
      serverFetch<ComplianceOverviewItem[]>("/dashboard/compliance-overview"),
    ]);
    return { records: recordsPage.content, overview };
  } catch {
    return { records: mockRecords, overview: mockOverview };
  }
}

export default async function AnalystCompliancePage() {
  const { records, overview } = await getData();
  return <ComplianceClient records={records} overview={overview} />;
}
