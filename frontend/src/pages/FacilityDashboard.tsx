import { useState, useId, useEffect, useCallback } from 'react';
import api from '../api/axios';

// --- Typy ---
type ApplicationStatus = 'submitted' | 'correction_needed' | 'approved' | 'rejected';

interface Attachment {
  id_document: number;
  id_application: number;
  id_criterion: number;
  file_path: string;
  created_at: string;
}

// Kształt pojedynczego wiersza zwracanego przez
// GET /api/applications/director/applications
interface ApiApplicationRow {
  id_application: number;
  status: ApplicationStatus;
  created_at: string;
  id_children: number;
  child_name: string;
  child_surname: string;
  child_pesel: string;
  child_birth_date: string;
  child_address: string;
  parent_name: string;
  parent_surname: string;
  parent_email: string;
  preference_order: number;
  calculated_points: number;
  id_institution: number;
  institution_name: string;
  attachments: Attachment[];
}

interface Application {
  id: string;
  id_application: number;
  childName: string;
  childPesel: string;
  childBirthDate: string;
  parentName: string;
  parentEmail: string;
  address: string;
  submittedAt: string;
  status: ApplicationStatus;
  priority: number;
  points: number;
  institutionName: string;
  attachments: Attachment[];
}

function mapApiRowToApplication(row: ApiApplicationRow): Application {
  return {
    id: `W/${row.id_application}`,
    id_application: row.id_application,
    childName: `${row.child_name} ${row.child_surname}`,
    childPesel: row.child_pesel,
    childBirthDate: row.child_birth_date,
    parentName: `${row.parent_name} ${row.parent_surname}`,
    parentEmail: row.parent_email,
    address: row.child_address,
    submittedAt: row.created_at,
    status: row.status,
    priority: row.preference_order,
    points: row.calculated_points,
    institutionName: row.institution_name,
    attachments: row.attachments || [],
  };
}

