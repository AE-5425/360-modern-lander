import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Shield, CheckCircle, Phone, Stethoscope } from 'lucide-react';

export interface PlanPreview {
  id: string;
  carrierName: string;
  carrierLogo: string;
  planName: string;
  planType: string;
  monthlyPremium: number;
  subsidizedPremium: number;
  deductible: number;
  maxOutOfPocket: number;
  estimatedSavings: number;
  isPopular?: boolean;
  isBestValue?: boolean;
  rating: number;
  features: string[];
  network: string;
  copays: {
    primaryCare: number;
    specialist: number;
    urgentCare: number;
    emergency: number;
  };
  prescription: {
    generic: number;
    preferred: number;
    specialty: string;
  };
  metalLevel: string;
  hiosId: string;
}

export type { PlanPreview };

interface PlanSelectionCardProps {
  plan: PlanPreview;
  isSelected: boolean;
  onSelect: (plan: PlanPreview) => void;
  householdSize: number;
  showComparison?: boolean;
}

export const PlanSelectionCard: React.FC<PlanSelectionCardProps> = ({
  plan,
  isSelected,
  onSelect,
  householdSize,
  showComparison = true
}) => {
  const getBadgeColor = (metalLevel: string) => {
    switch (metalLevel) {
      case 'bronze': return 'from-orange-500 to-amber-500';
      case 'silver': return 'from-gray-500 to-slate-500';
      case 'gold': return 'from-yellow-500 to-amber-500';
      case 'platinum': return 'from-purple-500 to-indigo-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white backdrop-blur-sm hover:shadow-lg overflow-hidden ${
        isSelected 
          ? 'border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200' 
          : 'border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => onSelect(plan)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {/* FIXED: Header Section - Better spacing and overflow control */}
      <div className="flex items-start justify-between mb-4 min-h-[48px]">
        <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
          <img 
            src={plan.carrierLogo} 
            alt={`${plan.carrierName} logo`}
            className="h-8 w-8 md:h-10 md:w-10 object-contain flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm md:text-base text-gray-800 truncate leading-tight">
              {plan.carrierName}
            </h3>
            <p className="text-xs md:text-sm text-gray-600 truncate leading-tight">
              {plan.planName}
            </p>
          </div>
        </div>
        
        {/* FIXED: Badges - Stack on mobile, side by side on desktop */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            {plan.isPopular && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                Popular
              </div>
            )}
            {plan.isBestValue && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                Best Value
              </div>
            )}
          </div>
          <div className={`bg-gradient-to-r ${getBadgeColor(plan.metalLevel)} text-white text-xs font-bold px-2 py-1 rounded-full capitalize whitespace-nowrap`}>
            {plan.planType}
          </div>
        </div>
      </div>

      {/* FIXED: Main Content - Responsive grid that doesn't overflow */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 items-start">
        
        {/* FIXED: Premium Section - Larger on desktop, full column on mobile */}
        <div className="col-span-1 md:col-span-2 text-center">
          <div className="space-y-1">
            <div className="text-xl md:text-2xl font-bold text-purple-600 leading-tight">
              {formatCurrency(plan.subsidizedPremium)}
            </div>
            <div className="text-xs text-gray-500 leading-tight">per month</div>
            {plan.estimatedSavings > 0 && (
              <div className="text-xs text-green-600 font-semibold leading-tight">
                Save {formatCurrency(plan.estimatedSavings)}/mo
              </div>
            )}
          </div>
        </div>

        {/* FIXED: Deductible - Better spacing */}
        <div className="text-center">
          <div className="text-sm md:text-lg font-bold text-gray-800 leading-tight">
            {formatCurrency(plan.deductible)}
          </div>
          <div className="text-xs text-gray-500 leading-tight mt-1">
            Deductible
          </div>
        </div>

        {/* FIXED: Doctor Copay - Hidden on mobile to prevent cramping */}
        <div className="hidden md:block text-center">
          <div className="text-sm font-bold text-gray-700 leading-tight">
            ${plan.copays.primaryCare}
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
            <Stethoscope className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="leading-tight">Doctor</span>
          </div>
        </div>

        {/* FIXED: Rating + Selection - Always visible */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current flex-shrink-0" />
            <span className="text-sm font-bold text-gray-700 ml-1">{plan.rating}</span>
          </div>
          {isSelected ? (
            <CheckCircle className="w-5 h-5 text-purple-500 mx-auto" />
          ) : (
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mx-auto hover:border-purple-400 transition-colors" />
          )}
        </div>
      </div>

      {/* FIXED: Mobile-only additional info row */}
      <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center">
            <Stethoscope className="w-3 h-3 mr-1" />
            <span>Doctor visits: ${plan.copays.primaryCare}</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            <span>Max out-of-pocket: {formatCurrency(plan.maxOutOfPocket)}</span>
          </div>
        </div>
      </div>

      {/* FIXED: Selection Indicator Ring - Positioned better */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg z-10"
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
};