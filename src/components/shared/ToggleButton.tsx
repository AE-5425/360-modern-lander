import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  darkMode?: boolean; // Added darkMode prop
  disabled?: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  label,
  description,
  darkMode = false,
  disabled = false
}) => {
  return (
    <motion.div
      className={`rounded-xl p-4 md:p-6 border-2 transition-all duration-300 cursor-pointer ${
        disabled
          ? (darkMode 
              ? 'bg-gray-800/30 border-gray-700/50 cursor-not-allowed opacity-50' 
              : 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50')
          : checked
            ? (darkMode 
                ? 'bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/70 shadow-lg' 
                : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-400 shadow-lg')
            : (darkMode 
                ? 'bg-gray-800/50 border-gray-600/50 hover:border-green-400/70 hover:bg-green-900/20 shadow-md hover:shadow-lg' 
                : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50 shadow-md hover:shadow-lg')
      }`}
      onClick={() => !disabled && onChange(!checked)}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <div className="flex items-start space-x-4">
        {/* Custom Toggle Switch */}
        <div className="flex-shrink-0 pt-1">
          <motion.div
            className={`relative w-14 h-8 rounded-full border-2 transition-all duration-300 ${
              checked
                ? (darkMode 
                    ? 'bg-green-500 border-green-400' 
                    : 'bg-green-500 border-green-400')
                : (darkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-200 border-gray-300')
            }`}
            animate={{
              backgroundColor: checked 
                ? '#10b981' 
                : (darkMode ? '#374151' : '#e5e7eb')
            }}
          >
            <motion.div
              className={`absolute top-1 w-6 h-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                checked 
                  ? 'bg-white' 
                  : (darkMode ? 'bg-gray-400' : 'bg-white')
              }`}
              animate={{
                x: checked ? 22 : 2,
                scale: checked ? 1.1 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            >
              {checked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Check className="w-3 h-3 text-green-600" />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Label and Description */}
        <div className="flex-1 min-w-0">
          <motion.div
            className={`font-semibold text-base md:text-lg transition-colors ${
              checked
                ? (darkMode ? 'text-green-300' : 'text-green-700')
                : (darkMode ? 'text-gray-200' : 'text-gray-800')
            }`}
            animate={{
              scale: checked ? 1.02 : 1
            }}
          >
            {label}
          </motion.div>
          
          {description && (
            <motion.p
              className={`text-sm md:text-base mt-1 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              animate={{
                opacity: checked ? 1 : 0.8
              }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Subtle background animation when checked */}
      {checked && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.1, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))'
          }}
        />
      )}
    </motion.div>
  );
};