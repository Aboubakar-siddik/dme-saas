import axios from 'axios';
import type { Patient, PatientSearchResult } from '../types/patient';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function searchPatients(query: string): Promise<PatientSearchResult> {
  const response = await api.get<PatientSearchResult>('/patients', {
    params: { q: query },
  });
  return response.data;
}

export async function getPatient(id: string): Promise<Patient> {
  const response = await api.get<Patient>(`/patients/${id}`);
  return response.data;
}

export async function createPatient(
  data: Omit<Patient, 'id' | 'clinicId' | 'createdAt' | 'updatedAt'>
): Promise<Patient> {
  const response = await api.post<Patient>('/patients', data);
  return response.data;
}