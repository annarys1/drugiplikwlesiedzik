import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
// 1. Definiujemy strukturę użytkownika zgodnie z tym, co wysyła backend
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // Tutaj trafi "parents" ze screena
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Automatyczne sprawdzanie sesji przy starcie aplikacji
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // 3. Prawdziwa funkcja logowania łącząca się z backendem
  const login = async (credentials: any) => {
    try {
      // UWAGA: Zmień port 5000 na taki, na jakim faktycznie działają Twoi koledzy!
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        console.error("Błąd logowania: Serwer zwrócił status", response.status);
        return false;
      }

      const data = await response.json();

      // Zapisujemy dane zgodnie ze wskazówkami kolegów
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Zapisujemy profil, żeby nie zniknął po F5
      
      setUser(data.user);
      return true;

    } catch (error) {
      console.error("Błąd połączenia z backendem. Czy serwer działa?", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Hook do łatwego używania logowania w komponentach
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  }
  return context;
};
