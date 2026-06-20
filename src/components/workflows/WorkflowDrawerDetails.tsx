import { CheckCircle2, Circle, Clock, XCircle, SkipForward } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Workflow, WorkflowStep, WorkflowStepStatus } from "@/types";

const STEP_ICON: Record<WorkflowStepStatus, React.ReactNode> = {
  completed:   <CheckCircle2 className="h-5 w-5 text-success" />,
  in_progress: <Clock className="h-5 w-5 text-accent" />,
  pending:     <Circle className="h-5 w-5 text-muted-foreground/40" />,
  failed:      <XCircle className="h-5 w-5 text-danger" />,
  skipped:     <SkipForward className="h-5 w-5 text-muted-foreground" />,
};

const STEP_LINE: Record<WorkflowStepStatus, string> = {
  completed:   "bg-success",
  in_progress: "bg-accent",
  pending:     "bg-muted",
  failed:      "bg-danger",
  skipped:     "bg-muted",
};

function StepRow({ step, isLast }: { step: WorkflowStep; isLast: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
          {STEP_ICON[step.status]}
        </div>
        {!isLast && <div className={cn("mt-1 w-0.5 flex-1", STEP_LINE[step.status])} style={{ minHeight: "24px" }} />}
      </div>
      <div className="min-w-0 flex-1 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-foreground">{step.order}. {step.name}</p>
          <StatusBadge status={step.status} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
          <span>Role: <span className="capitalize">{step.assignedRole}</span></span>
          <span>Due in {step.dueInDays}d</span>
          {step.completedBy && <span>By: {step.completedBy}</span>}
          {step.completedAt && <span>On: {formatDate(step.completedAt)}</span>}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function WorkflowDrawerDetails({ w }: { w: Workflow }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Row label="Status"><StatusBadge status={w.status} /></Row>
          <Row label="Sector">{w.sector}</Row>
          <Row label="Trigger">{w.trigger.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Row>
          <Row label="Created By">{typeof w.createdBy === "object" && w.createdBy !== null ? (w.createdBy as { id: string; name: string }).name : w.createdBy}</Row>
          <Row label="Created">{formatDate(w.createdAt)}</Row>
          {w.startedAt   && <Row label="Started">{formatDate(w.startedAt)}</Row>}
          {w.completedAt && <Row label="Completed">{formatDate(w.completedAt)}</Row>}
          {w.relatedEntityId && <Row label="Related Entity ID">{w.relatedEntityId}</Row>}
        </div>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{w.description}</p>
      </div>

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Steps ({w.steps.length})
        </p>
        <div>
          {w.steps.map((step, i) => (
            <StepRow key={step.id} step={step} isLast={i === w.steps.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
