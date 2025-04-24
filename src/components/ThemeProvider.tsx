"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const initialState: ThemeContextType = {
  theme: 'system',
  setTheme: () => null,
  isDarkMode: false,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'zoba-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (defaultTheme === 'system') {
      setTheme('system');
    }
  }, [defaultTheme, storageKey]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Determine if dark mode should be applied
    let isDark = false;
    
    if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }
    
    // Apply the appropriate class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setIsDarkMode(isDark);
    
    // Save the theme preference
    localStorage.setItem(storageKey, theme);
    
    // Force a re-render of the entire app
    document.body.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme, storageKey]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const isDark = mediaQuery.matches;
      
      root.classList.remove('light', 'dark');
      if (isDark) {
        root.classList.add('dark');
      }
      
      setIsDarkMode(isDark);
      document.body.style.colorScheme = isDark ? 'dark' : 'light';
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  const value = {
    theme,
    setTheme,
    isDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
