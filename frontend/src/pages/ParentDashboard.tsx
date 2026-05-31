import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/logowanie'); // Upewnij się, że ścieżka pasuje do App.tsx
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Witaj, {user?.email}!</h1>
      <p className="mt-2">To jest Twój bezpieczny panel rodzica.</p>
      <button 
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
      >
        Wyloguj się
      </button>
    </div>
  );
};

export default ParentDashboard;
