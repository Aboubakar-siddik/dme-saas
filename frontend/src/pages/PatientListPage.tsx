import { Link } from 'react-router-dom';
import { PatientSearch } from '../components/PatientSearch';

export function PatientListPage() {
  return (
    <div className="space-y-6">
      {/* En-tête avec titre et bouton */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Patients</h2>
        <Link
          to="/patients/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouveau patient
        </Link>
      </div>

      {/* Barre de recherche */}
      <PatientSearch />

      {/* Message d'aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
        Utilisez la barre de recherche ci-dessus pour trouver un patient par son nom ou son numéro de téléphone.
      </div>
    </div>
  );
}