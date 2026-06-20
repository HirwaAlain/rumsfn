"use client";

import { createContext, useContext, type ReactNode } from "react";
import { FULL_PERMISSIONS, type PortalPermissions, type PortalRole } from "@/lib/permissions";

interface PortalPermissionsContextValue {
  role: PortalRole;
  permissions: PortalPermissions;
}

const PortalPermissionsContext = createContext<PortalPermissionsContextValue>({
  role: "viewer",
  permissions: FULL_PERMISSIONS,
});

interface Props {
  role: PortalRole;
  permissions: PortalPermissions;
  children: ReactNode;
}

export function PortalPermissionsProvider({ role, permissions, children }: Props) {
  return (
    <PortalPermissionsContext.Provider value={{ role, permissions }}>
      {children}
    </PortalPermissionsContext.Provider>
  );
}

export function usePortalPermissions(): PortalPermissionsContextValue {
  return useContext(PortalPermissionsContext);
}
