import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PatientListPage } from './pages/PatientListPage';
import { PatientCreatePage } from './pages/PatientCreatePage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { WaitingQueuePage } from './pages/WaitingQueuePage';
import { VisitDetailPage } from './pages/VisitDetailPage';
import { NewVisitPage } from './pages/NewVisitPage';
import { LoginPage } from './pages/LoginPage';
import { PrescriptionPage } from './pages/PrescriptionPage';
import { UsersPage } from './pages/UsersPage';
import { DashboardPage } from './pages/DashboardPage';
import { useRole } from './hooks/useRole';
import { SetupPage } from './pages/SetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { PatientCardPage } from './pages/PatientCardPage';
import { PatientEditPage } from './pages/PatientEditPage';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Timer, UserCog, Settings, LogOut } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  const { user, logout } = useAuth();
  const { can } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  <div className="min-h-screen bg-gray-50 relative">
      {/* Logo Ministère en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.03]">
        <svg viewBox="0 0 100 100" className="w-96 h-96">
          <rect x="35" y="10" width="30" height="80" fill="#CE1126" rx="5" />
          <rect x="10" y="35" width="80" height="30" fill="#CE1126" rx="5" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#007A5E" strokeWidth="3" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/dashboard" className="flex items-center space-x-3 flex-shrink-0">
                {user?.clinic?.logo ? (
                  <img src={user.clinic.logo} alt={user.clinic.name} className="w-9 h-9 rounded-xl object-contain bg-white border" />
                ) : (
                  <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-heading font-bold">+</span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <h1 className="text-base font-heading font-bold text-primary-700 leading-tight">
                    {user?.clinic?.name || 'DME SaaS'}
                  </h1>
                  <p className="text-xs text-surface-500">Santé Numérique</p>
                </div>
              </Link>

              {/* Navigation desktop */}
              <nav className="hidden md:flex items-center space-x-1">
                {can('canViewDashboard') && (
                  <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5">
                    <LayoutDashboard size={16} /> Tableau de bord
                  </Link>
                )}
                {can('canViewPatients') && (
                  <Link to="/patients" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5">
                    <Users size={16} /> Patients
                  </Link>
                )}
                {can('canViewQueue') && (
                  <Link to="/queue" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5">
                    <Timer size={16} /> File d'attente
                  </Link>
                )}
                {can('canManageUsers') && (
                  <Link to="/users" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5">
                    <UserCog size={16} /> Utilisateurs
                  </Link>
                )}
                {can('canManageSettings') && (
                  <Link to="/settings" className="px-3 py-2 text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-1.5">
                    <Settings size={16} /> Paramètres
                  </Link>
                )}

                
              </nav>

              {/* Profil + Bouton mobile */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-surface-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-surface-500">{user?.role === 'ADMIN' ? 'Admin' : user?.role === 'DOCTOR' ? 'Médecin' : 'Secrétaire'}</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-heading font-bold text-sm">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  </div>
                  <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Déconnexion
                </button>
                </div>

                {/* Bouton hamburger mobile */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-lg"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <nav className="px-4 py-3 space-y-1">
                {can('canViewDashboard') && (
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-surface-700 hover:bg-primary-50 rounded-xl font-medium">
                    <LayoutDashboard size={20} /> Tableau de bord
                  </Link>
                )}
                {can('canViewPatients') && (
                  <Link to="/patients" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-surface-700 hover:bg-primary-50 rounded-xl font-medium">
                    <Users size={20} /> Patients
                  </Link>
                )}
                {can('canViewQueue') && (
                  <Link to="/queue" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-surface-700 hover:bg-primary-50 rounded-xl font-medium">
                    <Timer size={20} /> File d'attente
                  </Link>
                )}
                {can('canManageUsers') && (
                  <Link to="/users" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-surface-700 hover:bg-primary-50 rounded-xl font-medium">
                    <UserCog size={20} /> Utilisateurs
                  </Link>
                )}
                {can('canManageSettings') && (
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 text-surface-700 hover:bg-primary-50 rounded-xl font-medium">
                    <Settings size={20} /> Paramètres
                  </Link>
                )}
                <hr className="my-2" />
                <button onClick={logout} className="flex items-center gap-1 text-sm text-danger-500 font-medium">
                  <LogOut size={16} /> Déconnexion
                </button>
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-surface-500">{user?.role === 'ADMIN' ? 'Admin' : user?.role === 'DOCTOR' ? 'Médecin' : 'Secrétaire'}</p>
                  </div>
                  <button onClick={logout} className="flex items-center gap-1 text-sm text-danger-500 font-medium">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              </nav>
            </div>
          )}
        </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientListPage /></ProtectedRoute>} />
          <Route path="/patients/new" element={<ProtectedRoute><PatientCreatePage /></ProtectedRoute>} />
          <Route path="/patients/:id" element={<ProtectedRoute><PatientDetailPage /></ProtectedRoute>} />
          <Route path="/patients/:patientId/new-visit" element={<ProtectedRoute><NewVisitPage /></ProtectedRoute>} />
          <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientEditPage /></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><WaitingQueuePage /></ProtectedRoute>} />
          <Route path="/visits/:id" element={<ProtectedRoute><VisitDetailPage /></ProtectedRoute>} />
          <Route path="/visits/:id/prescription" element={<ProtectedRoute><PrescriptionPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/patients/:id/card" element={<ProtectedRoute><PatientCardPage /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="text-center py-12">
              <p className="text-5xl font-bold text-gray-300 mb-4">404</p>
              <p className="text-gray-500 mb-4">Page introuvable</p>
              <Link to="/dashboard" className="text-blue-600 hover:underline">Retour au tableau de bord</Link>
            </div>
          } />
        </Routes>
      </main>
    </div>
  </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;