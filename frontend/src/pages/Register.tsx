import { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Role = 'parents' | 'facility' | 'gmina';

const ROLE_LABELS: Record<Role, string> = {
  parents: 'Rodzic',
  facility: 'Placówka',
  gmina: 'Gmina',
};

export default function Register() {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const password2Id = useId();
  const roleId = useId();
  const errorId = useId();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'parents' as Role,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError('');
  };

  const validate = (): string => {
    if (!form.firstName.trim()) return 'Imię jest wymagane.';
    if (!form.lastName.trim()) return 'Nazwisko jest wymagane.';
    if (!form.email.trim()) return 'Adres e-mail jest wymagany.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Podaj poprawny adres e-mail.';
    if (!form.password) return 'Hasło jest wymagane.';
    if (form.password.length < 8) return 'Hasło musi mieć co najmniej 8 znaków.';
    if (form.password !== form.password2) return 'Hasła nie są identyczne.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? 'Rejestracja nie powiodła się. Spróbuj ponownie.');
        return;
      }

      // Auto-login po rejestracji
      const success = await login({ email: form.email, password: form.password });
      if (success) {
        navigate('/panel/rodzic');
      } else {
        navigate('/logowanie');
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
          <div className="mb-8 text-center">
            <h1
              className="text-3xl font-bold text-pink-800 mb-1"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Utwórz konto
            </h1>
            <p className="text-gray-500 text-base">
              Dołącz do systemu. To zajmie chwilę.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} noValidate aria-describedby={error ? errorId : undefined}>
            {/* Imię + Nazwisko obok siebie */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <label htmlFor={firstNameId} className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Imię <span aria-hidden="true" className="text-pink-600">*</span>
                </label>
                <input
                  id={firstNameId}
                  type="text"
                  autoComplete="given-name"
                  required
                  aria-required="true"
                  value={form.firstName}
                  onChange={set('firstName')}
                  placeholder="Jan"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={lastNameId} className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nazwisko <span aria-hidden="true" className="text-pink-600">*</span>
                </label>
                <input
                  id={lastNameId}
                  type="text"
                  autoComplete="family-name"
                  required
                  aria-required="true"
                  value={form.lastName}
                  onChange={set('lastName')}
                  placeholder="Kowalski"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="mb-5">
              <label htmlFor={emailId} className="block text-sm font-semibold text-gray-700 mb-1.5">
                Adres e-mail <span aria-hidden="true" className="text-pink-600">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                value={form.email}
                onChange={set('email')}
                placeholder="twoj@email.pl"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
              />
            </div>

            {/* Rola */}
            <div className="mb-5">
              <label htmlFor={roleId} className="block text-sm font-semibold text-gray-700 mb-1.5">
                Typ konta <span aria-hidden="true" className="text-pink-600">*</span>
              </label>
              <select
                id={roleId}
                value={form.role}
                onChange={set('role')}
                aria-required="true"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
              >
                {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>

            {/* Hasło */}
            <div className="mb-4">
              <label htmlFor={passwordId} className="block text-sm font-semibold text-gray-700 mb-1.5">
                Hasło <span aria-hidden="true" className="text-pink-600">*</span>
              </label>
              <div className="relative">
                <input
                  id={passwordId}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  aria-required="true"
                  aria-describedby="password-hint"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 znaków"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 text-base placeholder:text-gray-400
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
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
              <p id="password-hint" className="mt-1 text-xs text-gray-400">Minimum 8 znaków.</p>
            </div>

            {/* Powtórz hasło */}
            <div className="mb-6">
              <label htmlFor={password2Id} className="block text-sm font-semibold text-gray-700 mb-1.5">
                Powtórz hasło <span aria-hidden="true" className="text-pink-600">*</span>
              </label>
              <input
                id={password2Id}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                aria-required="true"
                value={form.password2}
                onChange={set('password2')}
                placeholder="Powtórz hasło"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 text-base placeholder:text-gray-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-pink-500 transition-colors"
              />
            </div>

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
                  Rejestrowanie…
                </span>
              ) : (
                'Utwórz konto'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Masz już konto?{' '}
            <Link
              to="/logowanie"
              className="text-pink-700 font-semibold hover:text-pink-900 underline underline-offset-2
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
