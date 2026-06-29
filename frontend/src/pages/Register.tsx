import { useState, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usunęliśmy definicję Role, bo nie jest już potrzebna do wyboru w formularzu

export default function Register() {
  const firstNameId = useId();
  const lastNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const password2Id = useId();
  const errorId = useId();

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    // Usunięto pole role z inicjalizacji
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      const res = await fetch('http://localhost:8801/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: 'parents', // Wymuszenie roli rodzica
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message ?? 'Rejestracja nie powiodła się. Spróbuj ponownie.');
        return;
      }

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
            <h1 className="text-3xl font-bold text-pink-800 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Utwórz konto
            </h1>
            <p className="text-gray-500 text-base">Dołącz do systemu. To zajmie chwilę.</p>
          </div>

          {error && (
            <div id={errorId} role="alert" aria-live="assertive" className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">
              <span aria-hidden="true" className="text-lg leading-tight">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-describedby={error ? errorId : undefined}>
            {/* Imię + Nazwisko */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <label htmlFor={firstNameId} className="block text-sm font-semibold text-gray-700 mb-1.5">Imię *</label>
                <input id={firstNameId} type="text" autoComplete="given-name" required value={form.firstName} onChange={set('firstName')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-pink-500" />
              </div>
              <div className="flex-1">
                <label htmlFor={lastNameId} className="block text-sm font-semibold text-gray-700 mb-1.5">Nazwisko *</label>
                <input id={lastNameId} type="text" autoComplete="family-name" required value={form.lastName} onChange={set('lastName')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-pink-500" />
              </div>
            </div>

            {/* E-mail */}
            <div className="mb-5">
              <label htmlFor={emailId} className="block text-sm font-semibold text-gray-700 mb-1.5">Adres e-mail *</label>
              <input id={emailId} type="email" autoComplete="email" required value={form.email} onChange={set('email')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-pink-500" />
            </div>

            {/* Hasło */}
            <div className="mb-4">
              <label htmlFor={passwordId} className="block text-sm font-semibold text-gray-700 mb-1.5">Hasło *</label>
              <input id={passwordId} type="password" required value={form.password} onChange={set('password')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-pink-500" />
            </div>

            {/* Powtórz hasło */}
            <div className="mb-6">
              <label htmlFor={password2Id} className="block text-sm font-semibold text-gray-700 mb-1.5">Powtórz hasło *</label>
              <input id={password2Id} type="password" required value={form.password2} onChange={set('password2')} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-visible:ring-2 focus-visible:ring-pink-500" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-pink-700 text-white font-semibold py-3 rounded-xl hover:bg-pink-800 transition-colors">
              {isSubmitting ? 'Rejestrowanie…' : 'Utwórz konto'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Masz już konto? <Link to="/logowanie" className="text-pink-700 font-semibold hover:underline">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </div>
); 
}