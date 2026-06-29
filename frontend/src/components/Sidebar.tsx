import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ContrastToggle from './ContrastToggle';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: '/panel/rodzic',
    label: 'Panel Rodzica',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/panel/placowka',
    label: 'Panel Placówki',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-3a1 1 0 011-1h2a1 1 0 011 1v3" />
      </svg>
    ),
  },
  {
    to: '/panel/gmina',
    label: 'Panel Gminy',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/logowanie');
  };

  return (
    <aside
      className="w-64 bg-white border-r border-pink-100 min-h-screen flex flex-col shadow-sm"
      aria-label="Nawigacja boczna"
    >
      {/* Logo / nazwa */}
      <div className="px-6 py-5 border-b border-pink-100">
        <p
          className="text-xl font-bold text-pink-800 leading-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          System opieki
        </p>
        {user && (
          <p className="text-xs text-gray-400 mt-0.5 truncate" aria-label={`Zalogowany jako: ${user.firstName} ${user.lastName}`}>
            {user.firstName} {user.lastName}
          </p>
        )}
      </div>

      {/* Przełącznik wysokiego kontrastu (WCAG 2.1) */}
      <div className="px-3 py-3 border-b border-pink-100">
        <ContrastToggle />
      </div>

      {/* Nawigacja — rośnie i wypycha logout na dół */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Menu główne">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500',
                isActive
                  ? 'bg-pink-100 text-pink-800'
                  : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700',
              ].join(' ')
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Wyloguj — zawsze na dole */}
      <div className="px-3 py-4 border-t border-pink-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-gray-500
            hover:bg-red-50 hover:text-red-700 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          aria-label="Wyloguj się z aplikacji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Wyloguj się</span>
        </button>
      </div>
    </aside>
  );
}
