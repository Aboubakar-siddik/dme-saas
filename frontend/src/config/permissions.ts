export type Role = 'ADMIN' | 'DOCTOR' | 'SECRETARY';

export interface Permissions {
  canViewDashboard: Role[];
  canViewPatients: Role[];
  canCreatePatient: Role[];
  canViewPatientDetail: Role[];
  canCreateVisit: Role[];
  canViewQueue: Role[];
  canManageConsultation: Role[];
  canGeneratePrescription: Role[];
  canManageUsers: Role[];
  canManageSettings: Role[];
}

export const permissions: Permissions = {
  canViewDashboard: ['ADMIN', 'DOCTOR'],
  canViewPatients: ['ADMIN', 'DOCTOR', 'SECRETARY'],
  canCreatePatient: ['SECRETARY', 'DOCTOR'],
  canViewPatientDetail: ['ADMIN', 'DOCTOR', 'SECRETARY'],
  canCreateVisit: ['SECRETARY', 'DOCTOR'],
  canViewQueue: ['DOCTOR', 'SECRETARY'],
  canManageConsultation: ['DOCTOR'],
  canGeneratePrescription: ['DOCTOR'],
  canManageUsers: ['ADMIN'],
  canManageSettings: ['ADMIN'],
};

export function hasPermission(role: string | undefined, permission: keyof Permissions): boolean {
  if (!role) return false;
  return permissions[permission].includes(role as Role);
}