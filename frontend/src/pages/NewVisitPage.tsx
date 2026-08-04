import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createVisit } from '../api/visits';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';

export function NewVisitPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { can } = useRole();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    weight: '',
    height: '',
    bloodSugar: '',
  });

  if (!can('canCreateVisit')) {
    return <Navigate to="/patients" replace />;
  }

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !patientId) return;

    setLoading(true);
    setError('');
    try {
      const visit = await createVisit(patientId, reason, {
        bloodPressure: vitals.bloodPressure || null,
        heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : null,
        respiratoryRate: vitals.respiratoryRate ? parseInt(vitals.respiratoryRate) : null,
        oxygenSaturation: vitals.oxygenSaturation ? parseInt(vitals.oxygenSaturation) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        weight: vitals.weight ? parseFloat(vitals.weight) : null,
        height: vitals.height ? parseFloat(vitals.height) : null,
        bloodSugar: vitals.bloodSugar ? parseFloat(vitals.bloodSugar) : null,
      });
      navigate(`/visits/${visit.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/patients/${patientId}`} className="text-blue-600 hover:text-blue-700">← Retour</Link>
        <h2 className="text-2xl font-bold text-gray-800">Nouvelle visite</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-6">
        
        {/* Motif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motif de la visite <span className="text-red-500">*</span>
          </label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
            placeholder="Décrivez le motif de la consultation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" required />
        </div>

        {/* Paramètres vitaux */}
        <fieldset className="border border-gray-200 rounded-lg p-4">
          <legend className="text-sm font-semibold text-gray-700 px-2 bg-white">Paramètres vitaux</legend>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">PA (mmHg)</label>
              <input type="text" name="bloodPressure" value={vitals.bloodPressure} onChange={handleVitalsChange}
                placeholder="120/80" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">FC (bpm)</label>
              <input type="number" name="heartRate" value={vitals.heartRate} onChange={handleVitalsChange}
                placeholder="72" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">FR (c/min)</label>
              <input type="number" name="respiratoryRate" value={vitals.respiratoryRate} onChange={handleVitalsChange}
                placeholder="16" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SpO₂ (%)</label>
              <input type="number" name="oxygenSaturation" value={vitals.oxygenSaturation} onChange={handleVitalsChange}
                placeholder="98" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Température (°C)</label>
              <input type="number" step="0.1" name="temperature" value={vitals.temperature} onChange={handleVitalsChange}
                placeholder="37.0" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Poids (kg)</label>
              <input type="number" step="0.1" name="weight" value={vitals.weight} onChange={handleVitalsChange}
                placeholder="70" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Taille (cm)</label>
              <input type="number" name="height" value={vitals.height} onChange={handleVitalsChange}
                placeholder="170" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Glycémie (g/L)</label>
              <input type="number" step="0.1" name="bloodSugar" value={vitals.bloodSugar} onChange={handleVitalsChange}
                placeholder="1.0" className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </fieldset>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link to={`/patients/${patientId}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Annuler
          </Link>
          <button type="submit" disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Création...' : 'Ajouter à la file d\'attente'}
          </button>
        </div>
      </form>
    </div>
  );
}