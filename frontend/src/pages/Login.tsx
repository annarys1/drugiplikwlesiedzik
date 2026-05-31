import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // 1. Tworzymy "pamięć" dla pól formularza
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Pobieramy narzędzia: funkcję logowania i nawigację
  const { login } = useAuth();
  const navigate = useNavigate();

  // 3. Funkcja, która uruchomi się po kliknięciu przycisku
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Zapobiega odświeżeniu strony
    setError('');

    // Wywołujemy login z AuthContext
    const success = await login({ email, password });

    if (success) {
      // Jeśli hasło (admin123) pasuje, idź do panelu rodzica
      navigate('/panel/rodzic');
    } else {
      // Jeśli nie, pokaż błąd
      setError('Błędny e-mail lub hasło (spróbuj admin123)');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600">Logowanie</h1>
        <p className="text-center text-gray-600">Nabór do przedszkoli - Panel Rodzica</p>
        
        {/* Dodajemy onSubmit do formularza */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Zapisuje co piszesz
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasło</label>
            <input 
              type="password" 
              placeholder="Hasło" 
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Zapisuje co piszesz
            />
          </div>

          {/* Wyświetlanie błędu, jeśli logowanie się nie uda */}
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500 transition-colors font-semibold"
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
