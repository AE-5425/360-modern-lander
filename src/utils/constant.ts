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

// Re-export CommonFocusStyle for SaasAble components
export { default as CommonFocusStyle } from './CommonFocusStyle';