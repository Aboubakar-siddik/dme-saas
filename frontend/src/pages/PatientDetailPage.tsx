import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient } from '../api/patients';
import type { Patient } from '../types/patient';
import { getPatientHistory } from '../api/visits';
import type { Visit } from '../types/visit';
import { useRole } from '../hooks/useRole';



// Remplacer le bouton



export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const { can } = useRole();
useEffect(() => {
  if (!id) return;

  setLoading(true);
  Promise.all([
    getPatient(id),
    getPatientHistory(id)
  ])
    .then(([patientData, historyData]) => {
      setPatient(patientData);
      setVisits(historyData);
    })
    .catch(() => setError('Patient introuvable.'))
    .finally(() => setLoading(false));
}, [id]);

  // État de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Erreur
  if (error || !patient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error || 'Patient introuvable.'}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            ← Retour
          </Link>

            {can('canCreatePatient') && (
            <Link
              to={`/patients/${patient.id}/edit`}
              className="px-3 py-1.5 text-sm bg-surface-100 text-surface-700 rounded-xl hover:bg-surface-200 transition-colors"
            >
              ✏️ Modifier
            </Link>
          )}

          <h2 className="text-2xl font-bold text-gray-800">
            {patient.firstName} {patient.lastName}
          </h2>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Dossier actif
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Infos identité */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte Identité */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Identité</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Nom complet</dt>
                <dd className="font-medium">{patient.firstName} {patient.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Téléphone</dt>
                <dd className="font-medium">{patient.phoneNumber}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Date de naissance</dt>
                <dd className="font-medium">
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')
                    : 'Non renseigné'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Sexe</dt>
                <dd className="font-medium">
                  {patient.sex === 'MALE' ? 'Masculin' : patient.sex === 'FEMALE' ? 'Féminin' : 'Non renseigné'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Groupe sanguin</dt>
                <dd className="font-medium">
                  {patient.bloodGroup ? patient.bloodGroup.replace(/_/g, ' ') : 'Non renseigné'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Colonne droite : Infos médicales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerte Allergies */}
          {patient.allergies && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <h3 className="font-bold text-red-700 flex items-center space-x-2">
                <span></span>
                <span>Allergies connues</span>
              </h3>
              <p className="text-red-600 mt-1">{patient.allergies}</p>
            </div>
          )}

          {/* Carte Antécédents */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Antécédents médicaux</h3>
            {patient.medicalHistory ? (
              <p className="text-gray-600 whitespace-pre-wrap">{patient.medicalHistory}</p>
            ) : (
              <p className="text-gray-400 italic">Aucun antécédent renseigné.</p>
            )}
          </div>

          {/* Carte Consultations (placeholder pour le futur) */}
          {/* Carte Consultations */}
<div className="bg-white shadow rounded-lg p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-700">Historique des consultations</h3>
    {can('canCreateVisit') && (
        <Link to={`/patients/${patient.id}/new-visit`} className="...">
          + Nouvelle visite
        </Link>
      )}

      {can('canCreateVisit') && (
        <Link to={`/patients/${patient.id}/card`} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
           Carnet
        </Link>
      )}
  </div>
  

  {visits.length === 0 ? (
    <div className="text-center py-8 text-gray-400">
      <p className="text-4xl mb-2"></p>
      <p>Aucune consultation enregistrée</p>
      <p className="text-sm mt-1">Créez une nouvelle visite pour commencer.</p>
    </div>
  ) : (
    <div className="space-y-3">
      {visits.map((visit) => (
        <Link
          key={visit.id}
          to={`/visits/${visit.id}`}
          className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">
                {new Date(visit.visitDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                visit.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : visit.status === 'IN_PROGRESS'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
              </span>
            </div>
            {visit.fee && (
              <span className="text-sm font-medium text-gray-600">{visit.fee.toLocaleString()} FCFA</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{visit.reason}</p>
          {visit.diagnosis && (
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium">Diagnostic :</span> {visit.diagnosis}
            </p>
          )}
        </Link>
      ))}
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  );
}