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
export interface StatItem {
  name: string;
  value: number;
}

export interface TrendItem {
  date: string;
  consultations: number;
}

export async function getGenderStats(): Promise<StatItem[]> {
  const res = await api.get('/dashboard/gender');
  return res.data;
}

export async function getAgeStats(): Promise<StatItem[]> {
  const res = await api.get('/dashboard/age');
  return res.data;
}

export async function getDiagnosisStats(): Promise<StatItem[]> {
  const res = await api.get('/dashboard/diagnosis');
  return res.data;
}

export async function getConsultationTrend(): Promise<TrendItem[]> {
  const res = await api.get('/dashboard/trend');
  return res.data;
}

export async function getGeographicStats(): Promise<StatItem[]> {
  const res = await api.get('/dashboard/geographic');
  return res.data;
}