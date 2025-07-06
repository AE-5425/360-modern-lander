// Enhanced Healthcare Theme Provider with advanced theme system
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Import enhanced theme system
import { 
  createHealthcareTheme, 
  useHealthcareTheme,
  ThemeMode, 
  Themes,
  type ThemeModeType,
  type ThemesType 
} from '../theme';

// Import fonts
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Theme context for managing theme state
interface ThemeContextType {
  mode: ThemeModeType;
  themeVariant: ThemesType;
  setMode: (mode: ThemeModeType) => void;
  setThemeVariant: (variant: ThemesType) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook to use theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeModeType;
  defaultThemeVariant?: ThemesType;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = ThemeMode.LIGHT,
  defaultThemeVariant = Themes.HEALTHCARE_DEFAULT 
}) => {
  const [mode, setMode] = useState<ThemeModeType>(defaultMode);
  const [themeVariant, setThemeVariant] = useState<ThemesType>(defaultThemeVariant);

  // Load theme preferences from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('healthcare-theme-mode') as ThemeModeType;
    const savedVariant = localStorage.getItem('healthcare-theme-variant') as ThemesType;
    
    if (savedMode && Object.values(ThemeMode).includes(savedMode)) {
      setMode(savedMode);
    }
    
    if (savedVariant && Object.values(Themes).includes(savedVariant)) {
      setThemeVariant(savedVariant);
    }
  }, []);

  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('healthcare-theme-mode', mode);
    localStorage.setItem('healthcare-theme-variant', themeVariant);
  }, [mode, themeVariant]);

  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode(current => current === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);
  };

  // Create theme using the enhanced system
  const theme = useHealthcareTheme(mode, themeVariant);

  const contextValue: ThemeContextType = {
    mode,
    themeVariant,
    setMode,
    setThemeVariant,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {children}
        </LocalizationProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// Export theme utilities for easy access
export { ThemeMode, Themes };
export type { ThemeModeType, ThemesType };
