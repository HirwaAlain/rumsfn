"use client";

import { apiFetch, setCookie, deleteCookie } from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  department: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? "Login failed");
  }
  const data = json.data as LoginResponse;
  setCookie("rums_token", data.accessToken, data.expiresIn);
  setCookie("rums_refresh", data.refreshToken, 7 * 24 * 60 * 60);
  return data;
}

export function logout() {
  deleteCookie("rums_token");
  deleteCookie("rums_refresh");
}

export async function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}
