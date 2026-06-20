"use client";

import { apiFetch } from "./client";
import type { User } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getUsers(): Promise<User[]> {
  const page = await apiFetch<PageResponse<User>>("/users?page=0&size=100&sort=createdAt,desc");
  return page.content;
}

export async function inviteUser(data: Partial<Omit<User, "id" | "lastLogin" | "createdAt" | "mfaEnabled" | "status">>): Promise<User> {
  return apiFetch<User>("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function updateUserStatus(id: string, status: string): Promise<User> {
  return apiFetch<User>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
