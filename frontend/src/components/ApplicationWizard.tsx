import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ← Pobierz token
import { validatePESEL, validateAge, validatePhone, validateAddress } from '../utils/validators';


// --- Typy ---
interface FormData {
  facilityIds: string[];
  facilityNames: string[];
  childFirstName: string;
  childLastName: string;
  childPesel: string;
  childBirthDate: string;
  address: string;
  parentName: string;
  parentPhone: string;
}

const INITIAL_FORM: FormData = {
  facilityIds: [],
  facilityNames: [],
  childFirstName: '',
  childLastName: '',
  childPesel: '',
  childBirthDate: '',
  address: '',
  parentName: '',
  parentPhone: '',
};

// --- Placówki (placeholder — docelowo z API) ---
const FACILITIES = [
  { id: '1', name: 'Placówka 1', type: 'Przedszkole', address: 'ul. XYZ 1' },
  { id: '2', name: 'Placówka 2', type: 'Przedszkole', address: 'ul. XYZ 2' },
  { id: '3', name: 'Placówka 3', type: 'Żłobek', address: 'ul. XYZ 3' },
  { id: '4', name: 'Placówka 4', type: 'Przedszkole', address: 'ul. XYZ 4' },
  { id: '5', name: 'Placówka 5', type: 'Przedszkole', address: 'ul. XYZ 5' },
];

const STEPS = ['Wybór placówki', 'Dane dziecka', 'Podsumowanie'];

