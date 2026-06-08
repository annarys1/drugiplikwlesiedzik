import { useNavigate } from 'react-router-dom';

export default function ParentDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel Rodzica</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Karta: Złóż wniosek */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Złóż nowy wniosek</h2>
            <p className="text-sm text-gray-500 mt-1">Wypełnij wniosek rekrutacyjny dla swojego dziecka do przedszkola lub żłobka.</p>
          </div>
          <button
            onClick={() => navigate('/panel/rodzic/nowy-wniosek')}
            className="mt-auto px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
          >
            Rozpocznij wniosek →
          </button>
        </div>

        {/* Karta: Moje wnioski (placeholder) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Moje wnioski</h2>
            <p className="text-sm text-gray-500 mt-1">Sprawdź status złożonych wniosków rekrutacyjnych.</p>
          </div>
          <span className="mt-auto text-xs text-gray-400 italic">Wkrótce dostępne</span>
        </div>

        {/* Karta: Profil (placeholder) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Mój profil</h2>
            <p className="text-sm text-gray-500 mt-1">Zarządzaj swoimi danymi kontaktowymi i danymi dzieci.</p>
          </div>
          <span className="mt-auto text-xs text-gray-400 italic">Wkrótce dostępne</span>
        </div>
      </div>
    </div>
  );
}
