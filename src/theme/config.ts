// Enhanced theme configuration system inspired by seed theme
// Note: Using CSS font stacks for Vite compatibility

export const Themes = {
  HEALTHCARE_DEFAULT: 'healthcare-default',
  HEALTHCARE_PROFESSIONAL: 'healthcare-professional', 
  HEALTHCARE_MODERN: 'healthcare-modern',
  HEALTHCARE_ACCESSIBLE: 'healthcare-accessible'
} as const;

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const ThemeDirection = {
  LTR: 'ltr',
  RTL: 'rtl'
} as const;

export type ThemesType = typeof Themes[keyof typeof Themes];
export type ThemeModeType = typeof ThemeMode[keyof typeof ThemeMode];
export type ThemeDirectionType = typeof ThemeDirection[keyof typeof ThemeDirection];

// Enhanced configuration for healthcare application
const config = {
  currentTheme: Themes.HEALTHCARE_DEFAULT,
  mode: ThemeMode.LIGHT,
  themeDirection: ThemeDirection.LTR,
  // Healthcare-specific settings
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    largeText: false
  },
  features: {
    animations: true,
    gradients: true,
    shadows: true,
    glassmorphism: true
  }
};

export default config;

// Font configurations for different healthcare themes
export const FONT_INTER = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
export const FONT_ROBOTO = 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_SYNE = 'Syne, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_HEEBO = 'Heebo, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_SPACE_GROTESK = 'Space Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_DMSANS = 'DM Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_PLUS_JAKARTA = 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
export const FONT_MANROPE = 'Manrope, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
