import { ComplaintsClient } from "@/components/complaints/ComplaintsClient";
import { serverFetch } from "@/lib/api/server";
import { complaints as mockComplaints } from "@/lib/mock-data/mock-complaints";
import type { Complaint } from "@/types";

interface Page<T> { content: T[]; }

async function fetchComplaints(): Promise<Complaint[]> {
  try {
    const data = await serverFetch<Page<Complaint>>("/complaints?page=0&size=100&sort=filedAt,desc");
    return data.content;
  } catch {
    return mockComplaints;
  }
}

export default async function ComplaintsPage() {
  const complaints = await fetchComplaints();
  return <ComplaintsClient complaints={complaints} />;
}
