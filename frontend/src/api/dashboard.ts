import api from './client';
import type { Visit } from '../types/visit';

export interface DashboardStats {
  totalPatients: number;
  todayVisits: number;
  waitingVisits: number;
  todayRevenue: number;
  recentVisits: Visit[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/dashboard');
  return response.data;
}

export interface WeeklyStats {
  day: string;
  consultations: number;
  revenu: number;
}

export async function getWeeklyStats(): Promise<WeeklyStats[]> {
  const response = await api.get<WeeklyStats[]>('/dashboard/weekly');
  return response.data;
}