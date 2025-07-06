// Healthcare-optimized section spacing
export const SECTION_COMMON_PY = {
  py: { xs: 6, md: 8, lg: 10 }
};

export const SECTION_COMMON_MY = {
  my: { xs: 4, md: 6, lg: 8 }
};

// Container configurations
export const CONTAINER_MAX_WIDTH = {
  xs: 'xs',
  sm: 'sm', 
  md: 'md',
  lg: 'lg',
  xl: 'xl'
} as const;

// Healthcare animation variants
export const HEALTHCARE_ANIMATIONS = {
  FADE_IN: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  },
  SCALE_IN: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  SLIDE_UP: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  },
  STAGGER_CHILDREN: {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Healthcare semantic colors (integrates with theme)
export const HEALTHCARE_VARIANTS = {
  TRUST: 'trust',
  CARE: 'care', 
  WELLNESS: 'wellness',
  INNOVATION: 'innovation',
  CRITICAL: 'critical'
} as const;
// Common focus styles for SaasAble components
export const CommonFocusStyle = {
  // Focus ring styles for accessibility
  focusRing: {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    '&:focus': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
    },
    '&:focus-visible': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
    },
  },

  // Button focus styles
  buttonFocus: {
    '&:focus': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    '&:focus-visible': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },

  // Input focus styles
  inputFocus: {
    '&:focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },

  // Card focus styles
  cardFocus: {
    '&:focus': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
    },
    '&:focus-visible': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
    },
  },

  // Link focus styles
  linkFocus: {
    '&:focus': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
      textDecoration: 'underline',
    },
  },
};

// Default export for common usage
export default CommonFocusStyle;