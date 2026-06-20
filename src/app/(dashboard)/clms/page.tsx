import { CLMSClient } from "@/components/clms/CLMSClient";
import { serverFetch } from "@/lib/api/server";
import { clmsCases as mockCases } from "@/lib/mock-data/mock-clms";
import type { CLMSCase } from "@/types";

interface Page<T> { content: T[]; }

async function fetchCLMSCases(): Promise<CLMSCase[]> {
  try {
    const data = await serverFetch<Page<CLMSCase>>("/clms?page=0&size=100&sort=submittedAt,desc");
    return data.content;
  } catch {
    return mockCases;
  }
}

export default async function ClmsPage() {
  const cases = await fetchCLMSCases();
  return <CLMSClient cases={cases} />;
}
