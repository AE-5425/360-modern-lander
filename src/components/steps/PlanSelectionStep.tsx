import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Shield, Heart, DollarSign, CheckCircle, Award, 
  TrendingUp, Users, Calculator, Gift, Info, ChevronDown, 
  ChevronUp, Filter, SortAsc
} from 'lucide-react';
import { PlanSelectionCard } from '../shared/PlanSelectionCard';
import type { PlanPreview } from '../shared/PlanSelectionCard';
import { formatCurrency } from '../utils/formatters';

interface PlanSelectionStepProps {
  control: any;
  errors: any;
  previewPlans: PlanPreview[];
  selectedPlan?: PlanPreview;
  onPlanSelect: (plan: PlanPreview) => void;
  calculateHouseholdSize: () => number;
  estimateMonthlySavings: (income: number, householdSize: number) => number;
  incomeData: {
    totalAnnualIncome: number;
  };
}

export const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  control,
  errors,
  previewPlans,
  selectedPlan,
  onPlanSelect,
  calculateHouseholdSize,
  estimateMonthlySavings,
  incomeData
}) => {
  const [sortBy, setSortBy] = useState<'premium' | 'deductible' | 'savings'>('savings');
  const [showFilters, setShowFilters] = useState(false);
  const [metalFilter, setMetalFilter] = useState<string>('all');

  const householdSize = calculateHouseholdSize();
  const totalSavings = selectedPlan ? selectedPlan.estimatedSavings * 12 : 0;

  // Sort plans based on selected criteria
  const sortedPlans = [...previewPlans].sort((a, b) => {
    switch (sortBy) {
      case 'premium':
        return a.subsidizedPremium - b.subsidizedPremium;
      case 'deductible':
        return a.deductible - b.deductible;
      case 'savings':
        return b.estimatedSavings - a.estimatedSavings;
      default:
        return 0;
    }
  });

  // Filter plans by metal level
  const filteredPlans = metalFilter === 'all' 
    ? sortedPlans 
    : sortedPlans.filter(plan => plan.metalLevel === metalFilter);

  return (
    <motion.div
      key="step7"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Choose Your Perfect Plan
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Based on your income and household size, here are your best options
        </motion.p>
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 text-sm"
        >
          <div className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
            <Users className="w-4 h-4 mr-2" />
            Household Size: {householdSize}
          </div>
          <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
            <Calculator className="w-4 h-4 mr-2" />
            Income: {formatCurrency(incomeData.totalAnnualIncome)}
          </div>
          {totalSavings > 0 && (
            <div className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
              <Gift className="w-4 h-4 mr-2" />
              Annual Savings: {formatCurrency(totalSavings)}
            </div>
          )}
        </motion.div>
      </div>

      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
            
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
              >
                <option value="savings">Highest Savings</option>
                <option value="premium">Lowest Premium</option>
                <option value="deductible">Lowest Deductible</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredPlans.length} of {previewPlans.length} plans
          </div>
        </div>

        {/* Expandable Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Metal Level</label>
                  <select
                    value={metalFilter}
                    onChange={(e) => setMetalFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Levels</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Plans List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-gray-50 rounded-xl"
          >
            <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Plans Match Your Filters</h3>
            <p className="text-gray-500">Try adjusting your filter settings to see more options.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                <PlanSelectionCard
                  plan={plan}
                  isSelected={selectedPlan?.id === plan.id}
                  onSelect={() => onPlanSelect(plan)}
                  householdSize={householdSize}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Selection Summary */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-xl font-bold text-green-800">Great Choice!</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(selectedPlan.subsidizedPremium)}
              </div>
              <div className="text-sm text-green-700">Monthly Premium</div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(selectedPlan.estimatedSavings)}
              </div>
              <div className="text-sm text-green-700">Monthly Savings</div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSavings)}
              </div>
              <div className="text-sm text-green-700">Annual Savings</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-green-700 text-sm">
              <strong>{selectedPlan.carrierName} - {selectedPlan.planName}</strong> selected
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};