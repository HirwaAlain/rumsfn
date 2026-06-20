"use client";

import { apiFetch } from "./client";
import type { License } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getLicenses(): Promise<License[]> {
  const page = await apiFetch<PageResponse<License>>("/licenses?page=0&size=100&sort=issuedAt,desc");
  return page.content;
}

export async function createLicense(data: Partial<Omit<License, "id">>): Promise<License> {
  return apiFetch<License>("/licenses", { method: "POST", body: JSON.stringify(data) });
}

export async function updateLicenseStatus(id: string, status: string): Promise<License> {
  return apiFetch<License>(`/licenses/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
