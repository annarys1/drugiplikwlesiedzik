import { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): string => {
    if (!email.trim()) return 'Adres e-mail jest wymagany.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Podaj poprawny adres e-mail.';
    if (!password) return 'Hasło jest wymagane.';
    if (password.length < 6) return 'Hasło musi mieć co najmniej 6 znaków.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      
      const result = await login({ email, password });
      
      if (result.success) {
        if (result.role === 'parents') navigate('/panel/rodzic');
        else if (result.role === 'headmaster') navigate('/panel/placowka');
        else if (result.role === 'admin') navigate('/panel/gmina');
        else navigate('/'); 
      } else {
        setError(result.message || 'Nieprawidłowy e-mail lub hasło. Spróbuj ponownie.');
      }
    } catch {
      setError('Błąd połączenia z serwerem. Spróbuj za chwilę.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-pink-100">
          {/* Nagłówek */}
          <div className="mb-8 text-center">
            <h1
              className="text-3xl font-bold text-pink-800 mb-1"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Zaloguj się
            </h1>
            <p className="text-gray-500 text-base">
              Witaj z powrotem! Podaj swoje dane.
            </p>
          </div>

          {/* Komunikat błędu — widoczny dla czytników ekranu */}
          {error && (
            <div
              id={errorId}
              role="alert"
              aria-live="assertive"
              className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm"
            >
              <span aria-hidden="true" className="text-lg leading-tight">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={error ? errorId : undefined}
          >
            {/* E-mail */}
            <div className="mb-5">
              <label
                htmlFor={emailId}
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Adres e-mail{' '}
                <span aria-hidden="true" className="text-pink-600">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="twoj@email.pl"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500
                  transition-colors duration-150"
              />
            </div>

            {/* Hasło */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={passwordId}
                  className="block text-sm font-semibold text-gray-700"
                >
                  Hasło{' '}
                  <span aria-hidden="true" className="text-pink-600">*</span>
                </label>
                <Link
                  to="/przypomnij-haslo"
                  className="text-xs text-pink-600 hover:text-pink-800 underline underline-offset-2
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
                >
                  Zapomniałem/am hasła
                </Link>
              </div>
              <div className="relative">
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Twoje hasło"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 text-base placeholder:text-gray-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500
                    transition-colors duration-150"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 p-1 rounded
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zm4.5-4.5l-9 9" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0c0 2.21 3.582 5 6 5s6-2.79 6-5-3.582-5-6-5-6 2.79-6 5z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="w-full bg-pink-700 hover:bg-pink-800 active:bg-pink-900 disabled:bg-pink-300 disabled:cursor-not-allowed
                text-white font-semibold text-base rounded-xl py-3 px-6
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-600"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  Logowanie…
                </span>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Nie masz jeszcze konta?{' '}
            <Link
              to="/rejestracja"
              className="text-pink-700 font-semibold hover:text-pink-900 underline underline-offset-2
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
            >
              Zarejestruj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
