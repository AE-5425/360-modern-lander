// src/components/shared/EnhancedCheckbox.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface EnhancedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  required?: boolean;
  error?: boolean;
  initials?: string; // User initials to display when checked
}

export const EnhancedCheckbox: React.FC<EnhancedCheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  required = false,
  error = false,
  initials
}) => {
  return (
    <motion.div 
      className={`flex items-start space-x-4 p-4 bg-white/80 rounded-xl border-2 transition-all cursor-pointer ${
        error
          ? 'border-red-300 hover:border-red-400'
          : checked 
          ? 'border-primary-400 bg-primary-50/50 hover:border-primary-500' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center relative overflow-hidden ${
          error
            ? 'border-red-400 bg-red-50'
            : checked 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-primary-500' 
            : 'border-gray-300 bg-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: checked ? 1 : 0, 
            opacity: checked ? 1 : 0 
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {initials && checked ? (
            <span className="text-white font-bold text-xs">
              {initials.substring(0, 2).toUpperCase()}
            </span>
          ) : checked ? (
            <Check className="w-4 h-4 text-white" />
          ) : null}
        </motion.div>
      </motion.div>
      
      <div className="flex-1">
        <label className={`font-semibold cursor-pointer ${
          error ? 'text-red-700' : 'text-gray-800'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className={`text-sm mt-1 ${
            error ? 'text-red-600' : 'text-gray-600'
          }`}>
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};