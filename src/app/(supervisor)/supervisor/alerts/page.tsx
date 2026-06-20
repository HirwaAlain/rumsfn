import { AlertsClient } from "@/components/alerts/AlertsClient";
import { serverFetch } from "@/lib/api/server";
import { alerts as mockAlerts } from "@/lib/mock-data/mock-alerts";
import type { Alert } from "@/types";

interface Page<T> { content: T[] }

async function getAlerts(): Promise<Alert[]> {
  try {
    const data = await serverFetch<Page<Alert>>("/alerts?page=0&size=100&sort=createdAt,desc");
    return data.content;
  } catch {
    return mockAlerts;
  }
}

export default async function SupervisorAlertsPage() {
  const alerts = await getAlerts();
  return <AlertsClient alerts={alerts} />;
}
