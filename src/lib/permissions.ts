export type PortalRole = "admin" | "supervisor" | "analyst" | "auditor" | "viewer";

export interface PortalPermissions {
  licenses: {
    create: boolean;
    edit: boolean;
    changeStatus: boolean;
    canRevoke: boolean;
  };
  complaints: {
    create: boolean;
    edit: boolean;
    changeStatus: boolean;
    assign: boolean;
  };
  compliance: {
    create: boolean;
    update: boolean;
  };
  fraud: {
    create: boolean;
    edit: boolean;
    changeStatus: boolean;
  };
  clms: {
    create: boolean;
    edit: boolean;
    changeStatus: boolean;
    approve: boolean;
    upload: boolean;
    download: boolean;
  };
  workflows: {
    create: boolean;
    edit: boolean;
    changeWorkflowStatus: boolean;
    updateStepStatus: boolean;
  };
  reports: {
    create: boolean;
    upload: boolean;
    publish: boolean;
    archive: boolean;
    download: boolean;
  };
  alerts: {
    markRead: boolean;
    dismiss: boolean;
    action: boolean;
  };
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    changeRole: boolean;
    changeStatus: boolean;
    delete: boolean;
  };
  auditLog: {
    view: boolean;
  };
  profile: {
    edit: boolean;
    changePassword: boolean;
  };
}

const ALL_TRUE: PortalPermissions = {
  licenses:   { create: true,  edit: true,  changeStatus: true,  canRevoke: true  },
  complaints: { create: true,  edit: true,  changeStatus: true,  assign: true     },
  compliance: { create: true,  update: true                                        },
  fraud:      { create: true,  edit: true,  changeStatus: true                    },
  clms:       { create: true,  edit: true,  changeStatus: true,  approve: true,  upload: true, download: true },
  workflows:  { create: true,  edit: true,  changeWorkflowStatus: true, updateStepStatus: true },
  reports:    { create: true,  upload: true, publish: true, archive: true, download: true },
  alerts:     { markRead: true, dismiss: true, action: true                        },
  users:      { view: true, create: true, edit: true, changeRole: true, changeStatus: true, delete: true },
  auditLog:   { view: true  },
  profile:    { edit: true,  changePassword: true                                  },
};

const NO_WRITE: PortalPermissions = {
  licenses:   { create: false, edit: false, changeStatus: false, canRevoke: false },
  complaints: { create: false, edit: false, changeStatus: false, assign: false    },
  compliance: { create: false, update: false                                       },
  fraud:      { create: false, edit: false, changeStatus: false                   },
  clms:       { create: false, edit: false, changeStatus: false, approve: false, upload: false, download: false },
  workflows:  { create: false, edit: false, changeWorkflowStatus: false, updateStepStatus: false },
  reports:    { create: false, upload: false, publish: false, archive: false, download: false },
  alerts:     { markRead: false, dismiss: false, action: false                     },
  users:      { view: false, create: false, edit: false, changeRole: false, changeStatus: false, delete: false },
  auditLog:   { view: false },
  profile:    { edit: false, changePassword: false                                 },
};

export const ROLE_PERMISSIONS: Record<PortalRole, PortalPermissions> = {
  admin: ALL_TRUE,

  supervisor: {
    ...ALL_TRUE,
    licenses: { ...ALL_TRUE.licenses, canRevoke: false },
    users:    NO_WRITE.users,
    auditLog: { view: false },
  },

  analyst: {
    ...ALL_TRUE,
    licenses: { create: true, edit: false, changeStatus: false, canRevoke: false },
    clms:     { ...ALL_TRUE.clms, approve: false },
    reports:  { ...ALL_TRUE.reports, publish: false },
    alerts:   { markRead: true, dismiss: true, action: false },
    users:    NO_WRITE.users,
    auditLog: { view: false },
  },

  auditor: {
    ...NO_WRITE,
    complaints: { create: false, edit: false, changeStatus: true, assign: false },
    compliance: { create: true,  update: true },
    workflows:  { create: false, edit: false, changeWorkflowStatus: false, updateStepStatus: true },
    alerts:     { markRead: true, dismiss: true, action: false },
    auditLog:   { view: true },
    profile:    { edit: true, changePassword: true },
  },

  viewer: {
    ...NO_WRITE,
    reports: { ...NO_WRITE.reports, download: true },
    profile: { edit: true, changePassword: true },
  },
};

export const FULL_PERMISSIONS: PortalPermissions = ALL_TRUE;
