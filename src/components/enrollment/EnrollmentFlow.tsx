// src/components/enrollment/EnrollmentFlow.tsx - Complete Updated Version
import React, { useState, useEffect, useCallback } from 'react';
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
  TrendingUp, Eye, EyeOff, Lock, UserCheck, Target, Sparkles
} from 'lucide-react';

// Import extracted components and utilities
import { TrustFooter } from '../shared/TrustFooter';
import { ContactInfoStep } from '../steps/ContactInfoStep';
import { ReviewAndSignStep } from '../steps/ReviewAndSignStep';
import { AddressStep } from '../steps/AddressStep';
import { PersonalDetailsStep } from '../steps/PersonalDetailsStep';
import { HouseholdStep } from '../steps/HouseholdStep';
import { IncomeStep } from '../steps/IncomeStep';
import { PlanSelectionStep } from '../steps/PlanSelectionStep';
import { SEPScreeningStep } from '../steps/SEPScreeningStep';
import { EnhancedInput } from '../shared/EnhancedInput';
import { ToggleButton } from '../shared/ToggleButton';
import { PlanSelectionCard } from '../shared/PlanSelectionCard';
import type { PlanPreview } from '../shared/PlanSelectionCard';
import { formatPhoneNumber, formatSSN, calculateAge, formatCurrency } from '../utils/formatters';
import { createValidationSchema } from '../utils/validators';
import { getFPL, getSubsidyLevel, estimateMonthlySavings, getIncomeTypeLabel } from '../utils/fplCalculations';

// Import RC-Slider styles
import 'rc-slider/assets/index.css';

// Enhanced type definitions with better organization
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
  currentRange: 'maximum-savings' | 'good-savings' | 'some-savings';
  primaryIncomeType: string;
  primaryIncomeDescription: string;
  isDualIncome: boolean;
  primaryIncomeAmount: number;
  spouseIncomeAmount: number;
  spouseIncomeType: string;
  spouseIncomeDescription: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
  tobaccoStatus: 'yes' | 'no';
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
  householdMembers: HouseholdMember[];
  incomeData: IncomeData;
  selectedPlan?: PlanPreview;
  sepEligibility?: {
    isEligible: boolean;
    categories: string[];
    eventDate?: string;
    eventType?: string;
    hasDocumentation?: boolean;
  };
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
}

interface SubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
  applicationId?: string;
}

// Enhanced default form values
const getDefaultValues = (): FormData => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  ssn: '',
  tobaccoStatus: 'no',
  streetAddress: '',
  apartmentUnit: '',
  city: '',
  state: '',
  zipCode: '',
  householdMembers: [],
  incomeData: {
    totalAnnualIncome: 45000,
    currentRange: 'maximum-savings',
    primaryIncomeType: 'employment',
    primaryIncomeDescription: '',
    isDualIncome: false,
    primaryIncomeAmount: 45000,
    spouseIncomeAmount: 0,
    spouseIncomeType: 'employment',
    spouseIncomeDescription: ''
  },
  selectedPlan: undefined,
  sepEligibility: {
    isEligible: false,
    categories: [],
    eventDate: '',
    eventType: '',
    hasDocumentation: false
  },
  termsAccepted: false,
  privacyAccepted: false,
  marketingAccepted: false,
  signature: ''
});

