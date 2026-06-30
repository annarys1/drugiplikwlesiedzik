import { useNavigate } from 'react-router-dom';

export default function GminaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Gminy</h1>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Zarządzaj dyrektorami</h2>
            <p className="text-sm text-gray-500 mt-1">Utwórz nowe konto dostępowe dla dyrektora placówki.</p>
          </div>
          <button
            onClick={() => navigate('/panel/gmina/dodaj-dyrektora')}
            className="mt-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
          >
            Dodaj dyrektora →
          </button>
        </div>

        
      </div>
    </div>
  );
}