import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PatientListPage } from './pages/PatientListPage';
import { PatientCreatePage } from './pages/PatientCreatePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              DME SaaS
            </a>
            <nav className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Patients</a>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/new" element={<PatientCreatePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;