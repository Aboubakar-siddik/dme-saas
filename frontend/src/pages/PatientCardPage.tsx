import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatient } from '../api/patients';
import { getPatientHistory } from '../api/visits';
import type { Patient } from '../types/patient';
import type { Visit } from '../types/visit';

export function PatientCardPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([getPatient(id), getPatientHistory(id)])
      .then(([p, v]) => { setPatient(p); setVisits(v); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  if (loading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!patient) return <p className="text-red-500">Patient introuvable.</p>;

  return (
    <>
      {/* Boutons d'action (cachés à l'impression) */}
      <div className="max-w-2xl mx-auto mb-6 no-print flex space-x-3">
        <Link to={`/patients/${id}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">← Retour</Link>
        <button onClick={handlePrint} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🖨️ Imprimer le carnet</button>
      </div>

      {/* Carnet patient (format impression) */}
      <div className="max-w-2xl mx-auto bg-white print:shadow-none print:max-w-full">
        <div className="border-2 border-gray-800 rounded-lg p-8 print:border-none print:p-0">
          {/* En-tête */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider">Carnet de Santé</h1>
            <p className="text-sm text-gray-600 mt-1">Dossier Médical Électronique</p>
          </div>

          {/* Identité patient */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">Identité du Patient</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">Nom :</span> {patient.lastName}</div>
              <div><span className="font-semibold">Prénom :</span> {patient.firstName}</div>
              <div><span className="font-semibold">Téléphone :</span> {patient.phoneNumber}</div>
              <div><span className="font-semibold">Date de naissance :</span> {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('fr-FR') : 'N/A'}</div>
              <div><span className="font-semibold">Sexe :</span> {patient.sex === 'MALE' ? 'Masculin' : patient.sex === 'FEMALE' ? 'Féminin' : 'N/A'}</div>
              <div><span className="font-semibold">Groupe sanguin :</span> {patient.bloodGroup?.replace(/_/g, ' ') || 'N/A'}</div>
            </div>
          </div>

          {/* Allergies */}
          {patient.allergies && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded">
              <span className="font-bold text-red-700">⚠️ Allergies :</span> {patient.allergies}
            </div>
          )}

          {/* Antécédents */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">Antécédents Médicaux</h2>
            <p className="text-sm">{patient.medicalHistory || 'Aucun antécédent renseigné.'}</p>
          </div>

          {/* Historique des consultations */}
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">Historique des Consultations</h2>
            {visits.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune consultation enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {visits.map((visit, index) => (
                  <div key={visit.id} className="border border-gray-200 rounded p-3 text-sm">
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Consultation du {new Date(visit.visitDate).toLocaleDateString('fr-FR')}</span>
                      <span>{visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'WAITING' ? 'En attente' : 'En cours'}</span>
                    </div>
                    <p><span className="font-medium">Motif :</span> {visit.reason}</p>
                    {visit.diagnosis && <p><span className="font-medium">Diagnostic :</span> {visit.diagnosis}</p>}
                    {visit.prescription && <p><span className="font-medium">Prescription :</span> {visit.prescription}</p>}
                    {visit.observations && <p><span className="font-medium">Observations :</span> {visit.observations}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; font-size: 12px; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 15mm; }
        }
      `}</style>
    </>
  );
}