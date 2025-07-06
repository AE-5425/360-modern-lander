import React from 'react';
import { Box } from '@mui/material';

interface GraphicsImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  className?: string;
  style?: React.CSSProperties;
}

const GraphicsImage: React.FC<GraphicsImageProps> = ({
  src,
  alt = '',
  width = '100%',
  height = 'auto',
  borderRadius = 2,
  objectFit = 'cover',
  loading = 'lazy',
  className,
  style,
  ...props
}) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      sx={{
        width,
        height,
        borderRadius,
        objectFit,
        display: 'block',
        maxWidth: '100%',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        },
        ...style
      }}
      {...props}
    />
  );
};

export default GraphicsImage;