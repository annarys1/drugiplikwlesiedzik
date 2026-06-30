import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  // Przy ładowaniu aplikacji sprawdź, czy w localStorage jest token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Opcjonalnie: zrób zapytanie do /api/me po dane użytkownika
      // setUser({ role: 'parent', ... });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
