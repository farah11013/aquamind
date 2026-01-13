import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface Theme {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const presetThemes: Record<string, Theme> = {
  ocean: {
    name: 'Ocean Blue',
    light: {
      background: '0 0% 100%',
      foreground: '210 50% 8%',
      card: '0 0% 100%',
      cardForeground: '210 50% 8%',
      popover: '0 0% 100%',
      popoverForeground: '210 50% 8%',
      primary: '210 100% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '180 80% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '210 40% 96%',
      mutedForeground: '210 20% 40%',
      accent: '210 40% 96%',
      accentForeground: '210 50% 8%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '210 40% 90%',
      input: '210 40% 90%',
      ring: '210 100% 50%',
    },
    dark: {
      background: '210 50% 8%',
      foreground: '0 0% 98%',
      card: '210 45% 12%',
      cardForeground: '0 0% 98%',
      popover: '210 45% 12%',
      popoverForeground: '0 0% 98%',
      primary: '180 80% 50%',
      primaryForeground: '210 50% 8%',
      secondary: '210 60% 30%',
      secondaryForeground: '0 0% 98%',
      muted: '210 40% 20%',
      mutedForeground: '210 20% 70%',
      accent: '210 40% 20%',
      accentForeground: '0 0% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '210 40% 25%',
      input: '210 40% 25%',
      ring: '180 80% 50%',
    },
  },
  coral: {
    name: 'Coral Reef',
    light: {
      background: '0 0% 100%',
      foreground: '20 50% 10%',
      card: '0 0% 100%',
      cardForeground: '20 50% 10%',
      popover: '0 0% 100%',
      popoverForeground: '20 50% 10%',
      primary: '15 85% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '340 75% 60%',
      secondaryForeground: '0 0% 100%',
      muted: '20 40% 96%',
      mutedForeground: '20 20% 40%',
      accent: '20 40% 96%',
      accentForeground: '20 50% 10%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '20 40% 90%',
      input: '20 40% 90%',
      ring: '15 85% 55%',
    },
    dark: {
      background: '20 50% 8%',
      foreground: '0 0% 98%',
      card: '20 45% 12%',
      cardForeground: '0 0% 98%',
      popover: '20 45% 12%',
      popoverForeground: '0 0% 98%',
      primary: '15 85% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '340 75% 60%',
      secondaryForeground: '0 0% 100%',
      muted: '20 40% 20%',
      mutedForeground: '20 20% 70%',
      accent: '20 40% 20%',
      accentForeground: '0 0% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '20 40% 25%',
      input: '20 40% 25%',
      ring: '15 85% 55%',
    },
  },
  deepSea: {
    name: 'Deep Sea',
    light: {
      background: '0 0% 100%',
      foreground: '220 50% 10%',
      card: '0 0% 100%',
      cardForeground: '220 50% 10%',
      popover: '0 0% 100%',
      popoverForeground: '220 50% 10%',
      primary: '240 60% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '260 50% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '220 40% 96%',
      mutedForeground: '220 20% 40%',
      accent: '220 40% 96%',
      accentForeground: '220 50% 10%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '220 40% 90%',
      input: '220 40% 90%',
      ring: '240 60% 45%',
    },
    dark: {
      background: '220 50% 5%',
      foreground: '0 0% 98%',
      card: '220 45% 8%',
      cardForeground: '0 0% 98%',
      popover: '220 45% 8%',
      popoverForeground: '0 0% 98%',
      primary: '240 70% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '260 60% 65%',
      secondaryForeground: '0 0% 100%',
      muted: '220 40% 15%',
      mutedForeground: '220 20% 70%',
      accent: '220 40% 15%',
      accentForeground: '0 0% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '220 40% 20%',
      input: '220 40% 20%',
      ring: '240 70% 60%',
    },
  },
  arctic: {
    name: 'Arctic Ice',
    light: {
      background: '0 0% 100%',
      foreground: '200 30% 15%',
      card: '0 0% 100%',
      cardForeground: '200 30% 15%',
      popover: '0 0% 100%',
      popoverForeground: '200 30% 15%',
      primary: '195 75% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '185 60% 60%',
      secondaryForeground: '0 0% 100%',
      muted: '200 30% 96%',
      mutedForeground: '200 15% 40%',
      accent: '200 30% 96%',
      accentForeground: '200 30% 15%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '200 30% 90%',
      input: '200 30% 90%',
      ring: '195 75% 50%',
    },
    dark: {
      background: '200 30% 10%',
      foreground: '0 0% 98%',
      card: '200 25% 14%',
      cardForeground: '0 0% 98%',
      popover: '200 25% 14%',
      popoverForeground: '0 0% 98%',
      primary: '195 75% 55%',
      primaryForeground: '0 0% 100%',
      secondary: '185 60% 65%',
      secondaryForeground: '0 0% 100%',
      muted: '200 30% 22%',
      mutedForeground: '200 15% 70%',
      accent: '200 30% 22%',
      accentForeground: '0 0% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '200 30% 28%',
      input: '200 30% 28%',
      ring: '195 75% 55%',
    },
  },
  tropical: {
    name: 'Tropical Waters',
    light: {
      background: '0 0% 100%',
      foreground: '170 40% 12%',
      card: '0 0% 100%',
      cardForeground: '170 40% 12%',
      popover: '0 0% 100%',
      popoverForeground: '170 40% 12%',
      primary: '165 80% 45%',
      primaryForeground: '0 0% 100%',
      secondary: '145 70% 50%',
      secondaryForeground: '0 0% 100%',
      muted: '170 30% 96%',
      mutedForeground: '170 15% 40%',
      accent: '170 30% 96%',
      accentForeground: '170 40% 12%',
      destructive: '0 84% 60%',
      destructiveForeground: '0 0% 100%',
      border: '170 30% 90%',
      input: '170 30% 90%',
      ring: '165 80% 45%',
    },
    dark: {
      background: '170 40% 8%',
      foreground: '0 0% 98%',
      card: '170 35% 12%',
      cardForeground: '0 0% 98%',
      popover: '170 35% 12%',
      popoverForeground: '0 0% 98%',
      primary: '165 80% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '145 70% 55%',
      secondaryForeground: '0 0% 100%',
      muted: '170 30% 20%',
      mutedForeground: '170 15% 70%',
      accent: '170 30% 20%',
      accentForeground: '0 0% 98%',
      destructive: '0 62% 50%',
      destructiveForeground: '0 0% 98%',
      border: '170 30% 25%',
      input: '170 30% 25%',
      ring: '165 80% 50%',
    },
  },
};

interface ThemeContextType {
  currentTheme: string;
  customTheme: Theme | null;
  isDark: boolean;
  setTheme: (themeKey: string) => void;
  setCustomTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<string>('ocean');
  const [customTheme, setCustomThemeState] = useState<Theme | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('app-theme');
    const savedCustomTheme = localStorage.getItem('app-custom-theme');
    
    if (savedCustomTheme) {
      try {
        const parsed = JSON.parse(savedCustomTheme);
        setCustomThemeState(parsed);
        setCurrentTheme('custom');
      } catch (e) {
        console.error('Failed to parse custom theme', e);
      }
    } else if (savedTheme && presetThemes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = customTheme || presetThemes[currentTheme];
    const colors = isDark ? theme.dark : theme.light;

    // Apply theme colors
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Update dark mode class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save to localStorage
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [currentTheme, customTheme, isDark]);

  const setTheme = (themeKey: string) => {
    if (themeKey === 'custom') return;
    setCurrentTheme(themeKey);
    setCustomThemeState(null);
    localStorage.setItem('app-theme', themeKey);
    localStorage.removeItem('app-custom-theme');
  };

  const setCustomTheme = (theme: Theme) => {
    setCustomThemeState(theme);
    setCurrentTheme('custom');
    localStorage.setItem('app-custom-theme', JSON.stringify(theme));
    localStorage.setItem('app-theme', 'custom');
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const resetTheme = () => {
    setCurrentTheme('ocean');
    setCustomThemeState(null);
    localStorage.removeItem('app-theme');
    localStorage.removeItem('app-custom-theme');
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        customTheme,
        isDark,
        setTheme,
        setCustomTheme,
        toggleDarkMode,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
