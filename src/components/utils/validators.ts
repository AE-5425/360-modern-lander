import * as yup from 'yup';
import { calculateAge } from './formatters';

// Enhanced validation schema with better error messages and business logic
export const createValidationSchema = (currentStep: number) => {
  const baseSchema = yup.object({
    firstName: yup.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
      .required('First name is required'),
    lastName: yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
      .required('Last name is required'),
    email: yup.string()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    phone: yup.string()
      .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in format: (123) 456-7890')
      .required('Phone number is required'),
    dateOfBirth: yup.string()
      .required('Date of birth is required')
      .test('age', 'You must be at least 18 years old to apply', function(value) {
        if (!value) return false;
        const age = calculateAge(value);
        return age >= 18;
      }),
    ssn: yup.string()
      .matches(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format: 123-45-6789')
      .required('Social Security Number is required'),
    tobaccoStatus: yup.string()
      .oneOf(['yes', 'no'], 'Please select your tobacco status')
      .required('Tobacco status is required'),
    streetAddress: yup.string()
      .min(5, 'Street address must be at least 5 characters')
      .max(100, 'Street address cannot exceed 100 characters')
      .required('Street address is required'),
    apartmentUnit: yup.string()
      .max(20, 'Apartment/Unit cannot exceed 20 characters'),
    city: yup.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City cannot exceed 50 characters')
      .matches(/^[a-zA-Z\s'-]+$/, 'City can only contain letters, spaces, hyphens, and apostrophes')
      .required('City is required'),
    state: yup.string().required('Please select your state'),
    zipCode: yup.string()
      .matches(/^\d{5}$/, 'ZIP code must be exactly 5 digits')
      .required('ZIP code is required'),
    // Enhanced SEP Eligibility validation with "none apply" support
    sepEligibility: yup.object({
      isEligible: yup.boolean()
        .test('eligibility-check', 'Please complete the eligibility screening', function(value) {
          const categories = this.parent.categories || [];
          
          // Allow progression if it's OEP, has qualifying event, or selected "none apply"
          if (categories.includes('open_enrollment') || 
              categories.includes('none_apply') || 
              (value === true && categories.length > 0)) {
            return true;
          }
          
          return false;
        })
        .required('Eligibility status is required'),
      categories: yup.array()
        .of(yup.string())
        .test('categories-check', 'Please select a qualifying category or indicate none apply', function(value) {
          if (!value || value.length === 0) return false;
          
          // Valid if OEP, none apply, or has valid qualifying categories
          return value.includes('open_enrollment') || 
                 value.includes('none_apply') || 
                 value.length > 0;
        })
        .required('Category selection is required'),
      eventType: yup.string()
        .when(['categories'], {
          is: (categories: string[]) => {
            return categories && 
                   !categories.includes('open_enrollment') && 
                   !categories.includes('none_apply') &&
                   categories.length > 0;
          },
          then: () => yup.string().required('Please select the specific qualifying event'),
          otherwise: () => yup.string()
        }),
      eventDate: yup.string()
        .when(['categories', 'eventType'], {
          is: (categories: string[], eventType: string) => {
            return categories && 
                   !categories.includes('open_enrollment') && 
                   !categories.includes('none_apply') &&
                   eventType && 
                   eventType !== '';
          },
          then: () => yup.string()
            .required('Please provide the date of your qualifying event')
            .test('recent-date', 'Event date must be within the allowable timeframe', function(value) {
              if (!value) return false;
              const eventDate = new Date(value);
              const today = new Date();
              const daysDiff = Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
              
              // Allow up to 90 days for most events, 60 days for others
              const maxDays = this.parent.eventType === 'medicaid_loss' ? 90 : 60;
              return daysDiff >= 0 && daysDiff <= maxDays;
            }),
          otherwise: () => yup.string()
        }),
      hasDocumentation: yup.boolean()
        .when(['categories'], {
          is: (categories: string[]) => {
            return categories && 
                   !categories.includes('open_enrollment') && 
                   !categories.includes('none_apply');
          },
          then: () => yup.boolean()
            .oneOf([true], 'Documentation confirmation is required')
            .required('Documentation status is required'),
          otherwise: () => yup.boolean()
        }),
      // Optional field for OEP notification email
      notificationEmail: yup.string()
        .when(['categories'], {
          is: (categories: string[]) => categories && categories.includes('none_apply'),
          then: () => yup.string().email('Please enter a valid email address'),
          otherwise: () => yup.string()
        })
    }),
    householdMembers: yup.array().of(
      yup.object({
        firstName: yup.string()
          .min(2, 'First name must be at least 2 characters')
          .matches(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes')
          .required('First name is required'),
        lastName: yup.string()
          .min(2, 'Last name must be at least 2 characters')
          .matches(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
          .required('Last name is required'),
        dateOfBirth: yup.string()
          .required('Date of birth is required')
          .test('age', 'Invalid date of birth', function(value) {
            if (!value) return false;
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 0 && age <= 120;
          }),
        gender: yup.string().required('Please select gender'),
        isApplyingForCoverage: yup.boolean().required(),
        ssn: yup.string().when('isApplyingForCoverage', {
          is: true,
          then: () => yup.string()
            .matches(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format: 123-45-6789')
            .required('Social Security Number is required for coverage'),
          otherwise: () => yup.string()
        }),
        tobaccoStatus: yup.string().when(['type', 'isApplyingForCoverage'], {
          is: (type: string, applying: boolean) => type === 'spouse' && applying,
          then: () => yup.string()
            .oneOf(['yes', 'no'], 'Please select tobacco status')
            .required('Tobacco status is required'),
          otherwise: () => yup.string()
        }),
        medicaidDenied: yup.boolean().when(['type', 'isApplyingForCoverage', 'dateOfBirth'], {
          is: (type: string, applying: boolean, dob: string) => {
            if (type === 'dependent' && applying && dob) {
              const age = calculateAge(dob);
              return age < 18;
            }
            return false;
          },
          then: () => yup.boolean().required('Please indicate if Medicaid/CHIP was denied'),
          otherwise: () => yup.boolean()
        }),
        medicaidDeniedDate: yup.string().when(['medicaidDenied'], {
          is: true,
          then: () => yup.string()
            .required('Please provide the denial date')
            .test('recent-date', 'Date must be within the last 60 days', function(value) {
              if (!value) return false;
              const denialDate = new Date(value);
              const sixtyDaysAgo = new Date();
              sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
              return denialDate >= sixtyDaysAgo && denialDate <= new Date();
            }),
          otherwise: () => yup.string()
        })
      })
    ),
    incomeData: yup.object({
      totalAnnualIncome: yup.number()
        .min(1000, 'Annual income must be at least $1,000')
        .max(1000000, 'Annual income cannot exceed $1,000,000')
        .required('Annual income is required'),
      primaryIncomeType: yup.string().required('Please select your income type'),
      // Add support for income range intelligence
		currentRange: yup.string()
		  .oneOf(['maximum-savings', 'good-savings', 'some-savings'], 'Invalid income range selection'),
    }),
    selectedPlan: yup.object().nullable(),
    termsAccepted: yup.boolean(),
    privacyAccepted: yup.boolean(),
    signature: yup.string()
  });

  // Return step-specific schemas for optimized validation - UPDATED FOR 8 STEPS
  switch (currentStep) {
    case 1: // Contact Info
      return yup.object({
        firstName: baseSchema.fields.firstName,
        lastName: baseSchema.fields.lastName,
        email: baseSchema.fields.email,
        phone: baseSchema.fields.phone,
      });
    case 2: // Address
      return yup.object({
        streetAddress: baseSchema.fields.streetAddress,
        apartmentUnit: baseSchema.fields.apartmentUnit,
        city: baseSchema.fields.city,
        state: baseSchema.fields.state,
        zipCode: baseSchema.fields.zipCode,
      });
    case 3: // SEP Screening (NEW STEP with enhanced validation)
      return yup.object({
        sepEligibility: baseSchema.fields.sepEligibility,
      });
    case 4: // Personal Details (shifted down from step 3)
      return yup.object({
        dateOfBirth: baseSchema.fields.dateOfBirth,
        ssn: baseSchema.fields.ssn,
        tobaccoStatus: baseSchema.fields.tobaccoStatus,
      });
    case 5: // Household (shifted down from step 4)
      return yup.object({
        householdMembers: baseSchema.fields.householdMembers,
      });
    case 6: // Income (shifted down from step 5)
      return yup.object({
        incomeData: baseSchema.fields.incomeData,
      });
    case 7: // Plan Selection (shifted down from step 6)
      return yup.object({
        selectedPlan: yup.object().required('Please select a health plan'),
      });
    case 8: // Terms & Signature (shifted down from step 7)
      return yup.object({
        termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
        privacyAccepted: yup.boolean().oneOf([true], 'You must accept the privacy policy'),
        signature: yup.string().required('Digital signature is required'),
      });
    default:
      return baseSchema;
  }
};

// Enhanced validation utilities
export const validateStep = (step: number, data: any) => {
  const schema = createValidationSchema(step);
  return schema.isValid(data);
};

export const getStepErrors = async (step: number, data: any) => {
  const schema = createValidationSchema(step);
  try {
    await schema.validate(data, { abortEarly: false });
    return {};
  } catch (error: any) {
    const errors: Record<string, string> = {};
    error.inner?.forEach((err: any) => {
      if (err.path) {
        errors[err.path] = err.message;
      }
    });
    return errors;
  }
};

// Additional utility for SEP eligibility checking
export const isSEPEligible = (sepEligibility: any): boolean => {
  if (!sepEligibility || !sepEligibility.categories) return false;
  
  const { categories, isEligible } = sepEligibility;
  
  // User is eligible if:
  // 1. It's Open Enrollment Period
  // 2. They have a qualifying life event
  // 3. They selected "none apply" (for lead capture, allows progression)
  return categories.includes('open_enrollment') || 
         categories.includes('none_apply') || 
         (isEligible && categories.length > 0);
};

// Utility to check if user needs qualifying event documentation
export const needsDocumentation = (sepEligibility: any): boolean => {
  if (!sepEligibility || !sepEligibility.categories) return false;
  
  const { categories } = sepEligibility;
  
  // Documentation needed for qualifying life events (not OEP or "none apply")
  return !categories.includes('open_enrollment') && 
         !categories.includes('none_apply') && 
         categories.length > 0;
};