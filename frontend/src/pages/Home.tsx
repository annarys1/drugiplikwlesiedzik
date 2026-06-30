import { useState, useEffect } from "react";
import api from '../api/axios';

export default function Home() {
  const [institutions, setInstitutions] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
useEffect(() => {
  const fetchData = async () => {

    try {
      const instRes = await api.get('/institution/list');
      setInstitutions(instRes.data);

    } catch (error) {
      console.error("Błąd pobierania placówek:", error);
    }


    try {
      const critRes = await api.get('/public/criteria');
      setCriteria(critRes.data);

    } catch (error) {
      console.error("Błąd pobierania kryteriów:", error);
    }


    setLoading(false);
  };

  fetchData();
}, []);

  return (
    <main>

      {/* Główna sekcja */}
      <section className="bg-pink-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h1 className="text-5xl font-bold text-pink-800 mb-6">
            EduEnroll
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Centralna rekrutacja do przedszkoli gminnych.
          </p>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Wybierz placówki, złóż wniosek i śledź jego status online.
          </p>

          

        </div>
      </section>

     <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Dostępne placówki</h2>

          {loading ? (
            <p className="text-center">Ładowanie danych...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {institutions.map((inst) => (
                <div key={inst.id_institution} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-xl mb-2">{inst.name}</h3>
                  <p className="text-gray-600 mb-2">{inst.city}</p>
                  <p className="text-sm">
                    Maks. miejsc: <b>{inst.max_capacity}</b>
                  </p>

                  {/* Dynamiczne kryteria: globalne + lokalne dla placówki */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-bold text-sm text-pink-700 uppercase mb-2">Kryteria rekrutacji:</h4>
                    <ul className="space-y-1">
                      {criteria
                        .filter((c) => c.id_institution === inst.id_institution || c.type === 'global')
                        .map((c) => (
                          <li key={c.id_criterion} className="flex justify-between text-sm bg-gray-50 p-1 px-2 rounded">
                            <span>
                              {c.name}
                              {c.is_variable === 1 && <span className="ml-1 text-[10px] text-gray-400">(zmienne)</span>}
                            </span>
                            <span className="font-bold text-pink-600">{c.criterion_point} pkt</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* Aktualna rekrutacja */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">

            <h2 className="text-3xl font-bold mb-4">
              Aktualna rekrutacja
            </h2>

            <p>
              Status:
              <span className="text-green-700 font-bold ml-2">
                Otwarta
              </span>
            </p>

            <p className="mt-2">
              Termin składania wniosków:
              <b> 1 czerwca - 7 lipca 2026</b>
            </p>

          </div>

        </div>
      </section>


      {/* Jak działa system */}
      <section className="bg-gray-50 py-16 px-6">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-10">
            Jak działa system?
          </h2>


          <div className="grid md:grid-cols-4 gap-6">

            {[
              "Dodaj dane dziecka",
              "Wybierz maksymalnie 3 placówki",
              "Dodaj wymagane dokumenty",
              "Odbierz wynik rekrutacji"
            ].map((item, index) => (

              <div
                key={index}
                className="bg-white rounded-xl shadow p-6 text-center"
              >
                <div className="text-4xl font-bold text-pink-700">
                  {index + 1}
                </div>

                <p className="mt-3">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* Najważniejsze informacje */}
      <section className="py-16 px-6">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-10">
            Najważniejsze informacje
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-xl">
                Kryteria punktowe
              </h3>
              <p>
                Sprawdź, za co przyznawane są punkty rekrutacyjne.
              </p>
            </div>


            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-xl">
                Wymagane dokumenty
              </h3>
              <p>
                                  
                📄 Wniosek rekrutacyjny
              </p>
              <p>
                              
                Dołącz uzupełniony wniosek rekrutacyjny zawierający
                dane dziecka oraz dane opiekuna.

              </p>
            </div>


            

          </div>

        </div>

      </section>

    </main>
  );
}
