import { useState } from 'react';
import api from '../api/axios';

export default function AddInstitution() {

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    max_capacity: '',
  });


  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();


    setStatus({
      type: 'loading',
      message: 'Trwa dodawanie placówki...',
    });



    try {

      await api.post('/institution/add', {
        ...formData,
        max_capacity: Number(formData.max_capacity),
      });



      setStatus({
        type: 'success',
        message: 'Placówka została pomyślnie dodana!',
      });



      setFormData({
        name: '',
        city: '',
        max_capacity: '',
      });



    } catch (error: any) {

      console.error(
        'Błąd dodawania placówki:',
        error
      );


      setStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Wystąpił błąd serwera.',
      });

    }

  };




  return (

    <div className="max-w-2xl mx-auto mt-10">


      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">


        <div className="bg-blue-50 px-8 py-6 border-b border-gray-200">


          <h1 className="text-2xl font-bold text-gray-800">
            Dodaj placówkę
          </h1>


          <p className="text-sm text-gray-500 mt-1">
            Utwórz nową placówkę edukacyjną.
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






        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >



          <div>


            <label className="block text-sm font-medium mb-2">
              Nazwa placówki
            </label>


            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Przedszkole nr 1"
            />


          </div>






          <div>


            <label className="block text-sm font-medium mb-2">
              Miasto
            </label>


            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="Kraków"
            />


          </div>






          <div>


            <label className="block text-sm font-medium mb-2">
              Maksymalna liczba miejsc
            </label>


            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 rounded-xl border"
              placeholder="100"
            />


          </div>






          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl disabled:bg-blue-300"
          >

            {status.type === 'loading'
              ? 'Dodawanie...'
              : 'Dodaj placówkę'}

          </button>




        </form>


      </div>


    </div>

  );

}