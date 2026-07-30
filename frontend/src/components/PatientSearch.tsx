import { useState, useEffect, useRef } from 'react';
import { searchPatients } from '../api/patients';
import type { Patient } from '../types/patient';
import { Link } from 'react-router-dom';

export function PatientSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Nettoyer le timeout à la destruction du composant
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    // Annuler le précédent debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    // Debounce : attendre 300ms après la dernière frappe
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await searchPatients(value);
        setResults(result.data);
      } catch (error) {
        console.error('Erreur recherche:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Rechercher un patient (nom ou téléphone)..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
      
      {/* Indicateur de chargement */}
      {loading && (
        <div className="absolute right-3 top-2.5">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Résultats de la recherche */}
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((patient) => (
            <Link
              key={patient.id}
              to={`/patients/${patient.id}`}
              className="block px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
            >
              <div className="font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="text-sm text-gray-500">
                {patient.phoneNumber}
                {patient.bloodGroup && ` · ${patient.bloodGroup.replace('_', ' ')}`}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Aucun résultat */}
      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          Aucun patient trouvé
        </div>
      )}
    </div>
  );
}