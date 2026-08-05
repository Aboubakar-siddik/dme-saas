import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'SECRETARY';
  firstName: string;
  lastName: string;
  clinicId: string;
  clinic: {
    id: string;
    name: string;
    logo?: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Vérifier si le token est encore valide au chargement
  useEffect(() => {
    if (token) {
      axios.get('/api/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
  const response = await axios.post('/api/v1/auth/login', { email, password });
  const { accessToken, user: userData } = response.data;
  localStorage.setItem('token', accessToken);
  setToken(accessToken);
  setUser(userData);
  return response.data; // ← Doit retourner les données
};

  const logout = () => {
  localStorage.removeItem('token');
  setToken(null);
  setUser(null);
  // Redirection forcée vers login (sans React Router pour éviter les problèmes)
  window.location.href = '/login';
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}