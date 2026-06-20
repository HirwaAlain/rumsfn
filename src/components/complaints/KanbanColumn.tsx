import { cn } from "@/lib/utils";
import { KanbanCard } from "@/components/complaints/KanbanCard";
import type { Complaint, ComplaintStatus } from "@/types";

export type ColumnConfig = {
  status: ComplaintStatus;
  label:  string;
  topBar: string;
  badge:  string;
};

interface KanbanColumnProps {
  config:      ColumnConfig;
  complaints:  Complaint[];
  onCardClick: (complaint: Complaint) => void;
}

export function KanbanColumn({ config, complaints, onCardClick }: KanbanColumnProps) {
  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Coloured top accent bar */}
      <div className={cn("h-1 rounded-t-xl", config.topBar)} />

      <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 border-border bg-background">
        {/* Column header */}
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          <span className="text-sm font-semibold text-foreground">{config.label}</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums",
              config.badge
            )}
          >
            {complaints.length}
          </span>
        </div>

        {/* Cards — independently scrollable */}
        <div className="flex-1 space-y-2.5 overflow-y-auto p-3 max-h-[65vh]">
          {complaints.length === 0 ? (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-10">
              <p className="text-xs text-muted-foreground">No complaints</p>
            </div>
          ) : (
            complaints.map((c) => (
              <KanbanCard key={c.id} complaint={c} onClick={onCardClick} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
