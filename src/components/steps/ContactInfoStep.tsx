import React from 'react';
import { motion } from 'framer-motion';
import { Controller } from 'react-hook-form';
import { 
  UserCheck, Mail, Phone, Shield, CheckCircle, Lock, Star 
} from 'lucide-react';
import { EnhancedInput } from '../shared/EnhancedInput';
import { ModernDatePicker } from '../shared/ModernDatePicker';
import { formatPhoneNumber } from '../utils/formatters';

interface ContactInfoStepProps {
  control: any;
  errors: any;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  control,
  errors
}) => {
  return (
    <motion.div
      key="step1"
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
          Let's Get Started
        </motion.h2>
        <motion.p 
          className="text-gray-600 text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Tell us how to reach you for plan recommendations
        </motion.p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="firstName" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-purple-500" />
              First Name
            </label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <EnhancedInput
                  field={{ ...field, id: 'firstName' }}
                  error={errors.firstName}
                  placeholder="First Name"
                  icon={<UserCheck className="w-5 h-5" />}
                />
              )}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="lastName" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-purple-500" />
              Last Name
            </label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <EnhancedInput
                  field={{ ...field, id: 'lastName' }}
                  error={errors.lastName}
                  placeholder="Last Name"
                  icon={<UserCheck className="w-5 h-5" />}
                />
              )}
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-purple-500" />
            Email Address
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <EnhancedInput
                field={{ ...field, id: 'email' }}
                error={errors.email}
                placeholder="Email Address"
                type="email"
                icon={<Mail className="w-5 h-5" />}
              />
            )}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-2 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-purple-500" />
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <EnhancedInput
                field={{ ...field, id: 'phone' }}
                error={errors.phone}
                placeholder="Phone Number"
                type="tel"
                formatter={formatPhoneNumber}
                maxLength={14}
                icon={<Phone className="w-5 h-5" />}
              />
            )}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
      >
        <div className="flex items-center justify-center space-x-6 text-sm text-blue-700">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-medium">HIPAA Secure</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Never Sold</span>
          </div>
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            <span className="font-medium">Bank-Level Security</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};