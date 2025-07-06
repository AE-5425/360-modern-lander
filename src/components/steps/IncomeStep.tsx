import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import Slider from 'rc-slider';
import Select from 'react-select';
import { 
  DollarSign, Edit3, Building, UserCheck, Shield, Clock, 
  TrendingUp, Heart, ChevronDown, ChevronUp, Info, Target, 
  Star, ArrowUpRight, RotateCcw
} from 'lucide-react';
import { EnhancedInput } from '../shared/EnhancedInput';
import { ToggleButton } from '../shared/ToggleButton';
import { formatCurrency } from '../utils/formatters';

// Income type options - simplified
const incomeTypeOptions = [
  { value: 'employment', label: 'Employment Income', icon: Building },
  { value: 'self-employment', label: 'Self-Employment', icon: UserCheck },
  { value: 'unemployment', label: 'Unemployment Benefits', icon: Shield },
  { value: 'social-security', label: 'Social Security', icon: Heart },
  { value: 'retirement', label: 'Retirement Income', icon: Clock },
  { value: 'investment', label: 'Investment Income', icon: TrendingUp },
  { value: 'not-employed', label: 'Not Currently Employed', icon: Clock },
  { value: 'other', label: 'Other Income', icon: DollarSign }
];

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? '#8b5cf6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
    '&:hover': { borderColor: '#8b5cf6' },
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    minHeight: '48px',
    border: '2px solid',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    fontWeight: '500'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f8fafc' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '2px 8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500'
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '16px',
    fontWeight: '500'
  })
};

interface HouseholdMember {
  id: string;
  type: 'spouse' | 'dependent';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  ssn: string;
  isApplyingForCoverage: boolean;
  tobaccoStatus?: 'yes' | 'no';
  medicaidDenied?: boolean;
  medicaidDeniedDate?: string;
  isExpanded?: boolean;
}

interface IncomeData {
  totalAnnualIncome: number;
  currentRange: 'maximum-savings' | 'good-savings' | 'higher-income';
  primaryIncomeType: string;
  primaryIncomeDescription: string;
  isDualIncome: boolean;
  primaryIncomeAmount: number;
  spouseIncomeAmount: number;
  spouseIncomeType: string;
  spouseIncomeDescription: string;
}

interface IncomeStepProps {
  control: any;
  errors: any;
  incomeData: IncomeData;
  householdMembers: HouseholdMember[];
  setValue: any;
  watch: any;
  calculateHouseholdSize: () => number;
  getFPL: (householdSize: number) => number;
  getSubsidyLevel: (income: number, householdSize: number) => string;
  estimateMonthlySavings: (income: number, householdSize: number) => number;
  redistributeIncome: (totalIncome: number) => void;
  handleIncomeChange: (value: number) => void;
  handleDualIncomeToggle: (isDual: boolean) => void;
  getIncomeTypeLabel: (type: string) => string;
  hasSpouse: () => boolean;
}

