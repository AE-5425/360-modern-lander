import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { MapPin, Home, Building, CheckCircle, AlertCircle } from 'lucide-react';

import { EnhancedInput } from '../shared/EnhancedInput';
import { getLocationFromZip, validateAddressLocally, debounceAddressValidation } from "../utils/addressValidation";

// Types
interface FormData {
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  state: string;
  zipCode: string;
}

interface LocationSuggestion {
  city: string;
  state: string;
  country?: string;
}

interface AddressStepProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
}

// State options
const stateOptions = [
  { value: 'FL', label: 'Florida' },
  { value: 'CA', label: 'California' },
  { value: 'TX', label: 'Texas' },
  { value: 'NY', label: 'New York' },
  { value: 'GA', label: 'Georgia' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'IL', label: 'Illinois' },
  { value: 'OH', label: 'Ohio' }
];

// Enhanced select styles with glassmorphism
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    borderColor: state.isFocused ? '#8b5cf6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
    '&:hover': { borderColor: '#8b5cf6' },
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    minHeight: '52px',
    border: '2px solid',
    transition: 'all 0.3s ease'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#8b5cf6' : state.isFocused ? '#f8fafc' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    padding: '12px 16px',
    borderRadius: '8px',
    margin: '2px 8px',
    cursor: 'pointer'
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '16px',
    border: '2px solid #e5e7eb',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  })
};

export const AddressStep: React.FC<AddressStepProps> = ({ control, errors, setValue, watch }) => {
  const [addressValidationStatus, setAddressValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [locationSuggestion, setLocationSuggestion] = useState<LocationSuggestion | null>(null);

  // Watch form values for validation
  const watchedValues = watch();

  // Enhanced ZIP code handler with real API lookup
  const handleZipCodeChange = useCallback(async (value: string, onChange: (value: string) => void) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 5);
    onChange(cleaned);
    
    if (cleaned.length === 5) {
      const location = await getLocationFromZip(cleaned);
      if (location) {
        setLocationSuggestion(location);
        if (!watch('city')) {
          setValue('city', location.city);
        }
        if (!watch('state')) {
          setValue('state', location.state);
        }
      } else {
        setLocationSuggestion(null);
      }
    } else {
      setLocationSuggestion(null);
    }
  }, [setValue, watch]);

  // Debounced address validation
  const debouncedValidation = useCallback(
    debounceAddressValidation((address) => {
      setAddressValidationStatus('validating');
      setTimeout(() => {
        const result = validateAddressLocally(address);
        setAddressValidationStatus(result.isValid ? 'valid' : 'invalid');
      }, 500);
    }),
    []
  );

  // Auto-validate address when fields change
  useEffect(() => {
    const address = {
      streetAddress: watchedValues.streetAddress || '',
      city: watchedValues.city || '',
      state: watchedValues.state || '',
      zipCode: watchedValues.zipCode || ''
    };

    if (address.streetAddress || address.city || address.state || address.zipCode) {
      debouncedValidation(address);
    } else {
      setAddressValidationStatus('idle');
    }
  }, [watchedValues.streetAddress, watchedValues.city, watchedValues.state, watchedValues.zipCode, debouncedValidation]);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your Address
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          We need your complete address to find available plans in your area
        </motion.p>
      </div>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label htmlFor="streetAddress" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
            <Home className="w-4 h-4 mr-2 text-purple-500" />
            Street Address
          </label>
          <Controller
            name="streetAddress"
            control={control}
            render={({ field }) => (
              <EnhancedInput
                field={{ ...field, id: 'streetAddress' }}
                error={errors.streetAddress}
                placeholder="Street Address"
                icon={<Home className="w-5 h-5" />}
              />
            )}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label htmlFor="apartmentUnit" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2 text-purple-500" />
            Apartment, Unit, Suite (Optional)
          </label>
          <Controller
            name="apartmentUnit"
            control={control}
            render={({ field }) => (
              <EnhancedInput
                field={{ ...field, id: 'apartmentUnit' }}
                error={errors.apartmentUnit}
                placeholder="Apartment, Unit, Suite, etc. (Optional)"
                icon={<Building className="w-5 h-5" />}
              />
            )}
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="city" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              City
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <EnhancedInput
                  field={{ ...field, id: 'city' }}
                  error={errors.city}
                  placeholder="City"
                  icon={<MapPin className="w-5 h-5" />}
                />
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="zipCode" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
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
                  onCustomChange={(value, onChange) => 
                    handleZipCodeChange(value, onChange, control.setValue, control.watch)
                  }
                  icon={<MapPin className="w-5 h-5" />}
                />
              )}
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label htmlFor="state" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
            State
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  inputId="state"
                  options={stateOptions}
                  placeholder="Select State"
                  styles={selectStyles}
                  value={stateOptions.find(option => option.value === field.value)}
                  onChange={(option) => field.onChange(option?.value || '')}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>
            )}
          />
        </motion.div>

        <AnimatePresence>
          {addressValidationStatus === 'validating' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-center"
            >
              <motion.div 
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-blue-700 font-medium">Validating address...</span>
            </motion.div>
          )}

          {addressValidationStatus === 'valid' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 border-2 border-green-200 rounded-2xl p-4"
            >
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-green-700 font-semibold">Address format looks great!</span>
              </div>
              <p className="text-sm text-green-600">
                We found your location and can provide accurate plan pricing
              </p>
            </motion.div>
          )}

          {addressValidationStatus === 'invalid' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4"
            >
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-yellow-700 font-semibold">Please check address format</span>
              </div>
              <p className="text-sm text-yellow-600">
                Make sure your street address includes a number and is formatted correctly.
              </p>
            </motion.div>
          )}

          {locationSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4"
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-blue-700 font-medium">
                  ZIP code found: {locationSuggestion.city}, {locationSuggestion.state}
                  {(!watchedValues.city || !watchedValues.state) && (
                    <span className="ml-2 text-green-600 font-semibold">(Auto-filled)</span>
                  )}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};