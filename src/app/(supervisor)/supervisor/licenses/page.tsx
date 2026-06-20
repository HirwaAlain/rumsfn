import { LicensesClient } from "@/components/licenses/LicensesClient";
import { serverFetch } from "@/lib/api/server";
import { licenses as mockLicenses } from "@/lib/mock-data/mock-licenses";
import type { License } from "@/types";

interface Page<T> { content: T[] }

async function getLicenses(): Promise<License[]> {
  try {
    const data = await serverFetch<Page<License>>("/licenses?page=0&size=100&sort=issuedAt,desc");
    return data.content;
  } catch {
    return mockLicenses;
  }
}

export default async function SupervisorLicensesPage() {
  const licenses = await getLicenses();
  return <LicensesClient licenses={licenses} />;
}
