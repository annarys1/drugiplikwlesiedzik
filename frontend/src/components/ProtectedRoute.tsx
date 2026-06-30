import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuth() as any;

  
  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center bg-[#efb7cd]"
        role="status"
        aria-label="Trwa ładowanie aplikacji"
      >
        <div className="relative mb-6" aria-hidden="true">
          <div className="w-16 h-16 rounded-full border-4 border-pink-200 border-t-pink-700 animate-spin" />
        </div>
        <p
          className="font-semibold text-lg text-pink-900 tracking-wide"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Ładowanie sesji…
        </p>
        <p className="text-pink-700 text-sm mt-1 opacity-75">
          Sprawdzamy Twoje dane
        </p>
      </div>
    );
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
