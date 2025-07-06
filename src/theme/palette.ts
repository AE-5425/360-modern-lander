// Enhanced palette system for healthcare themes
import { ThemeMode, type ThemeModeType } from './config';

// Healthcare semantic colors with accessibility in mind
const healthcareSemantics = {
  // Trust & Security (Blues)
  trust: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Care & Compassion (Teals/Greens)
  care: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  // Innovation & Technology (Purples)
  innovation: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Health & Wellness (Greens)
  wellness: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  // Critical/Emergency (Reds)
  critical: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  // Warning/Caution (Ambers)
  caution: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  }
};

// Enhanced neutral palette for healthcare UI
const neutrals = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

// Dark mode neutrals
const darkNeutrals = {
  50: '#0f172a',
  100: '#1e293b',
  200: '#334155',
  300: '#475569',
  400: '#64748b',
  500: '#94a3b8',
  600: '#cbd5e1',
  700: '#e2e8f0',
  800: '#f1f5f9',
  900: '#f8fafc',
};

export default function createPalette(mode: ThemeModeType, theme: string = 'healthcare-default') {
  const isDark = mode === ThemeMode.DARK;
  const colors = isDark ? darkNeutrals : neutrals;
  
  // Base palette configuration
  const basePalette = {
    mode,
    // Primary colors based on theme
    primary: {
      lighter: healthcareSemantics.trust[100],
      light: healthcareSemantics.trust[300],
      main: healthcareSemantics.trust[600],
      dark: healthcareSemantics.trust[700],
      darker: healthcareSemantics.trust[900],
      contrastText: '#ffffff',
    },
    // Secondary colors
    secondary: {
      lighter: healthcareSemantics.care[100],
      light: healthcareSemantics.care[300],
      main: healthcareSemantics.care[600],
      dark: healthcareSemantics.care[700],
      darker: healthcareSemantics.care[900],
      contrastText: '#ffffff',
    },
    // Semantic colors
    success: {
      lighter: healthcareSemantics.wellness[100],
      light: healthcareSemantics.wellness[300],
      main: healthcareSemantics.wellness[600],
      dark: healthcareSemantics.wellness[700],
      darker: healthcareSemantics.wellness[900],
      contrastText: '#ffffff',
    },
    warning: {
      lighter: healthcareSemantics.caution[100],
      light: healthcareSemantics.caution[300],
      main: healthcareSemantics.caution[600],
      dark: healthcareSemantics.caution[700],
      darker: healthcareSemantics.caution[900],
      contrastText: '#ffffff',
    },
    error: {
      lighter: healthcareSemantics.critical[100],
      light: healthcareSemantics.critical[300],
      main: healthcareSemantics.critical[600],
      dark: healthcareSemantics.critical[700],
      darker: healthcareSemantics.critical[900],
      contrastText: '#ffffff',
    },
    info: {
      lighter: healthcareSemantics.innovation[100],
      light: healthcareSemantics.innovation[300],
      main: healthcareSemantics.innovation[600],
      dark: healthcareSemantics.innovation[700],
      darker: healthcareSemantics.innovation[900],
      contrastText: '#ffffff',
    },
    // Enhanced grey scale
    grey: colors,
    // Text colors with healthcare accessibility
    text: {
      primary: isDark ? colors[900] : colors[900],
      secondary: isDark ? colors[700] : colors[600],
      disabled: isDark ? colors[500] : colors[400],
    },
    // Background colors
    background: {
      default: isDark ? colors[50] : '#f8fafc',
      paper: isDark ? colors[100] : '#ffffff',
      neutral: isDark ? colors[200] : colors[50],
    },
    // Divider colors
    divider: isDark ? colors[300] : colors[200],
    // Action colors
    action: {
      active: isDark ? colors[600] : colors[600],
      hover: isDark ? colors[800] : colors[100],
      selected: isDark ? colors[700] : colors[200],
      disabled: isDark ? colors[400] : colors[300],
      disabledBackground: isDark ? colors[200] : colors[100],
      focus: healthcareSemantics.trust[500],
    },
  };

  // Theme-specific customizations
  switch (theme) {
    case 'healthcare-professional':
      return {
        ...basePalette,
        primary: {
          ...basePalette.primary,
          main: '#1e40af', // Deeper, more professional blue
        },
        secondary: {
          ...basePalette.secondary,
          main: '#0f766e', // Professional teal
        },
      };
    
    case 'healthcare-modern':
      return {
        ...basePalette,
        primary: {
          ...basePalette.primary,
          main: '#7c3aed', // Modern purple
        },
        secondary: {
          ...basePalette.secondary,
          main: '#2dd4bf', // Bright teal
        },
      };
    
    case 'healthcare-accessible':
      return {
        ...basePalette,
        primary: {
          ...basePalette.primary,
          main: '#1d4ed8', // High contrast blue
        },
        secondary: {
          ...basePalette.secondary,
          main: '#059669', // High contrast green
        },
        // Enhanced contrast for accessibility
        text: {
          primary: isDark ? '#ffffff' : '#000000',
          secondary: isDark ? colors[800] : colors[700],
          disabled: isDark ? colors[600] : colors[500],
        },
      };
    
    default:
      return basePalette;
  }
}

// Export healthcare semantic colors for use in components
export { healthcareSemantics, neutrals, darkNeutrals };
