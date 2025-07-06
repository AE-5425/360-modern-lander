// Re-export the enhanced theme system
export { 
  createHealthcareTheme, 
  useHealthcareTheme, 
  defaultHealthcareTheme as theme,
  ThemeMode,
  Themes,
  config,
  createPalette,
  createTypography,
  createComponentOverrides,
  healthcareSemantics,
  neutrals,
  darkNeutrals,
  healthcareTypography
} from './index';

// Default export for backward compatibility
export { defaultHealthcareTheme as default } from './index';