// --- Konfiguracja statusów (zgodna z wartościami w bazie danych) ---
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; dot: string }> = {
  submitted:         { label: 'Nowy',               color: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500' },
  correction_needed: { label: 'Wymaga poprawek',     color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  approved:          { label: 'Zaakceptowany',       color: 'bg-green-100 text-green-800',  dot: 'bg-green-500' },
  rejected:          { label: 'Odrzucony',           color: 'bg-red-100 text-red-800',      dot: 'bg-red-500' },
};

function fileNameFromPath(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

function formatDate(value: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('pl-PL');
}

// --- Ikona załącznika ---
function AttachmentIcon() {
  return (
    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
  statusUpdating,
}: {
  app: Application;
  onClose: () => void;
  onStatusChange: (id_application: number, status: ApplicationStatus) => void;
  statusUpdating: boolean;
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <p className="text-xs text-gray-400 font-mono">Wniosek {app.id}</p>
            <h2 id={modalTitleId} className="text-lg font-bold text-gray-800">{app.childName}</h2>
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
          <section aria-labelledby="section-child">
            <h3 id="section-child" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dane dziecka</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Imię i nazwisko</p><p className="font-medium text-gray-800">{app.childName}</p></div>
              <div><p className="text-gray-400 text-xs">PESEL</p><p className="font-medium text-gray-800 font-mono">{app.childPesel}</p></div>
              <div><p className="text-gray-400 text-xs">Data urodzenia</p><p className="font-medium text-gray-800">{formatDate(app.childBirthDate)}</p></div>
              <div><p className="text-gray-400 text-xs">Priorytet placówki</p><p className="font-medium text-gray-800">{app.priority}. wybór ({app.points} pkt)</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Placówka</p><p className="font-medium text-gray-800">{app.institutionName}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Adres zamieszkania</p><p className="font-medium text-gray-800">{app.address}</p></div>
            </div>
          </section>

          <section aria-labelledby="section-parent">
            <h3 id="section-parent" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dane rodzica/opiekuna</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Imię i nazwisko</p><p className="font-medium text-gray-800">{app.parentName}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">E-mail</p><p className="font-medium text-gray-800">{app.parentEmail}</p></div>
            </div>
          </section>

          <section aria-labelledby="section-attachments">
            <h3 id="section-attachments" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Załączniki ({app.attachments.length})
            </h3>
            {app.attachments.length > 0 ? (
              <ul className="flex flex-col gap-2" aria-label="Lista załączników">
                {app.attachments.map((att) => (
                  <li key={att.id_document} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AttachmentIcon />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{fileNameFromPath(att.file_path)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic py-2">Brak załączników do tego wniosku.</p>
            )}
          </section>

          <section aria-labelledby="section-status" className="border-t border-gray-100 pt-5">
            <h3 id="section-status" className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Zmień status wniosku</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, typeof STATUS_CONFIG[ApplicationStatus]][]).map(([status, cfg]) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(app.id_application, status)}
                  disabled={app.status === status || statusUpdating}
                  className={[
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition disabled:cursor-not-allowed',
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

          <p className="text-xs text-gray-300 text-right">Złożono: {formatDate(app.submittedAt)}</p>
        </div>
      </div>
    </div>
  );
}

// --- Główny komponent panelu placówki ---
export default function FacilityDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'wszystkie'>('wszystkie');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const searchId = useId();
  const filterStatusId = useId();

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiApplicationRow[]>('/applications/director/applications');
      setApplications(response.data.map(mapApiRowToApplication));
    } catch (err: any) {
      console.error('Błąd pobierania wniosków:', err);
      setError(
        err?.response?.data?.message ||
        'Nie udało się pobrać wniosków. Sprawdź połączenie z serwerem i spróbuj ponownie.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const stats = {
    total: applications.length,
    nowe: applications.filter(a => a.status === 'submitted').length,
    weryfikacja: applications.filter(a => a.status === 'correction_needed').length,
    zaakceptowane: applications.filter(a => a.status === 'approved').length,
    odrzucone: applications.filter(a => a.status === 'rejected').length,
  };

  const filtered = applications.filter(app => {
    const matchStatus = filterStatus === 'wszystkie' || app.status === filterStatus;
    const matchSearch = !search.trim() ||
      app.childName.toLowerCase().includes(search.toLowerCase()) ||
      app.childPesel.includes(search) ||
      app.parentName.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id_application: number, status: ApplicationStatus) => {
    setStatusUpdating(true);
    try {
      await api.patch(`/applications/status/${id_application}`, { status });
      setApplications(prev => prev.map(a => a.id_application === id_application ? { ...a, status } : a));
      setSelectedApp(prev => prev?.id_application === id_application ? { ...prev, status } : prev);
    } catch (err: any) {
      console.error('Błąd zmiany statusu:', err);
      alert(err?.response?.data?.message || 'Nie udało się zmienić statusu wniosku.');
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel Placówki</h1>
          <p className="text-gray-500 text-sm mt-1">Przeglądaj wnioski rekrutacyjne i zarządzaj ich statusem.</p>
        </div>
        <button
          type="button"
          onClick={loadApplications}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
        >
          {loading ? 'Odświeżanie…' : 'Odśwież'}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6" role="list" aria-label="Podsumowanie wniosków">
        {[
          { label: 'Wszystkich',      value: stats.total,         color: 'text-gray-800',   bg: 'bg-gray-50 border-gray-200' },
          { label: 'Nowych',          value: stats.nowe,          color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-100' },
          { label: 'Wymaga poprawek', value: stats.weryfikacja,   color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-100' },
          { label: 'Zaakceptowanych', value: stats.zaakceptowane, color: 'text-green-700',  bg: 'bg-green-50 border-green-100' },
          { label: 'Odrzuconych',     value: stats.odrzucone,     color: 'text-red-700',    bg: 'bg-red-50 border-red-100' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-3 flex flex-col gap-0.5`} role="listitem">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
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

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <p className="font-medium text-gray-500">Wczytywanie wniosków…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-gray-500">Brak wniosków</p>
            <p className="text-sm mt-1">
              {applications.length === 0 ? 'Do Twojej placówki nie wpłynęły jeszcze żadne wnioski.' : 'Zmień filtry lub wyszukiwany termin.'}
            </p>
          </div>
        ) : (
          <ul aria-label={`Lista wniosków — ${filtered.length} wyników`}>
            {filtered.map((app, idx) => (
              <li key={`${app.id_application}-${app.institutionName}`} className={idx < filtered.length - 1 ? 'border-b border-gray-100' : ''}>
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="w-full text-left px-5 py-4 hover:bg-pink-50 transition focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-pink-500 group"
                  aria-label={`Otwórz wniosek ${app.id} — ${app.childName}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
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
                          <span className="text-xs text-gray-300">{app.priority}. priorytet · {app.points} pkt</span>
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
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Wyświetlono {filtered.length} z {applications.length} wniosków
          </div>
        )}
      </div>

      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onStatusChange={handleStatusChange}
          statusUpdating={statusUpdating}
        />
      )}
    </div>
  );
}
