import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 flex flex-col gap-4 shadow-sm">
      <h2 className="font-bold text-xl text-blue-800 mb-4 px-2">Menu Panelu</h2>
      <nav className="flex flex-col gap-2" aria-label="Nawigacja boczna">
        <Link to="/panel/rodzic" className="p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
          Panel Rodzica
        </Link>
        <Link to="/panel/placowka" className="p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
          Panel Placówki
        </Link>
        <Link to="/panel/gmina" className="p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
          Panel Gminy
        </Link>
      </nav>
    </aside>
  );
}
