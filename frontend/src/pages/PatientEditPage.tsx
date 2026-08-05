import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPatient, updatePatient } from '../api/patients';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';

export function PatientEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = useRole();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', phoneNumber: '', dateOfBirth: '',
    sex: '', bloodGroup: '', profession: '', maritalStatus: '',
    nationality: '', countryOfOrigin: '', cityOfResidence: '',
    neighborhood: '', idCardNumber: '', email: '',
    allergies: '', medicalHistory: '',
  });

  useEffect(() => {
    if (!id) return;
    getPatient(id)
      .then((p) => {
        setForm({
          firstName: p.firstName, lastName: p.lastName, phoneNumber: p.phoneNumber,
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
          sex: p.sex || '', bloodGroup: p.bloodGroup || '',
          profession: p.profession || '', maritalStatus: p.maritalStatus || '',
          nationality: p.nationality || '', countryOfOrigin: p.countryOfOrigin || '',
          cityOfResidence: p.cityOfResidence || '', neighborhood: p.neighborhood || '',
          idCardNumber: p.idCardNumber || '', email: p.email || '',
          allergies: p.allergies || '', medicalHistory: p.medicalHistory || '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSaving(true);

    try {
      await updatePatient(id, {
        ...form,
        dateOfBirth: form.dateOfBirth || null,
        sex: (form.sex as 'MALE' | 'FEMALE' | null) || null,
        bloodGroup: form.bloodGroup || null,
        maritalStatus: (form.maritalStatus as 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF' | null) || null,
        isMinor: false,
        parentId: null,
      });
      setSuccess('Patient mis à jour avec succès.');
      setTimeout(() => navigate(`/patients/${id}`), 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  if (!can('canCreatePatient')) {
    return <Navigate to="/patients" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/patients/${id}`} className="text-primary-600 hover:text-primary-700">← Retour</Link>
        <h2 className="text-2xl font-heading font-bold text-surface-800">Modifier le patient</h2>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-8">
        {/* Identité */}
        <fieldset>
          <legend className="text-lg font-heading font-semibold text-surface-700 mb-4 border-b pb-2">Identité</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Prénom *</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Nom *</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Téléphone *</label>
              <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Date de naissance</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Sexe</label>
              <select name="sex" value={form.sex} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">--</option>
                <option value="MALE">Masculin</option>
                <option value="FEMALE">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Groupe sanguin</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">--</option>
                <option value="A_POSITIVE">A+</option><option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option><option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option><option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option><option value="O_NEGATIVE">O-</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* Infos complémentaires */}
        <fieldset>
          <legend className="text-lg font-heading font-semibold text-surface-700 mb-4 border-b pb-2">Informations complémentaires</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Profession</label>
              <input type="text" name="profession" value={form.profession} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Statut matrimonial</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                <option value="">--</option>
                <option value="CELIBATAIRE">Célibataire</option>
                <option value="MARIE">Marié(e)</option>
                <option value="DIVORCE">Divorcé(e)</option>
                <option value="VEUF">Veuf/Veuve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Nationalité</label>
              <input type="text" name="nationality" value={form.nationality} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Pays d'origine</label>
              <input type="text" name="countryOfOrigin" value={form.countryOfOrigin} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Ville de résidence</label>
              <input type="text" name="cityOfResidence" value={form.cityOfResidence} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Quartier</label>
              <input type="text" name="neighborhood" value={form.neighborhood} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">N° CNI</label>
              <input type="text" name="idCardNumber" value={form.idCardNumber} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
        </fieldset>

        {/* Médical */}
        <fieldset>
          <legend className="text-lg font-heading font-semibold text-surface-700 mb-4 border-b pb-2">Informations médicales</legend>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Allergies</label>
              <textarea name="allergies" value={form.allergies} onChange={handleChange} rows={2}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Antécédents médicaux</label>
              <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={3}
                className="w-full px-3 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link to={`/patients/${id}`} className="px-4 py-2 border border-surface-300 text-surface-700 rounded-xl hover:bg-surface-50">
            Annuler
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 font-medium">
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}