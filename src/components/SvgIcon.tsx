import React from 'react';
import { SvgIcon as MuiSvgIcon } from '@mui/material';

interface CustomSvgIconProps {
  children?: React.ReactNode;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

const SvgIcon: React.FC<CustomSvgIconProps> = ({
  children,
  icon,
  size = 'medium',
  className,
  style,
  color,
  ...props
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32
  };

  if (icon && typeof icon === 'string') {
    return (
      <MuiSvgIcon
        className={className}
        sx={{
          width: sizeMap[size],
          height: sizeMap[size],
          color: color || 'inherit',
          ...style
        }}
        {...props}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </MuiSvgIcon>
    );
  }

  return (
    <MuiSvgIcon
      className={className}
      sx={{
        width: sizeMap[size],
        height: sizeMap[size],
        color: color || 'inherit',
        ...style
      }}
      {...props}
    >
      {children}
    </MuiSvgIcon>
  );
};

export default SvgIcon;