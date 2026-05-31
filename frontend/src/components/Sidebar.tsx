import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importujemy hooka do wylogowania

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/logowanie'); // Przenosimy użytkownika do logowania po wylogowaniu
  };

  return (
    // justify-between rozepcha te dwie sekcje (górę i dół) na przeciwległe końce
    <aside className="w-64 bg-white border-r h-screen sticky top-0 p-4 flex flex-col justify-between shadow-sm">
      
      {/* SEKCJA GÓRNA - Menu */}
      <div>
        <h2 className="font-bold text-xl text-pink-600 mb-4 px-2">Menu</h2>
        <nav className="flex flex-col gap-2" aria-label="Nawigacja boczna">
          <Link to="/panel/rodzic" className="p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md">
            Panel Rodzica
          </Link>
          <Link to="/panel/placowka" className="p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md">
            Panel Placówki
          </Link>
          {/* Tu możesz dodać link do "Dodaj dziecko" z Tygodnia 3 */}
          <Link to="/panel/rodzic/dziecko" className="p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 rounded-md">
            Dodaj dziecko
          </Link>
        </nav>
      </div>

      {/* SEKCJA DOLNA - Przycisk Wyloguj */}
      <div className="border-t pt-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
        >
          {/* Prosta ikonka wylogowania (SVG) */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Wyloguj się
        </button>
      </div>

    </aside>
  );
}
