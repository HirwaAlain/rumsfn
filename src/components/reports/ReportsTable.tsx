"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, FileText, Globe, Archive, Loader2, Printer } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/components/shared/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { printReport } from "@/components/reports/ReportPrint";
import type { Report, ReportType, ReportFormat } from "@/types";

const TYPE_CHIP: Record<ReportType, string> = {
  monthly:   "bg-info-bg text-info-fg",
  quarterly: "bg-accent/10 text-accent",
  annual:    "bg-success-bg text-success-fg",
  ad_hoc:    "bg-warning-bg text-warning-fg",
};

const FORMAT_ICON: Record<ReportFormat, string> = {
  pdf:  "text-danger",
  xlsx: "text-success",
  csv:  "text-warning",
};

interface ReportsTableProps {
  reports: Report[];
  canPublish?: boolean;
  canArchive?: boolean;
  canDownload?: boolean;
  onUpdate?: (updated: Report) => void;
}

function ActionsCell({
  report,
  canPublish,
  canArchive,
  canDownload,
  onUpdate,
  generatedBy,
  generatedByRole,
}: {
  report: Report;
  canPublish: boolean;
  canArchive: boolean;
  canDownload: boolean;
  onUpdate?: (r: Report) => void;
  generatedBy: string;
  generatedByRole: string;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function handlePublish() {
    setBusy("publish");
    try {
      await new Promise((r) => setTimeout(r, 400));
      onUpdate?.({ ...report, status: "published" });
      toast("Report published.");
    } catch {
      toast("Failed to publish.", "error");
    } finally {
      setBusy(null);
    }
  }

  async function handleArchive() {
    setBusy("archive");
    try {
      await new Promise((r) => setTimeout(r, 400));
      onUpdate?.({ ...report, status: "archived" });
      toast("Report archived.");
    } catch {
      toast("Failed to archive.", "error");
    } finally {
      setBusy(null);
    }
  }

  function handlePrint() {
    printReport(report, generatedBy, generatedByRole);
  }

  return (
    <div className="flex items-center gap-1">
      {canPublish && report.status === "draft" && (
        <button type="button" disabled={!!busy} onClick={handlePublish}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-success hover:bg-success-bg transition-colors disabled:opacity-50">
          {busy === "publish" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Globe className="h-3 w-3" />}
          Publish
        </button>
      )}
      {canArchive && report.status === "published" && (
        <button type="button" disabled={!!busy} onClick={handleArchive}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
          {busy === "archive" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Archive className="h-3 w-3" />}
          Archive
        </button>
      )}

      {/* Print button — always available */}
      <button type="button" onClick={handlePrint}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-accent/10 transition-colors">
        <Printer className="h-3 w-3" />
        Print
      </button>

      {/* Download link — only when a stored file exists */}
      {canDownload && report.downloadUrl && (
        <a href={report.downloadUrl}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Download className="h-3.5 w-3.5" />
          File
        </a>
      )}
    </div>
  );
}

export function ReportsTable({ reports, canPublish = true, canArchive = true, canDownload = true, onUpdate }: ReportsTableProps) {
  const { user } = useAuth();
  const [localReports, setLocalReports] = useState(reports);

  const generatedBy   = user?.name ?? "RURA Staff";
  const generatedByRole = user?.role?.toUpperCase() ?? "STAFF";

  function handleUpdate(updated: Report) {
    setLocalReports((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    onUpdate?.(updated);
  }

  const columns: ColumnDef<Report, unknown>[] = [
    {
      accessorKey: "title",
      header: "Report",
      cell: ({ row }) => (
        <div className="flex items-start gap-2.5">
          <FileText className={cn("mt-0.5 h-4 w-4 shrink-0", FORMAT_ICON[row.original.format])} />
          <div>
            <p className="font-medium text-foreground leading-snug">{row.original.title}</p>
            <p className="text-xs text-muted-foreground">{row.original.period}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const t = getValue<ReportType>();
        return (
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize", TYPE_CHIP[t])}>
            {t.replace("_", " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "sector",
      header: "Sector",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue<string>()} />,
    },
    {
      accessorKey: "createdBy",
      header: "Author",
      cell: ({ getValue }) => {
        const v = getValue<string | { id: string; name: string }>();
        const label = typeof v === "object" && v !== null ? v.name : v;
        return <span className="text-sm text-muted-foreground">{label ?? "—"}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsCell
          report={localReports.find((r) => r.id === row.original.id) ?? row.original}
          canPublish={canPublish}
          canArchive={canArchive}
          canDownload={canDownload}
          onUpdate={handleUpdate}
          generatedBy={generatedBy}
          generatedByRole={generatedByRole}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={localReports}
      columns={columns}
      searchPlaceholder="Search by title, author or sector…"
      emptyTitle="No reports found"
      emptyDescription="Try adjusting the type or status filters."
    />
  );
}