// Step configuration for MUI Stepper
const stepLabels = [
  'Contact Info',
  'Address',
  'SEP Screening',
  'Personal Details',
  'Household',
  'Income',
  'Select Plan',
  'Review & Sign'
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

export const EnrollmentFlow: React.FC = () => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [focusedMemberId, setFocusedMemberId] = useState<string | null>(null);
  const [stepCompletion, setStepCompletion] = useState<boolean[]>([false, false, false, false, false, false, false, false]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: 'idle' });
  const [previewPlans, setPreviewPlans] = useState<PlanPreview[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanSidebar, setShowPlanSidebar] = useState(false);
  const [showMobilePlanModal, setShowMobilePlanModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [validationTriggered, setValidationTriggered] = useState(false); // Track if Continue was clicked
  const totalSteps = 8;

  // Enhanced form setup with React Hook Form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
    reset,
    clearErrors
  } = useForm<FormData>({
    resolver: yupResolver(createValidationSchema(currentStep)),
    defaultValues: getDefaultValues(),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  });

  // Watch form values
  const watchedValues = watch();
  const incomeData = watch('incomeData');
  const householdMembers = watch('householdMembers');
  const selectedPlan = watch('selectedPlan');

  // Helper function for debouncing
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced auto-save functionality
  const debouncedSave = useCallback(
    debounce((data: FormData) => {
      setAutoSaveStatus('saving');
      try {
        localStorage.setItem('enrollmentProgress', JSON.stringify({
          data,
          step: currentStep,
          timestamp: new Date().toISOString()
        }));
        setAutoSaveStatus('saved');
      } catch (error) {
        console.warn('Error saving progress:', error);
        setAutoSaveStatus('error');
      }
    }, 1000),
    [currentStep]
  );

  const calculateHouseholdSize = (): number => {
    return 1 + (householdMembers?.length || 0);
  };

  const hasSpouse = () => householdMembers?.some(member => member.type === 'spouse') || false;

  // Enhanced plan generation - Only regenerate when step 6 is reached
  const generatePreviewPlans = useCallback(() => {
    const income = incomeData?.totalAnnualIncome || 45000;
    const fpl = getFPL(calculateHouseholdSize());
    const subsidyPercentage = Math.max(0, Math.min(90, 100 - (income / fpl) * 25));
    
    const basePlans: PlanPreview[] = [
      {
        id: 'bcbs-bronze-hsa',
        carrierName: "Blue Cross Blue Shield",
        carrierLogo: "/logos/blue_cross_blue_shield_Logo.webp",
        planName: "Blue Advantage Bronze HSA",
        planType: "Bronze",
        monthlyPremium: 385,
        subsidizedPremium: 385,
        deductible: 6000,
        maxOutOfPocket: 8000,
        estimatedSavings: 0,
        rating: 4.2,
        features: [
          "Basic preventive care covered 100%",
          "HSA-eligible with tax savings benefits",
          "Prescription drug coverage included",
          "24/7 telehealth services available",
          "Emergency room coverage nationwide",
          "Urgent care and walk-in clinic access"
        ],
        network: "Blue Choice PPO Network",
        copays: {
          primaryCare: 25,
          specialist: 65,
          urgentCare: 85,
          emergency: 350
        },
        prescription: {
          generic: 15,
          preferred: 45,
          specialty: "30% coinsurance"
        },
        metalLevel: "bronze",
        hiosId: "12345TX0010001"
      },
      {
        id: 'ambetter-silver-94',
        carrierName: "Ambetter",
        carrierLogo: "/logos/Ambetter_Logo.webp",
        planName: "Balanced Care Silver 94",
        planType: "Silver",
        monthlyPremium: 465,
        subsidizedPremium: 465,
        deductible: 3500,
        maxOutOfPocket: 7000,
        estimatedSavings: 0,
        isPopular: true,
        rating: 4.5,
        features: [
          "Enhanced preventive care benefits",
          "Lower deductible than Bronze plans",
          "Specialist visits with predictable copays",
          "Mental health coverage fully included",
          "Maternity benefits with no deductible",
          "Generic prescriptions low-cost",
          "Telehealth visits included"
        ],
        network: "Ambetter Regional Network",
        copays: {
          primaryCare: 20,
          specialist: 45,
          urgentCare: 75,
          emergency: 300
        },
        prescription: {
          generic: 10,
          preferred: 35,
          specialty: "25% coinsurance"
        },
        metalLevel: "silver",
        hiosId: "12345TX0020001"
      },
      {
        id: 'oscar-gold-simple',
        carrierName: "Oscar Health",
        carrierLogo: "/logos/Oscar_Health_logo.webp",
        planName: "Gold Simple 80",
        planType: "Gold",
        monthlyPremium: 545,
        subsidizedPremium: 545,
        deductible: 1500,
        maxOutOfPocket: 6000,
        estimatedSavings: 0,
        isBestValue: true,
        rating: 4.7,
        features: [
          "Comprehensive coverage with low deductible",
          "Most services covered before deductible",
          "Primary care visits low copay",
          "Specialist care with excellent coverage",
          "Premium specialist network access",
          "Concierge care team included",
          "Free virtual urgent care visits",
          "Health coaching and wellness programs"
        ],
        network: "Oscar Metro Plus Network",
        copays: {
          primaryCare: 15,
          specialist: 35,
          urgentCare: 50,
          emergency: 250
        },
        prescription: {
          generic: 5,
          preferred: 25,
          specialty: "20% coinsurance"
        },
        metalLevel: "gold",
        hiosId: "12345TX0030001"
      }
    ];

    return basePlans.map(plan => {
      const savings = Math.round(plan.monthlyPremium * (subsidyPercentage / 100));
      return {
        ...plan,
        subsidizedPremium: Math.max(50, plan.monthlyPremium - savings),
        estimatedSavings: savings
      };
    });
  }, [currentStep === 7 ? incomeData?.totalAnnualIncome : 45000, currentStep === 7 ? calculateHouseholdSize() : 1]);

  // Load preview plans - Only generate when needed, avoid constant resets
  useEffect(() => {
    const shouldShow = currentStep === 7 && watchedValues.state && watchedValues.city;
    
    if (shouldShow && previewPlans.length === 0) {
      setPlansLoading(true);
      setTimeout(() => {
        setPreviewPlans(generatePreviewPlans());
        setPlansLoading(false);
      }, 500);
    }
    
    // Only show sidebar on specific steps, and keep it minimal
    setShowPlanSidebar(false); // Disabled for now per user feedback
  }, [currentStep, watchedValues.state, watchedValues.city]);

  // Enhanced auto-save and form loading
  useEffect(() => {
    const saved = localStorage.getItem('enrollmentProgress');
    if (saved) {
      try {
        const { data, step, timestamp } = JSON.parse(saved);
        const savedTime = new Date(timestamp || 0);
        const now = new Date();
        const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          reset(data);
          setCurrentStep(step || 1);
          updateStepCompletion(data);
        } else {
          localStorage.removeItem('enrollmentProgress');
        }
      } catch (error) {
        console.warn('Error loading saved progress:', error);
        localStorage.removeItem('enrollmentProgress');
      }
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((data) => {
      debouncedSave(data);
      updateStepCompletion(data);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  // Update step completion status for 8 steps
  const updateStepCompletion = (data: FormData) => {
    const completion = [
      // Step 1: Contact Info
      !!(data.firstName && data.lastName && data.email && data.phone),
      
      // Step 2: Address
      !!(data.streetAddress && data.city && data.state && data.zipCode),
      
      // Step 3: SEP Screening (only required if we have address info)
      !!((data.streetAddress && data.city && data.state) ? 
        (data.sepEligibility?.isEligible !== undefined) : false),
      
      // Step 4: Personal Details
      !!(data.dateOfBirth && data.ssn && data.tobaccoStatus),
      
      // Step 5: Household (only complete if user has actually interacted with this step)
      // Check if household step has been visited (currentStep >= 5) or if there are members
      !!(currentStep >= 5 && (
        !data.householdMembers?.length || // No members added is valid
        data.householdMembers?.every(member => 
          member.firstName && member.lastName && member.dateOfBirth && member.gender && 
          (member.isApplyingForCoverage ? member.ssn : true)
        )
      )),
      
      // Step 6: Income (only complete if user has interacted with this step)
      !!(currentStep >= 6 && data.incomeData?.totalAnnualIncome > 0),
      
      // Step 7: Plan Selection
      !!(data.selectedPlan),
      
      // Step 8: Terms & Signature
      !!(data.termsAccepted && data.privacyAccepted && data.signature)
    ];
    setStepCompletion(completion);
  };

  // Enhanced navigation
  const nextStep = async () => {
    // Trigger validation for household step
    if (currentStep === 5) {
      setValidationTriggered(true);
    }
    
    const isStepValid = await trigger();
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setFocusedMemberId(null);
      setValidationTriggered(false); // Reset validation trigger
      clearErrors();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFocusedMemberId(null);
      setValidationTriggered(false); // Reset validation trigger
      clearErrors();
    }
  };

  // Plan selection handler
  const handlePlanSelect = (plan: PlanPreview) => {
    setValue('selectedPlan', plan);
  };

  // Form submission with enhanced feedback - FIXED: Direct submission call
  const onSubmit = async (data: FormData) => {
    if (submissionState.status !== 'idle') return;

    setSubmissionState({ status: 'submitting' });
    
    try {
      // Simulate API call with realistic timing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      localStorage.removeItem('enrollmentProgress');
      
      const applicationId = 'HHC' + Date.now();
      
      setSubmissionState({ 
        status: 'success', 
        applicationId,
        message: 'Application submitted successfully! A PDF summary will be emailed to you shortly.' 
      });
      
      setTimeout(() => {
        alert(`Demo: PDF application summary for ${applicationId} would be generated and emailed to ${data.email}`);
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

  // Income management functions (kept for integration with IncomeStep)
  const redistributeIncome = (totalIncome: number) => {
    if (!incomeData.isDualIncome || !hasSpouse()) {
      setValue('incomeData.primaryIncomeAmount', totalIncome);
      setValue('incomeData.spouseIncomeAmount', 0);
    } else {
      const currentTotal = incomeData.primaryIncomeAmount + incomeData.spouseIncomeAmount;
      if (currentTotal > 0) {
        const primaryRatio = incomeData.primaryIncomeAmount / currentTotal;
        setValue('incomeData.primaryIncomeAmount', Math.round(totalIncome * primaryRatio));
        setValue('incomeData.spouseIncomeAmount', Math.round(totalIncome * (1 - primaryRatio)));
      } else {
        setValue('incomeData.primaryIncomeAmount', Math.round(totalIncome * 0.6));
        setValue('incomeData.spouseIncomeAmount', Math.round(totalIncome * 0.4));
      }
    }
  };

  const handleIncomeChange = (value: number) => {
    setValue('incomeData.totalAnnualIncome', value);
    redistributeIncome(value);
  };

  const handleDualIncomeToggle = (isDual: boolean) => {
    setValue('incomeData.isDualIncome', isDual);
    if (!isDual) {
      setValue('incomeData.primaryIncomeAmount', incomeData.totalAnnualIncome);
      setValue('incomeData.spouseIncomeAmount', 0);
    } else {
      redistributeIncome(incomeData.totalAnnualIncome);
    }
  };

  // Enhanced insurance carriers for carousel
  const carriers = [
    { name: 'Ambetter', logo: '/logos/Ambetter_Logo.webp' },
    { name: 'Blue Cross Blue Shield', logo: '/logos/blue_cross_blue_shield_Logo.webp' },
    { name: 'Anthem', logo: '/logos/Anthem_Logo.webp' },
    { name: 'Cigna', logo: '/logos/cigna_Logo.webp' },
    { name: 'Molina Healthcare', logo: '/logos/Molina_Healthcare_logo.webp' },
    { name: 'Oscar Health', logo: '/logos/Oscar_Health_logo.webp' },
    { name: 'UnitedHealthcare', logo: '/logos/UnitedHealthcare_Logo.webp' },
    { name: 'Ascension', logo: '/logos/Ascension_Logo.webp' },
    { name: 'Christus Health', logo: '/logos/Christus_Health_Logo.webp' }
  ];

  // Enhanced submission status overlay
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
          className="bg-white rounded-3xl p-10 max-w-lg mx-4 text-center shadow-2xl border border-gray-200"
        >
          {submissionState.status === 'submitting' && (
            <>
              <motion.div 
                className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Submitting Your Application</h3>
              <p className="text-gray-600 mb-4">We're processing your information and generating your personalized PDF summary...</p>
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                <Lock className="w-5 h-5 inline mr-2" />
                Your data is encrypted and secure
              </div>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Application Complete!</h3>
              <p className="text-gray-600 mb-6">{submissionState.message}</p>
              {submissionState.applicationId && (
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-green-700 font-medium">
                    Application ID: {submissionState.applicationId}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                Check your email for next steps
              </div>
            </>
          )}
          
          {submissionState.status === 'error' && (
            <>
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Submission Error</h3>
              <p className="text-gray-600 mb-6">{submissionState.message}</p>
              <button
                onClick={() => setSubmissionState({ status: 'idle' })}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex relative overflow-hidden">
      {/* Submission Overlay */}
      <SubmissionOverlay />

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Hero Section - Left Side with Enhanced Visuals */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/hero-family.jpg" 
            alt="Happy family with health insurance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-700/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-gray-900/30"></div>
        </div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star className="w-5 h-5 text-yellow-300 mr-3 fill-current" />
              <span className="font-semibold">Trusted by 50,000+ families nationwide</span>
            </motion.div>
            
            <h1 className="text-6xl font-bold mb-8 leading-tight">
              Find Your Perfect
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Health Plan
              </motion.span>
            </h1>
            <p className="text-xl mb-10 text-gray-200 leading-relaxed max-w-lg">
              Get personalized recommendations and save thousands on your healthcare coverage. 
              Our HIPAA-compliant platform guides you through every step with expert support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="space-y-5 mb-10"
          >
            {[
              { icon: Shield, text: "HIPAA Compliant & Bank-Level Security", color: "text-green-300", bgColor: "bg-green-500/20" },
              { icon: Zap, text: "Quick 7-Step Application Process", color: "text-yellow-300", bgColor: "bg-yellow-500/20" },
              { icon: Target, text: "Instant Plan Recommendations", color: "text-blue-300", bgColor: "bg-blue-500/20" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                className="flex items-center space-x-4 group"
                whileHover={{ x: 10 }}
              >
                <div className={`${item.bgColor} backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-gray-200 font-medium group-hover:text-white transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="mb-10"
          >
            <p className="text-gray-300 text-sm mb-6 font-semibold flex items-center">
              <Award className="w-5 h-5 mr-3 text-yellow-300" />
              Trusted insurance partners nationwide:
            </p>
            <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <motion.div
                animate={{ x: [0, -(100 * carriers.length)] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
                className="flex space-x-8 py-4"
                style={{ width: `${(200 * carriers.length)}%` }}
              >
                {[...carriers, ...carriers].map((carrier, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 min-w-max border border-white/30 hover:bg-white/30 transition-all hover:scale-105"
                    style={{ minWidth: '160px', height: '70px' }}
                  >
                    <img 
                      src={carrier.logo} 
                      alt={`${carrier.name} logo`}
                      className="max-h-12 max-w-[140px] w-auto h-auto object-contain filter brightness-0 invert"
                      style={{ 
                        maxHeight: '48px',
                        maxWidth: '140px',
                        width: 'auto',
                        height: 'auto'
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="bg-white/15 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/30 hover:bg-white/20 transition-all"
          >
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                </motion.div>
              ))}
              <span className="ml-3 text-yellow-300 font-semibold">4.9/5 Customer Rating</span>
            </div>
            <p className="text-gray-200 text-lg italic mb-4 leading-relaxed">
              "Found the perfect plan and saved $3,600 per year! The process was incredibly easy and the support team was amazing."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-lg font-bold text-white mr-4 shadow-lg">
                SJ
              </div>
              <div>
                <div className="text-gray-200 font-semibold">Sarah J.</div>
                <div className="text-gray-400 text-sm">Tampa, FL • Family of 4</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Section - Right Side with Enhanced Styling */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-6 lg:p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border-2 border-white/30 relative overflow-hidden min-h-[700px]">
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-purple-500/5 to-blue-500/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              {/* MUI Progress Stepper */}
              <Box sx={{ mb: 6 }}>
                {/* Progress Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 3 
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    Step {currentStep} of {totalSteps}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      {Math.round((currentStep / totalSteps) * 100)}% Complete
                    </Typography>
                    {autoSaveStatus === 'saving' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"
                      />
                    )}
                    {autoSaveStatus === 'saved' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                    {autoSaveStatus === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </Box>
                </Box>

                {/* Linear Progress Bar */}
                <Box sx={{ mb: 4 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(currentStep / totalSteps) * 100}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: alpha(theme.palette.grey[300], 0.3),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animation: 'shimmer 2s infinite ease-in-out',
                        }
                      }
                    }}
                  />
                </Box>

                {/* MUI Stepper */}
                <Stepper 
                  activeStep={currentStep - 1} 
                  alternativeLabel
                  sx={{
                    '& .MuiStepConnector-root': {
                      top: 14,
                      '& .MuiStepConnector-line': {
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        borderTopWidth: 2,
                      }
                    },
                    '& .MuiStepConnector-active .MuiStepConnector-line': {
                      borderColor: theme.palette.primary.main,
                    },
                    '& .MuiStepConnector-completed .MuiStepConnector-line': {
                      borderColor: theme.palette.success.main,
                    },
                    '& .MuiStepLabel-label': {
                      fontSize: '0.875rem',
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
                      <StepLabel 
                        StepIconComponent={CustomStepIcon}
                        sx={{
                          '& .MuiStepLabel-iconContainer': {
                            paddingRight: 0,
                          }
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Form Steps - FIXED: No onSubmit handler, submission handled by button */}
              <form onSubmit={(e) => e.preventDefault()}>  {/* Always prevent default submission */}
                <AnimatePresence mode="wait">
                  {/* Step 1 - Contact Info */}
					{currentStep === 1 && (
					<ContactInfoStep 
						control={control}
						errors={errors}
						/>
					)}

                  {/* Step 2 - Enhanced Address using AddressStep Component */}
                  {currentStep === 2 && (
                    <AddressStep 
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                    />
                  )}

                  {/* Step 3 - SEP Eligibility Screening */}
                  {currentStep === 3 && watchedValues.city && watchedValues.state && (
                    <SEPScreeningStep 
                      control={control}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                    />
                  )}

					{/* Step 4 - Personal Details using extracted component */}
					{currentStep === 4 && (
					  <PersonalDetailsStep 
						control={control}
						errors={errors}
						watch={watch}
					  />
					)}
                  
                  {/* Step 5 - Household Members using extracted component */}
					{currentStep === 5 && (
					  <HouseholdStep 
						control={control}
						errors={errors}
						focusedMemberId={focusedMemberId}
						setFocusedMemberId={setFocusedMemberId}
						householdMembers={householdMembers}
						setValue={setValue}
						watch={watch}
						validationTriggered={validationTriggered}
					  />
					)}

                  {/* Step 6 - Income Information using extracted IncomeStep component */}
                  {currentStep === 6 && (
                    <IncomeStep 
                      control={control}
                      errors={errors}
                      incomeData={incomeData}
                      householdMembers={householdMembers}
                      setValue={setValue}
                      watch={watch}
                      calculateHouseholdSize={calculateHouseholdSize}
                      getFPL={getFPL}
                      getSubsidyLevel={getSubsidyLevel}
                      estimateMonthlySavings={estimateMonthlySavings}
                      redistributeIncome={redistributeIncome}
                      handleIncomeChange={handleIncomeChange}
                      handleDualIncomeToggle={handleDualIncomeToggle}
                      getIncomeTypeLabel={getIncomeTypeLabel}
                      hasSpouse={hasSpouse}
                    />
                  )}

                  {/* Step 7 - Plan Selection using extracted component */}
                  {currentStep === 7 && (
                    <PlanSelectionStep 
                      control={control}
                      errors={errors}
                      previewPlans={previewPlans}
                      selectedPlan={selectedPlan}
                      onPlanSelect={handlePlanSelect}
                      calculateHouseholdSize={calculateHouseholdSize}
                      estimateMonthlySavings={estimateMonthlySavings}
                      incomeData={incomeData}
                    />
                  )}

				{/* Step 8 - Review & Sign */}
				{currentStep === 8 && (
				  <ReviewAndSignStep 
					control={control}
					errors={errors}
					formData={watchedValues}
				  />
				)}
                </AnimatePresence>

                {/* Enhanced Navigation Buttons - FIXED: Prevent accidental submission */}
                <div className="flex justify-between mt-10 gap-6">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"  // IMPORTANT: type="button" prevents form submission
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={prevStep}
                      className="flex items-center px-8 py-4 text-gray-600 border-2 border-gray-300 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 shadow-lg font-semibold"
                      whileHover={{ scale: 1.05, x: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-3" />
                      Back
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="button"  // ALWAYS type="button" for navigation - never submit until explicit
                    onClick={() => {
                      console.log('🔍 Button Debug:', { currentStep, totalSteps, isSubmitting: currentStep === totalSteps });
                      if (currentStep === totalSteps) {
                        console.log('🚀 Submitting form...');
                        handleSubmit(onSubmit)();
                      } else {
                        console.log('➡️ Going to next step...');
                        nextStep();
                      }
                    }}
                    disabled={submissionState.status === 'submitting'}
                    className={`ml-auto flex items-center px-8 py-4 rounded-2xl transition-all transform shadow-xl font-bold text-lg ${
                      submissionState.status === 'submitting' 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-2xl'
                    }`}
                    whileHover={{ 
                      scale: submissionState.status === 'submitting' ? 1 : 1.05,
                      y: submissionState.status === 'submitting' ? 0 : -2
                    }}
                    whileTap={{ scale: submissionState.status === 'submitting' ? 1 : 0.95 }}
                  >
                    {submissionState.status === 'submitting' ? (
                      <>
                        <motion.div 
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        {currentStep === 5 ? 'Continue' :
                         currentStep === 7 ? 'Review & Sign' :
                         currentStep === totalSteps ? (
                          <>
                            Submit Application
                            <Sparkles className="w-5 h-5 ml-3" />
                          </>
                         ) : (
                          <>
                            Continue
                            <ChevronRight className="w-5 h-5 ml-3" />
                          </>
                         )}
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Compact Trust Footer - Below navigation */}
                <TrustFooter />
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};