export const IncomeStep: React.FC<IncomeStepProps> = ({
  control,
  errors,
  incomeData,
  householdMembers,
  setValue,
  watch,
  calculateHouseholdSize,
  getFPL,
  getSubsidyLevel,
  estimateMonthlySavings,
  redistributeIncome,
  handleIncomeChange,
  handleDualIncomeToggle,
  getIncomeTypeLabel,
  hasSpouse
}) => {
  const [showTips, setShowTips] = useState(false);
  const [currentRange, setCurrentRange] = useState<'maximum-savings' | 'good-savings' | 'higher-income'>('maximum-savings');

  const householdSize = calculateHouseholdSize();
  const fpl = getFPL(householdSize);
  const monthlySavings = estimateMonthlySavings(incomeData.totalAnnualIncome, householdSize);

  // Three optimized income ranges with updated titles
  const getIncomeRanges = (householdSize: number) => {
    const fpl = getFPL(householdSize);
    return {
      'maximum-savings': {
        min: Math.round(fpl * 1.0), // 100% FPL
        max: Math.round(fpl * 1.5), // 150% FPL - Ultra-high subsidies
        step: 250,
        label: "Low Income - Highest Aid",
        description: "Ultra-high subsidies, potential Medicaid",
        color: "from-emerald-500 to-green-500",
        bgColor: "from-emerald-50 to-green-50",
        borderColor: "border-emerald-300"
      },
      'good-savings': {
        min: Math.round(fpl * 1.5), // 150% FPL
        max: Math.round(fpl * 4), // 400% FPL - Good subsidies
        step: 500,
        label: "Middle Income - Moderate Aid",
        description: "Substantial tax credits available",
        color: "from-blue-500 to-purple-500",
        bgColor: "from-blue-50 to-purple-50",
        borderColor: "border-blue-300"
      },
      'higher-income': {
        min: Math.round(fpl * 4), // 400% FPL
        max: 150000,
        step: 2500,
        label: "High Income - Limited Aid",
        description: "Limited or no tax credits",
        color: "from-purple-500 to-slate-500",
        bgColor: "from-purple-50 to-slate-50",
        borderColor: "border-purple-300"
      }
    };
  };

  const ranges = getIncomeRanges(householdSize);
  const currentRangeData = ranges[currentRange];

  // Generate random income within any specified range
  const generateRandomIncome = (rangeKey: 'maximum-savings' | 'good-savings' | 'higher-income' = 'maximum-savings') => {
    const range = ranges[rangeKey];
    const min = range.min;
    const max = range.max;
    const step = range.step;
    
    // Generate random income in increments within the range
    const steps = Math.floor((max - min) / step);
    const randomSteps = Math.floor(Math.random() * steps);
    return min + (randomSteps * step);
  };

  // Initialize with random income in optimal range
  useEffect(() => {
    // Only set random income if current income is default/unset
    if (!incomeData.totalAnnualIncome || incomeData.totalAnnualIncome === 45000) {
      const randomIncome = generateRandomIncome('maximum-savings');
      setValue('incomeData.totalAnnualIncome', randomIncome);
      handleIncomeChange(randomIncome);
    }
    
    // Set range based on current income
    const maxSavingsRange = ranges['maximum-savings'];
    const goodSavingsRange = ranges['good-savings'];
    
    if (incomeData.totalAnnualIncome <= maxSavingsRange.max) {
      setCurrentRange('maximum-savings');
      setValue('incomeData.currentRange', 'maximum-savings');
    } else if (incomeData.totalAnnualIncome <= goodSavingsRange.max) {
      setCurrentRange('good-savings');
      setValue('incomeData.currentRange', 'good-savings');
    } else {
      setCurrentRange('higher-income');
      setValue('incomeData.currentRange', 'higher-income');
    }
  }, [householdSize]);

  // Handle range change with random income generation
  const handleRangeChange = (newRange: 'maximum-savings' | 'good-savings' | 'higher-income') => {
    setCurrentRange(newRange);
    setValue('incomeData.currentRange', newRange);
    
    // Always generate random income for the selected range
    const newIncome = generateRandomIncome(newRange);
    setValue('incomeData.totalAnnualIncome', newIncome);
    handleIncomeChange(newIncome);
  };

  // Simplified income type descriptions
  const needsDescription = (type: string) => {
    return !['social-security', 'retirement', 'investment', 'unemployment', 'not-employed'].includes(type);
  };

  return (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Refined Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Income Information
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Help us calculate your approximate tax credits
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Simplified Range Selection - REMOVED DESCRIPTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-base font-semibold text-gray-700 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Income Range
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              type="button"
              onClick={() => handleRangeChange('maximum-savings')}
              className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                currentRange === 'maximum-savings'
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
              whileHover={{ scale: currentRange === 'maximum-savings' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 mr-3">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">Low Income - Highest Aid</div>
                </div>
                {currentRange === 'maximum-savings' && (
                  <Star className="w-4 h-4 text-emerald-600" />
                )}
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleRangeChange('good-savings')}
              className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                currentRange === 'good-savings'
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
              whileHover={{ scale: currentRange === 'good-savings' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mr-3">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">Middle Income - Moderate Aid</div>
                </div>
                {currentRange === 'good-savings' && (
                  <Star className="w-4 h-4 text-blue-600" />
                )}
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => handleRangeChange('higher-income')}
              className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                currentRange === 'higher-income'
                  ? 'bg-gradient-to-br from-purple-50 to-slate-50 border-purple-300 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
              whileHover={{ scale: currentRange === 'higher-income' ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-slate-500 mr-3">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm">High Income - Limited Aid</div>
                </div>
                {currentRange === 'higher-income' && (
                  <ArrowUpRight className="w-4 h-4 text-purple-600" />
                )}
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Dynamic Income Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`bg-gradient-to-br ${currentRangeData.bgColor} rounded-xl p-6 border-2 ${currentRangeData.borderColor}`}
        >
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {formatCurrency(incomeData.totalAnnualIncome)}
            </div>
            <div className="text-sm text-gray-600">Total annual income for {householdSize} {householdSize === 1 ? 'person' : 'people'}</div>
            
            {/* Clean Savings Display */}
            {monthlySavings > 0 && (
              <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full border border-green-200 mt-3">
                <span className="font-semibold text-green-700 text-sm">
                  Estimated monthly savings: {formatCurrency(monthlySavings)}
                </span>
              </div>
            )}
          </div>
          
          <Controller
            name="incomeData.totalAnnualIncome"
            control={control}
            render={({ field }) => (
              <Slider
                min={currentRangeData.min}
                max={currentRangeData.max}
                step={currentRangeData.step}
                value={Math.min(field.value, currentRangeData.max)}
                onChange={(value) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  handleIncomeChange(newValue);
                }}
                trackStyle={{ backgroundColor: '#8b5cf6', height: 8 }}
                railStyle={{ backgroundColor: '#e5e7eb', height: 8 }}
                handleStyle={{
                  borderColor: '#8b5cf6',
                  height: 24,
                  width: 24,
                  marginTop: -8,
                  backgroundColor: '#8b5cf6',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)'
                }}
              />
            )}
          />
          
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formatCurrency(currentRangeData.min)}</span>
            <span>{formatCurrency(currentRangeData.max)}</span>
          </div>
        </motion.div>

			 {/* FIXED: Wrap the entire Primary Income Type section */}
		<div className="relative z-50">
		  {/* Primary Income Type */}
		  <motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		  >
			<label htmlFor="primary-income-type" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
			  <Building className="w-4 h-4 mr-2 text-blue-500" />
			  Primary Income Source
			</label>
			<Controller
			  name="incomeData.primaryIncomeType"
			  control={control}
			  render={({ field }) => (
				<Select
				  {...field}
				  inputId="primary-income-type"
				  options={incomeTypeOptions}
				  placeholder="Select your primary income type"
				  styles={selectStyles}
				  value={incomeTypeOptions.find(option => option.value === field.value)}
				  onChange={(option) => field.onChange(option?.value || '')}
				  formatOptionLabel={(option: any) => (
					<div className="flex items-center">
					  <option.icon className="w-4 h-4 mr-3 text-purple-500" />
					  {option.label}
					</div>
				  )}
				/>
			  )}
			/>
			<ErrorMessage
			  errors={errors}
			  name="incomeData.primaryIncomeType"
			  render={({ message }) => <p className="text-red-500 text-sm mt-2">{message}</p>}
			/>
		  </motion.div>
		</div>
        {/* Income Description - Only for certain types */}
        {watch('incomeData.primaryIncomeType') && needsDescription(watch('incomeData.primaryIncomeType')) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label htmlFor="income-description" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <Edit3 className="w-4 h-4 mr-2 text-gray-500" />
              Income Description
            </label>
            <Controller
              name="incomeData.primaryIncomeDescription"
              control={control}
              render={({ field }) => (
                <EnhancedInput
                  field={{ ...field, id: 'income-description' }}
                  error={errors.incomeData?.primaryIncomeDescription}
                  placeholder={`${getIncomeTypeLabel(watch('incomeData.primaryIncomeType'))} employer or description`}
                  icon={<Edit3 className="w-4 h-4" />}
                />
              )}
            />
          </motion.div>
        )}

        {/* Dual Income Toggle */}
        {hasSpouse() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ToggleButton
              checked={incomeData.isDualIncome}
              onChange={handleDualIncomeToggle}
              label="Does your spouse/partner also have income?"
              description="Toggle on to specify separate income amounts"
            />
          </motion.div>
        )}

        {/* RESTORED: Clean Dual Income Distribution */}
        {incomeData.isDualIncome && hasSpouse() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200"
          >
            <h4 className="text-base font-semibold text-gray-800 flex items-center mb-4">
              <Heart className="w-4 h-4 mr-2 text-pink-500" />
              Income Distribution
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block font-medium text-gray-700 text-sm">Your Income</label>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(incomeData.primaryIncomeAmount)}
                </div>
                <Controller
                  name="incomeData.primaryIncomeAmount"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={0}
                      max={incomeData.totalAnnualIncome}
                      step={1000}
                      value={field.value}
                      onChange={(value) => {
                        const newValue = Array.isArray(value) ? value[0] : value;
                        const spouseValue = incomeData.totalAnnualIncome - newValue;
                        field.onChange(newValue);
                        setValue('incomeData.spouseIncomeAmount', spouseValue);
                      }}
                      trackStyle={{ backgroundColor: '#8b5cf6', height: 6 }}
                      railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                      handleStyle={{
                        borderColor: '#8b5cf6',
                        height: 18,
                        width: 18,
                        marginTop: -6,
                        backgroundColor: '#8b5cf6'
                      }}
                    />
                  )}
                />
              </div>
              
              <div className="space-y-3">
                <label className="block font-medium text-gray-700 text-sm">Spouse/Partner Income</label>
                <div className="text-2xl font-bold text-pink-600">
                  {formatCurrency(incomeData.spouseIncomeAmount)}
                </div>
                <div className="h-6 flex items-center text-sm text-gray-500">
                  Automatically calculated
                </div>
              </div>
            </div>

            {/* RESTORED: Spouse Income Type and Description */}
            <div className="mt-6 pt-6 border-t border-pink-200 space-y-4">
              <h5 className="font-semibold text-gray-700 text-sm">Spouse Income Details</h5>
              
              <div>
                <label htmlFor="spouse-income-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Spouse Income Type
                </label>
                <Controller
                  name="incomeData.spouseIncomeType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="spouse-income-type"
                      options={incomeTypeOptions}
                      placeholder="Select spouse income type"
                      styles={selectStyles}
                      value={incomeTypeOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      formatOptionLabel={(option: any) => (
                        <div className="flex items-center">
                          <option.icon className="w-4 h-4 mr-3 text-purple-500" />
                          {option.label}
                        </div>
                      )}
                    />
                  )}
                />
              </div>

              {watch('incomeData.spouseIncomeType') && needsDescription(watch('incomeData.spouseIncomeType')) && (
                <div>
                  <label htmlFor="spouse-income-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Income Description
                  </label>
                  <Controller
                    name="incomeData.spouseIncomeDescription"
                    control={control}
                    render={({ field }) => (
                      <EnhancedInput
                        field={{ ...field, id: 'spouse-income-description' }}
                        error={errors.incomeData?.spouseIncomeDescription}
                        placeholder={`${getIncomeTypeLabel(watch('incomeData.spouseIncomeType'))} employer or description`}
                        icon={<Edit3 className="w-4 h-4" />}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Simplified Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-4 hover:bg-yellow-100/50 transition-all"
          >
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-2 text-yellow-600" />
              <span className="font-semibold text-yellow-800 text-sm">
                Income Reporting Tips
              </span>
            </div>
            {showTips ? 
              <ChevronUp className="w-4 h-4 text-yellow-600" /> : 
              <ChevronDown className="w-4 h-4 text-yellow-600" />
            }
          </button>
          
          <AnimatePresence>
            {showTips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
                  <div className="flex items-start">
                    <Target className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use your expected 2025 income</span>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Include all income sources</span>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use gross income (before taxes)</span>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Estimates help you get started</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};