import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ColorTheme {
  name: string;
  primary: string;
  primaryGlow: string;
  accent: string;
  gradient: string;
  glowColor: string;
}

export const colorThemes: Record<string, ColorTheme> = {
  emerald: {
    name: 'Emerald',
    primary: '158 64% 52%',
    primaryGlow: '158 64% 42%',
    accent: '158 64% 52%',
    gradient: 'linear-gradient(135deg, hsl(158 64% 52%), hsl(158 64% 42%))',
    glowColor: '158 64% 52%'
  },
  crimson: {
    name: 'Crimson',
    primary: '0 84% 60%',
    primaryGlow: '0 84% 50%',
    accent: '0 84% 60%',
    gradient: 'linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))',
    glowColor: '0 84% 60%'
  },
  sapphire: {
    name: 'Sapphire',
    primary: '217 91% 60%',
    primaryGlow: '217 91% 50%',
    accent: '217 91% 60%',
    gradient: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 50%))',
    glowColor: '217 91% 60%'
  },
  amethyst: {
    name: 'Amethyst',
    primary: '267 84% 64%',
    primaryGlow: '267 84% 54%',
    accent: '267 84% 64%',
    gradient: 'linear-gradient(135deg, hsl(267 84% 64%), hsl(267 84% 54%))',
    glowColor: '267 84% 64%'
  },
  amber: {
    name: 'Amber',
    primary: '45 93% 58%',
    primaryGlow: '45 93% 48%',
    accent: '45 93% 58%',
    gradient: 'linear-gradient(135deg, hsl(45 93% 58%), hsl(45 93% 48%))',
    glowColor: '45 93% 58%'
  },
  rose: {
    name: 'Rose',
    primary: '330 81% 60%',
    primaryGlow: '330 81% 50%',
    accent: '330 81% 60%',
    gradient: 'linear-gradient(135deg, hsl(330 81% 60%), hsl(330 81% 50%))',
    glowColor: '330 81% 60%'
  }
};

interface ThemeContextType {
  currentTheme: string;
  setTheme: (themeName: string) => void;
  theme: ColorTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('emerald');

  const setTheme = (themeName: string) => {
    if (colorThemes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('preferred-theme', themeName);
      applyTheme(colorThemes[themeName]);
    }
  };

  const applyTheme = (theme: ColorTheme) => {
    const root = document.documentElement;
    
    // Update CSS variables
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--upload-zone-active', theme.primary);
    root.style.setProperty('--gradient-primary', theme.gradient);
    root.style.setProperty('--shadow-glow', `0 0 40px hsl(${theme.glowColor} / 0.15)`);
  };

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('preferred-theme');
    if (savedTheme && colorThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
      applyTheme(colorThemes[savedTheme]);
    } else {
      applyTheme(colorThemes[currentTheme]);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      theme: colorThemes[currentTheme]
    }}>
      {children}
    </ThemeContext.Provider>
  );
};