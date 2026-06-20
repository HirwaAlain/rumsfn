"use client";

import { apiFetch } from "./client";
import type { FraudCase } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getFraudCases(): Promise<FraudCase[]> {
  const page = await apiFetch<PageResponse<FraudCase>>("/fraud?page=0&size=100&sort=reportedAt,desc");
  return page.content;
}

export async function createFraudCase(data: Partial<Omit<FraudCase, "id" | "caseNumber">> & { reportedAt?: string }): Promise<FraudCase> {
  return apiFetch<FraudCase>("/fraud", { method: "POST", body: JSON.stringify(data) });
}

export async function updateFraudStatus(id: string, status: string): Promise<FraudCase> {
  return apiFetch<FraudCase>(`/fraud/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
