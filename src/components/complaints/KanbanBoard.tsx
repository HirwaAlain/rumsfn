import { KanbanColumn, type ColumnConfig } from "@/components/complaints/KanbanColumn";
import type { Complaint, ComplaintStatus } from "@/types";

const COLUMNS: ColumnConfig[] = [
  {
    status: "open",
    label:  "Open",
    topBar: "bg-info",
    badge:  "bg-info-bg text-info-fg",
  },
  {
    status: "under_review",
    label:  "Under Review",
    topBar: "bg-warning",
    badge:  "bg-warning-bg text-warning-fg",
  },
  {
    status: "escalated",
    label:  "Escalated",
    topBar: "bg-danger",
    badge:  "bg-danger-bg text-danger-fg",
  },
  {
    status: "resolved",
    label:  "Resolved",
    topBar: "bg-success",
    badge:  "bg-success-bg text-success-fg",
  },
  {
    status: "closed",
    label:  "Closed",
    topBar: "bg-muted-foreground",
    badge:  "bg-muted text-muted-foreground",
  },
];

interface KanbanBoardProps {
  complaints: Complaint[];
  onCardClick: (complaint: Complaint) => void;
}

export function KanbanBoard({ complaints, onCardClick }: KanbanBoardProps) {
  const byStatus = Object.fromEntries(
    COLUMNS.map((col) => [
      col.status,
      complaints.filter((c) => c.status === col.status),
    ])
  ) as Record<ComplaintStatus, Complaint[]>;

  return (
    <div className="overflow-x-auto pb-3">
      <div className="flex gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            config={col}
            complaints={byStatus[col.status] ?? []}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}
