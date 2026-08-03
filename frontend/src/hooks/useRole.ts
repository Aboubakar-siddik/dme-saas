import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../config/permissions';
import type { Permissions } from '../config/permissions';

export function useRole() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'ADMIN',
    isDoctor: role === 'DOCTOR',
    isSecretary: role === 'SECRETARY',
    can: (permission: keyof Permissions) => hasPermission(role, permission),
  };
}