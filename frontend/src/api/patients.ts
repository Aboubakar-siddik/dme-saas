
import type { Patient, PatientSearchResult } from '../types/patient';

import api from './client';

// Intercepteur : ajouter le token à toutes les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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