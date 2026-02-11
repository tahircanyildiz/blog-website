import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    if (saved === 'system') return 'light';
    return saved || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark' || theme === 'glass') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (theme === 'glass') {
      root.classList.add('glass');
    } else {
      root.classList.remove('glass');
    }

    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
