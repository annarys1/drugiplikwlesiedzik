import { useState, useId } from 'react';

// --- Typy ---
type ApplicationStatus = 'nowy' | 'weryfikacja' | 'zaakceptowany' | 'odrzucony';

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'jpg' | 'png' | 'docx';
}

interface Application {
  id: string;
  childName: string;
  childPesel: string;
  childBirthDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  submittedAt: string;
  status: ApplicationStatus;
  priority: 1 | 2 | 3;
  attachments: Attachment[];
  notes?: string;
}

// --- Dane mockowe ---
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'W/2026/001',
    childName: 'Anna Kowalska',
    childPesel: '23040512345',
    childBirthDate: '2023-04-05',
    parentName: 'Jan Kowalski',
    parentPhone: '600 123 456',
    parentEmail: 'jan.kowalski@email.pl',
    address: 'ul. Słoneczna 12, 32-020 Wieliczka',
    submittedAt: '2026-05-10',
    status: 'nowy',
    priority: 1,
    attachments: [
      { id: 'a1', name: 'Akt urodzenia.pdf', size: '1.2 MB', type: 'pdf' },
      { id: 'a2', name: 'Zaświadczenie lekarskie.pdf', size: '0.8 MB', type: 'pdf' },
    ],
  },
  {
    id: 'W/2026/002',
    childName: 'Piotr Nowak',
    childPesel: '22071198765',
    childBirthDate: '2022-07-11',
    parentName: 'Marta Nowak',
    parentPhone: '700 987 654',
    parentEmail: 'marta.nowak@email.pl',
    address: 'ul. Kwiatowa 3, 32-020 Wieliczka',
    submittedAt: '2026-05-12',
    status: 'weryfikacja',
    priority: 2,
    attachments: [
      { id: 'a3', name: 'Akt urodzenia.pdf', size: '1.0 MB', type: 'pdf' },
    ],
    notes: 'Rodzina wielodzietna — priorytet zgodnie z regulaminem.',
  },
  {
    id: 'W/2026/003',
    childName: 'Zofia Wiśniewska',
    childPesel: '24010312233',
    childBirthDate: '2024-01-03',
    parentName: 'Tomasz Wiśniewski',
    parentPhone: '500 111 222',
    parentEmail: 'tomasz.w@email.pl',
    address: 'ul. Parkowa 7, 32-020 Wieliczka',
    submittedAt: '2026-05-14',
    status: 'zaakceptowany',
    priority: 1,
    attachments: [
      { id: 'a4', name: 'Akt urodzenia.pdf', size: '1.1 MB', type: 'pdf' },
      { id: 'a5', name: 'Zdjęcie dziecka.jpg', size: '0.3 MB', type: 'jpg' },
      { id: 'a6', name: 'Podanie.docx', size: '0.2 MB', type: 'docx' },
    ],
  },
  {
    id: 'W/2026/004',
    childName: 'Marek Zając',
    childPesel: '21121499887',
    childBirthDate: '2021-12-14',
    parentName: 'Agnieszka Zając',
    parentPhone: '601 444 555',
    parentEmail: 'agnieszka.z@email.pl',
    address: 'ul. Leśna 15, 32-020 Wieliczka',
    submittedAt: '2026-05-15',
    status: 'odrzucony',
    priority: 3,
    attachments: [],
    notes: 'Brak wymaganych dokumentów — wniosek niekompletny.',
  },
  {
    id: 'W/2026/005',
    childName: 'Lena Dąbrowska',
    childPesel: '23091567890',
    childBirthDate: '2023-09-15',
    parentName: 'Paweł Dąbrowski',
    parentPhone: '602 333 777',
    parentEmail: 'pawel.d@email.pl',
    address: 'ul. Różana 4, 32-020 Wieliczka',
    submittedAt: '2026-05-16',
    status: 'nowy',
    priority: 1,
    attachments: [
      { id: 'a7', name: 'Akt urodzenia.pdf', size: '0.9 MB', type: 'pdf' },
    ],
  },
];

