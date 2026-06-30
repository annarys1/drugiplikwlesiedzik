import { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  document: File | null; // zalaczniki
  selectedCriteria: any[];  
}

// Typ odpowiedzi z GET /api/institution/list
interface Facility {
  id_institution: number;
  name: string;
  city: string;
  max_capacity: number;
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
  document: null,
  selectedCriteria: [],
};

const MAX_FACILITIES = 3;
const STEPS = ['Wybór placówki', 'Kryteria','Dane dziecka', 'Podsumowanie'];

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
                className={[
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all',
                  isCompleted ? 'bg-pink-600 border-pink-600 text-white' : '',
                  isActive ? 'bg-white border-pink-600 text-pink-600 shadow-md' : '',
                  !isCompleted && !isActive ? 'bg-gray-100 border-gray-300 text-gray-400' : '',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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


// --- Krok 1: Priorytetyzacja placówek ---
function Step1Facility({
  form,
  onChange,
  facilities,
  facilitiesLoading,
  facilitiesError,
}: {
  form: FormData;
  onChange: (ids: string[], names: string[]) => void;
  facilities: Facility[];
  facilitiesLoading: boolean;
  facilitiesError: string | null;
}) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const listId = useId();

  const addFacility = (id: string, name: string) => {
    if (form.facilityIds.includes(id) || form.facilityIds.length >= MAX_FACILITIES) return;
    onChange([...form.facilityIds, id], [...form.facilityNames, name]);
  };

  const removeFacility = (idx: number) => {
    const newIds = form.facilityIds.filter((_, i) => i !== idx);
    const newNames = form.facilityNames.filter((_, i) => i !== idx);
    onChange(newIds, newNames);
  };

  const moveFacility = (idx: number, direction: 'up' | 'down') => {
    const newIds = [...form.facilityIds];
    const newNames = [...form.facilityNames];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newIds.length) return;
    [newIds[idx], newIds[targetIdx]] = [newIds[targetIdx], newIds[idx]];
    [newNames[idx], newNames[targetIdx]] = [newNames[targetIdx], newNames[idx]];
    onChange(newIds, newNames);
  };

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const newIds = [...form.facilityIds];
    const newNames = [...form.facilityNames];
    const [movedId] = newIds.splice(draggedIdx, 1);
    const [movedName] = newNames.splice(draggedIdx, 1);
    newIds.splice(targetIdx, 0, movedId);
    newNames.splice(targetIdx, 0, movedName);
    onChange(newIds, newNames);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const priorityColor = (idx: number) => {
    const colors = [
      'bg-pink-600 text-white',
      'bg-pink-400 text-white',
      'bg-pink-200 text-pink-900',
    ];
    return colors[idx] ?? 'bg-gray-200 text-gray-700';
  };

  const availableFacilities = facilities.filter(f => !form.facilityIds.includes(String(f.id_institution)));
  const canAddMore = form.facilityIds.length < MAX_FACILITIES;

  // --- Stan ładowania ---
  if (facilitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <svg className="w-8 h-8 animate-spin text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="text-sm">Pobieranie listy placówek…</p>
      </div>
    );
  }

  // --- Stan błędu ---
  if (facilitiesError) {
    return (
      <div className="py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3" role="alert">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700">Nie udało się pobrać listy placówek</p>
            <p className="text-xs text-red-500 mt-1">{facilitiesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Wybierz placówki</h2>
      <p className="text-gray-500 text-sm mb-6">
        Wybierz do {MAX_FACILITIES} placówek i ustaw ich kolejność priorytetów.{' '}
        <span className="font-medium text-pink-700">1. wybór</span> to placówka, do której chcesz trafić przede wszystkim.
      </p>

      {/* Lista wybranych placówek z priorytetami */}
      {form.facilityIds.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700">
              Wybrane placówki ({form.facilityIds.length}/{MAX_FACILITIES})
            </span>
            <span className="text-xs text-gray-400">— przeciągnij lub użyj strzałek, żeby zmienić kolejność</span>
          </div>

          <ul
            id={listId}
            role="list"
            aria-label="Wybrane placówki w kolejności priorytetów"
            className="flex flex-col gap-2"
          >
            {form.facilityIds.map((id, idx) => {
              const facility = facilities.find(f => String(f.id_institution) === id);
              if (!facility) return null;
              const isDragging = draggedIdx === idx;
              const isDragOver = dragOverIdx === idx;

              return (
                <li
                  key={id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={[
                    'flex items-center gap-3 p-3 rounded-xl border-2 bg-white transition-all select-none',
                    isDragging ? 'opacity-40 border-pink-400 shadow-none' : '',
                    isDragOver && !isDragging ? 'border-pink-500 shadow-md bg-pink-50' : '',
                    !isDragging && !isDragOver ? 'border-pink-200 shadow-sm hover:border-pink-400' : '',
                  ].join(' ')}
                >
                  <span className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0" aria-hidden="true">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm8-16a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4zm0 8a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </span>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${priorityColor(idx)}`}>
                    {idx + 1}. wybór
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{facility.name}</p>
                    <p className="text-xs text-gray-400 truncate">{facility.city}</p>
                  </div>

                  <div className="flex flex-col gap-0.5 flex-shrink-0" role="group" aria-label={`Zmień priorytet: ${facility.name}`}>
                    <button
                      type="button"
                      onClick={() => moveFacility(idx, 'up')}
                      disabled={idx === 0}
                      aria-label={`Przesuń ${facility.name} wyżej`}
                      className="p-1 rounded text-gray-400 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-20 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFacility(idx, 'down')}
                      disabled={idx === form.facilityIds.length - 1}
                      aria-label={`Przesuń ${facility.name} niżej`}
                      className="p-1 rounded text-gray-400 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-20 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFacility(idx)}
                    aria-label={`Usuń ${facility.name} z listy`}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Lista dostępnych placówek */}
      {canAddMore ? (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {form.facilityIds.length === 0 ? 'Dostępne placówki' : 'Dodaj kolejną placówkę'}
          </p>
          {availableFacilities.length === 0 ? (
            <p className="text-sm text-gray-400 italic py-2">Brak innych dostępnych placówek.</p>
          ) : (
            <div className="flex flex-col gap-2" role="group" aria-label="Dostępne placówki do wybrania">
              {availableFacilities.map((f) => (
                <button
                  key={f.id_institution}
                  type="button"
                  onClick={() => addFacility(String(f.id_institution), f.name)}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-pink-400 hover:bg-pink-50 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 group"
                  aria-label={`Dodaj ${f.name} do listy`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center flex-shrink-0 transition">
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{f.name}</p>
                    <p className="text-xs text-gray-400">{f.city} · maks. {f.max_capacity} miejsc</p>
                  </div>
                  <span className="text-xs text-pink-500 font-medium flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                    Dodaj →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-pink-50 border border-pink-200 rounded-xl text-sm text-pink-700">
          <span className="font-semibold">Osiągnięto limit {MAX_FACILITIES} placówek.</span>{' '}
          Usuń jedną z listy powyżej, żeby dodać inną.
        </div>
      )}

      {form.facilityIds.length === 0 && !facilitiesLoading && (
        <p className="mt-4 text-xs text-gray-400 text-center">
          Musisz wybrać co najmniej jedną placówkę, żeby przejść dalej.
        </p>
      )}
    </div>
  );
}

// --- Krok 2: Dane dziecka ---
type StringFields = {
  [K in keyof FormData]: FormData[K] extends string ? K : never;
}[keyof FormData];
function Step2Child({
  form,
  onChange,
  errors,
}: {
  form: FormData;
  onChange: (field: any, value: any) => void;
  errors: Partial<Record<StringFields, string>>;
}) {
  // Funkcja pomocnicza do pól tekstowych
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
        value={form[id] as string}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className={[
          'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition',
          errors[id] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400',
        ].join(' ')}
      />
      {hint && !errors[id] && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {errors[id] && <p className="text-xs text-red-600 mt-1" role="alert">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Dane dziecka</h2>
        <p className="text-gray-500 text-sm">Wypełnij dane dziecka, dla którego składasz wniosek.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('childFirstName', 'Imię dziecka', 'text', 'np. Anna')}
        {field('childLastName', 'Nazwisko dziecka', 'text', 'np. Kowalska')}
      </div>

      {field('childPesel', 'PESEL dziecka', 'text', '12345678901', 'Dokładnie 11 cyfr')}
      {field('childBirthDate', 'Data urodzenia', 'date', '', 'Dziecko musi mieć poniżej 7 lat')}
      {field('address', 'Adres zamieszkania', 'text', 'ul. Przykładowa 1, 32-020 Wieliczka')}

      <hr className="border-gray-100" />
      <p className="text-sm font-semibold text-gray-700 -mb-2">Dane rodzica/opiekuna</p>
      {field('parentName', 'Imię i nazwisko rodzica', 'text', 'np. Jan Kowalski')}
      {field('parentPhone', 'Numer telefonu', 'tel', 'np. 600 123 456')}

      {/* Nowy blok z plikiem */}
      <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Załącz dokument (PDF, PNG, JPG) <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.png"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onChange('document', e.target.files[0]);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
        />
      </div>
    </div>
  );
}
function StepCriteria({ form, facilityIds, onChange }: {
  form: FormData;
  facilityIds: string[];
  onChange: (c: any[]) => void
}) {
  const [criteria, setCriteria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCriteria = async () => {
      if (facilityIds.length === 0) {
        setCriteria([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/criteria/list?ids=${facilityIds.join(',')}`);
        const data = await res.json();
        setCriteria(data);
      } catch (err) {
        console.error("Błąd kryteriów:", err);
        setCriteria([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCriteria();
  }, [facilityIds]);

  if (loading) return <p className="text-sm text-gray-400">Ładowanie kryteriów...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Kryteria pierwszeństwa</h2>
      <p className="text-sm text-gray-500 mb-4">Zaznacz sytuacje, które Cię dotyczą:</p>

      {criteria.map((c) => {
        const isChecked = form.selectedCriteria.some(s => s.id_criterion === c.id_criterion);
        const selectedEntry = form.selectedCriteria.find(s => s.id_criterion === c.id_criterion);

        return (
          <label key={c.id_criterion} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
            <input
              type="checkbox"
              className="w-5 h-5 text-pink-600 rounded"
              checked={isChecked}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...form.selectedCriteria, { id_criterion: c.id_criterion, value: c.is_variable ? '' : undefined }]
                  : form.selectedCriteria.filter(s => s.id_criterion !== c.id_criterion);
                onChange(updated);
              }}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">{c.name}</span>

            {c.is_variable === 1 && isChecked && (
              <input
                type="number"
                min="1"
                placeholder="np. liczba godzin"
                className="ml-3 w-24 border rounded px-2 py-1 text-sm"
                value={selectedEntry?.value ?? ''}
                onClick={(e) => e.preventDefault()}
                onChange={(e) => {
                  const updated = form.selectedCriteria.map(s =>
                    s.id_criterion === c.id_criterion ? { ...s, value: e.target.value } : s
                  );
                  onChange(updated);
                }}
              />
            )}

            <span className="ml-auto text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded">
              {c.criterion_point} pkt
            </span>
          </label>
        );
      })}
    </div>
  );
}
// --- Krok 3: Podsumowanie ---
function Step3Summary({ form }: { form: FormData }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Podsumowanie wniosku</h2>
      <p className="text-gray-500 text-sm mb-6">Sprawdź dane przed złożeniem wniosku.</p>

      <div className="flex flex-col gap-4">
        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
          <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-3">Placówki (kolejność priorytetów)</p>
          <ol className="flex flex-col gap-2" aria-label="Wybrane placówki w kolejności priorytetów">
            {form.facilityNames.map((name, idx) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-pink-600 text-white' : idx === 1 ? 'bg-pink-400 text-white' : 'bg-pink-200 text-pink-900'}`}>
                  {idx + 1}
                </span>
                <span className="text-gray-800">{name}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Dane dziecka</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div><span className="text-gray-400">Imię i nazwisko:</span><br /><span className="font-medium text-gray-800">{form.childFirstName} {form.childLastName}</span></div>
            <div><span className="text-gray-400">PESEL:</span><br /><span className="font-medium text-gray-800">{form.childPesel}</span></div>
            <div><span className="text-gray-400">Data urodzenia:</span><br /><span className="font-medium text-gray-800">{form.childBirthDate}</span></div>
            <div><span className="text-gray-400">Adres:</span><br /><span className="font-medium text-gray-800">{form.address}</span></div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Dane rodzica/opiekuna</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div><span className="text-gray-400">Imię i nazwisko:</span><br /><span className="font-medium text-gray-800">{form.parentName}</span></div>
            <div><span className="text-gray-400">Telefon:</span><br /><span className="font-medium text-gray-800">{form.parentPhone}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Główny komponent Wizard ---
export default function ApplicationWizard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<StringFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // --- Pobieranie placówek z API ---
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [facilitiesError, setFacilitiesError] = useState<string | null>(null);

  useEffect(() => {
    // GET /api/institution/list — publiczny endpoint (bez tokenu)
    fetch('/api/institution')
      .then(res => {
        if (!res.ok) throw new Error(`Serwer zwrócił ${res.status}`);
        return res.json();
      })
      .then((data: Facility[]) => {
        setFacilities(data);
        setFacilitiesLoading(false);
      })
      .catch((err: Error) => {
        console.error('❌ Błąd pobierania placówek:', err.message);
        setFacilitiesError(err.message ?? 'Nieznany błąd');
        setFacilitiesLoading(false);
      });  
  }, []);

  const updateForm = (field: StringFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      return form.facilityIds.length > 0;
    }
    if (step === 1) {
    const isCriteriaValid = form.selectedCriteria.length > 0;
    if (!isCriteriaValid) {
      setServerError('Musisz wybrać co najmniej jedno kryterium, aby kontynuować.');
      return false;
    }
    setServerError(null);
    return true;
  }

    if (step === 2) {
      const newErrors: Partial<Record<StringFields, string>> = {};

      const peselValidation = validatePESEL(form.childPesel);
      if (!peselValidation.valid) newErrors.childPesel = peselValidation.message;

      if (form.childBirthDate) {
        const ageValidation = validateAge(form.childBirthDate);
        if (!ageValidation.valid) newErrors.childBirthDate = ageValidation.message;
      }

      if (!form.childFirstName.trim()) newErrors.childFirstName = 'Imię jest wymagane';
      if (!form.childLastName.trim()) newErrors.childLastName = 'Nazwisko jest wymagane';
      if (!form.childBirthDate) newErrors.childBirthDate = 'Data urodzenia jest wymagana';

      const phoneValidation = validatePhone(form.parentPhone);
      if (!phoneValidation.valid) newErrors.parentPhone = phoneValidation.message;

      const addressValidation = validateAddress(form.address);
      if (!addressValidation.valid) newErrors.address = addressValidation.message;

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

  const handleSubmit = async () => {
    setLoading(true);
    setServerError(null);

    try {
      // Krok 1: Dodaj dziecko — POST /api/children/add
      const childData = {
        firstName: form.childFirstName,
        lastName: form.childLastName,
        pesel: form.childPesel,
        date_birth: form.childBirthDate,
        domicile: form.address,
      };

      console.log('📤 Wysyłam dane dziecka:', childData);

      const childRes = await fetch('/api/children/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(childData),
      });

      const childJson = await childRes.json();
      console.log('📥 Odpowiedź /children/add:', childJson);

      if (!childRes.ok) {
        setServerError(childJson.message || 'Błąd podczas dodawania dziecka.');
        setLoading(false);
        return;
      }

      const childId = childJson.childId;

      // Krok 2: Złóż wniosek — POST /api/applications/apply
      const appRes = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ id_children: childId }),
      });

      const appJson = await appRes.json();
      console.log('📥 Odpowiedź /applications/apply:', appJson);

      if (!appRes.ok) {
        setServerError(appJson.message || 'Błąd podczas składania wniosku.');
        setLoading(false);
        return;
      }

      const applicationId = appJson.id_application;
         // Krok 3: Zapisz wybrane kryteria — POST /api/applications/criteria
      if (form.selectedCriteria.length > 0) {
        const critRes = await fetch('/api/applications/criteria', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            id_application: applicationId,
            criteria: form.selectedCriteria,
          }),
        });

        const critJson = await critRes.json();
        console.log('📥 Odpowiedź /applications/criteria:', critJson);

        if (!critRes.ok) {
          setServerError(critJson.message || 'Błąd podczas zapisu kryteriów.');
          setLoading(false);
          return;
        }
      }
      // Krok 3: Zapisz preferencje placówek — POST /api/applications/preferences
      const institutions = form.facilityIds.map((id, idx) => ({
        id_institution: Number(id),
        order: idx + 1,   // 1 = najwyższy priorytet
      }));

      const prefRes = await fetch('/api/applications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ id_application: applicationId, institutions }),
      });

      const prefJson = await prefRes.json();
      console.log('📥 Odpowiedź /preferences:', prefJson);

      if (!prefRes.ok) {
        setServerError(prefJson.message || 'Błąd podczas zapisywania preferencji.');
        setLoading(false);
        return;
      }

     
      if (form.document) {
        const fileData = new FormData();
        fileData.append('document', form.document);
        fileData.append('id_application', String(applicationId));
        fileData.append('id_criterion', '1'); 

        console.log('📤 Przesyłam plik do backendu dla wniosku:', applicationId);

        const uploadRes = await fetch('/api/applications/upload', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}` 
          },
          body: fileData
        });
        
        const uploadJson = await uploadRes.json();
        console.log('📥 Odpowiedź z uploadu:', uploadJson);

        if (!uploadRes.ok) {
          setServerError(uploadJson.message || 'Błąd podczas wgrywania dokumentu.');
          setLoading(false);
          return;
        }
      }

      console.log('✅ Wniosek oraz pliki złożone pomyślnie!');
      setSubmitted(true);

    } catch (error) {
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
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Wniosek złożony!</h2>
        <p className="text-gray-500 mb-2 max-w-sm">
          Wniosek o przyjęcie dziecka do {form.facilityIds.length === 1 ? 'placówki' : `${form.facilityIds.length} placówek`} został pomyślnie złożony.
        </p>
        <p className="text-gray-400 text-sm mb-6 max-w-sm">
          Kolejność priorytetów: {form.facilityNames.join(' → ')}
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
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3" role="alert">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700"><strong>Błąd:</strong> {serverError}</p>
          </div>
        )}

        {step === 0 && (
          <Step1Facility
            form={form}
            onChange={(ids, names) => setForm((prev) => ({ ...prev, facilityIds: ids, facilityNames: names }))}
            facilities={facilities}
            facilitiesLoading={facilitiesLoading}
            facilitiesError={facilitiesError}
          />
        )}
        {step === 1 && (
  <StepCriteria
    form={form}
    facilityIds={form.facilityIds}
    onChange={(c) => setForm(prev => ({ ...prev, selectedCriteria: c }))}
  />
)}
{step === 2 && (
  <Step2Child form={form} onChange={updateForm} errors={errors} />
)}
{step === 3 && <Step3Summary form={form} />}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          {step > 0 ? (
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-400 disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={(step === 0 && form.facilityIds.length === 0) || loading || facilitiesLoading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Dalej
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Wysyłam...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
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
