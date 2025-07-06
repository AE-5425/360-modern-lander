import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Slider from 'rc-slider';
import Select from 'react-select';
import { ErrorMessage } from '@hookform/error-message';

// MUI Components
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Typography,
  LinearProgress,
  Chip,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Circle as CircleIcon,
  EmojiEvents
} from '@mui/icons-material';

import { 
  ChevronRight, ChevronUp, ChevronDown, Shield, Clock, CheckCircle, ArrowLeft, Star, Users, Heart, X, 
  DollarSign, RotateCcw, Check, AlertCircle, MapPin, FileText, 
  Edit3, Calendar, CreditCard, Phone, Mail, Home, Building, Award, Zap,
  TrendingUp, Eye, EyeOff, Lock, UserCheck, Target, Sparkles, Car, Truck, Laptop, Hammer, 
  Calculator, Gift, MoreHorizontal as More, Moon, Sun
} from 'lucide-react';

// Import shared components
import { TrustFooter } from '../shared/TrustFooter';
import { EnhancedInput } from '../shared/EnhancedInput';
import { ToggleButton } from '../shared/ToggleButton';
import { formatPhoneNumber, formatCurrency } from '../utils/formatters';
import { WorkTypeSelector } from '../shared/WorkTypeSelector';

// Work Type Interface
interface WorkType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  popular?: boolean;
}

// Updated work types with broader independent work options
const workTypes: WorkType[] = [
  { id: 'freelancer', label: 'Freelancer', icon: Laptop, popular: true },
  { id: 'contractor', label: 'Contractor', icon: Hammer, popular: true },
  { id: 'business-owner', label: 'Small Business', icon: Building, popular: true },
  { id: 'consultant', label: 'Consultant', icon: Users, popular: true },
  { id: 'rideshare', label: 'Driver', icon: Car, popular: true },
  { id: 'other', label: 'Other', icon: More, popular: true }
];

// Define types locally since quote engine may not have all exports
interface WorkerProfile {
  workType: string;
  weeklyIncome: number;
  state: string;
  zipCode: string;
  age?: number;
  budgetRange: [number, number];
  coveragePriorities: string[];
  urgency: 'asap' | 'next-month' | 'exploring';
}

interface InsurancePlan {
  id: string;
  carrierName: string;
  carrierLogo: string;
  planName: string;
  planType: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  monthlyPremium: number;
  deductible: number;
  maxOutOfPocket: number;
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
  features: string[];
  network: string;
  rating: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

interface QuoteResult {
  originalPremium: number;
  estimatedPremium: number;
  monthlySavings: number;
  annualSavings: number;
  taxDeduction: number;
  effectiveMonthlyRate: number;
  plan: InsurancePlan;
  workerBenefits: string[];
}

// Simple quote generation function
const generateQuotes = (profile: WorkerProfile): QuoteResult[] => {
  const monthlyIncome = profile.weeklyIncome * 4.33;
  const annualIncome = monthlyIncome * 12;
  
  // Base quotes adjusted for income and state
  const baseQuotes: Omit<QuoteResult, 'originalPremium' | 'estimatedPremium' | 'monthlySavings' | 'annualSavings' | 'taxDeduction' | 'effectiveMonthlyRate'>[] = [
    {
      plan: {
        id: 'bronze-hsa',
        carrierName: 'Blue Cross Blue Shield',
        carrierLogo: '/logos/blue_cross_blue_shield_Logo.webp',
        planName: 'Bronze HSA Advantage',
        planType: 'Bronze',
        monthlyPremium: 280,
        deductible: 6000,
        maxOutOfPocket: 8000,
        copays: { primaryCare: 25, specialist: 65, urgentCare: 85, emergency: 350 },
        prescription: { generic: 15, preferred: 45, specialty: '30% coinsurance' },
        features: ['HSA-eligible', 'Preventive care covered', 'Tax advantages'],
        network: 'Blue Choice PPO',
        rating: 4.2
      },
      workerBenefits: ['Tax-deductible premiums', 'Flexible payment options', 'No employer verification needed']
    },
    {
      plan: {
        id: 'silver-standard',
        carrierName: 'Ambetter',
        carrierLogo: '/logos/Ambetter_Logo.webp',
        planName: 'Silver Balanced Care',
        planType: 'Silver',
        monthlyPremium: 350,
        deductible: 3500,
        maxOutOfPocket: 7000,
        copays: { primaryCare: 20, specialist: 45, urgentCare: 75, emergency: 300 },
        prescription: { generic: 10, preferred: 35, specialty: '25% coinsurance' },
        features: ['Balanced coverage', 'Mental health included', 'Telehealth'],
        network: 'Ambetter Regional',
        rating: 4.5,
        isPopular: true
      },
      workerBenefits: ['Tax-deductible premiums', 'Flexible payment options', 'Coverage during income gaps']
    },
    {
      plan: {
        id: 'gold-comprehensive',
        carrierName: 'Oscar Health',
        carrierLogo: '/logos/Oscar_Health_logo.webp',
        planName: 'Gold Comprehensive',
        planType: 'Gold',
        monthlyPremium: 420,
        deductible: 1500,
        maxOutOfPocket: 6000,
        copays: { primaryCare: 15, specialist: 35, urgentCare: 50, emergency: 250 },
        prescription: { generic: 5, preferred: 25, specialty: '20% coinsurance' },
        features: ['Low deductible', 'Comprehensive coverage', 'Concierge care'],
        network: 'Oscar Metro Plus',
        rating: 4.7,
        isBestValue: true
      },
      workerBenefits: ['Tax-deductible premiums', 'Flexible payment options', 'Premium customer service']
    }
  ];

  // Calculate pricing based on income and location
  const stateFactor = profile.state === 'FL' ? 1.0 : profile.state === 'CA' ? 1.3 : 0.95;
  const incomeFactor = annualIncome < 30000 ? 0.85 : annualIncome < 50000 ? 0.92 : 0.98;
  
  return baseQuotes.map(baseQuote => {
    const basePremium = baseQuote.plan.planType === 'Bronze' ? 280 : 
                      baseQuote.plan.planType === 'Silver' ? 350 : 420;
    
    const originalPremium = Math.round(basePremium * stateFactor);
    const estimatedPremium = Math.round(originalPremium * incomeFactor);
    const monthlySavings = Math.max(0, originalPremium - estimatedPremium);
    const annualSavings = monthlySavings * 12;
    const taxDeduction = Math.round(estimatedPremium * 12 * 0.22);
    const effectiveMonthlyRate = Math.round(estimatedPremium - (taxDeduction / 12));
    
    return {
      ...baseQuote,
      originalPremium,
      estimatedPremium,
      monthlySavings,
      annualSavings,
      taxDeduction,
      effectiveMonthlyRate
    };
  });
};

// Import RC-Slider styles
import 'rc-slider/assets/index.css';

// Form Data Interface
interface IndependentWorkerLeadData {
  // Step 1: Quick Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  workType: string;
  
