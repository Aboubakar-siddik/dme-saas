import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { createVisit } from '../api/visits';

export function NewVisitPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || !patientId) return;
    
    setLoading(true);
    setError('');
    try {
      const visit = await createVisit(patientId, reason);
      navigate(`/visits/${visit.id}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/patients/${patientId}`} className="text-blue-600 hover:text-blue-700">← Retour</Link>
        <h2 className="text-2xl font-bold text-gray-800">Nouvelle visite</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motif de la visite <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Décrivez le motif de la consultation..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Link to={`/patients/${patientId}`} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Annuler
          </Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Création...' : 'Créer la visite'}
          </button>
        </div>
      </form>
    </div>
  );
}