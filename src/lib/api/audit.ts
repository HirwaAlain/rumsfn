"use client";

import { apiFetch } from "./client";
import type { AuditLogEntry } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  const page = await apiFetch<PageResponse<AuditLogEntry>>("/audit?page=0&size=100&sort=timestamp,desc");
  return page.content;
}
