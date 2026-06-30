import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AddHeadmaster() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    institutionId: '',
  });

  const [institutions, setInstitutions] = useState<any[]>([]);

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });


  // Pobranie listy placówek
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await api.get('/institution');
        setInstitutions(response.data);
      } catch (error) {
        console.error('Błąd pobierania placówek:', error);
      }
    };

    fetchInstitutions();
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus({
      type: 'loading',
      message: 'Trwa dodawanie konta...',
    });


    try {
      await api.post('/auth/register-headmaster', formData);

      setStatus({
        type: 'success',
        message: 'Konto dyrektora zostało pomyślnie utworzone!',
      });


      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        institutionId: '',
      });


    } catch (error: any) {

      console.error('Błąd rejestracji dyrektora:', error);

      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Wystąpił błąd serwera. Spróbuj ponownie.',
      });
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-10">

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


        <div className="bg-blue-50 px-8 py-6 border-b border-gray-200">

          <h1 className="text-2xl font-bold text-gray-800">
            Dodaj Dyrektora
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Utwórz konto dyrektora i przypisz placówkę.
          </p>

        </div>



        {status.type === 'success' && (
          <div className="bg-green-50 text-green-700 p-4 mx-8 mt-6 rounded-xl border border-green-200">
            {status.message}
          </div>
        )}


        {status.type === 'error' && (
          <div className="bg-red-50 text-red-700 p-4 mx-8 mt-6 rounded-xl border border-red-200">
            {status.message}
          </div>
        )}



        <form onSubmit={handleSubmit} className="p-8 space-y-6">


          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Imię
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border"
                placeholder="Jan"
              />
            </div>



            <div>
              <label className="block text-sm font-medium mb-2">
                Nazwisko
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border"
                placeholder="Kowalski"
              />

            </div>

          </div>



          <div>

            <label className="block text-sm font-medium mb-2">
              Adres e-mail
            </label>


            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="dyrektor@przedszkole.pl"
            />

          </div>




          <div>

            <label className="block text-sm font-medium mb-2">
              Hasło tymczasowe
            </label>


            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Hasło startowe"
            />


          </div>




          <div>

            <label className="block text-sm font-medium mb-2">
              Placówka
            </label>


            <select
              name="institutionId"
              value={formData.institutionId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border"
            >

              <option value="">
                Wybierz placówkę
              </option>


              {institutions.map((institution) => (

              <option
                key={institution.id_institution}
                value={institution.id_institution}
              >
                {institution.name} - {institution.city}
              </option>

            ))}


            </select>

          </div>




          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:bg-blue-300"
          >

            {status.type === 'loading'
              ? 'Tworzenie konta...'
              : 'Utwórz konto dyrektora'}

          </button>


        </form>

      </div>

    </div>
  );
}
