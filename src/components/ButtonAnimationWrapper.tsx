import React from 'react';
import { motion } from 'framer-motion';

interface ButtonAnimationWrapperProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'default' | 'healthcare' | 'trust' | 'gentle';
}

const ButtonAnimationWrapper: React.FC<ButtonAnimationWrapperProps> = ({ 
  children, 
  disabled = false,
  className,
  style,
  variant = 'healthcare'
}) => {
  if (disabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const getAnimationProps = () => {
    switch (variant) {
      case 'healthcare':
        return {
          whileHover: { 
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2 }
          },
          whileTap: { 
            scale: 0.98,
            y: 0,
            transition: { duration: 0.1 }
          },
        };
      case 'trust':
        return {
          whileHover: { 
            scale: 1.05,
            transition: { duration: 0.3 }
          },
          whileTap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
          },
        };
      case 'gentle':
        return {
          whileHover: { 
            scale: 1.01,
            transition: { duration: 0.4 }
          },
          whileTap: { 
            scale: 0.99,
            transition: { duration: 0.1 }
          },
        };
      default:
        return {
          whileHover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
          },
          whileTap: { 
            scale: 0.95,
            transition: { duration: 0.1 }
          },
        };
    }
  };

  return (
    <motion.div
      {...getAnimationProps()}
      className={className}
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

export default ButtonAnimationWrapper;
