import { useEffect, useState } from 'react';
import api from '../api/axios';


interface Application {
  id_application: number;
  first_name: string;
  last_name: string;
  status: string; 
  chosen_institutions: string; 
  points?: number; 
}

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my-applications');
        setApplications(response.data);
      } catch (err) {
        console.error("Błąd pobierania wniosków", err);
        setError('Nie udało się pobrać listy wniosków. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const translateStatus = (status: string) => {
    switch (status) {
      case 'submitted': return 'Złożony (Oczekuje)';
      case 'approved': return 'Zatwierdzony';
      case 'rejected': return 'Odrzucony';
      case 'correction_needed': return 'Wymaga poprawy';
      default: return status;
    }
  };

  if (loading) return <div className="p-6 text-lg">Ładowanie wniosków...</div>;
  if (error) return <div className="p-6 text-red-600 font-bold">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Moje złożone wnioski</h1>
      
      {applications.length === 0 ? (
        <p className="text-gray-600 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          Nie złożyłeś jeszcze żadnego wniosku. Zrób to klikając przycisk "Złóż nowy wniosek" na swoim panelu.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Imię i nazwisko dziecka</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Preferencja</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Punkty</th>
              </tr>
            </thead>
<tbody className="divide-y divide-gray-200">
  {applications.map((app) => (
    <tr key={app.id_application} className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 font-medium text-gray-800">
        {app.first_name} {app.last_name}
      </td>
      
      {/* Tutaj wyświetlamy wybrane placówki zamiast preference_order */}
      <td className="py-4 px-6 text-gray-600 text-sm">
        {app.chosen_institutions || 'Brak wybranych placówek'}
      </td>
      
      {/* Tutaj używamy app.status (tak jak w SQL) */}
      <td className="py-4 px-6">
        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
          app.status === 'approved' ? 'bg-green-100 text-green-700' :
          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
          app.status === 'correction_needed' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {translateStatus(app.status)}
        </span>
      </td>
      
      {/* Tutaj wyświetlamy punkty */}
      <td className="py-4 px-6 font-bold text-gray-800">
        {app.points ? `${app.points} pkt` : 'Brak danych'}
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;