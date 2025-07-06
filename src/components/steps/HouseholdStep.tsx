import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { 
  Plus, Users, Heart, ChevronDown, ChevronUp, Trash2, Edit3, 
  Calendar, UserCheck, Shield, AlertTriangle, CheckCircle, 
  Baby, User, Clock, Star
} from 'lucide-react';
import { EnhancedInput } from '../shared/EnhancedInput';
import { ModernDatePicker } from '../shared/ModernDatePicker';
import { ToggleButton } from '../shared/ToggleButton';
import { TobaccoSelector } from '../shared/TobaccoSelector';
import { formatSSN, calculateAge } from '../utils/formatters';

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

interface HouseholdStepProps {
  control: any;
  errors: any;
  focusedMemberId: string | null;
  setFocusedMemberId: (id: string | null) => void;
  householdMembers: HouseholdMember[];
  setValue: any;
  watch: any;
  validationTriggered?: boolean;
}

export const HouseholdStep: React.FC<HouseholdStepProps> = ({
  control,
  errors,
  focusedMemberId,
  setFocusedMemberId,
  householdMembers,
  setValue,
  watch,
  validationTriggered = false
}) => {

  // Get member errors function - only validate if Continue was clicked
  const getMemberErrors = (member: HouseholdMember, index: number) => {
    // Only validate if Continue was clicked
    const shouldValidate = validationTriggered;
    
    if (!shouldValidate) {
      return [];
    }

    const memberErrors = [];
    const memberFieldErrors = errors.householdMembers?.[index];

    // Required field validations
    if (!member.firstName?.trim()) {
      memberErrors.push('First name is required');
    }
    if (!member.lastName?.trim()) {
      memberErrors.push('Last name is required');
    }
    if (!member.dateOfBirth) {
      memberErrors.push('Date of birth is required');
    }
    if (!member.gender) {
      memberErrors.push('Gender is required');
    }
    if (member.isApplyingForCoverage && !member.ssn?.trim()) {
      memberErrors.push('SSN is required for coverage applicants');
    }

    // Age validation for tobacco question
    if (member.isApplyingForCoverage && member.dateOfBirth) {
      const age = calculateAge(member.dateOfBirth);
      if (age >= 18 && !member.tobaccoStatus) {
        memberErrors.push('Tobacco status is required for adults applying for coverage');
      }
    }

    // Include any additional field-level errors
    if (memberFieldErrors) {
      Object.values(memberFieldErrors).forEach((error: any) => {
        if (error?.message && !memberErrors.includes(error.message)) {
          memberErrors.push(error.message);
        }
      });
    }

    return memberErrors;
  };

  // Check if member has errors
  const memberHasErrors = (member: HouseholdMember, index: number): boolean => {
    return getMemberErrors(member, index).length > 0;
  };

  // Auto-expand first member with errors when validation is triggered
  useEffect(() => {
    if (validationTriggered && householdMembers.length > 0) {
      const firstMemberWithErrors = householdMembers.findIndex((member, index) => 
        memberHasErrors(member, index)
      );
      
      if (firstMemberWithErrors !== -1 && !householdMembers[firstMemberWithErrors].isExpanded) {
        // Auto-expand the first member with errors
        const updatedMembers = [...householdMembers];
        updatedMembers[firstMemberWithErrors] = {
          ...updatedMembers[firstMemberWithErrors],
          isExpanded: true
        };
        setValue('householdMembers', updatedMembers);
        setFocusedMemberId(updatedMembers[firstMemberWithErrors].id);
      }
    }
  }, [validationTriggered, householdMembers, setValue, setFocusedMemberId]);

  const addHouseholdMember = (type: 'spouse' | 'dependent') => {
    const newMember: HouseholdMember = {
      id: Date.now().toString(),
      type,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      ssn: '',
      isApplyingForCoverage: true,
      tobaccoStatus: 'no',
      medicaidDenied: false,
      isExpanded: true
    };
    
    const updatedMembers = [...householdMembers, newMember];
    setValue('householdMembers', updatedMembers);
    setFocusedMemberId(newMember.id);
  };

  const removeMember = (memberId: string) => {
    const updatedMembers = householdMembers.filter(member => member.id !== memberId);
    setValue('householdMembers', updatedMembers);
    if (focusedMemberId === memberId) {
      setFocusedMemberId(null);
    }
  };

  const toggleMemberExpansion = (memberId: string) => {
    const updatedMembers = householdMembers.map(member => 
      member.id === memberId 
        ? { ...member, isExpanded: !member.isExpanded }
        : member
    );
    setValue('householdMembers', updatedMembers);
    
    const member = updatedMembers.find(m => m.id === memberId);
    if (member?.isExpanded) {
      setFocusedMemberId(memberId);
    }
  };

  const updateMember = (memberId: string, field: string, value: any) => {
    const updatedMembers = householdMembers.map(member => 
      member.id === memberId ? { ...member, [field]: value } : member
    );
    setValue('householdMembers', updatedMembers);
  };

  const hasSpouse = () => householdMembers.some(member => member.type === 'spouse');
  const getDependents = () => householdMembers.filter(member => member.type === 'dependent');

  return (
    <motion.div
      key="step5"
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
          Household Members
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Add family members who live with you and may need coverage
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Add Member Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          {!hasSpouse() && (
            <motion.button
              type="button"
              onClick={() => addHouseholdMember('spouse')}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-5 h-5 mr-3" />
              Add Spouse/Partner
            </motion.button>
          )}
          
          <motion.button
            type="button"
            onClick={() => addHouseholdMember('dependent')}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg font-semibold"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Baby className="w-5 h-5 mr-3" />
            Add Child/Dependent
          </motion.button>
        </motion.div>

        {/* Household Members List */}
        <AnimatePresence mode="popLayout">
          {householdMembers.map((member, index) => {
            const memberErrors = getMemberErrors(member, index);
            const hasErrors = memberErrors.length > 0;
            const age = member.dateOfBirth ? calculateAge(member.dateOfBirth) : null;
            const showTobaccoQuestion = member.isApplyingForCoverage && age !== null && age >= 18;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                layout
                className={`bg-white/80 backdrop-blur-sm rounded-2xl border-2 shadow-lg overflow-hidden transition-all ${
                  member.isExpanded 
                    ? 'border-purple-300 shadow-xl' 
                    : hasErrors && validationTriggered
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Member Header */}
                <div 
                  className={`p-4 cursor-pointer transition-all ${
                    member.isExpanded 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50' 
                      : hasErrors && validationTriggered
                      ? 'bg-red-50 hover:bg-red-100'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleMemberExpansion(member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        member.type === 'spouse' 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      } shadow-lg`}>
                        {member.type === 'spouse' ? (
                          <Heart className="w-5 h-5 text-white" />
                        ) : (
                          <Baby className="w-5 h-5 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {member.firstName && member.lastName 
                            ? `${member.firstName} ${member.lastName}`
                            : `${member.type === 'spouse' ? 'Spouse/Partner' : 'Child/Dependent'}`
                          }
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {age !== null && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Age {age}
                            </span>
                          )}
                          {member.isApplyingForCoverage ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Applying for coverage
                            </span>
                          ) : (
                            <span className="flex items-center text-gray-500">
                              <User className="w-3 h-3 mr-1" />
                              Not applying for coverage
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Error indicator for collapsed members with issues */}
                      {hasErrors && validationTriggered && !member.isExpanded && (
                        <div className="flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {memberErrors.length} error{memberErrors.length > 1 ? 's' : ''}
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMember(member.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      {member.isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Member Form */}
                <AnimatePresence>
                  {member.isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 border-t border-gray-200 space-y-6"
                    >
                      {/* Show validation errors when expanded and validation triggered */}
                      {hasErrors && validationTriggered && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-red-50 border border-red-200 rounded-lg p-4"
                        >
                          <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Please fix the following issues:
                          </h5>
                          <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                            {memberErrors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                          </label>
                          <Controller
                            name={`householdMembers.${index}.firstName`}
                            control={control}
                            render={({ field }) => (
                              <EnhancedInput
                                field={{
                                  ...field,
                                  onChange: (e) => {
                                    field.onChange(e);
                                    updateMember(member.id, 'firstName', e.target.value);
                                  }
                                }}
                                error={errors.householdMembers?.[index]?.firstName}
                                placeholder="First Name"
                                icon={<UserCheck className="w-4 h-4" />}
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                          </label>
                          <Controller
                            name={`householdMembers.${index}.lastName`}
                            control={control}
                            render={({ field }) => (
                              <EnhancedInput
                                field={{
                                  ...field,
                                  onChange: (e) => {
                                    field.onChange(e);
                                    updateMember(member.id, 'lastName', e.target.value);
                                  }
                                }}
                                error={errors.householdMembers?.[index]?.lastName}
                                placeholder="Last Name"
                                icon={<UserCheck className="w-4 h-4" />}
                              />
                            )}
                          />
                        </div>
                      </div>

                      {/* Date of Birth and Gender */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <Controller
                            name={`householdMembers.${index}.dateOfBirth`}
                            control={control}
                            render={({ field }) => (
                              <ModernDatePicker
                                field={{
                                  ...field,
                                  onChange: (date) => {
                                    field.onChange(date);
                                    updateMember(member.id, 'dateOfBirth', date);
                                  }
                                }}
                                error={errors.householdMembers?.[index]?.dateOfBirth}
                                placeholder="Select date of birth"
                                label="Date of Birth"
                                required={true}
                                id={`dob-${member.id}`}
                                minAge={member.type === 'spouse' ? 18 : 0}
                                maxAge={member.type === 'spouse' ? 120 : 26}
                              />
                            )}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gender
                          </label>
                          <Controller
                            name={`householdMembers.${index}.gender`}
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  updateMember(member.id, 'gender', e.target.value);
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none bg-white/80 backdrop-blur-sm text-gray-800 transition-all"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            )}
                          />
                          <ErrorMessage
                            errors={errors}
                            name={`householdMembers.${index}.gender`}
                            render={({ message }) => <p className="text-red-500 text-sm mt-1">{message}</p>}
                          />
                        </div>
                      </div>

                      {/* Coverage Toggle */}
                      <div>
                        <ToggleButton
                          checked={member.isApplyingForCoverage}
                          onChange={(checked) => {
                            updateMember(member.id, 'isApplyingForCoverage', checked);
                            setValue(`householdMembers.${index}.isApplyingForCoverage`, checked);
                          }}
                          label="Apply for health insurance coverage?"
                          description="Toggle on if this person needs health insurance"
                        />
                      </div>

                      {/* SSN - Only if applying for coverage - FIXED */}
                      {member.isApplyingForCoverage && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Social Security Number
                          </label>
                          <Controller
                            name={`householdMembers.${index}.ssn`}
                            control={control}
                            render={({ field }) => (
                              <EnhancedInput
                                field={{
                                  ...field,
                                  onChange: (e) => {
                                    // Defensive coding - handle both event objects and direct values
                                    const rawValue = e?.target?.value ?? e ?? '';
                                    const formatted = formatSSN(rawValue);
                                    field.onChange(formatted);
                                    updateMember(member.id, 'ssn', formatted);
                                  }
                                }}
                                error={errors.householdMembers?.[index]?.ssn}
                                placeholder="XXX-XX-XXXX"
                                icon={<Shield className="w-4 h-4" />}
                                maxLength={11}
                              />
                            )}
                          />
                          <p className="text-sm text-green-600 mt-1">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Identity verification only - fully encrypted
                          </p>
                        </div>
                      )}

                      {/* Tobacco Question - Only for adults applying for coverage */}
                      {showTobaccoQuestion && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tobacco Use (Required for coverage applicants 18+)
                          </label>
                          <p className="text-sm text-gray-600 mb-4">
                            Have you used tobacco products 4 times or more a week in the last 6 months?
                          </p>
                          <Controller
                            name={`householdMembers.${index}.tobaccoStatus`}
                            control={control}
                            render={({ field }) => (
                              <TobaccoSelector
                                value={field.value || 'no'}
                                onChange={(value) => {
                                  field.onChange(value);
                                  updateMember(member.id, 'tobaccoStatus', value);
                                }}
                                error={errors.householdMembers?.[index]?.tobaccoStatus}
                              />
                            )}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Summary when no members */}
        {householdMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Just You For Now
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You can add family members who live with you and may need health insurance coverage. 
              Or continue with just yourself - you can always add family members later.
            </p>
            <motion.div 
              className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 mr-2" />
              Individual coverage is perfectly fine!
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};