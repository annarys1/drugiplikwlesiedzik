import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col gap-4 shadow-sm">
      <h2 className="font-bold text-xl text-pink-600 mb-4 px-2">Menu</h2>
      <nav className="flex flex-col gap-2" aria-label="Nawigacja boczna">
  <Link to="/panel/rodzic" className="p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md">
    Panel Rodzica
  </Link>
  <Link to="/panel/placowka" className="p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md">
    Panel Placówki
  </Link>
</nav>
    </aside>
  );
}