// --- Konfiguracja statusów ---
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; dot: string }> = {
  nowy:         { label: 'Nowy',         color: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-500' },
  weryfikacja:  { label: 'Weryfikacja',  color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  zaakceptowany:{ label: 'Zaakceptowany',color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  odrzucony:    { label: 'Odrzucony',    color: 'bg-red-100 text-red-800',     dot: 'bg-red-500' },
};

// --- Ikona załącznika ---
function AttachmentIcon({ type }: { type: Attachment['type'] }) {
  const colors: Record<Attachment['type'], string> = {
    pdf: 'text-red-500',
    jpg: 'text-blue-500',
    png: 'text-blue-500',
    docx: 'text-indigo-500',
  };
  return (
    <svg className={`w-5 h-5 ${colors[type]} flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// --- Badge statusu ---
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// --- Modal szczegółów wniosku ---
function ApplicationModal({
  app,
  onClose,
  onStatusChange,
}: {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}) {
  const modalTitleId = useId();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Okno modala */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Nagłówek */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <p className="text-xs text-gray-400 font-mono">Wniosek {app.id}</p>
            <h2 id={modalTitleId} className="text-lg font-bold text-gray-800">
              {app.childName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} />
            <button
              onClick={onClose}
              aria-label="Zamknij szczegóły wniosku"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Dane dziecka */}
          <section aria-labelledby="section-child">
            <h3 id="section-child" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dane dziecka</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Imię i nazwisko</p><p className="font-medium text-gray-800">{app.childName}</p></div>
              <div><p className="text-gray-400 text-xs">PESEL</p><p className="font-medium text-gray-800 font-mono">{app.childPesel}</p></div>
              <div><p className="text-gray-400 text-xs">Data urodzenia</p><p className="font-medium text-gray-800">{app.childBirthDate}</p></div>
              <div><p className="text-gray-400 text-xs">Priorytet placówki</p><p className="font-medium text-gray-800">{app.priority}. wybór</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Adres zamieszkania</p><p className="font-medium text-gray-800">{app.address}</p></div>
            </div>
          </section>

          {/* Dane rodzica */}
          <section aria-labelledby="section-parent">
            <h3 id="section-parent" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dane rodzica/opiekuna</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Imię i nazwisko</p><p className="font-medium text-gray-800">{app.parentName}</p></div>
              <div><p className="text-gray-400 text-xs">Telefon</p><p className="font-medium text-gray-800">{app.parentPhone}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">E-mail</p><p className="font-medium text-gray-800">{app.parentEmail}</p></div>
            </div>
          </section>

          {/* Załączniki */}
          <section aria-labelledby="section-attachments">
            <h3 id="section-attachments" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Załączniki ({app.attachments.length})
            </h3>
            {app.attachments.length > 0 ? (
              <ul className="flex flex-col gap-2" aria-label="Lista załączników">
                {app.attachments.map((att) => (
                  <li key={att.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AttachmentIcon type={att.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{att.name}</p>
                      <p className="text-xs text-gray-400">{att.size}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Pobierz ${att.name}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                      onClick={() => {
                        // TODO: podłączyć pod endpoint /api/attachments/:id/download
                        console.log('Pobieranie:', att.name);
                      }}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Pobierz
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Brak załączników do tego wniosku.</p>
            )}
          </section>

          {/* Notatki */}
          {app.notes && (
            <section aria-labelledby="section-notes">
              <h3 id="section-notes" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notatki</h3>
              <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-100 rounded-xl p-3">{app.notes}</p>
            </section>
          )}

          {/* Zmiana statusu */}
          <section aria-labelledby="section-status" className="border-t border-gray-100 pt-5">
            <h3 id="section-status" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Zmień status wniosku</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([status, cfg]) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(app.id, status)}
                  disabled={app.status === status}
                  className={[
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500',
                    app.status === status
                      ? `${cfg.color} border-transparent cursor-default opacity-80`
                      : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50',
                  ].join(' ')}
                  aria-pressed={app.status === status}
                  aria-label={`Ustaw status: ${cfg.label}`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
                  {cfg.label}
                  {app.status === status && (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Metadane */}
          <p className="text-xs text-gray-300 text-right">
            Złożono: {app.submittedAt}
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Główny komponent panelu placówki ---
export default function FacilityDashboard() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'wszystkie'>('wszystkie');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const searchId = useId();
  const filterStatusId = useId();

  // Statystyki
  const stats = {
    total: applications.length,
    nowe: applications.filter(a => a.status === 'nowy').length,
    weryfikacja: applications.filter(a => a.status === 'weryfikacja').length,
    zaakceptowane: applications.filter(a => a.status === 'zaakceptowany').length,
    odrzucone: applications.filter(a => a.status === 'odrzucony').length,
  };

  // Filtrowanie
  const filtered = applications.filter(app => {
    const matchStatus = filterStatus === 'wszystkie' || app.status === filterStatus;
    const matchSearch = !search.trim() ||
      app.childName.toLowerCase().includes(search.toLowerCase()) ||
      app.childPesel.includes(search) ||
      app.parentName.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Zmiana statusu
  const handleStatusChange = (id: string, status: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status } : a)
    );
    setSelectedApp(prev => prev?.id === id ? { ...prev, status } : prev);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel Placówki</h1>
        <p className="text-gray-500 text-sm mt-1">Przeglądaj wnioski rekrutacyjne i zarządzaj ich statusem.</p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6" role="list" aria-label="Podsumowanie wniosków">
        {[
          { label: 'Wszystkich', value: stats.total, color: 'text-gray-800', bg: 'bg-gray-50 border-gray-200' },
          { label: 'Nowych', value: stats.nowe, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Weryfikacja', value: stats.weryfikacja, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100' },
          { label: 'Zaakceptowanych', value: stats.zaakceptowane, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
          { label: 'Odrzuconych', value: stats.odrzucone, color: 'text-red-700', bg: 'bg-red-50 border-red-100' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-3 flex flex-col gap-0.5`} role="listitem">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtry */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        {/* Szukaj */}
        <div className="flex-1">
          <label htmlFor={searchId} className="sr-only">Szukaj wniosku</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Szukaj po nazwisku, PESEL, nr wniosku…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition"
            />
          </div>
        </div>

        {/* Filtr statusu */}
        <div>
          <label htmlFor={filterStatusId} className="sr-only">Filtruj według statusu</label>
          <select
            id={filterStatusId}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as ApplicationStatus | 'wszystkie')}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition"
          >
            <option value="wszystkie">Wszystkie statusy</option>
            {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista wniosków */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-gray-500">Brak wniosków</p>
            <p className="text-sm mt-1">Zmień filtry lub wyszukiwany termin.</p>
          </div>
        ) : (
          <ul aria-label={`Lista wniosków — ${filtered.length} wyników`}>
            {filtered.map((app, idx) => (
              <li
                key={app.id}
                className={idx < filtered.length - 1 ? 'border-b border-gray-100' : ''}
              >
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="w-full text-left px-5 py-4 hover:bg-pink-50 transition focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-pink-500 group"
                  aria-label={`Otwórz wniosek ${app.id} — ${app.childName}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar inicjały */}
                      <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-sm font-bold flex-shrink-0" aria-hidden="true">
                        {app.childName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800 text-sm">{app.childName}</span>
                          <span className="text-xs text-gray-400 font-mono">{app.id}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <span className="text-xs text-gray-500">{app.parentName}</span>
                          {app.attachments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {app.attachments.length} zał.
                            </span>
                          )}
                          <span className="text-xs text-gray-300">{app.priority}. priorytet</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={app.status} />
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-pink-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer z licznikiem */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Wyświetlono {filtered.length} z {applications.length} wniosków
          </div>
        )}
      </div>

      {/* Modal szczegółów */}
      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
