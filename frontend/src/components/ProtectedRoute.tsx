import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, isAuthenticated } = useAuth();

  // Jeśli użytkownik nie jest zalogowany, wyślij go do strony logowania
  if (!isAuthenticated) {
    return <Navigate to="/logowanie" replace />;
  }

  // Jeśli rola użytkownika nie pasuje do wymaganej (np. rodzic w panelu gminy)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Jeśli wszystko jest ok, pokaż zawartość (Outlet lub dzieci)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
