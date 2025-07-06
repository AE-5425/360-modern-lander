// Enhanced typography system for healthcare themes
import type { Theme } from '@mui/material/styles';
import { 
  FONT_INTER, 
  FONT_ROBOTO, 
  FONT_SYNE, 
  FONT_HEEBO,
  FONT_SPACE_GROTESK,
  FONT_DMSANS,
  FONT_PLUS_JAKARTA,
  FONT_MANROPE 
} from './config';

// Healthcare-specific typography scales
const healthcareTypography = {
  // Medical documentation scale
  medical: {
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  // Patient-friendly scale (larger, more readable)
  patient: {
    h1: { fontSize: '3rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1.125rem', lineHeight: 1.7 },
    body2: { fontSize: '1rem', lineHeight: 1.6 },
    caption: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  // Compact scale for data-heavy interfaces
  compact: {
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '0.875rem', lineHeight: 1.5 },
    body2: { fontSize: '0.75rem', lineHeight: 1.4 },
    caption: { fontSize: '0.6875rem', lineHeight: 1.3 },
  }
};

export default function createTypography(theme: Theme, themeVariant: string = 'healthcare-default') {
  // Base font family selection based on theme
  let fontFamily = FONT_INTER;
  let scale = healthcareTypography.medical;

  switch (themeVariant) {
    case 'healthcare-professional':
      fontFamily = FONT_ROBOTO;
      scale = healthcareTypography.medical;
      break;
    case 'healthcare-modern':
      fontFamily = FONT_SPACE_GROTESK;
      scale = healthcareTypography.patient;
      break;
    case 'healthcare-accessible':
      fontFamily = FONT_DMSANS;
      scale = healthcareTypography.patient;
      break;
    default:
      fontFamily = FONT_INTER;
      scale = healthcareTypography.medical;
  }

  return {
    fontFamily,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    
    // Headings with healthcare-appropriate sizing
    h1: {
      fontFamily,
      fontSize: scale.h1.fontSize,
      fontWeight: scale.h1.fontWeight,
      lineHeight: scale.h1.lineHeight,
      letterSpacing: '-0.02em',
      color: theme.palette.text.primary,
      [theme.breakpoints.down('md')]: {
        fontSize: `calc(${scale.h1.fontSize} * 0.8)`,
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: `calc(${scale.h1.fontSize} * 0.7)`,
      },
    },
    h2: {
      fontFamily,
      fontSize: scale.h2.fontSize,
      fontWeight: scale.h2.fontWeight,
      lineHeight: scale.h2.lineHeight,
      letterSpacing: '-0.01em',
      color: theme.palette.text.primary,
      [theme.breakpoints.down('md')]: {
        fontSize: `calc(${scale.h2.fontSize} * 0.85)`,
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: `calc(${scale.h2.fontSize} * 0.75)`,
      },
    },
    h3: {
      fontFamily,
      fontSize: scale.h3.fontSize,
      fontWeight: scale.h3.fontWeight,
      lineHeight: scale.h3.lineHeight,
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        fontSize: `calc(${scale.h3.fontSize} * 0.85)`,
      },
    },
    h4: {
      fontFamily,
      fontSize: scale.h4.fontSize,
      fontWeight: scale.h4.fontWeight,
      lineHeight: scale.h4.lineHeight,
      color: theme.palette.text.primary,
      [theme.breakpoints.down('sm')]: {
        fontSize: `calc(${scale.h4.fontSize} * 0.9)`,
      },
    },
    h5: {
      fontFamily,
      fontSize: scale.h5.fontSize,
      fontWeight: scale.h5.fontWeight,
      lineHeight: scale.h5.lineHeight,
      color: theme.palette.text.primary,
    },
    h6: {
      fontFamily,
      fontSize: scale.h6.fontSize,
      fontWeight: scale.h6.fontWeight,
      lineHeight: scale.h6.lineHeight,
      color: theme.palette.text.primary,
    },
    
    // Body text optimized for healthcare content
    body1: {
      fontFamily,
      fontSize: scale.body1.fontSize,
      lineHeight: scale.body1.lineHeight,
      color: theme.palette.text.primary,
      fontWeight: 400,
    },
    body2: {
      fontFamily,
      fontSize: scale.body2.fontSize,
      lineHeight: scale.body2.lineHeight,
      color: theme.palette.text.secondary,
      fontWeight: 400,
    },
    
    // Specialized healthcare typography
    subtitle1: {
      fontFamily,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      fontWeight: 600,
      color: theme.palette.text.primary,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontFamily,
      fontSize: '1rem',
      lineHeight: 1.4,
      fontWeight: 600,
      color: theme.palette.text.secondary,
      letterSpacing: '0.01em',
    },
    
    // UI elements
    button: {
      fontFamily,
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      textTransform: 'none' as const,
      letterSpacing: '0.02em',
    },
    caption: {
      fontFamily,
      fontSize: scale.caption.fontSize,
      lineHeight: scale.caption.lineHeight,
      color: theme.palette.text.secondary,
      fontWeight: 400,
    },
    overline: {
      fontFamily,
      fontSize: '0.75rem',
      lineHeight: 1.2,
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      color: theme.palette.text.secondary,
    },
    
    // Healthcare-specific variants
    medicalLabel: {
      fontFamily,
      fontSize: '0.75rem',
      lineHeight: 1.3,
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: theme.palette.text.secondary,
    },
    patientName: {
      fontFamily,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      fontWeight: 700,
      color: theme.palette.text.primary,
    },
    criticalText: {
      fontFamily,
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 600,
      color: theme.palette.error.main,
    },
    successText: {
      fontFamily,
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 600,
      color: theme.palette.success.main,
    },
    warningText: {
      fontFamily,
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 600,
      color: theme.palette.warning.main,
    },
    
    // Form-specific typography
    inputLabel: {
      fontFamily,
      fontSize: '0.875rem',
      lineHeight: 1.4,
      fontWeight: 500,
      color: theme.palette.text.primary,
    },
    helperText: {
      fontFamily,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 400,
      color: theme.palette.text.secondary,
    },
    errorText: {
      fontFamily,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontWeight: 500,
      color: theme.palette.error.main,
    },
  };
}

// Export typography scales for component use
export { healthcareTypography };
