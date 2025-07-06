// Theme Selector Component for Healthcare Application
import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Accessibility as AccessibilityIcon,
  Business as BusinessIcon,
  AutoAwesome as ModernIcon,
  LocalHospital as DefaultIcon,
} from '@mui/icons-material';

import { useThemeContext, ThemeMode, Themes } from '../ThemeProvider';

interface ThemeSelectorProps {
  compact?: boolean;
  showLabels?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  compact = false, 
  showLabels = true 
}) => {
  const { mode, themeVariant, setMode, setThemeVariant, toggleMode } = useThemeContext();

  const themeOptions = [
    {
      value: Themes.HEALTHCARE_DEFAULT,
      label: 'Healthcare Default',
      description: 'Balanced design for general healthcare applications',
      icon: <DefaultIcon />,
    },
    {
      value: Themes.HEALTHCARE_PROFESSIONAL,
      label: 'Professional',
      description: 'Clean, professional design for medical professionals',
      icon: <BusinessIcon />,
    },
    {
      value: Themes.HEALTHCARE_MODERN,
      label: 'Modern',
      description: 'Contemporary design with vibrant colors',
      icon: <ModernIcon />,
    },
    {
      value: Themes.HEALTHCARE_ACCESSIBLE,
      label: 'Accessible',
      description: 'High contrast design for better accessibility',
      icon: <AccessibilityIcon />,
    },
  ];

  if (compact) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Toggle Dark Mode">
          <IconButton onClick={toggleMode} size="small">
            {mode === ThemeMode.DARK ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={themeVariant}
            onChange={(e) => setThemeVariant(e.target.value as typeof themeVariant)}
            displayEmpty
            sx={{ fontSize: '0.875rem' }}
          >
            {themeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <PaletteIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Theme Settings
        </Typography>
      </Box>

      {/* Dark Mode Toggle */}
      <Box mb={3}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === ThemeMode.DARK}
              onChange={toggleMode}
              color="primary"
            />
          }
          label={
            <Box display="flex" alignItems="center" gap={1}>
              {mode === ThemeMode.DARK ? <DarkModeIcon /> : <LightModeIcon />}
              <Typography variant="body2" fontWeight={500}>
                {mode === ThemeMode.DARK ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </Box>
          }
        />
        <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
          Toggle between light and dark themes
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Theme Variant Selection */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} mb={2}>
          Healthcare Theme Variant
        </Typography>
        
        <FormControl fullWidth>
          <InputLabel id="theme-variant-label">Select Theme</InputLabel>
          <Select
            labelId="theme-variant-label"
            value={themeVariant}
            label="Select Theme"
            onChange={(e) => setThemeVariant(e.target.value as typeof themeVariant)}
          >
            {themeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={2} py={1}>
                  <Box 
                    sx={{ 
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showLabels && (
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            Choose a theme variant that best fits your healthcare application needs
          </Typography>
        )}
      </Box>

      {/* Theme Preview */}
      <Box mt={3}>
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Current Theme Preview
        </Typography>
        <Box 
          display="flex" 
          gap={1} 
          p={2} 
          borderRadius={1} 
          bgcolor="background.paper"
          border="1px solid"
          borderColor="divider"
        >
          <Box 
            width={24} 
            height={24} 
            borderRadius="50%" 
            bgcolor="primary.main" 
            title="Primary Color"
          />
          <Box 
            width={24} 
            height={24} 
            borderRadius="50%" 
            bgcolor="secondary.main" 
            title="Secondary Color"
          />
          <Box 
            width={24} 
            height={24} 
            borderRadius="50%" 
            bgcolor="success.main" 
            title="Success Color"
          />
          <Box 
            width={24} 
            height={24} 
            borderRadius="50%" 
            bgcolor="warning.main" 
            title="Warning Color"
          />
          <Box 
            width={24} 
            height={24} 
            borderRadius="50%" 
            bgcolor="error.main" 
            title="Error Color"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default ThemeSelector;
