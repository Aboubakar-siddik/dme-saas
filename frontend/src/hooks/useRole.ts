import { useAuth } from '../contexts/AuthContext';

export function useRole() {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'ADMIN',
    isDoctor: user?.role === 'DOCTOR',
    isSecretary: user?.role === 'SECRETARY',
    role: user?.role,
  };
}