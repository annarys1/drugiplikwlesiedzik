import { useNavigate } from 'react-router-dom';

export default function DirectorDashboard() {

  const navigate = useNavigate();


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Panel Placówki
      </h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


        {/* Wnioski */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">

          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            📄
          </div>


          <div>
            <h2 className="font-semibold text-gray-800">
              Wnioski rekrutacyjne
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Przeglądaj i zarządzaj złożonymi wnioskami.
            </p>
          </div>


          <button
            onClick={() => navigate('/panel/placowka/wnioski')}
            className="mt-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Przejdź →
          </button>

        </div>



        {/* Kryteria */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">

          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            ⚙️
          </div>


          <div>
            <h2 className="font-semibold text-gray-800">
              Kryteria placówki
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Dodawaj, edytuj i usuwaj kryteria rekrutacji.
            </p>
          </div>


          <button
            onClick={() => navigate('/panel/placowka/kryteria')}
            className="mt-auto px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            Zarządzaj →
          </button>

        </div>


      </div>

    </div>
  );
}