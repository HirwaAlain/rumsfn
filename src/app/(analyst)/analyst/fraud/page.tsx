import { FraudClient } from "@/components/fraud/FraudClient";
import { serverFetch } from "@/lib/api/server";
import { fraudCases as mockCases } from "@/lib/mock-data/mock-fraud";
import type { FraudCase } from "@/types";

interface Page<T> { content: T[] }

async function getCases(): Promise<FraudCase[]> {
  try {
    const data = await serverFetch<Page<FraudCase>>("/fraud?page=0&size=100&sort=reportedAt,desc");
    return data.content;
  } catch {
    return mockCases;
  }
}

export default async function AnalystFraudPage() {
  const cases = await getCases();
  return <FraudClient cases={cases} />;
}
