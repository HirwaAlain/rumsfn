import { WorkflowsClient } from "@/components/workflows/WorkflowsClient";
import { serverFetch } from "@/lib/api/server";
import { workflows as mockWorkflows } from "@/lib/mock-data/mock-workflows";
import type { Workflow } from "@/types";

interface Page<T> { content: T[] }

async function getWorkflows(): Promise<Workflow[]> {
  try {
    const data = await serverFetch<Page<Workflow>>("/workflows?page=0&size=100&sort=createdAt,desc");
    return data.content;
  } catch {
    return mockWorkflows;
  }
}

export default async function SupervisorWorkflowsPage() {
  const workflows = await getWorkflows();
  return <WorkflowsClient workflows={workflows} />;
}
