import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PatientListPage } from './pages/PatientListPage';
import { PatientCreatePage } from './pages/PatientCreatePage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { WaitingQueuePage } from './pages/WaitingQueuePage';
import { VisitDetailPage } from './pages/VisitDetailPage';
import { NewVisitPage } from './pages/NewVisitPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              DME SaaS
            </Link>
            <nav className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Patients</Link>
              <Link to="/queue" className="text-gray-600 hover:text-gray-900">File d'attente</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/new" element={<PatientCreatePage />} />
            <Route path="/patients/:id" element={<PatientDetailPage />} />
            <Route path="/patients/:patientId/new-visit" element={<NewVisitPage />} />
            <Route path="/queue" element={<WaitingQueuePage />} />
            <Route path="/visits/:id" element={<VisitDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;