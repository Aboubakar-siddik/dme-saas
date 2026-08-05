import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPatient } from '../api/patients';
import { useRole } from '../hooks/useRole';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';


export function PatientCreatePage() {
  const navigate = useNavigate();
  const { can } = useRole();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    sex: '',
    bloodGroup: '',
    profession: '',
    maritalStatus: '',
    nationality: '',
    countryOfOrigin: '',
    cityOfResidence: '',
    neighborhood: '',
    idCardNumber: '',
    email: '',
    allergies: '',
    medicalHistory: '',
  });

  if (!can('canCreatePatient')) {
    return <Navigate to="/patients" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.phoneNumber) {
      setError('Le nom, prénom et numéro de téléphone sont obligatoires.');
      return;
    }

    setLoading(true);
    try {
    const patient = await createPatient({
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth || null,
      sex: (form.sex as 'MALE' | 'FEMALE' | null) || null,
      bloodGroup: form.bloodGroup || null,
      profession: form.profession || null,
      maritalStatus: (form.maritalStatus as 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF' | null) || null,
      nationality: form.nationality || null,
      countryOfOrigin: form.countryOfOrigin || null,
      cityOfResidence: form.cityOfResidence || null,
      neighborhood: form.neighborhood || null,
      idCardNumber: form.idCardNumber || null,
      email: form.email || null,
      isMinor: false,
      parentId: null,
      imn: null,        // ← Ajoute cette ligne
      allergies: form.allergies || null,
      medicalHistory: form.medicalHistory || null,
    });
      navigate(`/patients/${patient.id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erreur lors de la création du patient.';
      setError(typeof message === 'string' ? message : message.join(', '));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/patients" className="text-blue-600 hover:text-blue-700">← Retour</Link>
        <h2 className="text-2xl font-bold text-gray-800">Nouveau patient</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-8">
        
        {/* ===== IDENTITÉ ===== */}
        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Identité</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
              <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="691234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
              <select name="sex" value={form.sex} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">-- Sélectionner --</option>
                <option value="MALE">Masculin</option>
                <option value="FEMALE">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">-- Sélectionner --</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ===== INFORMATIONS COMPLÉMENTAIRES ===== */}
        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informations complémentaires</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input type="text" name="profession" value={form.profession} onChange={handleChange} placeholder="Ex: Enseignant"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut matrimonial</label>
              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">-- Sélectionner --</option>
                <option value="CELIBATAIRE">Célibataire</option>
                <option value="MARIE">Marié(e)</option>
                <option value="DIVORCE">Divorcé(e)</option>
                <option value="VEUF">Veuf/Veuve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
              <input type="text" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Ex: Camerounaise"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays d'origine</label>
              <input type="text" name="countryOfOrigin" value={form.countryOfOrigin} onChange={handleChange} placeholder="Ex: Cameroun"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville de résidence</label>
              <input type="text" name="cityOfResidence" value={form.cityOfResidence} onChange={handleChange} placeholder="Ex: Garoua"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
              <input type="text" name="neighborhood" value={form.neighborhood} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° CNI</label>
              <input type="text" name="idCardNumber" value={form.idCardNumber} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </fieldset>

        {/* ===== INFORMATIONS MÉDICALES ===== */}
        <fieldset>
          <legend className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informations médicales</legend>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <textarea name="allergies" value={form.allergies} onChange={handleChange} rows={2}
                placeholder="Ex: Pénicilline, Arachides..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents médicaux</label>
              <textarea name="medicalHistory" value={form.medicalHistory} onChange={handleChange} rows={3}
                placeholder="Ex: Diabète type 2 diagnostiqué en 2020..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
          </div>
        </fieldset>

        {/* ===== BOUTONS ===== */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Link to="/patients" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le patient'}
            </Button>
        </div>
      </form>
    </div>
  );
}