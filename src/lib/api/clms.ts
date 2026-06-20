"use client";

import { apiFetch } from "./client";
import type { CLMSCase } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getCLMSCases(): Promise<CLMSCase[]> {
  const page = await apiFetch<PageResponse<CLMSCase>>("/clms?page=0&size=100&sort=submittedAt,desc");
  return page.content;
}

export async function createCLMSCase(data: Partial<Omit<CLMSCase, "id" | "caseNumber" | "submittedAt">>): Promise<CLMSCase> {
  return apiFetch<CLMSCase>("/clms", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCLMSStatus(id: string, status: string): Promise<CLMSCase> {
  return apiFetch<CLMSCase>(`/clms/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
