"use client";

import { apiFetch } from "./client";
import type { Workflow } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getWorkflows(): Promise<Workflow[]> {
  const page = await apiFetch<PageResponse<Workflow>>("/workflows?page=0&size=100&sort=createdAt,desc");
  return page.content;
}

export async function createWorkflow(data: Partial<Omit<Workflow, "id" | "steps" | "startedAt" | "completedAt">>): Promise<Workflow> {
  return apiFetch<Workflow>("/workflows", { method: "POST", body: JSON.stringify(data) });
}

export async function updateWorkflowStatus(id: string, status: string): Promise<Workflow> {
  return apiFetch<Workflow>(`/workflows/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
