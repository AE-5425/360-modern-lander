import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { 
  Calendar, Heart, Home, Shield, CheckCircle, Clock, 
  Briefcase, MapPin, AlertTriangle
} from 'lucide-react';
import { EnhancedInput } from '../shared/EnhancedInput';

interface FormData {
  sepEligibility?: {
    isEligible: boolean;
    categories: string[];
    eventDate?: string;
    eventType?: string;
    hasDocumentation?: boolean;
    suggestedDate?: string;
    previousZipCode?: string;
    coverageDescription?: string;
  };
  zipCode?: string;
  [key: string]: any;
}

interface SEPScreeningStepProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  setValue: (name: string, value: any) => void;
  watch: (name?: string) => any;
}

const isOpenEnrollmentPeriod = (): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  const oepStartThisYear = new Date(currentYear, 10, 1);
  const oepEndNextYear = new Date(currentYear + 1, 0, 15);
  const oepStartLastYear = new Date(currentYear - 1, 10, 1);
  const oepEndThisYear = new Date(currentYear, 0, 15);
  
  return (now >= oepStartThisYear && now <= oepEndNextYear) || 
         (now >= oepStartLastYear && now <= oepEndThisYear);
};

// Smart date suggestion within SEP period
const suggestRecentDate = (sepDays: number = 60): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * (sepDays - 7)) + 7; // 7-60 days ago
  const suggestedDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  return suggestedDate.toISOString().split('T')[0];
};

