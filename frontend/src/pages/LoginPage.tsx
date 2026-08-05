import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier si la plateforme est configurée
  useEffect(() => {
  axios.get('/api/v1/clinic/is-setup')
    .then(res => {
      if (!res.data.configured) {
        navigate('/setup');
      }
    })
    .catch(() => {});
}, [navigate]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await login(email, password);
    
    // Rediriger selon le rôle
    const role = (response as any)?.user?.role;
    if (role === 'SECRETARY') {
      navigate('/patients');
    } else if (role === 'DOCTOR') {
      navigate('/queue');
    } else {
      navigate('/dashboard');
    }
  } catch (err: any) {
    setError(err?.response?.data?.message || 'Email ou mot de passe incorrect.');
  } finally {
    setLoading(false);
  }
};
return (
  <div className="min-h-screen flex items-center justify-center p-4"
    style={{
      background: 'linear-gradient(135deg, #0B6E99 0%, #2E8B57 50%, #F4B400 100%)',
    }}>
    <div className="w-full max-w-md">
      {/* Carte de login */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-heading font-bold text-2xl">+</span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-surface-800">DME SaaS</h1>
          <p className="text-surface-500 mt-1">Dossier Médical Électronique</p>
        </div>

        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@clinique.cm"
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl 
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none 
                transition-all text-surface-800 placeholder-surface-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl 
                focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none 
                transition-all text-surface-800 placeholder-surface-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white 
              rounded-xl hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 
              font-heading font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
      
      <p className="text-center text-white/70 text-sm mt-6">
        © 2026 DME SaaS — Santé Numérique pour le Cameroun
      </p>
    </div>
  </div>
);
}