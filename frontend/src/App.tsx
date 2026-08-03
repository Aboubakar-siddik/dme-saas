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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              DME SaaS
            </Link>
            <nav className="flex items-center space-x-6">
              {can('canViewDashboard') && (
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Tableau de bord
                </Link>
              )}
              {can('canViewPatients') && (
                <Link to="/patients" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Patients
                </Link>
              )}
              {can('canViewQueue') && (
                <Link to="/queue" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  File d'attente
                </Link>
              )}
              {can('canManageUsers') && (
                <Link to="/users" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Utilisateurs
                </Link>
              )}
              {can('canManageSettings') && (
                <Link to="/settings" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                  Paramètres
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {user?.firstName} {user?.lastName}
              <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {user?.role === 'ADMIN' ? 'Admin' : user?.role === 'DOCTOR' ? 'Médecin' : 'Secrétaire'}
              </span>
            </span>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><PatientListPage /></ProtectedRoute>} />
          <Route path="/patients/new" element={<ProtectedRoute><PatientCreatePage /></ProtectedRoute>} />
          <Route path="/patients/:id" element={<ProtectedRoute><PatientDetailPage /></ProtectedRoute>} />
          <Route path="/patients/:patientId/new-visit" element={<ProtectedRoute><NewVisitPage /></ProtectedRoute>} />
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