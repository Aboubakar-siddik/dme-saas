import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWaitingQueue } from '../api/visits';
import type { Visit } from '../types/visit';

export function WaitingQueuePage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWaitingQueue()
      .then(setVisits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">File d'attente</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {visits.length} patient{visits.length !== 1 ? 's' : ''}
        </span>
      </div>

      {visits.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center text-gray-400">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-lg">Aucun patient en attente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Link
              key={visit.id}
              to={`/visits/${visit.id}`}
              className="block bg-white shadow rounded-lg p-5 hover:shadow-md transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {visit.patient?.firstName} {visit.patient?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{visit.patient?.phoneNumber}</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {new Date(visit.visitDate).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              
              <div className="mt-3 flex items-center space-x-4">
                <span className="text-sm text-gray-600">{visit.reason}</span>
              </div>

              {visit.patient?.allergies && (
                <div className="mt-2 px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full inline-block">
                  ⚠️ {visit.patient.allergies}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}