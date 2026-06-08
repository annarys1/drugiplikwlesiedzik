import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let savedUser = localStorage.getItem('user');
    let savedToken = localStorage.getItem('token');

    // Jeśli tokenu nie ma - ustaw mock token (do testowania)
    if (!savedToken) {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6InBhcmVudHMifQ.test';
      const mockUser = {
        id: 1,
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        role: "parents"
      };
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      savedToken = mockToken;
      savedUser = JSON.stringify(mockUser);
      
      console.log('✅ Mock token ustawiony w AuthContext');
    }

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await fetch('http://149.156.194.192:8803/api/auth/login', {
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

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setToken(data.token);
      return true;

    } catch (error) {
      console.error("Błąd połączenia z backendem. Czy serwer działa?", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  }
  return context;
};