// Enhanced component overrides for healthcare themes
import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { healthcareSemantics } from './palette';

export default function createComponentOverrides(theme: Theme) {
  return {
    // Enhanced Button components with healthcare-specific styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none' as const,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '12px 24px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            transform: 'none',
            boxShadow: 'none',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
          },
          '&.MuiButton-containedSecondary': {
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${alpha(theme.palette.secondary.dark, 0.9)} 100%)`,
              boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
            },
          },
          '&.MuiButton-containedSuccess': {
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${alpha(theme.palette.success.dark, 0.9)} 100%)`,
              boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.4)}`,
            },
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: theme.palette.primary.main,
          color: theme.palette.primary.main,
          backgroundColor: 'transparent',
          '&:hover': {
            borderWidth: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderColor: theme.palette.primary.dark,
            color: theme.palette.primary.dark,
          },
        },
        text: {
          color: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.dark,
          },
        },
        // Healthcare-specific button variants
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1rem',
        },
      },
    },

    // Enhanced TextField components
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: theme.palette.background.paper,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: alpha(theme.palette.grey[400], 0.5),
              borderWidth: 2,
              transition: 'border-color 0.3s ease',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: 2,
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            '&.Mui-error fieldset': {
              borderColor: theme.palette.error.main,
              '&:focus-within': {
                boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.1)}`,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            fontWeight: 500,
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          },
          '& .MuiFormHelperText-root': {
            marginTop: 8,
            fontSize: '0.75rem',
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          },
        },
      },
    },

    // Enhanced Card components
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
        },
      },
    },

    // Enhanced Chip components
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 32,
          '&.MuiChip-filled': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          },
          '&.MuiChip-outlined': {
            borderColor: alpha(theme.palette.grey[400], 0.5),
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[100], 0.5),
            },
          },
        },
        // Healthcare status chips
        colorSuccess: {
          backgroundColor: alpha(healthcareSemantics.wellness[500], 0.1),
          color: healthcareSemantics.wellness[700],
          border: `1px solid ${alpha(healthcareSemantics.wellness[500], 0.3)}`,
        },
        colorError: {
          backgroundColor: alpha(healthcareSemantics.critical[500], 0.1),
          color: healthcareSemantics.critical[700],
          border: `1px solid ${alpha(healthcareSemantics.critical[500], 0.3)}`,
        },
        colorWarning: {
          backgroundColor: alpha(healthcareSemantics.caution[500], 0.1),
          color: healthcareSemantics.caution[700],
          border: `1px solid ${alpha(healthcareSemantics.caution[500], 0.3)}`,
        },
      },
    },

    // Enhanced Stepper components
    MuiStepper: {
      styleOverrides: {
        root: {
          padding: '24px 0',
          backgroundColor: 'transparent',
        },
      },
    },

    MuiStepLabel: {
      styleOverrides: {
        root: {
          '& .MuiStepLabel-iconContainer': {
            paddingRight: 0,
          },
        },
        label: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: theme.palette.text.secondary,
          '&.Mui-active': {
            fontWeight: 600,
            color: theme.palette.primary.main,
          },
          '&.Mui-completed': {
            color: theme.palette.success.main,
            fontWeight: 600,
          },
        },
      },
    },


	MuiStepConnector: {
	  styleOverrides: {
		root: {
		  top: 14,
		  '& .MuiStepConnector-line': {
			borderColor: alpha(theme.palette.grey[300], 0.5),
			borderTopWidth: 2,
			transition: 'border-color 0.3s ease',
		  },
		  '&.Mui-active .MuiStepConnector-line': {
			borderColor: theme.palette.primary.main,
		  },
		  '&.Mui-completed .MuiStepConnector-line': {
			borderColor: theme.palette.success.main,
		  },
		},
	  },
	},

    // Enhanced LinearProgress
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 12,
          borderRadius: 6,
          backgroundColor: alpha(theme.palette.grey[300], 0.3),
          overflow: 'hidden',
        },
        bar: {
          borderRadius: 6,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          position: 'relative' as const,
          '&::after': {
            content: '""',
            position: 'absolute' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 2s infinite ease-in-out',
          },
        },
      },
    },

    // Enhanced Paper components
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.MuiPaper-elevation1': {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          },
          '&.MuiPaper-elevation2': {
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
          },
          '&.MuiPaper-elevation3': {
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
          },
        },
      },
    },

    // Enhanced Dialog components
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          padding: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 600,
          color: theme.palette.text.primary,
          paddingBottom: '16px',
        },
      },
    },

    // Enhanced Alert components
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 16px',
          '&.MuiAlert-standardSuccess': {
            backgroundColor: alpha(healthcareSemantics.wellness[500], 0.1),
            color: healthcareSemantics.wellness[800],
            border: `1px solid ${alpha(healthcareSemantics.wellness[500], 0.3)}`,
          },
          '&.MuiAlert-standardError': {
            backgroundColor: alpha(healthcareSemantics.critical[500], 0.1),
            color: healthcareSemantics.critical[800],
            border: `1px solid ${alpha(healthcareSemantics.critical[500], 0.3)}`,
          },
          '&.MuiAlert-standardWarning': {
            backgroundColor: alpha(healthcareSemantics.caution[500], 0.1),
            color: healthcareSemantics.caution[800],
            border: `1px solid ${alpha(healthcareSemantics.caution[500], 0.3)}`,
          },
          '&.MuiAlert-standardInfo': {
            backgroundColor: alpha(healthcareSemantics.innovation[500], 0.1),
            color: healthcareSemantics.innovation[800],
            border: `1px solid ${alpha(healthcareSemantics.innovation[500], 0.3)}`,
          },
        },
      },
    },

    // Enhanced Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha(theme.palette.grey[900], 0.9),
          color: theme.palette.common.white,
          fontSize: '0.75rem',
          borderRadius: 8,
          padding: '8px 12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          color: alpha(theme.palette.grey[900], 0.9),
        },
      },
    },

    // Enhanced Select components
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
        },
      },
    },

    // Enhanced Menu components
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          marginTop: 8,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
          },
          '&.Mui-selected': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
            },
          },
        },
      },
    },

    // Enhanced Checkbox and Radio
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: theme.palette.primary.main,
          },
        },
      },
    },

    // Enhanced Switch
    MuiSwitch: {
      styleOverrides: {
        root: {
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: theme.palette.primary.main,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.primary.main,
            },
          },
        },
      },
    },
  };
}

// Add keyframes for shimmer animation
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// Inject keyframes into document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
