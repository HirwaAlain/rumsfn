import { AuditClient } from "@/components/audit/AuditClient";
import { serverFetch } from "@/lib/api/server";
import { auditLog as mockAudit } from "@/lib/mock-data/mock-audit";
import type { AuditLogEntry } from "@/types";

interface Page<T> { content: T[] }

async function getAudit(): Promise<AuditLogEntry[]> {
  try {
    const data = await serverFetch<Page<AuditLogEntry>>("/audit?page=0&size=100&sort=timestamp,desc");
    return data.content;
  } catch {
    return mockAudit;
  }
}

export default async function AuditorAuditPage() {
  const entries = await getAudit();
  return <AuditClient entries={entries} />;
}
