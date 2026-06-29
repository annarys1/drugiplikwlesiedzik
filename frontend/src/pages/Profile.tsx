import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(user);
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    // Jeśli brakuje pełnych danych, dociągamy je z backendu
    if (!user) {
      api.get('/auth/me')
        .then(res => {
          setProfileData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Błąd pobierania profilu:", err);
          setLoading(false);
        });
    }
  }, [user]);

  // Ładny ekran ładowania
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 font-medium">Pobieranie danych profilu...</div>
      </div>
    );
  }

  // Komunikat braku dostępu
  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 font-medium bg-red-50 p-4 rounded-xl border border-red-100">
          Błąd: Musisz się zalogować, aby zobaczyć ten profil.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Główna karta profilu */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Górna część z zielonym akcentem (nawiązanie do kafelka) */}
        <div className="bg-green-50 px-8 py-6 border-b border-gray-200 flex items-center gap-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 shadow-sm">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mój profil</h1>
            <p className="text-sm text-gray-500 mt-1">Sprawdź swoje dane kontaktowe</p>
          </div>
        </div>

        {/* Sekcja z danymi użytkownika */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pole: Imię */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1.5">Imię</p>
              <div className="text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                {profileData.name || profileData.firstName}
              </div>
            </div>

            {/* Pole: Nazwisko */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1.5">Nazwisko</p>
              <div className="text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                {profileData.surname || profileData.lastName}
              </div>
            </div>
            
          </div>
          
          {/* Pole: E-mail (na całą szerokość) */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1.5">Adres e-mail</p>
            <div className="text-lg font-semibold text-gray-800 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
              {profileData.email}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}