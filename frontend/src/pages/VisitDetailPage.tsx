import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVisit, updateVisit } from '../api/visits';
import type { Visit } from '../types/visit';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';

// Listes des systèmes
const GENERAL_SYSTEMS = [
  'Asthénie/Fatigue', 'Amaigrissement', 'Fièvre',
  'Céphalées', 'Vertiges', 'Convulsions',
  'Toux', 'Dyspnée', 'Expectorations',
  'Nausées', 'Vomissements', 'Diarrhée', 'Douleurs abdominales',
  'Dysurie', 'Pollakiurie', 'Hématurie',
  'Arthralgies', 'Myalgies',
  'Rash', 'Prurit', 'Lésions cutanées',
];

const CARDIO_SYSTEMS = [
  'Douleur thoracique', 'Palpitations', 'Dyspnée d\'effort',
  'Œdèmes des membres inférieurs', 'Claudication intermittente',
  'Toux persistante', 'Hémoptysie', 'Wheezing',
  'Orthopnée', 'Cyanose',
];

export function VisitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useRole();
  
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Consultation state
  const [anamnesis, setAnamnesis] = useState('');
  const [personalHistory, setPersonalHistory] = useState<boolean | null>(null);
  const [personalHistoryDetails, setPersonalHistoryDetails] = useState('');
  const [familyHistory, setFamilyHistory] = useState<boolean | null>(null);
  const [familyHistoryDetails, setFamilyHistoryDetails] = useState('');
  const [selectedGeneralSystems, setSelectedGeneralSystems] = useState<string[]>([]);
  const [selectedCardioSystems, setSelectedCardioSystems] = useState<string[]>([]);
  const [observations, setObservations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [bilan, setBilan] = useState('');
  const [prescription, setPrescription] = useState('');
  const [fee, setFee] = useState('');

  if (!can('canManageConsultation')) {
    return <Navigate to="/queue" replace />;
  }

  useEffect(() => {
    if (!id) return;
    getVisit(id)
      .then((v) => {
        setVisit(v);
        setAnamnesis(v.anamnesis || '');
        setPersonalHistory(v.personalHistory ?? null);
        setPersonalHistoryDetails(v.personalHistoryDetails || '');
        setFamilyHistory(v.familyHistory ?? null);
        setFamilyHistoryDetails(v.familyHistoryDetails || '');
        setSelectedGeneralSystems(v.generalSystems ? JSON.parse(v.generalSystems) : []);
        setSelectedCardioSystems(v.cardioSystems ? JSON.parse(v.cardioSystems) : []);
        setObservations(v.observations || '');
        setDiagnosis(v.diagnosis || '');
        setBilan(v.bilan || '');
        setPrescription(v.prescription || '');
        setFee(v.fee?.toString() || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSystem = (system: string, selected: string[], setSelected: (s: string[]) => void) => {
    if (selected.includes(system)) {
      setSelected(selected.filter(s => s !== system));
    } else {
      setSelected([...selected, system]);
    }
  };

  const handleSave = async (newStatus: string) => {
    if (!id) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateVisit(id, {
        anamnesis,
        personalHistory,
        personalHistoryDetails: personalHistory ? personalHistoryDetails : null,
        familyHistory,
        familyHistoryDetails: familyHistory ? familyHistoryDetails : null,
        generalSystems: selectedGeneralSystems.length > 0 ? JSON.stringify(selectedGeneralSystems) : null,
        cardioSystems: selectedCardioSystems.length > 0 ? JSON.stringify(selectedCardioSystems) : null,
        observations,
        diagnosis,
        bilan,
        prescription,
        fee: fee ? parseFloat(fee) : null,
        status: newStatus as 'WAITING' | 'IN_PROGRESS' | 'COMPLETED',
      });
      setSuccess(newStatus === 'COMPLETED' ? 'Consultation terminée avec succès.' : 'Brouillon sauvegardé.');
      if (newStatus === 'COMPLETED') {
        setTimeout(() => navigate('/queue'), 1500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la sauvegarde.');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/queue" className="text-blue-600 hover:text-blue-700">← File d'attente</Link>
          <h2 className="text-2xl font-bold text-gray-800">Consultation</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          visit.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
          visit.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {visit.status === 'COMPLETED' ? 'Terminée' : visit.status === 'IN_PROGRESS' ? 'En cours' : 'En attente'}
        </span>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>}

      {/* Infos patient + vitaux */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              {visit.patient?.firstName} {visit.patient?.lastName}
            </h3>
            <p className="text-sm text-gray-500">Motif : {visit.reason}</p>
            {visit.patient?.allergies && (
              <p className="text-sm text-red-600 mt-1">⚠️ Allergies : {visit.patient.allergies}</p>
            )}
            {visit.patient?.bloodGroup && (
              <p className="text-sm text-gray-500 mt-1">Groupe : {visit.patient.bloodGroup.replace(/_/g, ' ')}</p>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Paramètres vitaux</h4>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {visit.bloodPressure && <div><span className="text-gray-400">PA:</span> {visit.bloodPressure}</div>}
              {visit.heartRate && <div><span className="text-gray-400">FC:</span> {visit.heartRate} bpm</div>}
              {visit.respiratoryRate && <div><span className="text-gray-400">FR:</span> {visit.respiratoryRate} c/min</div>}
              {visit.oxygenSaturation && <div><span className="text-gray-400">SpO₂:</span> {visit.oxygenSaturation}%</div>}
              {visit.temperature && <div><span className="text-gray-400">T°:</span> {visit.temperature}°C</div>}
              {visit.weight && <div><span className="text-gray-400">Poids:</span> {visit.weight} kg</div>}
              {visit.height && <div><span className="text-gray-400">Taille:</span> {visit.height} cm</div>}
              {visit.bloodSugar && <div><span className="text-gray-400">Glycémie:</span> {visit.bloodSugar} g/L</div>}
              {!visit.bloodPressure && !visit.heartRate && <span className="text-gray-400 col-span-4">Aucun paramètre renseigné</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Anamnèse */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Anamnèse (description par le patient)</h3>
        <textarea value={anamnesis} onChange={(e) => setAnamnesis(e.target.value)} rows={3}
          placeholder="Le patient décrit ses symptômes..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
      </div>

      {/* Antécédents personnels */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Antécédents personnels</h3>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="personalHistory" checked={personalHistory === true} onChange={() => setPersonalHistory(true)}
              className="w-4 h-4 text-blue-600" /> <span className="text-sm">Oui</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="personalHistory" checked={personalHistory === false} onChange={() => { setPersonalHistory(false); setPersonalHistoryDetails(''); }}
              className="w-4 h-4 text-blue-600" /> <span className="text-sm">Non</span>
          </label>
        </div>
        {personalHistory && (
          <textarea value={personalHistoryDetails} onChange={(e) => setPersonalHistoryDetails(e.target.value)} rows={3}
            placeholder="Détaillez les antécédents personnels..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        )}
      </div>

      {/* Antécédents familiaux */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Antécédents familiaux</h3>
        <div className="flex space-x-4 mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="familyHistory" checked={familyHistory === true} onChange={() => setFamilyHistory(true)}
              className="w-4 h-4 text-blue-600" /> <span className="text-sm">Oui</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="radio" name="familyHistory" checked={familyHistory === false} onChange={() => { setFamilyHistory(false); setFamilyHistoryDetails(''); }}
              className="w-4 h-4 text-blue-600" /> <span className="text-sm">Non</span>
          </label>
        </div>
        {familyHistory && (
          <textarea value={familyHistoryDetails} onChange={(e) => setFamilyHistoryDetails(e.target.value)} rows={3}
            placeholder="Détaillez les antécédents familiaux..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        )}
      </div>

      {/* Systèmes généraux */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Systèmes généraux</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {GENERAL_SYSTEMS.map(system => (
            <label key={system} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input type="checkbox" checked={selectedGeneralSystems.includes(system)}
                onChange={() => toggleSystem(system, selectedGeneralSystems, setSelectedGeneralSystems)}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm">{system}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Système cardiovasculaire */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Système cardiovasculaire et respiratoire</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {CARDIO_SYSTEMS.map(system => (
            <label key={system} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input type="checkbox" checked={selectedCardioSystems.includes(system)}
                onChange={() => toggleSystem(system, selectedCardioSystems, setSelectedCardioSystems)}
                className="w-4 h-4 text-red-600 rounded" />
              <span className="text-sm">{system}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Résumé : Diagnostic, Bilan, Traitement */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Résumé de la consultation</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observations cliniques</label>
          <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows={3}
            placeholder="Notes d'examen clinique..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic</label>
          <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Ex: Angine bactérienne"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bilan (examens complémentaires demandés)</label>
          <textarea value={bilan} onChange={(e) => setBilan(e.target.value)} rows={2}
            placeholder="Ex: NFS, CRP, Radiographie thoracique..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Traitement (prescription)</label>
          <textarea value={prescription} onChange={(e) => setPrescription(e.target.value)} rows={3}
            placeholder="Ex: Amoxicilline 1g, 2x/jour, 7 jours"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Honoraires (FCFA)</label>
          <input type="number" value={fee} onChange={(e) => setFee(e.target.value)}
            placeholder="Ex: 5000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pb-8">
        <Link to="/queue" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          Annuler
        </Link>
        <button onClick={() => handleSave('IN_PROGRESS')} disabled={saving}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">
          {saving ? '...' : 'Sauvegarder brouillon'}
        </button>
        {(prescription || visit.prescription) && (
          <Link to={`/visits/${id}/prescription`}
            className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50">
            🖨️ Ordonnance
          </Link>
        )}
        <button onClick={() => handleSave('COMPLETED')} disabled={saving}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Terminer la consultation'}
        </button>
      </div>
    </div>
  );
}