import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  // Charger les paramètres actuels
  useEffect(() => {
    axios.get('/api/v1/clinic/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setForm({
          name: res.data.name || '',
          address: res.data.address || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
        });
        if (res.data.logo) {
          setLogoPreview(res.data.logo);
          setLogoFile(res.data.logo);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Le logo ne doit pas dépasser 2 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      setLogoFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await axios.patch('/api/v1/clinic/settings', {
        ...form,
        logo: logoFile,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Paramètres mis à jour avec succès.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la mise à jour.');
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">← Tableau de bord</Link>
        <h2 className="text-2xl font-bold text-gray-800">Paramètres</h2>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6 space-y-6">
        {/* Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'établissement</label>
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl">🏥</span>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                📁 Changer le logo
                <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logoFile && (
                <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                  className="ml-3 text-sm text-red-600 hover:text-red-700">Supprimer</button>
              )}
              <p className="text-xs text-gray-400 mt-1">PNG, JPEG ou SVG. Max 2 Mo.</p>
            </div>
          </div>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'établissement *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input type="text" name="address" value={form.address} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Bouton */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}