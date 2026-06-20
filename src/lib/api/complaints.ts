"use client";

import { apiFetch } from "./client";
import type { Complaint } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getComplaints(): Promise<Complaint[]> {
  const page = await apiFetch<PageResponse<Complaint>>("/complaints?page=0&size=100&sort=filedAt,desc");
  return page.content;
}

export async function createComplaint(data: Partial<Omit<Complaint, "id" | "referenceNumber" | "filedAt">>): Promise<Complaint> {
  return apiFetch<Complaint>("/complaints", { method: "POST", body: JSON.stringify(data) });
}

export async function updateComplaintStatus(id: string, status: string): Promise<Complaint> {
  return apiFetch<Complaint>(`/complaints/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
