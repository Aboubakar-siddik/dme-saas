import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alreadySetup, setAlreadySetup] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<string | null>(null); // base64

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
  });

  useEffect(() => {
    axios.get('/api/v1/clinic/is-setup')
      .then(res => {
        if (res.data.configured) {
          setAlreadySetup(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Gérer l'upload du logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille (max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      setError('Le logo ne doit pas dépasser 2 Mo.');
      return;
    }

    // Vérifier le type
    if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
      setError('Format accepté : PNG, JPEG, SVG.');
      return;
    }

    // Convertir en base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      setLogoFile(reader.result as string);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/v1/clinic/setup', {
        ...form,
        logo: logoFile, // Envoi du logo en base64
      });
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la configuration.');
    } finally {
      setLoading(false);
    }
  };

  if (alreadySetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">DME SaaS</h1>
          <p className="text-gray-500 mb-6">La plateforme est déjà configurée.</p>
          <a href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">DME SaaS</h1>
          <p className="text-gray-500 mt-2">Configuration initiale</p>
        </div>

        {/* Étapes */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mb-6">
          {step === 1 ? 'Informations établissement' : step === 2 ? 'Logo de l\'établissement' : 'Compte administrateur'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Étape 1 : Infos clinique */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la clinique *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input type="text" name="address" value={form.address} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Suivant →</button>
              </div>
            </div>
          )}

          {/* Étape 2 : Logo */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Ajoutez le logo de votre établissement. Il apparaîtra sur les ordonnances, certificats et dans l'en-tête.
                </p>

                {/* Preview du logo */}
                <div className="mb-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="mx-auto max-h-32 rounded-lg border" />
                  ) : (
                    <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🏥</span>
                    </div>
                  )}
                </div>

                {/* Input file */}
                <label className="cursor-pointer inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  📁 Choisir un logo
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
                </label>
                {logoFile && (
                  <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); }}
                    className="ml-3 text-sm text-red-600 hover:text-red-700">Supprimer</button>
                )}
                <p className="text-xs text-gray-400 mt-2">PNG, JPEG ou SVG. Max 2 Mo.</p>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">← Retour</button>
                <button type="button" onClick={() => setStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Suivant →</button>
              </div>
            </div>
          )}

          {/* Étape 3 : Compte admin */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" name="adminFirstName" value={form.adminFirstName} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" name="adminLastName" value={form.adminLastName} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email admin *</label>
                <input type="email" name="adminEmail" value={form.adminEmail} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <input type="password" name="adminPassword" value={form.adminPassword} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required minLength={6} />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">← Retour</button>
                <button type="submit" disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  {loading ? 'Configuration...' : 'Finaliser la configuration'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}