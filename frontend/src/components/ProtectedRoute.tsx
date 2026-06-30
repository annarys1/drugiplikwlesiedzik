import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  // 1. Zamiast 'isAuthenticated' używamy 'user' (tak jak mamy w AuthContext)
  const { user, isLoading } = useAuth();

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

  // 2. Jeśli nie ma zalogowanego usera -> do logowania (zakładam, że ścieżka to "/")
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Jeśli rola usera nie zgadza się z wymaganą -> wyślij go na JEGO panel
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return <Navigate to="/panel/gmina" replace />;
    if (user.role === 'headmaster') return <Navigate to="/panel/placowka" replace />;
    return <Navigate to="/panel/rodzic" replace />;
  }

  // 4. Jeśli wszystko jest ok -> pokaż zawartość
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;