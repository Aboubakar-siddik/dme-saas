import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, type DashboardStats } from '../api/dashboard';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-500">Erreur de chargement.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Patients total</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPatients}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Visites aujourd'hui</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.todayVisits}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider">En attente</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{stats.waitingVisits}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500 uppercase tracking-wider">Revenu du jour</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {stats.todayRevenue.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {/* Dernières visites */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Dernières visites</h3>
        {stats.recentVisits.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Aucune visite enregistrée.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentVisits.map((visit) => (
              <Link
                key={visit.id}
                to={`/visits/${visit.id}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {visit.patient?.firstName} {visit.patient?.lastName}
                  </span>
                  <span className="text-sm text-gray-500 ml-3">{visit.reason}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    visit.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-700'
                      : visit.status === 'WAITING'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'WAITING' ? 'En attente' : 'En cours'}
                  </span>
                  {visit.fee && (
                    <span className="text-sm text-gray-600">{visit.fee.toLocaleString()} FCFA</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}