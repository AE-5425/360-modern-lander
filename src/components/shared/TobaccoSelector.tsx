import React from 'react';
import { motion } from 'framer-motion';
import { Cigarette, Heart, AlertTriangle } from 'lucide-react';

interface TobaccoSelectorProps {
  value: 'yes' | 'no';
  onChange: (value: 'yes' | 'no') => void;
  error?: any;
}

export const TobaccoSelector: React.FC<TobaccoSelectorProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        {/* No Option */}
        <motion.button
          type="button"
          onClick={() => onChange('no')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            value === 'no'
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
          }`}
          whileHover={{ scale: value === 'no' ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 mr-3">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-sm">No</div>
            </div>
            {value === 'no' && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600">
            I don't use tobacco products regularly
          </p>
        </motion.button>

        {/* Yes Option */}
        <motion.button
          type="button"
          onClick={() => onChange('yes')}
          className={`p-4 rounded-xl border-2 transition-all text-left ${
            value === 'yes'
              ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 shadow-lg'
              : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
          }`}
          whileHover={{ scale: value === 'yes' ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 mr-3">
              <Cigarette className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800 text-sm">Yes</div>
            </div>
            {value === 'yes' && (
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600">
            I use tobacco products 4+ times per week
          </p>
        </motion.button>
      </div>

      {/* Warning Message for Tobacco Users */}
      {value === 'yes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-3"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-700">
              <strong>Important:</strong> Tobacco use may result in higher monthly premiums. 
              Many plans offer tobacco cessation programs to help you quit and reduce costs.
            </div>
          </div>
        </motion.div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
};