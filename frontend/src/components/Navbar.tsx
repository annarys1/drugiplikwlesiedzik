import { Link } from 'react-router-dom';
import ContrastToggle from './ContrastToggle';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 border-b border-gray-200" aria-label="Główna nawigacja">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-700 hover:text-pink-800 rounded focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
          EduEnroll
        </Link>
        <div className="flex items-center gap-4">
          <ContrastToggle />
          <Link to="/logowanie" className="px-4 py-2 font-medium text-pink-700 bg-blue-50 hover:bg-blue-100 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
            Zaloguj się
          </Link>
          <Link to="/rejestracja" className="px-4 py-2 font-medium text-white bg-pink-700 hover:bg-blue-800 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </nav>
  );
}
