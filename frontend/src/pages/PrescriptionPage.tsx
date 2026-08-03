import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVisit } from '../api/visits';
import type { Visit } from '../types/visit';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';


export function PrescriptionPage() {
  const { id } = useParams<{ id: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [clinicName, setClinicName] = useState('Clinique');
  const [doctorName, setDoctorName] = useState('');
  const { can } = useRole();
  if (!can('canGeneratePrescription')) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    if (!id) return;

    // Charger la visite
    getVisit(id)
      .then((v) => {
        setVisit(v);
        // Récupérer le profil pour avoir le nom du médecin
        const token = localStorage.getItem('token');
        if (token) {
          fetch('/api/v1/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((user) => {
              setDoctorName(`Dr ${user.firstName} ${user.lastName}`);
              setClinicName(user.clinic?.name || 'Clinique');
            })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Parser la prescription en lignes
  const parsePrescription = (text: string | null): string[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 no-print">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!visit) {
    return <p className="text-red-500 no-print">Visite introuvable.</p>;
  }

  const prescriptions = parsePrescription(visit.prescription);
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Boutons d'action (cachés à l'impression) */}
      <div className="max-w-2xl mx-auto mb-6 no-print space-x-3 flex">
        <Link
          to={`/visits/${id}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← Retour
        </Link>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🖨️ Imprimer l'ordonnance
        </button>
      </div>

      {/* Ordonnance (format A5 simulé) */}
      <div className="max-w-2xl mx-auto bg-white print:shadow-none print:max-w-full print:mx-0">
        <div className="border-2 border-gray-800 rounded-lg p-8 print:border-none print:p-0">
          {/* En-tête */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6 print:border-b print:pb-2 print:mb-4">
            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wider print:text-lg">
              {clinicName}
            </h1>
            <p className="text-sm text-gray-600 mt-1 print:text-xs">
              Ordonnance Médicale
            </p>
          </div>

          {/* Infos patient et date */}
          <div className="flex justify-between mb-6 print:mb-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">Patient :</span>{' '}
                {visit.patient?.firstName} {visit.patient?.lastName}
              </p>
              {visit.patient?.dateOfBirth && (
                <p className="text-gray-600 mt-1 print:text-xs">
                  Né(e) le : {new Date(visit.patient.dateOfBirth).toLocaleDateString('fr-FR')}
                  {visit.patient?.sex === 'MALE' ? ' (M)' : visit.patient?.sex === 'FEMALE' ? ' (F)' : ''}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">Date : {today}</p>
            </div>
          </div>

          {/* Ligne de prescription */}
          <div className="mb-8 print:mb-6">
            <p className="text-sm font-semibold mb-2 print:text-xs">Prescription :</p>
            {prescriptions.length > 0 ? (
              <ul className="space-y-2 print:space-y-1">
                {prescriptions.map((line, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-sm border-b border-gray-200 pb-2 print:border-dashed print:text-xs"
                  >
                    <span className="font-bold text-gray-500 w-5 print:w-4">{index + 1}.</span>
                    <span className="flex-1">{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic text-sm">Aucune prescription renseignée.</p>
            )}
          </div>

          {/* Diagnostic (rappel pour le pharmacien) */}
          {visit.diagnosis && (
            <div className="mb-8 print:mb-6 p-4 bg-gray-50 rounded-lg print:bg-transparent print:p-0 print:border-t print:pt-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Diagnostic</p>
              <p className="text-sm font-medium text-gray-700">{visit.diagnosis}</p>
            </div>
          )}

          {/* Pied de page */}
          <div className="flex justify-between items-end mt-12 print:mt-8 pt-6 border-t-2 border-gray-800 print:pt-4 print:border-t">
            <div>
              <p className="text-xs text-gray-500 print:text-[10px]">
                Ordonnance valable 3 mois
              </p>
              <p className="text-xs text-gray-500 print:text-[10px]">
                En cas d'urgence, contacter la clinique
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-12 border-b border-gray-800 mb-1 print:w-24 print:h-10"></div>
              <p className="text-sm font-semibold print:text-xs">{doctorName}</p>
              <p className="text-xs text-gray-500 print:text-[10px]">Médecin traitant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles d'impression globaux */}
      <style>{`
        @media print {
          body {
            background: white !important;
            font-size: 12px;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A5;
            margin: 10mm;
          }
        }
      `}</style>
    </>
  );
}