import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface EnhancedInputProps {
  field: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    id?: string;
  };
  error?: { message?: string };
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  formatter?: (value: string) => string;
  maxLength?: number;
  darkMode?: boolean; // Added darkMode prop
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  field,
  error,
  placeholder,
  type = 'text',
  formatter,
  maxLength,
  darkMode = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Apply maxLength if specified
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    
    // Apply formatter if provided
    if (formatter) {
      value = formatter(value);
    }
    
    field.onChange(value);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const hasError = !!error?.message;
  const hasValue = !!field.value;

  return (
    <div className="relative">
      <motion.div
        className={`relative transition-all duration-300 ${
          isFocused ? 'scale-105' : 'scale-100'
        }`}
        whileFocus={{ scale: 1.02 }}
      >
        <input
          {...field}
          id={field.id}
          type={inputType}
          placeholder={placeholder}
          value={field.value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            field.onBlur();
          }}
          maxLength={maxLength}
          className={`w-full px-4 py-2 md:px-6 md:py-3 rounded-xl border-2 transition-all duration-300 text-base md:text-lg font-medium placeholder-opacity-70 backdrop-blur-sm ${
            hasError
              ? (darkMode 
                  ? 'border-red-500 bg-red-900/20 text-red-300 placeholder-red-400 focus:ring-red-500/30' 
                  : 'border-red-500 bg-red-50 text-red-700 placeholder-red-400 focus:ring-red-200')
              : hasValue
                ? (darkMode 
                    ? 'border-green-500 bg-green-900/20 text-gray-200 placeholder-gray-400 focus:ring-green-500/30' 
                    : 'border-green-500 bg-green-50 text-gray-800 placeholder-gray-500 focus:ring-green-200')
                : (darkMode 
                    ? 'border-gray-600 bg-gray-800/70 text-gray-200 placeholder-gray-400 hover:border-blue-400 focus:border-blue-400 focus:ring-blue-500/30' 
                    : 'border-gray-300 bg-white/80 text-gray-800 placeholder-gray-500 hover:border-blue-400 focus:border-blue-500 focus:ring-blue-200')
          } ${
            type === 'password' ? 'pr-12' : ''
          } focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl`}
          style={{
            // Match react-select height
            minHeight: '48px',
            // Force override browser autocomplete styling
            ...(darkMode && {
              colorScheme: 'dark',
              // Override webkit autofill in dark mode
              WebkitTextFillColor: '#f3f4f6',
              WebkitBoxShadow: hasValue 
                ? '0 0 0 1000px rgba(34, 197, 94, 0.2) inset' 
                : '0 0 0 1000px rgba(31, 41, 55, 0.7) inset',
              backgroundColor: hasValue 
                ? 'rgba(34, 197, 94, 0.2)' 
                : 'rgba(31, 41, 55, 0.7)',
              color: '#f3f4f6'
            }),
            ...(!darkMode && hasValue && {
              // Light mode with value
              WebkitTextFillColor: '#374151',
              WebkitBoxShadow: '0 0 0 1000px rgb(240, 253, 244) inset',
              backgroundColor: 'rgb(240, 253, 244)',
              color: '#374151'
            })
          }}
        />
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
              darkMode 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Status Icon */}
        {!hasError && hasValue && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
          </motion.div>
        )}
        
        {hasError && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Error Message */}
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-2 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error.message}
        </motion.p>
      )}
      
      {/* Character Counter */}
      {maxLength && (
        <div className={`text-xs mt-1 text-right transition-colors ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {field.value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
};