  // Step 2: Income & Location
  zipCode: string;
  state?: string; // Auto-populated from ZIP
  age: number;
  weeklyIncome: number;
  incomeVariable: boolean;
  
  // Step 3: Coverage Preferences
  budgetRange: [number, number];
  coveragePriorities: string[];
  urgency: 'asap' | 'next-month' | 'exploring';
  marketingOptIn: boolean;
  
  // Step 4: Quote Selection & Appointment
  selectedQuote?: QuoteResult;
  appointmentDate?: Date;
  appointmentTime?: string;
}

interface SubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
  leadId?: string;
}

// ZIP code to state mapping (simplified)
const getStateFromZip = (zipCode: string): string => {
  const zipInt = parseInt(zipCode.substring(0, 3));
  
  // Florida ZIP codes
  if (zipInt >= 320 && zipInt <= 349) return 'FL';
  // Texas ZIP codes  
  if (zipInt >= 730 && zipInt <= 799) return 'TX';
  if (zipInt >= 885 && zipInt <= 885) return 'TX';
  // California ZIP codes
  if (zipInt >= 900 && zipInt <= 966) return 'CA';
  // New York ZIP codes
  if (zipInt >= 100 && zipInt <= 149) return 'NY';
  // Georgia ZIP codes
  if (zipInt >= 300 && zipInt <= 319) return 'GA';
  // North Carolina ZIP codes
  if (zipInt >= 270 && zipInt <= 289) return 'NC';
  // Alabama ZIP codes
  if (zipInt >= 350 && zipInt <= 369) return 'AL';
  // Arizona ZIP codes
  if (zipInt >= 850 && zipInt <= 865) return 'AZ';
  // Illinois ZIP codes
  if (zipInt >= 600 && zipInt <= 629) return 'IL';
  // Ohio ZIP codes
  if (zipInt >= 430 && zipInt <= 458) return 'OH';
  
  return 'FL'; // Default to Florida
};

// Coverage priorities
const coveragePriorities = [
  { value: 'low-cost', label: 'Lowest Monthly Cost' },
  { value: 'low-deductible', label: 'Low Deductible' },
  { value: 'specific-doctors', label: 'Keep My Doctors' },
  { value: 'prescription', label: 'Prescription Coverage' },
  { value: 'preventive', label: 'Preventive Care' },
  { value: 'emergency', label: 'Emergency Coverage' }
];

// Age options for dropdown
const ageOptions = Array.from({ length: 64 }, (_, i) => ({
  value: i + 18,
  label: `${i + 18} years old`
}));

// State options
const stateOptions = [
  { value: 'FL', label: 'Florida' },
  { value: 'TX', label: 'Texas' },
  { value: 'CA', label: 'California' },
  { value: 'NY', label: 'New York' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'IL', label: 'Illinois' },
  { value: 'OH', label: 'Ohio' }
];

// Default form values
const getDefaultValues = (): IndependentWorkerLeadData => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  workType: '',
  state: '',
  zipCode: '',
  age: 30,
  weeklyIncome: 800,
  incomeVariable: true,
  budgetRange: [100, 300], // Keep this for slider functionality
  coveragePriorities: [],
  urgency: '' as any, // Empty by default so step 3 isn't marked complete initially
  marketingOptIn: true,
  selectedQuote: undefined
});

// Validation schema
const createValidationSchema = (currentStep: number) => {
  const baseSchema = {
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    workType: yup.string().required('Work type is required'),
  };

  const step2Schema = {
    state: yup.string().required('State is required'),
    zipCode: yup.string().matches(/^\d{5}$/, 'ZIP code must be 5 digits').required('ZIP code is required'),
    age: yup.number().min(18, 'Must be 18 or older').max(80, 'Must be 80 or younger').required('Age is required'),
    weeklyIncome: yup.number().min(1, 'Income is required').required('Income is required'),
  };

  const step3Schema = {
    budgetRange: yup.array().of(yup.number()).required('Budget range is required'),
    urgency: yup.string().required('Urgency is required'),
  };

  const step4Schema = {
    selectedQuote: yup.object().required('Please select a quote to continue'),
    appointmentDate: yup.date().required('Please schedule an appointment'),
    appointmentTime: yup.string().required('Please select an appointment time'),
  };

  if (currentStep === 1) {
    return yup.object().shape(baseSchema);
  } else if (currentStep === 2) {
    return yup.object().shape({ ...baseSchema, ...step2Schema });
  } else if (currentStep === 3) {
    return yup.object().shape({ ...baseSchema, ...step2Schema, ...step3Schema });
  } else {
    return yup.object().shape({ ...baseSchema, ...step2Schema, ...step3Schema, ...step4Schema });
  }
};

// Updated step configuration
const stepLabels = [
  'About You',
  'Work & Income', 
  'Coverage Preferences',
  'Choose Your Plan'
];

// Custom Step Icon Component
const CustomStepIcon = (props: any) => {
  const { active, completed, icon } = props;
  const theme = useTheme();
  
  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
      >
        <CheckCircleIcon 
          sx={{ 
            color: theme.palette.success.main,
            fontSize: 28,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }} 
        />
      </motion.div>
    );
  }
  
  if (active) {
    return (
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          {icon}
        </Paper>
      </motion.div>
    );
  }
  
  return (
    <CircleIcon 
      sx={{ 
        color: theme.palette.grey[400],
        fontSize: 28 
      }} 
    />
  );
};

