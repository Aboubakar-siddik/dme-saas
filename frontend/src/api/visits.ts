import axios from 'axios';
import type { Visit } from '../types/visit';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export async function createVisit(patientId: string, reason: string): Promise<Visit> {
  const response = await api.post<Visit>('/visits', { patientId, reason });
  return response.data;
}

export async function getWaitingQueue(): Promise<Visit[]> {
  const response = await api.get<Visit[]>('/visits/queue');
  return response.data;
}

export async function getVisit(id: string): Promise<Visit> {
  const response = await api.get<Visit>(`/visits/${id}`);
  return response.data;
}

export async function updateVisit(
  id: string,
  data: Partial<Pick<Visit, 'observations' | 'diagnosis' | 'prescription' | 'fee' | 'status'>>
): Promise<Visit> {
  const response = await api.patch<Visit>(`/visits/${id}`, data);
  return response.data;
}

export async function getPatientHistory(patientId: string): Promise<Visit[]> {
  const response = await api.get<Visit[]>(`/visits/patient/${patientId}`);
  return response.data;
}