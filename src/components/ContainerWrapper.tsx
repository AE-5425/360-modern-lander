import React from 'react';
import { Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ContainerWrapperProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  section?: boolean; // For healthcare section styling
  background?: 'default' | 'paper' | 'neutral' | 'gradient';
  sx?: any; // MUI sx prop
  className?: string;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ 
  children, 
  maxWidth = 'lg',
  section = false,
  background = 'default',
  sx = {},
  className,
  ...props
}) => {
  const theme = useTheme();

  const getBackgroundStyles = () => {
    switch (background) {
      case 'paper':
        return { backgroundColor: theme.palette.background.paper };
      case 'neutral':
        return { 
          backgroundColor: theme.palette.mode === 'dark' 
            ? theme.palette.grey[900] 
            : theme.palette.grey[50] 
        };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
        };
      default:
        return {};
    }
  };

  return (
    <Container 
      maxWidth={maxWidth} 
      className={className}
      sx={{ 
        // Healthcare-optimized spacing
        py: section ? { xs: 6, md: 8, lg: 10 } : { xs: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        // Healthcare theme integration
        ...getBackgroundStyles(),
        // Professional styling
        position: 'relative',
        ...sx 
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ContainerWrapper;