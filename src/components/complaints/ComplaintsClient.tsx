"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ComplaintFilterBar } from "@/components/complaints/ComplaintFilterBar";
import { KanbanBoard } from "@/components/complaints/KanbanBoard";
import { ComplaintModal } from "@/components/complaints/ComplaintModal";
import { FileComplaintModal } from "@/components/complaints/FileComplaintModal";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { Complaint, ComplaintSeverity, RwandaSector } from "@/types";

export function ComplaintsClient({ complaints: initial }: { complaints: Complaint[] }) {
  const { permissions } = usePortalPermissions();
  const [complaints, setComplaints]       = useState(initial);
  const [sectorFilter, setSectorFilter]   = useState<RwandaSector | "All">("All");
  const [severityFilter, setSeverityFilter] = useState<ComplaintSeverity | "All">("All");
  const [selected, setSelected]           = useState<Complaint | null>(null);
  const [modalOpen, setModalOpen]         = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const filtered = complaints.filter(
    (c) =>
      (sectorFilter   === "All" || c.sector   === sectorFilter) &&
      (severityFilter === "All" || c.severity === severityFilter)
  );

  const handleCardClick = useCallback((c: Complaint) => { setSelected(c); setModalOpen(true); }, []);
  const handleClose     = useCallback(() => setModalOpen(false), []);
  const handleUpdate    = useCallback((updated: Complaint) =>
    setComplaints((prev) => prev.map((c) => c.id === updated.id ? updated : c)), []);
  const handleCreated   = useCallback((created: Complaint) =>
    setComplaints((prev) => [created, ...prev]), []);

  return (
    <>
      <PageHeader
        title="Consumer Complaints"
        description="Track, assign, and resolve complaints filed against licensed operators."
        actions={
          permissions.complaints.create ? (
            <button
              type="button"
              onClick={() => setFileModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              File Complaint
            </button>
          ) : undefined
        }
      />

      <div className="space-y-4">
        <ComplaintFilterBar
          sectorFilter={sectorFilter}
          severityFilter={severityFilter}
          onSectorChange={setSectorFilter}
          onSeverityChange={setSeverityFilter}
          total={complaints.length}
          filtered={filtered.length}
        />
        <KanbanBoard complaints={filtered} onCardClick={handleCardClick} />
      </div>

      <ComplaintModal
        complaint={selected}
        open={modalOpen}
        onClose={handleClose}
        onUpdate={handleUpdate}
      />

      <FileComplaintModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
