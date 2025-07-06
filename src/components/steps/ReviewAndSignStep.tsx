import React from 'react';
import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { 
  Award, FileText, Edit3, Shield, CheckCircle, Lock, 
  Heart, Star, Mail, Phone, MapPin, DollarSign, Check,
  Users, Calculator, Gift
} from 'lucide-react';
import { EnhancedCheckbox } from '../shared/EnhancedCheckbox';
import { DocuSignSignature } from '../shared/DocuSignSignature';
import type { PlanPreview } from '../shared/PlanSelectionCard';

interface HouseholdMember {
  id: string;
  type: 'spouse' | 'dependent';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  ssn: string;
  isApplyingForCoverage: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  householdMembers: HouseholdMember[];
  incomeData: {
    totalAnnualIncome: number;
  };
  selectedPlan?: PlanPreview;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
}

interface ReviewAndSignStepProps {
  control: any;
  errors: any;
  formData: FormData;
}

export const ReviewAndSignStep: React.FC<ReviewAndSignStepProps> = ({
  control,
  errors,
  formData
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateHouseholdSize = () => {
    return 1 + (formData.householdMembers?.length || 0);
  };

  const getApplyingMembers = () => {
    return formData.householdMembers?.filter(member => member.isApplyingForCoverage) || [];
  };

  // Get user initials for enhanced checkboxes
  const getUserInitials = () => {
    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <motion.div
      key="step8"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="text-center mb-6">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Review & Submit
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Almost done! Please review and sign your application
        </motion.p>
      </div>

      <div className="space-y-6">
        {/* Enhanced Application Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Award className="w-6 h-6 mr-3 text-purple-500" />
            Application Summary
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal & Contact Information */}
            <div className="bg-white/80 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Personal & Contact Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    Email:
                  </span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Phone className="w-3 h-3 mr-1" />
                    Phone:
                  </span>
                  <span className="font-medium">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 mt-0.5" />
                    Address:
                  </span>
                  <span className="font-medium text-right">
                    {formData.streetAddress}<br />
                    {formData.city}, {formData.state} {formData.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Household & Income Information */}
            <div className="bg-white/80 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                Household & Income
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Household Size:</span>
                  <span className="font-medium">{calculateHouseholdSize()} {calculateHouseholdSize() === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Calculator className="w-3 h-3 mr-1" />
                    Annual Income:
                  </span>
                  <span className="font-medium">{formatCurrency(formData.incomeData?.totalAnnualIncome || 0)}</span>
                </div>
                {getApplyingMembers().length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 text-xs">Members applying for coverage:</span>
                    <div className="mt-1 space-y-1">
                      <div className="text-xs font-medium text-blue-600">
                        {formData.firstName} {formData.lastName} (Primary)
                      </div>
                      {getApplyingMembers().map((member, idx) => (
                        <div key={idx} className="text-xs font-medium text-blue-600">
                          {member.firstName} {member.lastName} ({member.type})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Plan */}
          {formData.selectedPlan && (
            <div className="mt-6 bg-white/80 rounded-xl p-5">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Selected Health Plan
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="font-bold text-gray-800 text-lg">{formData.selectedPlan.carrierName}</div>
                  <div className="text-gray-600 mb-3">{formData.selectedPlan.planName}</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Deductible:</span>
                      <div className="font-bold">{formatCurrency(formData.selectedPlan.deductible)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Out-of-Pocket:</span>
                      <div className="font-bold">{formatCurrency(formData.selectedPlan.maxOutOfPocket)}</div>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatCurrency(formData.selectedPlan.subsidizedPremium)}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">per month</div>
                  {formData.selectedPlan.estimatedSavings > 0 && (
                    <div className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Gift className="w-3 h-3 mr-1" />
                      Save {formatCurrency(formData.selectedPlan.estimatedSavings)}/month
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Terms and Conditions with Scrollable Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-blue-500" />
            Terms & Conditions
          </h3>
          
          {/* Scrollable Terms Container */}
          <div className="bg-white/80 rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800">Please review the following terms</h4>
              <p className="text-sm text-gray-600">Scroll to read all terms and conditions</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-4 space-y-4 text-sm text-gray-700 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div>
                <h5 className="font-semibold mb-2">1. Health Plan Enrollment</h5>
                <p>By submitting this application, I understand that I am applying for health insurance coverage through the Health Insurance Marketplace. I acknowledge that coverage will only begin upon approval and payment of the first month's premium.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">2. Accuracy of Information</h5>
                <p>I certify that all information provided in this application is true and complete to the best of my knowledge. I understand that providing false or misleading information may result in denial of coverage or cancellation of my policy.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">3. Premium Tax Credits</h5>
                <p>I understand that premium tax credit amounts are estimates based on the income information provided. Final tax credit amounts will be determined by the IRS and may be reconciled on my tax return.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">4. Coverage Limitations</h5>
                <p>I understand that this health plan may have limitations on coverage, including provider networks, covered services, and pre-authorization requirements. I agree to review the Summary of Benefits and Coverage before making my final decision.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">5. Changes to Coverage</h5>
                <p>I understand that changes to my health plan can only be made during Open Enrollment periods or if I qualify for a Special Enrollment Period due to qualifying life events.</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">6. Data Sharing</h5>
                <p>I authorize the sharing of my information with relevant government agencies for the purpose of determining eligibility for health coverage and premium tax credits.</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Agreement Checkboxes */}
          <div className="space-y-3">
            <Controller
              name="termsAccepted"
              control={control}
              render={({ field }) => (
                <EnhancedCheckbox
                  checked={field.value || false}
                  onChange={field.onChange}
                  label="I accept the Terms and Conditions"
                  description="I have read and agree to the terms and conditions outlined above"
                  required={true}
                  error={!!errors.termsAccepted}
                  initials={getUserInitials()}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="termsAccepted"
              render={({ message }) => <p className="text-red-500 text-sm ml-10">{message}</p>}
            />

            <Controller
              name="privacyAccepted"
              control={control}
              render={({ field }) => (
                <EnhancedCheckbox
                  checked={field.value || false}
                  onChange={field.onChange}
                  label="I accept the Privacy Policy"
                  description="I understand how my personal information will be used and protected"
                  required={true}
                  error={!!errors.privacyAccepted}
                  initials={getUserInitials()}
                />
              )}
            />
            <ErrorMessage
              errors={errors}
              name="privacyAccepted"
              render={({ message }) => <p className="text-red-500 text-sm ml-10">{message}</p>}
            />

            <Controller
              name="marketingAccepted"
              control={control}
              render={({ field }) => (
                <EnhancedCheckbox
                  checked={field.value || false}
                  onChange={field.onChange}
                  label="Send me helpful health insurance updates (Optional)"
                  description="Receive important plan updates, renewal reminders, and money-saving tips"
                  required={false}
                  error={false}
                  initials={getUserInitials()}
                />
              )}
            />
          </div>
        </motion.div>

        {/* Enhanced Digital Signature - FIXED: Removed duplicate message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
        >
          <Controller
            name="signature"
            control={control}
            render={({ field }) => (
              <DocuSignSignature
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.signature}
                fullName={`${formData.firstName} ${formData.lastName}`.trim()}
                required={true}
              />
            )}
          />
          {/* REMOVED DUPLICATE MESSAGE - DocuSignSignature component already handles this */}
        </motion.div>

        {/* Security Assurance - Consolidated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6"
        >
          <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
            <Lock className="w-6 h-6 mr-3" />
            Your Application is Secure
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-green-700">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
              <span>HIPAA compliant processing</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
              <span>SOC 2 Type II certified</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
              <span>Immediate confirmation email</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};