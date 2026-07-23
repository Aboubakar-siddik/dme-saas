import api from './client';

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'SECRETARY';
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users');
  return response.data;
}

export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}): Promise<User> {
  const response = await api.post<User>('/users', data);
  return response.data;
}

export async function toggleUserActive(id: string): Promise<User> {
  const response = await api.patch<User>(`/users/${id}/toggle`);
  return response.data;
}