// Enhanced select styles
const getSelectStyles = (darkMode: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? '#3b82f6' : (darkMode ? '#4b5563' : '#e5e7eb'),
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': { borderColor: '#3b82f6' },
    backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
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
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? (darkMode ? '#374151' : '#f8fafc') : (darkMode ? '#1f2937' : 'white'),
    color: state.isSelected ? 'white' : (darkMode ? '#f3f4f6' : '#374151'),
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
    border: `2px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    backgroundColor: darkMode ? '#1f2937' : 'white'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: darkMode ? '#9ca3af' : '#9ca3af',
    fontSize: '16px',
    fontWeight: '500'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: darkMode ? '#f3f4f6' : '#374151',
    fontSize: '16px',
    fontWeight: '500'
  })
});

export const GigWorkerLeadForm: React.FC = () => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: 'idle' });
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);
  const totalSteps = 4;

  // Scroll to top when step changes
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    // Scroll to top immediately
    scrollToTop();
  }, [currentStep]);

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
    reset
  } = useForm<IndependentWorkerLeadData>({
    resolver: yupResolver(createValidationSchema(currentStep)),
    defaultValues: getDefaultValues(),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  const watchedValues = watch();

  // Calculate monthly income from weekly
  const monthlyIncome = (watchedValues.weeklyIncome || 0) * 4.33;
  const annualIncome = monthlyIncome * 12;

  // Calculate step completion using useMemo to prevent infinite loops
  const stepCompletion = useMemo(() => {
    return [
      // Step 1: About You
      !!(watchedValues.firstName && watchedValues.lastName && watchedValues.email && watchedValues.phone && watchedValues.workType),
      
      // Step 2: Income & Location
      !!(watchedValues.zipCode && watchedValues.age && watchedValues.weeklyIncome > 0),
      
      // Step 3: Coverage Preferences - Only complete if user actually selected urgency
      !!(watchedValues.budgetRange && watchedValues.urgency),
      
      // Step 4: Quote Selection & Appointment
      !!(watchedValues.selectedQuote && selectedDate && selectedTime)
    ];
  }, [
    watchedValues.firstName,
    watchedValues.lastName,
    watchedValues.email,
    watchedValues.phone,
    watchedValues.workType,
    watchedValues.zipCode,
    watchedValues.age,
    watchedValues.weeklyIncome,
    watchedValues.budgetRange,
    watchedValues.urgency,
    watchedValues.selectedQuote,
    selectedDate,
    selectedTime
  ]);

  // Auto-populate state from ZIP code
  useEffect(() => {
    if (watchedValues.zipCode && watchedValues.zipCode.length === 5) {
      const detectedState = getStateFromZip(watchedValues.zipCode);
      if (detectedState !== watchedValues.state) {
        setValue('state', detectedState);
      }
    }
  }, [watchedValues.zipCode, watchedValues.state, setValue]);

  // Generate quotes function
  const generateQuotesForUser = async () => {
    if (!watchedValues.workType || !watchedValues.zipCode || !watchedValues.weeklyIncome) {
      setQuoteError(true);
      return;
    }

    setQuoteLoading(true);
    setQuoteError(false);

    try {
      // Auto-detect state from ZIP code
      const detectedState = getStateFromZip(watchedValues.zipCode);
      
      // Create worker profile from form data
      const profile: WorkerProfile = {
        workType: watchedValues.workType,
        weeklyIncome: watchedValues.weeklyIncome,
        state: detectedState,
        zipCode: watchedValues.zipCode,
        age: watchedValues.age,
        budgetRange: watchedValues.budgetRange,
        coveragePriorities: watchedValues.coveragePriorities,
        urgency: watchedValues.urgency
      };

      // Generate quotes using the quote engine
      const generatedQuotes = generateQuotes(profile);
      setQuotes(generatedQuotes);
      setCurrentStep(4);
    } catch (error) {
      console.error('Quote generation error:', error);
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  };

  // Navigation
  const nextStep = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      if (currentStep === 3) {
        // Generate quotes before moving to step 4
        await generateQuotesForUser();
      } else if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form submission
  const onSubmit = async (data: IndependentWorkerLeadData) => {
    if (submissionState.status !== 'idle') return;

    setSubmissionState({ status: 'submitting' });
    
    try {
      // Auto-detect state from ZIP code
      const detectedState = getStateFromZip(data.zipCode);
      
      // Simulate API call with enhanced data
      const submissionData = {
        ...data,
        state: detectedState,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        selectedQuote: data.selectedQuote,
        estimatedPremium: data.selectedQuote?.estimatedPremium,
        taxSavings: data.selectedQuote?.taxDeduction,
        carrierName: data.selectedQuote?.plan.carrierName,
        planName: data.selectedQuote?.plan.planName,
        submissionTime: new Date().toISOString()
      };

      console.log('Submitting enhanced lead data:', submissionData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const leadId = 'LEAD-' + Date.now();
      
      setSubmissionState({ 
        status: 'success', 
        leadId,
        message: 'Appointment scheduled! Your insurance expert will call you at the scheduled time.' 
      });

      // Auto-close after 3 seconds
      setTimeout(() => {
        setSubmissionState({ status: 'idle' });
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionState({ 
        status: 'error', 
        message: 'Submission failed. Please try again.' 
      });
    }
  };

  // Calendar Component
  const CalendarScheduler = () => {
    // Generate next 30 days excluding weekends
    const getAvailableDates = () => {
      const dates = [];
      const today = new Date();
      let currentDate = new Date(today);
      
      while (dates.length < 20) {
        const dayOfWeek = currentDate.getDay();
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    // Available time slots
    const timeSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
      '4:00 PM', '4:30 PM', '5:00 PM'
    ];

    const availableDates = getAvailableDates();

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    return (
      <div className="max-w-4xl mx-auto">
        <style>
          {`
            .date-selected-dark {
              background-color: rgba(34, 197, 94, 0.5) !important;
              background-image: none !important;
            }
            .date-selected-light {
              background-color: rgb(240, 253, 244) !important;
              background-image: none !important;
            }
          `}
        </style>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Selection */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 transition-colors ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Select a Date
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableDates.map((date, index) => (
				<motion.button
                  key={index}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? (darkMode 
                          ? 'border-green-500 bg-green-900/50 shadow-lg' 
                          : 'border-green-500 bg-green-50 shadow-lg')
                      : (darkMode 
                          ? 'border-gray-600 hover:border-green-400 hover:bg-green-900/30 bg-gray-800/70' 
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50 bg-white')
                  }`}
                  style={{
                    // Force override any browser defaults - same as working time buttons
                    backgroundColor: selectedDate?.toDateString() === date.toDateString()
                      ? (darkMode ? 'rgba(34, 197, 94, 0.5)' : 'rgb(240, 253, 244)')
                      : (darkMode ? 'rgba(31, 41, 55, 0.7)' : 'white')
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold transition-colors ${
                        darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <div className={`transition-colors ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    {selectedDate?.toDateString() === date.toDateString() && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 transition-colors ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            }`}>
              Select a Time
            </h4>
            {!selectedDate ? (
              <div className={`text-center py-12 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <Clock className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <p>Please select a date first</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {timeSlots.map((time, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedTime === time
                        ? (darkMode 
                            ? 'border-green-500 bg-green-900/50 shadow-lg' 
                            : 'border-green-500 bg-green-50 shadow-lg')
                        : (darkMode 
                            ? 'border-gray-600 hover:border-green-400 hover:bg-green-900/30 bg-gray-800/70' 
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50 bg-white')
                    }`}
                    style={{
                      // Force override any browser defaults
                      backgroundColor: selectedTime === time
                        ? (darkMode ? 'rgba(34, 197, 94, 0.5)' : 'rgb(240, 253, 244)')
                        : (darkMode ? 'rgba(31, 41, 55, 0.7)' : 'white')
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`font-semibold transition-colors ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>{time}</div>
                    {selectedTime === time && (
                      <CheckCircle className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Compact Quote Card Component
  const QuoteCard = ({ quote, index }: { quote: QuoteResult; index: number }) => {
    const isSelected = watchedValues.selectedQuote?.plan.id === quote.plan.id;
    const isPopular = quote.plan.isPopular;
    const isBestValue = quote.plan.isBestValue;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          delay: index * 0.1, 
          duration: 0.5,
          type: "spring",
          stiffness: 300
        }}
        whileHover={{ 
          y: -4, 
          scale: 1.01,
          transition: { duration: 0.2 }
        }}
        className="relative group w-full max-w-2xl mx-auto"
      >
        <button
          type="button"
          onClick={() => setValue('selectedQuote', quote)}
          className={`w-full p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-300 min-h-[180px] md:min-h-[200px] ${
            isSelected
              ? (darkMode 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-900/50 to-green-900/50 shadow-xl ring-4 ring-blue-500/30' 
                  : 'border-blue-500 bg-gradient-to-br from-blue-50 to-green-50 shadow-xl ring-4 ring-blue-200')
              : (darkMode 
                  ? 'border-gray-600/50 bg-gray-800/50 hover:border-blue-500/50 shadow-lg hover:shadow-xl' 
                  : 'border-gray-200 bg-white hover:border-blue-300 shadow-lg hover:shadow-xl')
          }`}
        >
          {/* Popular/Best Value Badge */}
          {(isPopular || isBestValue) && (
            <motion.div 
              className="absolute -top-2 md:-top-3 left-4 md:left-6"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                isPopular ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-blue-500'
              }`}>
                {isPopular ? '🔥 Most Popular' : '⭐ Best Value'}
              </span>
            </motion.div>
          )}

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-3">
              <div className="flex items-center space-x-2 md:space-x-3">
                <img 
                  src={quote.plan.carrierLogo} 
                  alt={quote.plan.carrierName}
                  className="w-8 h-8 md:w-12 md:h-12 object-contain flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className={`font-bold text-sm md:text-lg truncate transition-colors ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{quote.plan.carrierName}</h3>
                  <p className={`text-xs md:text-sm truncate transition-colors ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{quote.plan.planName}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  ${quote.estimatedPremium}/mo
                </div>
                {quote.monthlySavings > 0 && (
                  <div className="text-xs md:text-sm text-gray-500 line-through">
                    ${quote.originalPremium}/mo
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-xs mb-1 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Deductible</div>
                <div className={`font-semibold text-sm md:text-base transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>${quote.plan.deductible.toLocaleString()}</div>
              </div>
              <div className={`p-2 md:p-3 rounded-lg transition-colors ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
                <div className={`text-xs mb-1 transition-colors ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Max Out-of-Pocket</div>
                <div className={`font-semibold text-sm md:text-base transition-colors ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>${quote.plan.maxOutOfPocket.toLocaleString()}</div>
              </div>
            </div>

            <div className="mb-3 md:mb-4">
              <div className={`text-xs mb-2 font-semibold transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Key Benefits</div>
              <div className="flex flex-wrap gap-1">
                {quote.workerBenefits.slice(0, 2).map((benefit, i) => (
                  <span 
                    key={i} 
                    className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {isSelected && (
              <motion.div 
                className="flex items-center justify-center mt-3 md:mt-4 text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                <span className="font-bold text-sm md:text-base">Selected Plan</span>
              </motion.div>
            )}
          </div>
        </button>
      </motion.div>
    );
  };

  const SubmissionOverlay = () => {
    if (submissionState.status === 'idle') return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-lg"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`rounded-3xl p-10 max-w-lg mx-4 text-center shadow-2xl border transition-all ${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          {submissionState.status === 'submitting' && (
            <>
              <motion.div 
                className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Scheduling Your Appointment</h3>
              <p className={`mb-4 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Connecting you with a licensed insurance expert...</p>
            </>
          )}
          
          {submissionState.status === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Appointment Scheduled!</h3>
              <p className={`mb-6 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{submissionState.message}</p>
              {submissionState.leadId && (
                <div className={`rounded-xl p-4 mb-4 transition-colors ${
                  darkMode ? 'bg-green-900/50' : 'bg-green-50'
                }`}>
                  <p className={`text-sm font-medium transition-colors ${
                    darkMode ? 'text-green-300' : 'text-green-700'
                  }`}>
                    Reference ID: {submissionState.leadId}
                  </p>
                </div>
              )}
            </>
          )}
          
          {submissionState.status === 'error' && (
            <>
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h3 className={`text-2xl font-bold mb-3 transition-colors ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>Something Went Wrong</h3>
              <p className={`mb-6 transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{submissionState.message}</p>
              <button
                onClick={() => setSubmissionState({ status: 'idle' })}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
              >
                Try Again
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen flex relative overflow-hidden transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900' 
        : 'bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50'
    }`}>
      <SubmissionOverlay />

      {/* Control Buttons - Exit and Dark Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed top-4 right-4 z-50 flex gap-3"
      >
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all ${
            darkMode 
              ? 'bg-gray-800/80 border-gray-600/50 text-yellow-400 hover:bg-gray-700/90' 
              : 'bg-white/80 border-white/50 text-gray-600 hover:bg-white/90 hover:text-gray-800'
          } backdrop-blur-sm`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Exit Form Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.href = '/'}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border transition-all ${
            darkMode 
              ? 'bg-gray-800/80 border-gray-600/50 text-gray-300 hover:bg-gray-700/90 hover:text-white' 
              : 'bg-white/80 border-white/50 text-gray-600 hover:bg-white/90 hover:text-gray-800'
          } backdrop-blur-sm`}
          title="Exit Form"
        >
          <X className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* FIXED Hero Section - Left Side */}
      <div 
        className="hidden lg:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '33.333333%', // Exact 1/3 width
          height: '100vh',
          zIndex: 1,
          contain: 'layout style paint', // CSS containment prevents interference
          overflow: 'hidden'
        }}
      >
        {/* Background as CSS instead of img tag for stability */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/images/young_woman_on_laptop.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: '20% center', // Moved image further left to show more of the woman
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll', // Changed from 'fixed' to allow positioning
            willChange: 'auto' // Prevent transform optimizations
          }}
        >
          {/* Gradient Overlay */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(30, 58, 138, 0.6) 50%, rgba(31, 41, 55, 0.7) 100%)'
            }}
          />
        </div>
        
        {/* Content Container */}
        <div 
          className="relative z-10 flex flex-col justify-center px-12 text-white"
          style={{
            height: '100%',
            contain: 'layout style'
          }}
        >
          {/* Company Logo/Name */}
          <div className="mb-6 max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">360 Insurance Group</h1>
                <p className="text-xs text-gray-300">We have you covered</p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/30">
            <Zap className="w-4 h-4 text-yellow-300 mr-2" />
            <span className="font-semibold text-sm">90-second application</span>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight max-w-sm">
            Get Your Quote
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-green-300 to-blue-300">
              Right Now
            </span>
          </h2>
          <p className="text-lg mb-8 text-gray-200 leading-relaxed max-w-xs">
            Instant quotes for independent workers. No W-2 required, tax deductible, 
            and designed for the self-employed.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl font-bold text-blue-300">25,000+</div>
              <div className="text-xs text-gray-300">Workers Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="text-xl font-bold text-green-300">$2.3M</div>
              <div className="text-xs text-gray-300">Total Savings</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-sm">
            {[
              { icon: Shield, text: "No employer verification needed", color: "text-blue-300", bgColor: "bg-blue-500/20" },
              { icon: Calculator, text: "Tax deductible premiums", color: "text-yellow-300", bgColor: "bg-yellow-500/20" },
              { icon: Clock, text: "Get quotes in 90 seconds", color: "text-green-300", bgColor: "bg-green-500/20" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`${item.bgColor} backdrop-blur-sm rounded-full p-2`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-gray-200 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADJUSTED Form Section - Right Side */}
      <div 
        className="w-full flex items-center justify-center p-3 md:p-6 lg:p-8 relative z-10"
        style={{
          // Account for fixed left pane on large screens
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '33.333333%' : '0',
          width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '66.666667%' : '100%',
          minHeight: '100vh',
          contain: 'layout style'
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <div className={`backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 border relative overflow-hidden min-h-[500px] md:min-h-[600px] transition-all duration-500 ${
            darkMode 
              ? 'bg-gray-800/95 border-gray-700/30' 
              : 'bg-white/95 border-white/20'
          }`}>
            <div className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800/20 via-blue-900/20 to-green-900/20' 
                : 'bg-gradient-to-br from-white/5 via-blue-500/5 to-green-500/5'
            }`}></div>
            
            <div className="relative z-10">
              {/* Premium Progress Header */}
              <Box sx={{ mb: { xs: 4, md: 6 } }}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: { xs: 2, md: 3 }
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Step {currentStep} of {totalSteps}
                    </Typography>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold',
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontSize: { xs: '0.875rem', md: '1rem' }
                        }}
                      >
                        {Math.round((currentStep / totalSteps) * 100)}% Complete
                      </Typography>
                    </motion.div>
                  </Box>

                  <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <LinearProgress 
                        variant="determinate" 
                        value={(currentStep / totalSteps) * 100}
                        sx={{
                          height: { xs: 8, md: 12 },
                          borderRadius: { xs: 4, md: 6 },
                          backgroundColor: alpha(theme.palette.grey[300], 0.3),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: { xs: 4, md: 6 },
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                          }
                        }}
                      />
                    </motion.div>
                  </Box>

                  <Stepper 
                    activeStep={currentStep - 1} 
                    alternativeLabel
                    sx={{
                      '& .MuiStepConnector-root': {
                        top: { xs: 12, md: 14 },
                        '& .MuiStepConnector-line': {
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          borderTopWidth: { xs: 2, md: 3 },
                        }
                      },
                      '& .MuiStepConnector-active .MuiStepConnector-line': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: `0 0 8px ${theme.palette.primary.main}40`,
                      },
                      '& .MuiStepConnector-completed .MuiStepConnector-line': {
                        borderColor: theme.palette.success.main,
                        boxShadow: `0 0 8px ${theme.palette.success.main}40`,
                      },
                      '& .MuiStepLabel-label': {
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        fontWeight: 500,
                        mt: 1,
                        color: theme.palette.text.secondary,
                        '&.Mui-active': {
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                        },
                        '&.Mui-completed': {
                          color: theme.palette.success.main,
                          fontWeight: 600,
                        }
                      }
                    }}
                  >
                    {stepLabels.map((label, index) => (
                      <Step key={label} completed={stepCompletion[index]}>
                        <StepLabel StepIconComponent={CustomStepIcon}>
                          {label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </motion.div>
              </Box>

              {/* Form Steps */}
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  {/* Step 1: About You */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <motion.div 
                        className="text-center mb-6 md:mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="inline-block mb-3 md:mb-4"
                        >
                          <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-full p-3 md:p-4 shadow-lg">
                            <UserCheck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                        </motion.div>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-2 md:mb-3 transition-colors ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-100 to-blue-300 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent'
                        }`}>
                          Tell Us About Yourself
                        </h2>
                        <p className={`text-base md:text-lg transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Quick contact info and what type of work you do
                        </p>
                      </motion.div>
                      
                      <div className="space-y-6 md:space-y-8">
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div>
                            <label htmlFor="firstName" className={`block text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center transition-colors ${
                              darkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              <UserCheck className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
                              First Name
                            </label>
                            <Controller
                              name="firstName"
                              control={control}
                              render={({ field }) => (
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <EnhancedInput
                                    field={{ ...field, id: 'firstName' }}
                                    error={errors.firstName}
                                    placeholder="First Name"
                                    darkMode={darkMode}
                                  />
                                </motion.div>
                              )}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="lastName" className={`block text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center transition-colors ${
                              darkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              <UserCheck className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
                              Last Name
                            </label>
                            <Controller
                              name="lastName"
                              control={control}
                              render={({ field }) => (
                                <motion.div
                                  whileFocus={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <EnhancedInput
                                    field={{ ...field, id: 'lastName' }}
                                    error={errors.lastName}
                                    placeholder="Last Name"
                                    darkMode={darkMode}
                                  />
                                </motion.div>
                              )}
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label htmlFor="email" className={`block text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <Mail className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
                            Email Address
                          </label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <EnhancedInput
                                  field={{ ...field, id: 'email' }}
                                  error={errors.email}
                                  placeholder="Email Address"
                                  type="email"
                                  darkMode={darkMode}
                                />
                              </motion.div>
                            )}
                          />
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <label htmlFor="phone" className={`block text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
                            Phone Number
                          </label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <EnhancedInput
                                  field={{ ...field, id: 'phone' }}
                                  error={errors.phone}
                                  placeholder="Phone Number"
                                  type="tel"
                                  formatter={formatPhoneNumber}
                                  maxLength={14}
                                  darkMode={darkMode}
                                />
                              </motion.div>
                            )}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <label className={`block text-sm md:text-base font-semibold mb-3 md:mb-4 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <Building className="w-3 h-3 md:w-4 md:h-4 mr-2 text-blue-500" />
                            What Type of Work Do You Do?
                          </label>
                          <Controller
                            name="workType"
                            control={control}
                            render={({ field }) => (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                <WorkTypeSelector
                                  selectedWorkType={field.value}
                                  onSelect={field.onChange}
                                  error={errors.workType}
                                  showPopular={false}
                                  columns={3}
                                  size="medium"
                                  darkMode={darkMode}
                                />
                              </motion.div>
                            )}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Work & Income + Age */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="text-center mb-8">
                        <h2 className={`text-2xl font-bold mb-3 transition-colors ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-100 to-blue-300 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent'
                        }`}>
                          Income & Location Details
                        </h2>
                        <p className={`text-base transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Help us find plans available in your area and estimate costs
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="zipCode" className={`block text-base font-semibold mb-2 flex items-center transition-colors ${
                              darkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                              ZIP Code
                            </label>
                            <Controller
                              name="zipCode"
                              control={control}
                              render={({ field }) => (
                                <EnhancedInput
                                  field={{ ...field, id: 'zipCode' }}
                                  error={errors.zipCode}
                                  placeholder="ZIP Code"
                                  maxLength={5}
                                  darkMode={darkMode}
                                />
                              )}
                            />
                          </div>

                          <div>
                            <label htmlFor="age" className={`block text-base font-semibold mb-2 flex items-center transition-colors ${
                              darkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
                              Age
                            </label>
                            <Controller
                              name="age"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={ageOptions}
                                  value={ageOptions.find(option => option.value === field.value)}
                                  onChange={(option) => field.onChange(option?.value)}
                                  styles={getSelectStyles(darkMode)}
                                  placeholder="Select your age"
                                  isSearchable={false}
                                />
                              )}
                            />
                            {errors.age && (
                              <p className="text-red-500 text-sm mt-2">{errors.age.message}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Auto-detected state display */}
                        {watchedValues.zipCode && watchedValues.zipCode.length === 5 && (
                          <div className={`text-sm p-3 rounded-lg border transition-all ${
                            darkMode 
                              ? 'text-gray-300 bg-blue-900/50 border-blue-700/50' 
                              : 'text-gray-600 bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                              <span>Detected state: <strong>{watchedValues.state}</strong></span>
                            </div>
                          </div>
                        )}

                        <div className={`rounded-xl p-6 border-2 transition-all ${
                          darkMode 
                            ? 'bg-gradient-to-br from-blue-900/40 to-green-900/40 border-blue-700/50' 
                            : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-200'
                        }`}>
                          <div className="text-center mb-6">
                            <div className={`text-4xl font-bold mb-2 transition-colors ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                              {formatCurrency(watchedValues.weeklyIncome || 0)} / week
                            </div>
                            <div className={`text-sm transition-colors ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              ≈ {formatCurrency(monthlyIncome)} / month | {formatCurrency(annualIncome)} / year
                            </div>
                          </div>
                          
                          <label className={`block text-base font-semibold mb-4 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            How much do you typically earn per week?
                          </label>
                          
                          <Controller
                            name="weeklyIncome"
                            control={control}
                            render={({ field }) => (
                              <Slider
                                min={100}
                                max={3000}
                                step={50}
                                value={field.value || 800}
                                onChange={(value) => {
                                  const newValue = Array.isArray(value) ? value[0] : value;
                                  field.onChange(newValue);
                                }}
                                trackStyle={{ backgroundColor: '#3b82f6', height: 8 }}
                                railStyle={{ backgroundColor: '#e5e7eb', height: 8 }}
                                handleStyle={{
                                  borderColor: '#3b82f6',
                                  height: 24,
                                  width: 24,
                                  marginTop: -8,
                                  backgroundColor: '#3b82f6',
                                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                                }}
                              />
                            )}
                          />
                          
                          <div className={`flex justify-between text-sm mt-2 transition-colors ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span>$100/week</span>
                            <span>$3,000/week</span>
                          </div>

                          <div className="mt-6">
                            <ToggleButton
                              checked={watchedValues.incomeVariable || false}
                              onChange={(checked) => setValue('incomeVariable', checked)}
                              label="My income varies week to week"
                              description="Common for independent workers - we'll account for this"
                              darkMode={darkMode}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Coverage Preferences */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="text-center mb-8">
                        <h2 className={`text-2xl font-bold mb-3 transition-colors ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-100 to-blue-300 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent'
                        }`}>
                          Coverage Preferences
                        </h2>
                        <p className={`text-base transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Tell us what matters most to you in a health plan
                        </p>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className={`block text-base font-semibold mb-4 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            What's your monthly budget for health insurance?
                          </label>
                          
                          <div className={`rounded-xl p-6 border-2 transition-all ${
                            darkMode 
                              ? 'bg-gradient-to-br from-green-900/40 to-blue-900/40 border-green-700/50' 
                              : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'
                          }`}>
                            <div className="text-center mb-4">
                              <div className={`text-2xl font-bold transition-colors ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`}>
                                {formatCurrency(watchedValues.budgetRange?.[0] || 100)} - {formatCurrency(watchedValues.budgetRange?.[1] || 300)} / month
                              </div>
                            </div>
                            
                            <Controller
                              name="budgetRange"
                              control={control}
                              render={({ field }) => (
                                <Slider
                                  range
                                  min={50}
                                  max={500}
                                  step={25}
                                  value={field.value || [100, 300]}
                                  onChange={(value) => field.onChange(value)}
                                  trackStyle={[{ backgroundColor: '#10b981', height: 8 }]}
                                  railStyle={{ backgroundColor: '#e5e7eb', height: 8 }}
                                  handleStyle={[
                                    {
                                      borderColor: '#10b981',
                                      height: 24,
                                      width: 24,
                                      marginTop: -8,
                                      backgroundColor: '#10b981',
                                    },
                                    {
                                      borderColor: '#10b981',
                                      height: 24,
                                      width: 24,
                                      marginTop: -8,
                                      backgroundColor: '#10b981',
                                    }
                                  ]}
                                />
                              )}
                            />
                            
                            <div className={`flex justify-between text-sm mt-2 transition-colors ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <span>$50/month</span>
                              <span>$500/month</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-base font-semibold mb-4 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <Heart className="w-4 h-4 mr-2 text-red-500" />
                            What's most important to you? (Select all that apply)
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {coveragePriorities.map((priority) => (
                              <motion.button
                                key={priority.value}
                                type="button"
                                onClick={() => {
                                  const current = watchedValues.coveragePriorities || [];
                                  const newPriorities = current.includes(priority.value)
                                    ? current.filter(p => p !== priority.value)
                                    : [...current, priority.value];
                                  setValue('coveragePriorities', newPriorities);
                                }}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  (watchedValues.coveragePriorities || []).includes(priority.value)
                                    ? (darkMode 
                                        ? 'bg-gradient-to-br from-blue-900/50 to-green-900/50 border-blue-500/70 shadow-lg' 
                                        : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-400 shadow-lg')
                                    : (darkMode 
                                        ? 'bg-gray-800/50 border-gray-600/50 hover:border-blue-500/50 hover:bg-blue-900/30 shadow-md hover:shadow-lg' 
                                        : 'bg-white border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg')
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium transition-colors ${
                                    darkMode ? 'text-gray-200' : 'text-gray-800'
                                  }`}>{priority.label}</span>
                                  {(watchedValues.coveragePriorities || []).includes(priority.value) && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className={`block text-base font-semibold mb-4 flex items-center transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            When do you need coverage?
                          </label>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                              { value: 'asap', label: 'As Soon As Possible', description: 'Start coverage immediately' },
                              { value: 'next-month', label: 'Next Month', description: 'Start next month' },
                              { value: 'exploring', label: 'Just Exploring', description: 'Getting quotes for now' }
                            ].map((urgency) => (
                              <motion.button
                                key={urgency.value}
                                type="button"
                                onClick={() => setValue('urgency', urgency.value as any)}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${
                                  watchedValues.urgency === urgency.value
                                    ? (darkMode 
                                        ? 'bg-gradient-to-br from-blue-900/50 to-green-900/50 border-blue-500/70 shadow-lg' 
                                        : 'bg-gradient-to-br from-blue-50 to-green-50 border-blue-400 shadow-lg')
                                    : (darkMode 
                                        ? 'bg-gray-800/50 border-gray-600/50 hover:border-blue-500/50 hover:bg-blue-900/30 shadow-md hover:shadow-lg' 
                                        : 'bg-white border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg')
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className={`font-semibold mb-1 transition-colors ${
                                  darkMode ? 'text-gray-200' : 'text-gray-800'
                                }`}>{urgency.label}</div>
                                <div className={`text-sm transition-colors ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>{urgency.description}</div>
                                {watchedValues.urgency === urgency.value && (
                                  <div className="mt-2 flex justify-center">
                                    <CheckCircle className="w-5 h-5 text-blue-500" />
                                  </div>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <ToggleButton
                            checked={watchedValues.marketingOptIn || false}
                            onChange={(checked) => setValue('marketingOptIn', checked)}
                            label="Send me helpful health insurance updates"
                            description="Get money-saving tips and important plan updates (optional)"
                            darkMode={darkMode}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Quote Display & Appointment Scheduling */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="text-center mb-8">
                        <h2 className={`text-2xl font-bold mb-3 transition-colors ${
                          darkMode 
                            ? 'bg-gradient-to-r from-gray-100 to-blue-300 bg-clip-text text-transparent' 
                            : 'bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent'
                        }`}>
                          Your Personalized Quotes
                        </h2>
                        <p className={`text-base transition-colors ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Choose your plan and schedule a consultation
                        </p>
                      </div>

                      {quoteLoading && (
                        <div className="text-center py-12">
                          <motion.div 
                            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className={`text-lg transition-colors ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Generating your personalized quotes...</p>
                        </div>
                      )}

                      {quoteError && (
                        <div className="text-center py-12">
                          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                          <p className={`text-lg mb-4 transition-colors ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>Unable to generate quotes. Please try again.</p>
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Back to Preferences
                          </button>
                        </div>
                      )}

                      {!quoteLoading && !quoteError && quotes.length > 0 && (
                        <div className="space-y-6">
                          <div className="space-y-4">
                            {quotes.map((quote, index) => (
                              <QuoteCard key={quote.plan.id} quote={quote} index={index} />
                            ))}
                            
                            <ErrorMessage
                              errors={errors}
                              name="selectedQuote"
                              render={({ message }) => (
                                <p className="text-red-500 text-sm mt-2 text-center">{message}</p>
                              )}
                            />
                          </div>

                          {/* Calendar Section */}
                          {watchedValues.selectedQuote && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="mt-8"
                            >
                              <div className={`rounded-2xl p-8 border-2 transition-all ${
                                darkMode 
                                  ? 'bg-gradient-to-br from-green-900/40 to-blue-900/40 border-green-700/50' 
                                  : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'
                              }`}>
                                <div className="text-center mb-6">
                                  <div className="flex justify-center mb-4">
                                    <div className="bg-green-500 rounded-full p-3">
                                      <Calendar className="w-8 h-8 text-white" />
                                    </div>
                                  </div>
                                  <h3 className={`text-2xl font-bold mb-2 transition-colors ${
                                    darkMode ? 'text-gray-200' : 'text-gray-800'
                                  }`}>
                                    Schedule Your Consultation
                                  </h3>
                                  <p className={`text-lg transition-colors ${
                                    darkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    Meet with a licensed agent to finalize your <strong>{watchedValues.selectedQuote.plan.planName}</strong> plan
                                  </p>
                                  <div className={`mt-4 p-4 rounded-lg inline-block transition-colors ${
                                    darkMode ? 'bg-gray-800/70 border border-gray-600/50' : 'bg-white'
                                  }`}>
                                    <div className={`text-sm transition-colors ${
                                      darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>Selected Plan</div>
                                    <div className="font-bold text-lg text-green-600">
                                      {watchedValues.selectedQuote.plan.carrierName} - ${watchedValues.selectedQuote.estimatedPremium}/month
                                    </div>
                                  </div>
                                </div>
                                
                                <CalendarScheduler />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Premium Navigation Buttons */}
                <div className="flex justify-between mt-12 gap-6">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={prevStep}
                      className="group flex items-center px-8 py-4 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 shadow-lg font-semibold bg-white/80 backdrop-blur-sm"
                      whileHover={{ scale: 1.05, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                      Back
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (currentStep === totalSteps && selectedDate && selectedTime) {
                        // Set the appointment details before submitting
                        setValue('appointmentDate', selectedDate);
                        setValue('appointmentTime', selectedTime);
                        handleSubmit(onSubmit)();
                      } else if (currentStep < totalSteps) {
                        nextStep();
                      }
                    }}
                    disabled={submissionState.status === 'submitting' || quoteLoading || (currentStep === totalSteps && (!selectedDate || !selectedTime))}
                    className={`group ml-auto flex items-center px-8 py-4 rounded-2xl transition-all transform shadow-2xl font-bold text-lg relative overflow-hidden ${
                      submissionState.status === 'submitting' || quoteLoading || (currentStep === totalSteps && (!selectedDate || !selectedTime))
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 hover:shadow-2xl'
                    }`}
                    whileHover={{ 
                      scale: (submissionState.status === 'submitting' || quoteLoading || (currentStep === totalSteps && (!selectedDate || !selectedTime))) ? 1 : 1.05,
                      y: (submissionState.status === 'submitting' || quoteLoading || (currentStep === totalSteps && (!selectedDate || !selectedTime))) ? 0 : -3
                    }}
                    whileTap={{ scale: (submissionState.status === 'submitting' || quoteLoading || (currentStep === totalSteps && (!selectedDate || !selectedTime))) ? 1 : 0.95 }}
                  >
                    <div className="relative z-10 flex items-center">
                      {submissionState.status === 'submitting' ? (
                        <>
                          <motion.div 
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Scheduling...
                        </>
                      ) : quoteLoading ? (
                        <>
                          <motion.div 
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Generating Quotes...
                          </motion.span>
                        </>
                      ) : (
                        <>
                          {currentStep === totalSteps ? (
                            selectedDate && selectedTime ? (
                              <>
                                <motion.span
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  Schedule Appointment
                                </motion.span>
                                <motion.div
                                  animate={{ 
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1]
                                  }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                >
                                  <Calendar className="w-5 h-5 ml-3" />
                                </motion.div>
                              </>
                            ) : (
                              <>
                                <motion.span
                                  animate={{ opacity: [1, 0.7, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  {!watchedValues.selectedQuote ? 'Select a Plan' : 'Schedule Appointment'}
                                </motion.span>
                                <Calendar className="w-5 h-5 ml-3" />
                              </>
                            )
                          ) : currentStep === 3 ? (
                            <>
                              <motion.span
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                Get My Quotes
                              </motion.span>
                              <motion.div
                                animate={{ 
                                  y: [0, -2, 0],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Calculator className="w-5 h-5 ml-3" />
                              </motion.div>
                            </>
                          ) : (
                            <>
                              Continue
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <ChevronRight className="w-5 h-5 ml-3" />
                              </motion.div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </motion.button>
                </div>

                <TrustFooter darkMode={darkMode} />
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};