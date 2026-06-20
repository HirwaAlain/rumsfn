import { AuditClient } from "@/components/audit/AuditClient";
import { serverFetch } from "@/lib/api/server";
import { auditLog as mockAuditLog } from "@/lib/mock-data/mock-audit";
import type { AuditLogEntry } from "@/types";

interface Page<T> { content: T[]; }

async function fetchAuditLog(): Promise<AuditLogEntry[]> {
  try {
    const data = await serverFetch<Page<AuditLogEntry>>("/audit?page=0&size=100&sort=timestamp,desc");
    return data.content;
  } catch {
    return mockAuditLog;
  }
}

export default async function AuditPage() {
  const entries = await fetchAuditLog();
  return <AuditClient entries={entries} />;
}
