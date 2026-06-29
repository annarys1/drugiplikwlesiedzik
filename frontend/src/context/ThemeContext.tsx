import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ThemeContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const STORAGE_KEY = 'highContrast';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
    localStorage.setItem(STORAGE_KEY, String(highContrast));
  }, [highContrast]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ highContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme musi być użyty wewnątrz ThemeProvider');
  return context;
}
