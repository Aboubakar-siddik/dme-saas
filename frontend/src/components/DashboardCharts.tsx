import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from './ui/Card';
import { getWeeklyStats, type WeeklyStats } from '../api/dashboard';

export function DashboardCharts() {
  const [data, setData] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeeklyStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><div className="h-[300px] flex items-center justify-center text-gray-400">Chargement...</div></Card>
        <Card><div className="h-[300px] flex items-center justify-center text-gray-400">Chargement...</div></Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Consultations (7 jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="consultations" fill="#0B6E99" radius={[6, 6, 0, 0]} name="Consultations" />
            <Bar dataKey="revenu" fill="#2E8B57" radius={[6, 6, 0, 0]} name="Revenu (FCFA)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus FCFA (7 jours)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="revenu" fill="#10b981" radius={[6, 6, 0, 0]} name="Revenu (FCFA)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}