export const SEPScreeningStep: React.FC<SEPScreeningStepProps> = ({
  control,
  errors,
  setValue,
  watch
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [showDateCustomize, setShowDateCustomize] = useState(false);
  
  const sepData = watch('sepEligibility');
  const currentZip = watch('zipCode');
  const isOEP = isOpenEnrollmentPeriod();

  useEffect(() => {
    if (!sepData) {
      setValue('sepEligibility', {
        isEligible: isOEP,
        categories: isOEP ? ['open_enrollment'] : [],
        eventDate: '',
        eventType: isOEP ? 'open_enrollment' : '',
        hasDocumentation: isOEP
      });
    }
  }, [setValue, sepData, isOEP]);

  // Real qualifying events that matter for lead qualification
  const sepEvents = [
    {
      id: 'moved',
      title: 'Recently Moved',
      description: 'Changed address in last 60 days',
      icon: Home,
      color: 'from-blue-500 to-cyan-500',
      sepDays: 60,
      needsAdditionalInfo: true
    },
    {
      id: 'lost_coverage', 
      title: 'Lost Coverage',
      description: 'Job loss, COBRA, or other coverage ending',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      sepDays: 60,
      needsAdditionalInfo: true
    },
    {
      id: 'medicaid_denied',
      title: 'Denied Medicaid/CHIP',
      description: 'Application denied in last 60 days',
      icon: Briefcase,
      color: 'from-orange-500 to-amber-500',
      sepDays: 60,
      needsAdditionalInfo: false
    },
    {
      id: 'marriage',
      title: 'Got Married',
      description: 'Marriage or domestic partnership',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      sepDays: 60,
      needsAdditionalInfo: false
    },
    {
      id: 'incarceration',
      title: 'Released From Incarceration',
      description: 'Released from detention or jail',
      icon: MapPin,
      color: 'from-purple-500 to-indigo-500',
      sepDays: 60,
      needsAdditionalInfo: false
    },
    {
      id: 'none_apply',
      title: 'None Apply',
      description: 'Interested in Open Enrollment',
      icon: Calendar,
      color: 'from-gray-400 to-gray-500',
      sepDays: 0,
      isNoneOption: true
    }
  ];

  // FIXED: Enhanced handleEventSelect with field clearing
  const handleEventSelect = (eventId: string) => {
    setSelectedEvent(eventId);
    const event = sepEvents.find(e => e.id === eventId);
    
    if (eventId === 'none_apply') {
      setValue('sepEligibility', {
        isEligible: false,
        categories: ['none_apply'],
        eventType: 'none_apply',
        hasDocumentation: true, // Allow progression for lead capture
        suggestedDate: '',
        // CLEAR ALL CONDITIONAL FIELDS
        previousZipCode: '',
        coverageDescription: ''
      });
    } else {
      const suggestedDate = suggestRecentDate(event?.sepDays || 60);
      setValue('sepEligibility', {
        isEligible: true,
        categories: [eventId],
        eventType: eventId,
        hasDocumentation: true,
        eventDate: suggestedDate,
        suggestedDate: suggestedDate,
        // CLEAR ALL CONDITIONAL FIELDS WHEN SWITCHING
        previousZipCode: '',
        coverageDescription: ''
      });
    }
  };

  // FIXED: Add field clearing effect
  useEffect(() => {
    // Clear conditional fields when event type changes
    if (selectedEvent === 'moved') {
      setValue('sepEligibility.coverageDescription', '');
    } else if (selectedEvent === 'lost_coverage') {
      setValue('sepEligibility.previousZipCode', '');
    }
  }, [selectedEvent, setValue]);

  const handleCustomizeDate = () => {
    setShowDateCustomize(!showDateCustomize);
  };

  // FIXED: Enhanced ZIP validation
  const previousZip = watch('sepEligibility.previousZipCode');
  const zipMatches = previousZip && currentZip && previousZip === currentZip;
  const isValidZip = previousZip && /^\d{5}$/.test(previousZip);

  if (isOEP) {
    return (
      <motion.div
        key="sep-oep"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center bg-green-50 px-4 py-3 rounded-xl border border-green-200 mb-3"
          >
            <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
            <div className="text-left">
              <h3 className="font-bold text-green-800 text-base">Great news!</h3>
              <p className="text-green-700 text-sm">You can enroll today - it's Open Enrollment!</p>
            </div>
          </motion.div>

          <motion.h2 
            className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Let's Find Your Perfect Plan
          </motion.h2>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="sep-screening"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center mb-6">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Check Your Eligibility
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Did any of these happen to you recently?
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-200 text-sm"
        >
          <Clock className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-blue-700 font-medium">
            You have 60 days from qualifying events to enroll
          </span>
        </motion.div>
      </div>

      {/* 6-Option Grid - Clean and Equal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {sepEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
              selectedEvent === event.id
                ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-400 shadow-lg ring-2 ring-purple-200'
                : event.isNoneOption
                ? 'bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100'
                : 'bg-white border-gray-200 hover:border-purple-300 shadow-md hover:shadow-lg'
            }`}
            onClick={() => handleEventSelect(event.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${event.color} mx-auto mb-3 w-fit shadow-lg`}>
                <event.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className={`font-bold text-base mb-2 ${event.isNoneOption ? 'text-gray-600' : 'text-gray-800'}`}>
                {event.title}
              </h4>
              <p className={`text-sm ${event.isNoneOption ? 'text-gray-500' : 'text-gray-600'}`}>
                {event.description}
              </p>
              {selectedEvent === event.id && !event.isNoneOption && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 flex items-center justify-center text-green-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">Selected</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Eligibility Confirmation - Better Spaced */}
      <AnimatePresence>
        {selectedEvent && selectedEvent !== 'none_apply' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200"
          >
            {/* Better Separated Sections */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <h4 className="font-bold text-green-800 text-xl">You're Eligible!</h4>
              </div>
              
              {sepData?.suggestedDate && (
                <div className="flex items-center justify-between bg-white/70 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Estimated event date: </span>
                    <span className="font-bold text-gray-800 ml-2">
                      {new Date(sepData.suggestedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCustomizeDate}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {showDateCustomize ? 'Use suggested' : 'Change date'}
                  </button>
                </div>
              )}
            </div>

            {/* Additional Info Fields - FIXED with enhanced validation */}
            <AnimatePresence>
              {selectedEvent === 'moved' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Controller
                    name="sepEligibility.previousZipCode"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label htmlFor="sepPreviousZip" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                          Previous ZIP Code
                        </label>
                        <EnhancedInput
                          field={{ 
                            ...field, 
                            id: 'sepPreviousZip',
                            value: field.value || '', // Ensure controlled value
                            onChange: (e) => {
							  // Handle both event objects and direct values
							  const inputValue = e?.target?.value ?? e ?? '';
							  const zipValue = String(inputValue).replace(/\D/g, '').slice(0, 5);
							  field.onChange(zipValue);
							}
                          }}
                          error={errors.sepEligibility?.previousZipCode}
                          placeholder="Previous ZIP"
                          icon={<MapPin className="w-4 h-4" />}
                          maxLength={5}
                        />
                        {zipMatches && isValidZip && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Previous ZIP cannot be the same as current ZIP ({currentZip})
                          </p>
                        )}
                      </div>
                    )}
                  />
                </motion.div>
              )}

              {selectedEvent === 'lost_coverage' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Controller
                    name="sepEligibility.coverageDescription"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label htmlFor="sepCoverageDesc" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-purple-500" />
                          What Coverage Did You Lose? (Optional)
                        </label>
                        <EnhancedInput
                          field={{ 
                            ...field, 
                            id: 'sepCoverageDesc',
                            value: field.value || '' // Ensure controlled value
                          }}
                          error={errors.sepEligibility?.coverageDescription}
                          placeholder="e.g., Employer insurance, COBRA, etc."
                          icon={<Shield className="w-4 h-4" />}
                        />
                      </div>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional Date Customization */}
            <AnimatePresence>
              {showDateCustomize && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-green-200"
                >
                  <Controller
                    name="sepEligibility.eventDate"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label htmlFor="eventDate" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                          Exact Event Date (if you remember)
                        </label>
                        <input
                          type="date"
                          {...field}
                          id="eventDate"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none bg-white text-gray-800 transition-all"
                          max={new Date().toISOString().split('T')[0]}
                          min={new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Don't worry if it's not exact - CMS will verify documents later
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle "None Apply" Response */}
      <AnimatePresence>
        {selectedEvent === 'none_apply' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 bg-gray-100 rounded-xl p-4 border border-gray-300"
          >
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                <strong>Open Enrollment:</strong> November 1 - January 15
              </p>
              <p className="text-gray-500 text-xs">
                We'll show you available plans and help you prepare.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};