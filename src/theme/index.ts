// Enhanced Healthcare Theme System - Main Entry Point
import { createTheme, type Theme } from '@mui/material/styles';
import { useMemo } from 'react';

// Import theme modules
import config, { ThemeMode, Themes, type ThemeModeType, type ThemesType } from './config';
import createPalette from './palette';
import createTypography from './typography';
import createComponentOverrides from './overrides';

// Enhanced breakpoints for healthcare applications
const breakpoints = {
  values: {
    xs: 0,
    sm: 768,
    md: 1024,
    lg: 1266,
    xl: 1440,
  },
};

// Enhanced spacing system
const spacing = 8;

// Enhanced shape system
const shape = {
  borderRadius: 12,
};

// Enhanced shadows for healthcare UI
const shadows = [
  'none',
  '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
  '0 25px 50px rgba(0, 0, 0, 0.25)',
];

// Enhanced z-index system for healthcare applications
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Main theme creation function
export function createHealthcareTheme(
  mode: ThemeModeType = ThemeMode.LIGHT,
  themeVariant: ThemesType = Themes.HEALTHCARE_DEFAULT
): Theme {
  // Create palette
  const palette = createPalette(mode, themeVariant);

  // Create base theme with palette
  const baseTheme = createTheme({
    breakpoints,
    spacing,
    shape,
    shadows,
    zIndex,
    palette,
  });

  // Create typography with base theme
  const typography = createTypography(baseTheme, themeVariant);

  // Create final theme with typography
  const themeWithTypography = createTheme({
    ...baseTheme,
    typography,
  });

  // Add component overrides
  const components = createComponentOverrides(themeWithTypography);

  // Return final theme
  return createTheme({
    ...themeWithTypography,
    components,
  });
}

// Hook for using healthcare theme
export function useHealthcareTheme(
  mode: ThemeModeType = ThemeMode.LIGHT,
  themeVariant: ThemesType = Themes.HEALTHCARE_DEFAULT
) {
  return useMemo(() => createHealthcareTheme(mode, themeVariant), [mode, themeVariant]);
}

// Default theme instance
export const defaultHealthcareTheme = createHealthcareTheme();

// Export theme configuration and types
export { config, ThemeMode, Themes };
export type { ThemeModeType, ThemesType };

// Export individual theme modules for advanced customization
export { default as createPalette } from './palette';
export { default as createTypography } from './typography';
export { default as createComponentOverrides } from './overrides';
export { healthcareSemantics, neutrals, darkNeutrals } from './palette';
export { healthcareTypography } from './typography';
