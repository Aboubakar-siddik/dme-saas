import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, type DashboardStats } from '../api/dashboard';
import { Users, Activity, Clock, DollarSign } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DashboardCharts } from '../components/DashboardCharts';

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
    return (
      <Card className="text-center py-8">
        <p className="text-red-500">Erreur de chargement des statistiques.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Tableau de bord</h2>
        <p className="text-sm text-gray-400">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Patients total"
          value={stats.totalPatients}
          icon={Users}
          color="blue"
        />
        <StatCard
          label="Visites aujourd'hui"
          value={stats.todayVisits}
          icon={Activity}
          color="green"
        />
        <StatCard
          label="En attente"
          value={stats.waitingVisits}
          icon={Clock}
          color="orange"
        />
        <StatCard
          label="Revenu du jour"
          value={`${stats.todayRevenue.toLocaleString()} FCFA`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Graphiques */}
      <DashboardCharts />

      {/* Dernières visites */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Dernières visites</h3>
          <Link to="/queue" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Voir la file d'attente →
          </Link>
        </div>

        {stats.recentVisits.length === 0 ? (
          <div className="text-center py-8">
            <Activity size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">Aucune visite enregistrée.</p>
            <Link to="/patients" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
              Créer une première visite
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentVisits.map((visit) => (
              <Link
                key={visit.id}
                to={`/visits/${visit.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {visit.patient?.firstName} {visit.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{visit.reason}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      visit.status === 'COMPLETED' ? 'success' :
                      visit.status === 'WAITING' ? 'info' : 'warning'
                    }
                  >
                    {visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'WAITING' ? 'En attente' : 'En cours'}
                  </Badge>
                  {visit.fee && (
                    <span className="text-sm font-medium text-gray-700">
                      {visit.fee.toLocaleString()} FCFA
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}