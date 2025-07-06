import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Typography,
  useTheme,
  alpha
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

interface ModernDatePickerProps {
  // React Hook Form Controller field prop
  field?: {
    name: string;
    value: string | Date | null;
    onChange: (value: string | Date | null) => void;
    onBlur?: () => void;
  };
  
  // Standard props
  value?: Date | string | null;
  onChange?: (date: Date | string | null) => void;
  placeholder?: string;
  label?: string;
  error?: any;
  errorMessage?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
  
  // Date restrictions
  minDate?: Date;
  maxDate?: Date;
  minAge?: number;
  maxAge?: number;
  
  // Legacy compatibility
  selected?: Date | null;
  placeholderText?: string;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  scrollableYearDropdown?: boolean;
  className?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
}

const ModernDatePicker: React.FC<ModernDatePickerProps> = ({
  // React Hook Form field
  field,
  
  // Standard props
  value,
  onChange,
  placeholder = "Select date",
  label,
  error,
  errorMessage,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  
  // Date restrictions
  minDate,
  maxDate,
  minAge,
  maxAge,
  
  // Legacy compatibility
  selected,
  placeholderText,
  className,
  name,
  id,
  autoComplete = "off"
}) => {
  const theme = useTheme();

  // Determine the current value (prioritize field prop from Controller)
  const currentValue = field?.value || selected || value;
  const currentPlaceholder = placeholderText || placeholder;
  const effectiveLabel = label || currentPlaceholder;

  // Calculate date bounds based on age restrictions
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  
  let finalMinDate = minDate;
  let finalMaxDate = maxDate;
  
  // Apply age restrictions if provided
  if (minAge !== undefined && !minDate) {
    finalMinDate = new Date(currentYear - maxAge || 120, 0, 1);
  }
  
  if (maxAge !== undefined && !maxDate) {
    finalMaxDate = new Date(currentYear - minAge || 0, currentMonth, currentDay);
  }

  // Default restrictions for adults (18+)
  if (!finalMinDate && !finalMaxDate && !minAge && !maxAge) {
    finalMinDate = new Date(currentYear - 120, 0, 1); // 120 years ago
    finalMaxDate = new Date(currentYear - 18, currentMonth, currentDay); // 18 years ago
  }

  // Convert current value to dayjs
  const dayjsValue = currentValue ? dayjs(currentValue) : null;
  const dayjsMinDate = finalMinDate ? dayjs(finalMinDate) : undefined;
  const dayjsMaxDate = finalMaxDate ? dayjs(finalMaxDate) : undefined;

  // Handle date change
  const handleDateChange = (newValue: Dayjs | null) => {
    const newDate = newValue ? newValue.toDate() : null;
    const dateString = newValue ? newValue.format('YYYY-MM-DD') : '';
    
    // Call field onChange if using Controller
    if (field?.onChange) {
      field.onChange(dateString);
    }
    
    // Call direct onChange if provided
    if (onChange) {
      onChange(newDate);
    }
  };

  // Handle blur
  const handleBlur = () => {
    if (field?.onBlur) {
      field.onBlur();
    }
  };

  const hasError = !!(error?.message || errorMessage);
  const hasValue = !!currentValue;
  const isValid = hasValue && !hasError;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DatePicker
          value={dayjsValue}
          onChange={handleDateChange}
          minDate={dayjsMinDate}
          maxDate={dayjsMaxDate}
          disabled={disabled}
          views={['year', 'month', 'day']}
          openTo="year"
          slotProps={{
            textField: {
              fullWidth,
              size,
              variant,
              label: effectiveLabel,
              placeholder: currentPlaceholder,
              error: hasError,
              helperText: hasError ? undefined : helperText,
              required,
              name: field?.name || name,
              id,
              autoComplete,
              className,
              onBlur: handleBlur,
              InputProps: {
                startAdornment: (
                  <CalendarIcon 
                    sx={{ 
                      color: hasError ? theme.palette.error.main : 
                             isValid ? theme.palette.success.main : 
                             theme.palette.action.active,
                      mr: 1,
                      fontSize: 20
                    }} 
                  />
                ),
              },
              sx: {
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.2s ease',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  ...(hasError && {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.error.main,
                      borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.error.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.error.main,
                    },
                  }),
                  ...(isValid && {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.success.main,
                      borderWidth: '2px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.success.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.success.main,
                    },
                  }),
                  ...(!hasError && !isValid && {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px',
                    },
                  }),
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  ...(hasError && {
                    color: theme.palette.error.main,
                  }),
                  ...(isValid && {
                    color: theme.palette.success.main,
                  }),
                  '&.Mui-focused': {
                    color: hasError ? theme.palette.error.main : 
                           isValid ? theme.palette.success.main : 
                           theme.palette.primary.main,
                  },
                },
              }
            },
            popper: {
              sx: {
                zIndex: 9999,
                '& .MuiPaper-root': {
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            },
            day: {
              sx: {
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
                '&.MuiPickersDay-today': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                  fontWeight: 600,
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
              },
            },
            yearButton: {
              sx: {
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                },
              },
            },
            monthButton: {
              sx: {
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                },
              },
            },
            actionBar: {
              actions: ['clear', 'today', 'accept'],
            },
          }}
        />
      </motion.div>
      
      {/* Enhanced error message with animation */}
      {hasError && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              mt: 1,
              px: 2,
              py: 1,
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              borderRadius: '8px',
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ErrorIcon 
              sx={{ 
                color: theme.palette.error.main,
                fontSize: 16,
                flexShrink: 0
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.palette.error.main,
                fontWeight: 500
              }}
            >
              {error?.message || errorMessage}
            </Typography>
          </Box>
        </motion.div>
      )}
      
      {/* Success indicator */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 1,
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              color: theme.palette.success.main,
              fontSize: 20,
              backgroundColor: 'white',
              borderRadius: '50%',
            }} 
          />
        </motion.div>
      )}
    </Box>
  );
};

// Export utility functions for compatibility
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  const parsed = dayjs(dateString);
  return parsed.isValid() ? parsed.toDate() : null;
};

export const formatDateString = (date: Date | null): string => {
  if (!date) return '';
  return dayjs(date).format('MM/DD/YYYY');
};

export default ModernDatePicker;
export { ModernDatePicker };