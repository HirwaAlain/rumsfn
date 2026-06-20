"use client";

import { Building2, Tag } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Complaint } from "@/types";

interface KanbanCardProps {
  complaint: Complaint;
  onClick:   (complaint: Complaint) => void;
}

export function KanbanCard({ complaint, onClick }: KanbanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(complaint)}
      className="group w-full rounded-lg border border-border bg-card p-3.5 text-left shadow-sm transition-all hover:border-accent/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
    >
      {/* Reference + severity */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="font-mono text-[11px] leading-tight text-muted-foreground">
          {complaint.referenceNumber}
        </span>
        <StatusBadge status={complaint.severity} className="shrink-0" />
      </div>

      {/* Subject */}
      <p className="mb-3 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {complaint.subject}
      </p>

      {/* Operator */}
      <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Building2 className="h-3 w-3 shrink-0" />
        <span className="truncate">{complaint.respondentOperator}</span>
      </div>

      {/* Category */}
      <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Tag className="h-3 w-3 shrink-0" />
        <span className="truncate">{complaint.category}</span>
      </div>

      {/* Footer: filed date + assignee avatar */}
      <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs text-muted-foreground">
        <span>{formatDate(complaint.filedAt)}</span>
        {complaint.assignedTo ? (
          (() => {
            const name = typeof complaint.assignedTo === "object"
              ? (complaint.assignedTo as { id: string; name: string }).name
              : complaint.assignedTo as string;
            return (
              <span className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/15 text-[10px] font-semibold text-accent">
                  {name.charAt(0)}
                </span>
                <span className="max-w-[80px] truncate">
                  {name.split(" ")[0]}
                </span>
              </span>
            );
          })()
        ) : (
          <span className="italic">Unassigned</span>
        )}
      </div>
    </button>
  );
}
