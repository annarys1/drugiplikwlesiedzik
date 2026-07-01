import { useEffect, useState } from "react";
import api from "../api/axios";


interface Props {
  role: "admin" | "headmaster";
}

export default function CriteriaManager({ role }: Props) {

  const isAdmin = role === "admin";
  const canManage = role === "admin" || role === "headmaster";

  const [criteria, setCriteria] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedPoints, setEditedPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [newCriterion, setNewCriterion] = useState({
    name: "",
    criterion_point: ""
  });


  const load = async () => {
    try {

      const endpoint = isAdmin
        ? "/criteria/admin"
        : "/criteria/headmaster";

      const res = await api.get(endpoint);

      setCriteria(res.data);

    } catch(error) {
      console.error("Błąd pobierania kryteriów:", error);
    }
  };


  useEffect(() => {
    load();
  }, [role]);





  const savePoints = async (id: number) => {

  try {

    setLoading(true);

    const endpoint = isAdmin
      ? `/criteria/admin/${id}`
      : `/criteria/headmaster/${id}`;

    await api.put(endpoint, {
      criterion_point: Number(editedPoints)
    });

    setEditingId(null);
    setEditedPoints("");

    await load();

  } catch (error) {

    console.error("Błąd zapisu kryterium:", error);

  } finally {

    setLoading(false);

  }

};






  const deleteCriterion = async (id: number) => {

  const confirmDelete = window.confirm(
    "Czy na pewno chcesz usunąć to kryterium?"
  );

  if (!confirmDelete) return;

  try {

    const endpoint = isAdmin
      ? `/criteria/admin/${id}`
      : `/criteria/headmaster/${id}`;

    await api.delete(endpoint);

    await load();

  } catch (error) {

    console.error("Błąd usuwania kryterium:", error);

  }

};






  const addCriterion = async () => {

  if (!newCriterion.name || !newCriterion.criterion_point) {
    alert("Uzupełnij wszystkie pola");
    return;
  }

  try {

    const endpoint = isAdmin
      ? "/criteria/admin"
      : "/criteria/headmaster";

    await api.post(endpoint, {
    name: newCriterion.name,
    criterion_point: Number(newCriterion.criterion_point),
    type: "institution"
  });

    setNewCriterion({
      name: "",
      criterion_point: ""
    });

    setShowAdd(false);

    await load();

  } catch (error) {

    console.error("Błąd dodawania kryterium:", error);

  }

};


  return (

    <div className="p-6">


      <h1 className="text-2xl font-bold mb-5 text-gray-800">

        Kryteria rekrutacji

      </h1>




      {
        canManage  && (

          <button

            onClick={() =>
              setShowAdd(!showAdd)
            }

            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg mb-5"

          >

            + Dodaj kryterium

          </button>

        )
      }







      {
        showAdd && canManage && (

          <div className="mb-5 p-4 border rounded-lg bg-gray-50">


            <h2 className="font-semibold mb-3">

              Nowe kryterium

            </h2>



            <input

              type="text"

              placeholder="Nazwa kryterium"

              value={newCriterion.name}

              onChange={(e)=>
                setNewCriterion({
                  ...newCriterion,
                  name:e.target.value
                })
              }

              className="border rounded px-3 py-2 mr-3"

            />



            <input

              type="number"

              placeholder="Punkty"

              value={newCriterion.criterion_point}

              onChange={(e)=>
                setNewCriterion({
                  ...newCriterion,
                  criterion_point:e.target.value
                })
              }

              className="border rounded px-3 py-2 mr-3"

            />



            <button

              onClick={addCriterion}

              className="bg-green-600 text-white px-4 py-2 rounded"

            >

              Dodaj

            </button>


          </div>

        )

      }







      <div className="overflow-x-auto">


        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">


          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3 border-b">
                Nazwa
              </th>


              <th className="text-left p-3 border-b">
                Punkty
              </th>


              <th className="text-left p-3 border-b">
                Typ
              </th>


              <th className="text-left p-3 border-b">
                Akcje
              </th>


            </tr>

          </thead>






          <tbody>


          {
            criteria.map((c)=>(


              <tr
                key={c.id_criterion}
                className="hover:bg-gray-50"
              >



                <td className="p-3 border-b">

                  {c.name}

                </td>





                <td className="p-3 border-b">


                {
                  editingId === c.id_criterion ? (

                    <input

                      type="number"

                      value={editedPoints}

                      onChange={(e)=>
                        setEditedPoints(
                          e.target.value
                        )
                      }

                      className="border rounded px-2 py-1 w-24"

                    />


                  ) : (

                    c.criterion_point

                  )

                }


                </td>





                <td className="p-3 border-b">


                  {
                    c.is_variable
                    ? "Zmienny"
                    : "Stały"
                  }


                </td>






                <td className="p-3 border-b">



                {


                editingId === c.id_criterion ? (


                    <button

                      disabled={loading}

                      onClick={() =>
                        savePoints(
                          c.id_criterion
                        )
                      }

                      className="text-green-600 hover:underline"

                    >

                      {
                        loading
                        ? "Zapisywanie..."
                        : "Zapisz"
                      }


                    </button>


                ) : (


                  isAdmin || c.id_institution !== null ?(

                    <>


                      <button

                        onClick={() => {

                          setEditingId(
                            c.id_criterion
                          );


                          setEditedPoints(
                            String(
                              c.criterion_point
                            )
                          );

                        }}

                        className="text-blue-600 hover:underline mr-3"

                      >

                        Edytuj

                      </button>





                      <button

                        onClick={() =>
                          deleteCriterion(
                            c.id_criterion
                          )
                        }

                        className="text-red-600 hover:underline"

                      >

                        Usuń

                      </button>


                    </>


                  ) : (

                    <span className="text-gray-400">

                      Tylko administrator

                    </span>

                  )


                )


                }



                </td>



              </tr>


            ))
          }


          </tbody>


        </table>


      </div>


    </div>

  );

}