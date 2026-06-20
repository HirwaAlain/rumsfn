"use client";

import { apiFetch } from "./client";
import type { Alert } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getAlerts(): Promise<Alert[]> {
  const page = await apiFetch<PageResponse<Alert>>("/alerts?page=0&size=100&sort=createdAt,desc");
  return page.content;
}

export async function markAlertRead(id: string): Promise<Alert> {
  return apiFetch<Alert>(`/alerts/${id}/read`, { method: "PATCH" });
}

export async function markAllAlertsRead(): Promise<void> {
  await apiFetch<void>("/alerts/mark-all-read", { method: "PATCH" });
}

export async function dismissAlert(id: string): Promise<Alert> {
  return apiFetch<Alert>(`/alerts/${id}/dismiss`, { method: "PATCH" });
}

export async function actionAlert(id: string): Promise<Alert> {
  return apiFetch<Alert>(`/alerts/${id}/action`, { method: "PATCH" });
}
