"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LicenseFilterBar } from "@/components/licenses/LicenseFilterBar";
import { LicenseTable } from "@/components/licenses/LicenseTable";
import { LicenseDrawer } from "@/components/licenses/LicenseDrawer";
import { IssueLicenceModal } from "@/components/licenses/IssueLicenceModal";
import { usePortalPermissions } from "@/contexts/PortalPermissionsContext";
import type { License, LicenseStatus, RwandaSector } from "@/types";

export function LicensesClient({ licenses: initial }: { licenses: License[] }) {
  const { permissions } = usePortalPermissions();
  const [licenses, setLicenses]         = useState(initial);
  const [sectorFilter, setSectorFilter] = useState<RwandaSector | "All">("All");
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | "All">("All");
  const [selected, setSelected]         = useState<License | null>(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [modalOpen, setModalOpen]       = useState(false);

  const filtered = licenses.filter(
    (l) =>
      (sectorFilter === "All" || l.sector === sectorFilter) &&
      (statusFilter === "All" || l.status === statusFilter)
  );

  const handleView         = useCallback((l: License) => { setSelected(l); setDrawerOpen(true); }, []);
  const handleCloseDrawer  = useCallback(() => setDrawerOpen(false), []);
  const handleUpdate       = useCallback((updated: License) =>
    setLicenses((prev) => prev.map((l) => l.id === updated.id ? updated : l)), []);
  const handleCreated      = useCallback((created: License) =>
    setLicenses((prev) => [created, ...prev]), []);

  return (
    <>
      <PageHeader
        title="License Management"
        description="Issue, renew, and track operator licences across all regulated sectors."
        actions={
          permissions.licenses.create ? (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Issue Licence
            </button>
          ) : undefined
        }
      />

      <div className="space-y-4">
        <LicenseFilterBar
          sectorFilter={sectorFilter}
          statusFilter={statusFilter}
          onSectorChange={setSectorFilter}
          onStatusChange={setStatusFilter}
          totalCount={licenses.length}
          filteredCount={filtered.length}
        />
        <LicenseTable licenses={filtered} onView={handleView} />
      </div>

      <LicenseDrawer
        license={selected}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onUpdate={handleUpdate}
        canChangeStatus={permissions.licenses.changeStatus}
        canRevoke={permissions.licenses.canRevoke}
      />

      <IssueLicenceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
