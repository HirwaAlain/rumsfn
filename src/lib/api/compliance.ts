"use client";

import { apiFetch } from "./client";
import type { ComplianceRecord } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getComplianceRecords(): Promise<ComplianceRecord[]> {
  const page = await apiFetch<PageResponse<ComplianceRecord>>("/compliance?page=0&size=100&sort=dueDate,desc");
  return page.content;
}

export async function updateComplianceStatus(id: string, status: string): Promise<ComplianceRecord> {
  return apiFetch<ComplianceRecord>(`/compliance/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
