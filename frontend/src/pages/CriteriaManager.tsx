import {useEffect,useState} from "react";
import api from "../api/axios";


export default function CriteriaManager(){

const [criteria,setCriteria]=useState<any[]>([]);


const load=async()=>{

const res=await api.get(
'/criteria/headmaster'
);

setCriteria(res.data);

};


useEffect(()=>{
load();
},[]);



return (

<div>

<h1 className="text-2xl font-bold mb-5">
Kryteria placówki
</h1>


<button
className="bg-pink-600 text-white px-4 py-2 rounded"
>
+ Dodaj kryterium
</button>



<table className="w-full mt-5">

<thead>

<tr>
<th>Nazwa</th>
<th>Punkty</th>
<th>Typ</th>
<th></th>
</tr>

</thead>


<tbody>

{
criteria.map(c=>(

<tr key={c.id_criterion}>

<td>
{c.name}
</td>


<td>
{c.criterion_point}
</td>


<td>
{c.is_variable ? 
"zmienne":
"stałe"}
</td>


<td>

<button>
Edytuj
</button>

</td>


</tr>


))
}


</tbody>


</table>


</div>

)

}