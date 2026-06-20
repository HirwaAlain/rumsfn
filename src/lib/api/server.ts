import { cookies } from "next/headers";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export class ServerApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ServerApiError";
  }
}

export async function serverFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("rums_token")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new ServerApiError(
      res.status,
      json.error ?? "UNKNOWN_ERROR",
      json.message ?? "An unexpected error occurred.",
    );
  }

  return json.data as T;
}
