import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from './ui/Card';
import {
  getGenderStats, getAgeStats, getDiagnosisStats,
  getConsultationTrend, getGeographicStats,
  type StatItem, type TrendItem,
} from '../api/dashboard';

const COLORS = ['#0B6E99', '#2E8B57', '#F4B400', '#D32F2F', '#6B7280', '#9333EA', '#EC4899', '#14B8A6'];

// Composant pour le Pie Chart
function PieChartCard({ title, data }: { title: string; data: StatItem[] }) {
  return (
    <Card>
      <h3 className="text-sm font-heading font-semibold text-surface-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Composant pour le Bar Chart
function BarChartCard({ title, data, color = '#0B6E99' }: { title: string; data: StatItem[]; color?: string }) {
  return (
    <Card>
      <h3 className="text-sm font-heading font-semibold text-surface-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Composant pour le Line Chart
function LineChartCard({ title, data }: { title: string; data: TrendItem[] }) {
  return (
    <Card>
      <h3 className="text-sm font-heading font-semibold text-surface-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="consultations" stroke="#0B6E99" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Composant principal
export function AnalyticsCharts() {
  const [genderData, setGenderData] = useState<StatItem[]>([]);
  const [ageData, setAgeData] = useState<StatItem[]>([]);
  const [diagnosisData, setDiagnosisData] = useState<StatItem[]>([]);
  const [trendData, setTrendData] = useState<TrendItem[]>([]);
  const [geoData, setGeoData] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getGenderStats(), getAgeStats(), getDiagnosisStats(),
      getConsultationTrend(), getGeographicStats(),
    ])
      .then(([gender, age, diagnosis, trend, geo]) => {
        setGenderData(gender);
        setAgeData(age);
        setDiagnosisData(diagnosis);
        setTrendData(trend);
        setGeoData(geo);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ligne 1 : Sexe + Âge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard title="Répartition par sexe" data={genderData} />
        <PieChartCard title="Répartition par âge" data={ageData} />
      </div>

      {/* Ligne 2 : Tendance 30 jours */}
      <LineChartCard title="Évolution des consultations (30 jours)" data={trendData} />

      {/* Ligne 3 : Top diagnostics + Géographique */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard title="Top 10 des diagnostics" data={diagnosisData} color="#D32F2F" />
        <BarChartCard title="Répartition géographique" data={geoData} color="#2E8B57" />
      </div>
    </div>
  );
}