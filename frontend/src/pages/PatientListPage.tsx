import { Link } from 'react-router-dom';
import { PatientSearch } from '../components/PatientSearch';
import { useRole } from '../hooks/useRole';
import { UserPlus, Search } from 'lucide-react';

export function PatientListPage() {
  const { can } = useRole();

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-surface-800">Patients</h2>
          <p className="text-sm text-surface-500 hidden sm:block">Recherchez et gérez les dossiers patients</p>
        </div>
        {can('canCreatePatient') && (
          <Link to="/patients/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-xl 
              hover:bg-primary-600 transition-all text-sm font-medium sm:w-auto">
            <UserPlus size={18} />
            <span className="hidden sm:inline">Nouveau patient</span>
            <span className="sm:hidden">+ Patient</span>
          </Link>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <Search size={20} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-surface-800">Rechercher un patient</h3>
            <p className="text-sm text-surface-500">Par nom, prénom ou numéro de téléphone</p>
          </div>
        </div>
        <PatientSearch />
      </div>

      {/* Information */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-start gap-3">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-primary-600 text-sm"></span>
        </div>
        <p className="text-sm text-primary-700">
          Utilisez la barre de recherche ci-dessus pour trouver un patient par son nom ou son numéro de téléphone. 
          Tapez au moins 2 caractères pour lancer la recherche.
        </p>
      </div>
    </div>
  );
}