import React from "react";
import { motion } from "framer-motion";
import { Controller } from "react-hook-form";
import { 
  Calendar, 
  Lock, 
  Cigarette, 
  User, 
  AlertTriangle,
  X,
  Check
} from "lucide-react";
import { EnhancedInput } from "../shared/EnhancedInput";
import { ModernDatePicker } from "../shared/ModernDatePicker";
import { TobaccoSelector } from "../shared/TobaccoSelector";
import { formatSSN, calculateAge } from "../utils/formatters";

interface PersonalDetailsStepProps {
  control: any;
  errors: any;
  watch: any;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ 
  control, 
  errors,
  watch
}) => {
  const dateOfBirth = watch('dateOfBirth');
  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;
  const showMedicareWarning = age !== null && age >= 65;

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Compact Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Personal Details
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Secure information needed for your health plan application
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Date of Birth and SSN - 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="dateOfBirth" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-purple-500" />
              Date of Birth
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <ModernDatePicker
                  field={field}
                  error={errors.dateOfBirth}
                  placeholder="Select your birth date"
                  label="Date of Birth"
                  required={true}
                  id="dateOfBirth"
                  minAge={18}  // Must be 18 or older
                  maxAge={120} // Reasonable max age
                />
              )}
            />
            {/* Age Display */}
            {age !== null && (
              <p className="text-sm text-gray-600 mt-1">
                Age: {age} years old
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="ssn" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-green-500" />
              Social Security Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Controller
              name="ssn"
              control={control}
              render={({ field }) => (
                <EnhancedInput
                  field={{ ...field, id: 'ssn' }}
                  error={errors.ssn}
                  placeholder="XXX-XX-XXXX"
                  type="text"
                  formatter={formatSSN}
                  maxLength={11}
                  icon={<Lock className="w-4 h-4" />}
                />
              )}
            />
            <p className="text-sm text-green-600 mt-1">
              <Lock className="w-3 h-3 inline mr-1" />
              Identity verification only - fully encrypted
            </p>
          </motion.div>
        </div>

        {/* Medicare Eligibility Warning for 65+ */}
        {showMedicareWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-blue-800 text-lg mb-2">Medicare May Be a Better Option</h4>
                <p className="text-blue-700 mb-3">
                  Since you're {age} years old, you may be eligible for Medicare, which typically provides 
                  better coverage and lower costs than ACA marketplace plans for seniors.
                </p>
                <p className="text-sm text-blue-600">
                  <strong>You can still complete this application</strong>, but we recommend also exploring 
                  Medicare options at <span className="font-mono">medicare.gov</span> or calling 1-800-MEDICARE.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Tobacco Status - Only show for 18+ applicants */}
        {age !== null && age >= 18 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-base font-semibold text-gray-700 mb-4 flex items-center">
              <Cigarette className="w-4 h-4 mr-2 text-orange-500" />
              Tobacco Use Status
              <span className="text-red-500 ml-1">*</span>
            </label>
            <p className="text-gray-600 text-sm mb-4">
              Have you used tobacco products 4 times or more a week in the last 6 months?
            </p>
            
            <Controller
              name="tobaccoStatus"
              control={control}
              render={({ field }) => (
                <TobaccoSelector
                  value={field.value || 'no'}
                  onChange={field.onChange}
                  error={errors.tobaccoStatus}
                />
              )}
            />
          </motion.div>
        )}

        {/* Under 18 - No Tobacco Question */}
        {age !== null && age < 18 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center text-green-700">
              <Check className="w-5 h-5 mr-2" />
              <span className="font-medium">No tobacco questions required for minors</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};