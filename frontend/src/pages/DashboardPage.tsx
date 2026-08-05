import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, type DashboardStats } from '../api/dashboard';
import { Users, Activity, Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DashboardCharts } from '../components/DashboardCharts';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
export function DashboardPage() {
  const { can } = useRole();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!can('canViewDashboard')) {
    return <Navigate to="/patients" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="text-center py-12">
        <Activity size={48} className="mx-auto text-surface-300 mb-4" />
        <p className="text-surface-500">Erreur de chargement des statistiques.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-surface-800">Tableau de bord</h2>
          <p className="text-surface-500 mt-1 flex items-center gap-2">
            <Calendar size={16} />
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/patients" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium">
          <Users size={18} />
          Voir tous les patients
        </Link>
      </div>

      {/* Cartes statistiques */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard label="Patients" value={stats.totalPatients} icon={Users} color="blue" />
      <StatCard label="Aujourd'hui" value={stats.todayVisits} icon={Activity} color="green" />
      <StatCard label="En attente" value={stats.waitingVisits} icon={Clock} color="orange" />
      <StatCard label="Revenu" value={`${stats.todayRevenue.toLocaleString()} FCFA`} icon={DollarSign} color="purple" />
    </div>

      {/* Graphiques */}
      <DashboardCharts />
      <div className="mt-8">
        <h3 className="text-xl font-heading font-bold text-surface-800 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary-500" />
          Analyses épidémiologiques
        </h3>
      <AnalyticsCharts />
    </div>

      {/* Dernières visites */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-semibold text-surface-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-500" />
            Dernières visites
          </h3>
          <Link to="/queue" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Voir la file d'attente →
          </Link>
        </div>

        {stats.recentVisits.length === 0 ? (
          <div className="text-center py-12">
            <Activity size={48} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-400 font-medium">Aucune visite enregistrée.</p>
            <Link to="/patients" className="text-primary-600 text-sm hover:underline mt-2 inline-block">
              Créer une première visite
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentVisits.map((visit) => (
              <Link
                key={visit.id}
                to={`/visits/${visit.id}`}
                className="flex items-center justify-between p-4 hover:bg-surface-50 rounded-xl border border-surface-100 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Users size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-surface-800">
                      {visit.patient?.firstName} {visit.patient?.lastName}
                    </p>
                    <p className="text-sm text-surface-500">{visit.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      visit.status === 'COMPLETED' ? 'success' :
                      visit.status === 'WAITING' ? 'info' : 'warning'
                    }
                  >
                    {visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'WAITING' ? 'En attente' : 'En cours'}
                  </Badge>
                  {visit.fee && (
                    <span className="text-sm font-semibold text-surface-700">
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