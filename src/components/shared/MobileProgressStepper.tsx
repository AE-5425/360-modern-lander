// Save this as: src/components/shared/MobileProgressStepper.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, User, Home, Users, DollarSign, 
  ClipboardCheck, Shield, FileText, Star 
} from 'lucide-react';

interface Step {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<any>;
  isCompleted: boolean;
}

interface MobileProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
  onStepClick?: (stepIndex: number) => void;
}

export const MobileProgressStepper: React.FC<MobileProgressStepperProps> = ({
  currentStep,
  totalSteps,
  steps,
  onStepClick
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  if (isMobile) {
    // FIXED: Extract the current step and icon component
    const currentStepData = steps[currentStep - 1];
    const CurrentStepIcon = currentStepData?.icon;

    return (
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          {/* Mobile: Current Step Focus */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full">
                {CurrentStepIcon && (
                  <CurrentStepIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {currentStepData?.shortLabel || `Step ${currentStep}`}
                </div>
                <div className="text-xs text-gray-500">
                  Step {currentStep} of {totalSteps}
                </div>
              </div>
            </div>
            
            {/* Completion status */}
            <div className="flex items-center text-xs font-medium">
              {currentStep === totalSteps ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Complete</span>
                </div>
              ) : (
                <div className="text-purple-600">
                  {Math.round(progressPercentage)}% Complete
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Step dots on progress bar */}
            <div className="absolute -top-1 left-0 w-full flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-4 h-4 rounded-full border-2 bg-white transition-all ${
                    index + 1 <= currentStep 
                      ? 'border-purple-600' 
                      : 'border-gray-300'
                  }`}
                >
                  {index + 1 < currentStep && (
                    <CheckCircle className="w-3 h-3 text-purple-600 -m-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Step Navigation Dots */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => onStepClick?.(index + 1)}
                disabled={!step.isCompleted && index + 1 !== currentStep}
                className={`w-2 h-2 rounded-full transition-all touch-optimized ${
                  index + 1 === currentStep
                    ? 'bg-purple-600 w-6'
                    : index + 1 < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Full stepper
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Health Insurance Application
          </h1>
          <div className="flex items-center text-sm font-medium">
            {currentStep === totalSteps ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Application Complete</span>
              </div>
            ) : (
              <div className="text-gray-600">
                Step {currentStep} of {totalSteps} • {Math.round(progressPercentage)}% Complete
              </div>
            )}
          </div>
        </div>

        {/* Desktop: Full progress stepper */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
            <motion.div
              className="h-0.5 bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              // FIXED: Extract icon component for each step
              const StepIcon = step.icon;
              
              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => onStepClick?.(index + 1)}
                    disabled={!step.isCompleted && index + 1 !== currentStep}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      index + 1 === currentStep
                        ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                        : index + 1 < currentStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'
                    } ${
                      (step.isCompleted || index + 1 === currentStep) && onStepClick
                        ? 'cursor-pointer hover:scale-105'
                        : 'cursor-default'
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-medium ${
                      index + 1 === currentStep
                        ? 'text-purple-600'
                        : index + 1 < currentStep
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to create your steps
export const createSteps = (currentStep: number) => [
  {
    id: 'contact',
    label: 'Contact Info',
    shortLabel: 'Contact',
    icon: User,
    isCompleted: currentStep > 1
  },
  {
    id: 'address',
    label: 'Address',
    shortLabel: 'Address',
    icon: Home,
    isCompleted: currentStep > 2
  },
  {
    id: 'sep',
    label: 'SEP Screening',
    shortLabel: 'Eligibility',
    icon: Shield,
    isCompleted: currentStep > 3
  },
  {
    id: 'personal',
    label: 'Personal Details',
    shortLabel: 'Personal',
    icon: FileText,
    isCompleted: currentStep > 4
  },
  {
    id: 'household',
    label: 'Household',
    shortLabel: 'Family',
    icon: Users,
    isCompleted: currentStep > 5
  },
  {
    id: 'income',
    label: 'Income',
    shortLabel: 'Income',
    icon: DollarSign,
    isCompleted: currentStep > 6
  },
  {
    id: 'plans',
    label: 'Select Plan',
    shortLabel: 'Plan',
    icon: ClipboardCheck,
    isCompleted: currentStep > 7
  },
  {
    id: 'review',
    label: 'Review & Sign',
    shortLabel: 'Review',
    icon: Star,
    isCompleted: currentStep > 8
  }
];