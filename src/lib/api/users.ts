"use client";

import { apiFetch } from "./client";
import type { User, UserRole, UserDepartment } from "@/types";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UserCreateResult {
  user: User;
  inviteSent: boolean;
  inviteMessage: string;
}

export interface InviteUserPayload {
  name: string;
  contactEmail: string;
  phone?: string;
  role: UserRole;
  department: UserDepartment;
}

export async function getUsers(): Promise<User[]> {
  const page = await apiFetch<PageResponse<User>>("/users?page=0&size=100&sort=createdAt,desc");
  return page.content;
}

export async function inviteUser(data: InviteUserPayload): Promise<UserCreateResult> {
  return apiFetch<UserCreateResult>("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function updateUserStatus(id: string, status: string): Promise<User> {
  return apiFetch<User>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function updateUserRole(id: string, role: string): Promise<User> {
  return apiFetch<User>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}
