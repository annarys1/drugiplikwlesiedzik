import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (credentials: any) => {
    // Udawane logowanie dla testów
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (credentials.password === 'admin123') {
      const mockUser = { email: credentials.email, role: 'PARENT' };
      setUser(mockUser);
      localStorage.setItem('token', 'fake-token');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth musi być użyty wewnątrz AuthProvider");
  return context;
};
