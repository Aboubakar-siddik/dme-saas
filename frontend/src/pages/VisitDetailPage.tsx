import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVisit, updateVisit } from '../api/visits';
import type { Visit } from '../types/visit';

export function VisitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formulaire
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [fee, setFee] = useState('');

  useEffect(() => {
    if (!id) return;
    getVisit(id)
      .then((v) => {
        setVisit(v);
        setObservations(v.observations || '');
        setDiagnosis(v.diagnosis || '');
        setPrescription(v.prescription || '');
        setFee(v.fee?.toString() || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateVisit(id, {
        observations,
        diagnosis,
        prescription,
        fee: fee ? parseFloat(fee) : null,
        status: 'COMPLETED',
      });
      navigate('/queue');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!visit) {
    return <p className="text-red-500">Visite introuvable.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-4">
        <Link to="/queue" className="text-blue-600 hover:text-blue-700">← File d'attente</Link>
        <h2 className="text-2xl font-bold text-gray-800">Consultation</h2>
      </div>

      {/* Infos patient */}
      <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {visit.patient?.firstName} {visit.patient?.lastName}
          </h3>
          <p className="text-sm text-gray-500">Motif : {visit.reason}</p>
        </div>
        <div className="text-right">
          {visit.patient?.bloodGroup && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {visit.patient.bloodGroup.replace(/_/g, ' ')}
            </span>
          )}
          {visit.patient?.allergies && (
            <div className="mt-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded">
              ⚠️ {visit.patient.allergies}
            </div>
          )}
        </div>
      </div>

      {/* Formulaire de consultation */}
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={4}
            placeholder="Notes d'examen clinique..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Ex: Angine bactérienne"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
          <textarea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            rows={3}
            placeholder="Ex: Amoxicilline 1g, 2x/jour, 7 jours"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Honoraires (FCFA)</label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="Ex: 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3">
          <Link
            to="/queue"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Terminer la consultation'}
          </button>
        </div>
      </div>
    </div>
  );
}