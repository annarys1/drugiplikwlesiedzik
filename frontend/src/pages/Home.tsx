import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main>

      {/* Główna sekcja */}
      <section className="bg-pink-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h1 className="text-5xl font-bold text-pink-800 mb-6">
            EduEnroll
          </h1>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Centralna rekrutacja do przedszkoli i żłobków gminnych.
            Wybierz placówki, złóż wniosek i śledź jego status online.
          </p>

          <Link
            to="/placowki"
            className="inline-block mt-8 bg-pink-700 text-white px-8 py-3 rounded-xl hover:bg-pink-800"
          >
            Zobacz dostępne placówki
          </Link>

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
              <b> 1 marca - 31 marca 2027</b>
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

          <div className="grid md:grid-cols-3 gap-6">

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
                Dowiedz się, jakie dokumenty należy dołączyć.
              </p>
            </div>


            <div className="border rounded-xl p-6">
              <h3 className="font-bold text-xl">
                Harmonogram
              </h3>
              <p>
                Zobacz terminy kolejnych etapów rekrutacji.
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
