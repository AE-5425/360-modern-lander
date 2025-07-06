import React from 'react';
import { motion } from 'framer-motion';
import { DirectionsCar as Car, LocalShipping as Truck, Computer as Laptop, Build as Hammer, Business as Building, MoreHoriz as More } from '@mui/icons-material';
import { Error as ErrorIcon, CheckCircle } from '@mui/icons-material';

interface WorkType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
}

interface WorkTypeSelectorProps {
  selectedWorkType: string;
  onSelect: (workType: string) => void;
  error?: { message?: string };
  showPopular?: boolean;
  columns?: number;
  size?: 'small' | 'medium' | 'large';
  darkMode?: boolean; // Added darkMode prop
}

// Updated work types with 6 options in consistent sizing
const workTypes: WorkType[] = [
  { id: 'rideshare', label: 'Rideshare Driver', icon: Car, popular: true },
  { id: 'delivery', label: 'Delivery Driver', icon: Truck, popular: true },
  { id: 'freelancer', label: 'Freelancer', icon: Laptop, popular: true },
  { id: 'contractor', label: 'Contractor', icon: Hammer, popular: true },
  { id: 'business-owner', label: 'Small Business', icon: Building, popular: true },
  { id: 'other', label: 'Other', icon: More, popular: true }
];

export const WorkTypeSelector: React.FC<WorkTypeSelectorProps> = ({
  selectedWorkType,
  onSelect,
  error,
  showPopular = false,
  columns = 3,
  size = 'medium',
  darkMode = false // Default to false for backward compatibility
}) => {
  // Always show these 6 work types
  const displayedWorkTypes = workTypes;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {displayedWorkTypes.map((workType) => {
          const IconComponent = workType.icon;
          const isSelected = selectedWorkType === workType.id;
          
          return (
            <motion.button
              key={workType.id}
              type="button"
              onClick={() => onSelect(workType.id)}
              className={`relative p-4 rounded-xl border-2 text-center transition-all group min-h-[120px] flex flex-col items-center justify-center ${
                isSelected 
                  ? (darkMode 
                      ? 'bg-gradient-to-br from-blue-900/50 to-green-900/50 border-blue-400 shadow-lg' 
                      : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-400 shadow-lg')
                  : (darkMode 
                      ? 'bg-gray-800/50 border-gray-600 hover:border-blue-400 hover:bg-blue-900/30 shadow-md hover:shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg')
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all mb-3 ${
                isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg' 
                  : (darkMode 
                      ? 'bg-gray-700 text-gray-300 group-hover:bg-blue-800 group-hover:text-blue-300' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600')
              }`}>
                <IconComponent sx={{ fontSize: 24 }} />
              </div>
              
              <div className={`font-semibold text-sm transition-colors leading-tight ${
                isSelected 
                  ? (darkMode ? 'text-blue-300' : 'text-blue-800')
                  : (darkMode 
                      ? 'text-gray-200 group-hover:text-blue-300' 
                      : 'text-gray-800 group-hover:text-blue-700')
              }`}>
                {workType.label}
              </div>
              
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2"
                >
                  <CheckCircle sx={{ fontSize: 20, color: '#10b981' }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <ErrorIcon sx={{ fontSize: 16, mr: 0.5 }} />
          {error.message}
        </p>
      )}
    </div>
  );
};