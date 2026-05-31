import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  // Dodajemy isLoading z naszego Contextu
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Dopóki aplikacja sprawdza localStorage, pokazujemy ekran ładowania
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-semibold text-indigo-600">Ładowanie sesji...</div>;
  }

  // 2. Jeśli ładowanie się skończyło i użytkownik NIE jest zalogowany -> do logowania
  if (!isAuthenticated) {
    return <Navigate to="/logowanie" replace />;
  }

  // 3. Jeśli rola użytkownika nie pasuje do wymaganej
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // 4. Jeśli wszystko jest ok -> pokaż zawartość
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
