/**
 * Common Focus Style Utilities
 * SaasAble Theme Compatible Focus Styles
 */

// The main export that Hero3.jsx is looking for
export const generateFocusVisibleStyles = (theme?: any) => {
  const primaryColor = theme?.palette?.primary?.main || '#0066cc';
  
  return {
    '&:focus-visible': {
      outline: `2px solid ${primaryColor}`,
      outlineOffset: '2px',
      borderRadius: '4px',
      boxShadow: `0 0 0 4px ${primaryColor}20`,
    },
    '&:focus:not(:focus-visible)': {
      outline: 'none',
    },
  };
};

// Additional SaasAble-compatible focus utilities
export const focusVisibleStyles = {
  '&:focus-visible': {
    outline: '2px solid #0066cc',
    outlineOffset: '2px',
    borderRadius: '4px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
};

export const generateFocusStyles = (color = '#0066cc') => ({
  '&:focus-visible': {
    outline: `2px solid ${color}`,
    outlineOffset: '2px',
    borderRadius: '4px',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
});

// Healthcare-themed focus styles that work with your SaasAble theme
export const healthcareFocusStyles = {
  '&:focus-visible': {
    outline: '2px solid #2563eb',
    outlineOffset: '2px',
    borderRadius: '6px',
    boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
  },
  '&:focus:not(:focus-visible)': {
    outline: 'none',
  },
};

// Default export for compatibility
export default {
  generateFocusVisibleStyles,
  focusVisibleStyles,
  generateFocusStyles,
  healthcareFocusStyles,
};