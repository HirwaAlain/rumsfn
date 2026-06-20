"use client";

import { apiFetch } from "./client";
import type { Report } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getReports(): Promise<Report[]> {
  const page = await apiFetch<PageResponse<Report>>("/reports?page=0&size=100&sort=createdAt,desc");
  return page.content;
}

export async function createReport(data: Partial<Omit<Report, "id" | "createdAt" | "downloadUrl" | "sizeKb">>): Promise<Report> {
  return apiFetch<Report>("/reports", { method: "POST", body: JSON.stringify(data) });
}

export async function publishReport(id: string): Promise<Report> {
  return apiFetch<Report>(`/reports/${id}/publish`, { method: "PATCH" });
}