// --- Pasek postępu ---
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-8" aria-label="Postęp wypełniania wniosku">
      {STEPS.map((label, idx) => {
        const isCompleted = idx < current;
        const isActive = idx === current;
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                  ${isCompleted ? 'bg-pink-600 border-pink-600 text-white' : ''}
                  ${isActive ? 'bg-white border-pink-600 text-pink-600 shadow-md' : ''}
                  ${!isCompleted && !isActive ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-pink-600' : isCompleted ? 'text-pink-500' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-2 mb-5 transition-all ${isCompleted ? 'bg-pink-500' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Krok 1: Wybór placówki ---
function Step1Facility({
  form,
  onChange,
}: {
  form: FormData;
  onChange: (ids: string[], names: string[]) => void;
}) {
  const toggle = (id: string, name: string) => {
    const alreadySelected = form.facilityIds.includes(id);
    if (alreadySelected) {
      const idx = form.facilityIds.indexOf(id);
      const newIds = form.facilityIds.filter((_, i) => i !== idx);
      const newNames = form.facilityNames.filter((_, i) => i !== idx);
      onChange(newIds, newNames);
    } else {
      onChange([...form.facilityIds, id], [...form.facilityNames, name]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Wybierz placówki</h2>
      <p className="text-gray-500 text-sm mb-6">
        Możesz wybrać kilka placówek jednocześnie. Zaznacz wszystkie, do których chcesz złożyć wniosek.
      </p>
      <div className="flex flex-col gap-3" role="group" aria-label="Lista placówek">
        {FACILITIES.map((f) => {
          const selected = form.facilityIds.includes(f.id);
          return (
            <label
              key={f.id}
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selected
                  ? 'border-pink-500 bg-pink-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-50/40'}
              `}
            >
              <input
                type="checkbox"
                value={f.id}
                checked={selected}
                onChange={() => toggle(f.id, f.name)}
                className="mt-1 accent-pink-600 w-4 h-4"
                aria-label={f.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{f.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.type === 'Żłobek' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {f.type}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{f.address}</span>
              </div>
              {selected && (
                <svg className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </label>
          );
        })}
      </div>
      {form.facilityIds.length > 0 && (
        <p className="text-sm text-pink-600 font-medium mt-4">
          Wybrano {form.facilityIds.length} {form.facilityIds.length === 1 ? 'placówkę' : 'placówki/placówek'}
        </p>
      )}
    </div>
  );
}

// --- Krok 2: Dane dziecka (POPRAWIONY z walidacją) ---
type StringFields = {
  [K in keyof FormData]: FormData[K] extends string ? K : never;
}[keyof FormData];

function Step2Child({
  form,
  onChange,
  errors,
}: {
  form: FormData;
  onChange: (field: StringFields, value: string) => void;
  errors: Partial<Record<StringFields, string>>;
}) {
  const field = (
    id: StringFields,
    label: string,
    type = 'text',
    placeholder = '',
    hint?: string
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500" aria-hidden="true">*</span>
      </label>
      <input
        id={id}
        type={type}
        value={form[id]}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition
          ${errors[id] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
        `}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint && !errors[id] && (
        <p id={`${id}-hint`} className="text-xs text-gray-400 mt-1">{hint}</p>
      )}
      {errors[id] && (
        <p id={`${id}-error`} className="text-xs text-red-600 mt-1" role="alert">{errors[id]}</p>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Dane dziecka</h2>
      <p className="text-gray-500 text-sm mb-6">Uzupełnij dane dziecka, które ma zostać przyjęte do placówki.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('childFirstName', 'Imię dziecka', 'text', 'np. Jan')}
        {field('childLastName', 'Nazwisko dziecka', 'text', 'np. Kowalski')}
        {field('childPesel', 'PESEL dziecka', 'text', 'np. 21040512345', 'PESEL składa się z 11 cyfr')}
        {field('childBirthDate', 'Data urodzenia', 'date')}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Dane rodzica / opiekuna</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('parentName', 'Imię i nazwisko rodzica', 'text', 'np. Anna Kowalska')}
          {field('parentPhone', 'Numer telefonu', 'tel', 'np. 600 123 456')}
          <div className="sm:col-span-2">
            {field('address', 'Adres zamieszkania dziecka', 'text', 'np. ul. Lipowa 3, Biskupice')}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Krok 3: Podsumowanie ---
function Step3Summary({ form }: { form: FormData }) {
  const selectedFacilities = FACILITIES.filter((f) => form.facilityIds.includes(f.id));

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b border-gray-100 last:border-0 gap-0.5 sm:gap-4">
      <span className="text-sm text-gray-500 sm:w-48 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || '—'}</span>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Sprawdź wniosek</h2>
      <p className="text-gray-500 text-sm mb-6">Upewnij się, że wszystkie dane są poprawne przed wysłaniem.</p>

      <div className="space-y-4">
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-3">
            Wybrane placówki ({selectedFacilities.length})
          </h3>
          {selectedFacilities.map((f, i) => (
            <div key={f.id} className={`py-2.5 ${i < selectedFacilities.length - 1 ? 'border-b border-pink-100' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-800">{f.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.type === 'Żłobek' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {f.type}
                </span>
              </div>
              <span className="text-xs text-gray-500">{f.address}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Dane dziecka</h3>
          <Row label="Imię i nazwisko" value={`${form.childFirstName} ${form.childLastName}`} />
          <Row label="PESEL" value={form.childPesel} />
          <Row label="Data urodzenia" value={form.childBirthDate} />
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Dane rodzica / opiekuna</h3>
          <Row label="Imię i nazwisko" value={form.parentName} />
          <Row label="Telefon" value={form.parentPhone} />
          <Row label="Adres zamieszkania" value={form.address} />
        </div>
      </div>

      <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
        </svg>
        <p className="text-sm text-blue-700">
          Po wysłaniu wniosek otrzyma status <strong>Oczekujący</strong>. Możesz śledzić jego postęp w panelu rodzica.
        </p>
      </div>
    </div>
  );
}

// --- Główny komponent (UPDATED) ---
export default function ApplicationWizard() {
  const navigate = useNavigate();
  const { token } = useAuth(); // ← DEV 2: Pobierz token JWT

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<StringFields, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // ← DEV 2: Loading state
  const [serverError, setServerError] = useState<string | null>(null); // ← DEV 2: Error z backendu

  const updateForm = (field: StringFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null); // Wyczyść błąd serwera
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      return form.facilityIds.length > 0;
    }

    if (step === 1) {
      const newErrors: Partial<Record<StringFields, string>> = {};

      // ✅ DEV 2: Dodana walidacja PESEL (suma kontrolna)
      const peselValidation = validatePESEL(form.childPesel);
      if (!peselValidation.valid) {
        newErrors.childPesel = peselValidation.message;
      }

      // ✅ DEV 2: Dodana walidacja wieku (max 7 lat)
      const ageValidation = validateAge(form.childBirthDate);
      if (!ageValidation.valid) {
        newErrors.childBirthDate = ageValidation.message;
      }

      // Reszta walidacji
      if (!form.childFirstName.trim()) newErrors.childFirstName = 'Imię jest wymagane';
      if (!form.childLastName.trim()) newErrors.childLastName = 'Nazwisko jest wymagane';
      if (!form.childBirthDate) newErrors.childBirthDate = 'Data urodzenia jest wymagana';

      // ✅ DEV 2: Walidacja telefonu
      const phoneValidation = validatePhone(form.parentPhone);
      if (!phoneValidation.valid) {
        newErrors.parentPhone = phoneValidation.message;
      }

      // ✅ DEV 2: Walidacja adresu
      const addressValidation = validateAddress(form.address);
      if (!addressValidation.valid) {
        newErrors.address = addressValidation.message;
      }

      if (!form.parentName.trim()) newErrors.parentName = 'Imię i nazwisko rodzica jest wymagane';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setServerError(null);
    setStep((s) => s - 1);
  };

  // ✅ DEV 2: Wysyłanie danych do backendu
  const handleSubmit = async () => {
    setLoading(true);
    setServerError(null);

    try {
      // Przygotowanie danych do wysłania
      const childData = {
        firstName: form.childFirstName,
        lastName: form.childLastName,
        pesel: form.childPesel,
        date_birth: form.childBirthDate, // Format: YYYY-MM-DD
        domicile: form.address,
      };

      console.log('📤 Wysyłam dane:', childData);
      console.log('🔐 Token:', token?.substring(0, 20) + '...');

      // Fetch do backendu
      const response = await fetch('http://149.156.194.192:8803/api/children/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ← Bearer Token z AuthContext
        },
        body: JSON.stringify(childData),
      });

      const data = await response.json();
      console.log('📥 Response z backendu:', data);

      if (response.ok) {
        // ✅ Sukces (201 Created)
        console.log('✅ Dziecko dodane pomyślnie!');
        setSubmitted(true);
      } else {
        // ❌ Błąd z backendu (400, 409, 500, itp.)
        console.error('❌ Błąd z backendu:', data.message);
        setServerError(data.message || 'Błąd serwera');
      }
    } catch (error) {
      // ❌ Błąd sieci (network error)
      console.error('❌ Błąd sieci:', error);
      setServerError('Błąd sieci. Sprawdź połączenie z internetem.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wniosek złożony!</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Wniosek o przyjęcie dziecka do {form.facilityIds.length === 1 ? 'placówki' : `${form.facilityIds.length} placówek`}{' '}
          został pomyślnie złożony. Możesz śledzić jego status w panelu.
        </p>
        <button
          onClick={() => navigate('/panel/rodzic')}
          className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
        >
          Wróć do panelu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator current={step} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {/* ✅ DEV 2: Wyświetlanie błędu z backendu */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">
              <strong>Błąd:</strong> {serverError}
            </p>
          </div>
        )}

        {step === 0 && (
          <Step1Facility
            form={form}
            onChange={(ids, names) => setForm((prev) => ({ ...prev, facilityIds: ids, facilityNames: names }))}
          />
        )}
        {step === 1 && (
          <Step2Child form={form} onChange={updateForm} errors={errors} />
        )}
        {step === 2 && <Step3Summary form={form} />}

        {/* Nawigacja */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          {step > 0 ? (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Wstecz
            </button>
          ) : (
            <button
              onClick={() => navigate('/panel/rodzic')}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 disabled:opacity-40"
            >
              Anuluj
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={handleNext}
              disabled={(step === 0 && form.facilityIds.length === 0) || loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Dalej
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Wysyłam...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Złóż wniosek
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}