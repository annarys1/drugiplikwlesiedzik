import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/axios';

// 1. Definiujemy, jak wygląda użytkownik
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// 2. Definiujemy, co udostępnia nasz kontekst
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<{ success: boolean; role?: string; message?: string }>;
  token: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Pobieramy token i usera z localStorage na starcie aplikacji
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      // Zapisujemy token ORAZ dane użytkownika w przeglądarce
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Aktualizujemy stan aplikacji
      setToken(data.token);
      setUser(data.user);

      // Zwracamy rolę do Login.tsx, żeby wiedział, gdzie przekierować!
      return { success: true, role: data.user.role };
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Błąd połączenia z serwerem';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('użyj AuthProvider w App.tsx!');
  return context;
}