import { useState } from 'react';
import api from '../api/axios';

export default function AddHeadmaster() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({
    type: 'idle',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Trwa dodawanie konta...' });

    try {
      // Wywołanie endpointu zabezpieczonego dla admina
      await api.post('/auth/register-headmaster', formData);
      
      setStatus({ type: 'success', message: 'Konto dyrektora zostało pomyślnie utworzone!' });
      // Wyczyszczenie formularza po sukcesie
      setFormData({ firstName: '', lastName: '', email: '', password: '' });
    } catch (error: any) {
      console.error('Błąd rejestracji dyrektora:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Wystąpił błąd serwera. Spróbuj ponownie.' 
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Nagłówek formularza */}
        <div className="bg-blue-50 px-8 py-6 border-b border-gray-200 flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-sm">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dodaj Dyrektora</h1>
            <p className="text-sm text-gray-500 mt-1">Wypełnij dane, aby utworzyć konto administratora placówki</p>
          </div>
        </div>

        {/* Komunikaty o statusie */}
        {status.type === 'success' && (
          <div className="bg-green-50 text-green-700 p-4 mx-8 mt-6 rounded-xl border border-green-200 font-medium">
            {status.message}
          </div>
        )}
        {status.type === 'error' && (
          <div className="bg-red-50 text-red-700 p-4 mx-8 mt-6 rounded-xl border border-red-200 font-medium">
            {status.message}
          </div>
        )}

        {/* Formularz */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Imię</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="np. Jan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nazwisko</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="np. Kowalski"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Adres e-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="dyrektor@przedszkole.pl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hasło tymczasowe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Wpisz hasło startowe"
            />
            <p className="text-xs text-gray-500 mt-2">Dyrektor użyje tego hasła do pierwszego logowania.</p>
          </div>

          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {status.type === 'loading' ? 'Tworzenie konta...' : 'Utwórz konto dyrektora'}
          </button>
        </form>
      </div>
    </div>
  );
}