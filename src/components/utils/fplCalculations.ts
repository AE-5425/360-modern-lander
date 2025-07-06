// Federal Poverty Level calculations and income utilities for 2025

// Federal Poverty Level thresholds for 2025
const fplThresholds = {
  1: 15060, 2: 20440, 3: 25820, 4: 31200,
  5: 36580, 6: 41960, 7: 47340, 8: 52720
};

/**
 * Get the Federal Poverty Level for a given household size
 * @param householdSize - Number of people in the household
 * @returns Federal Poverty Level amount for the household size
 */
export const getFPL = (householdSize: number): number => {
  if (householdSize <= 8) {
    return fplThresholds[householdSize as keyof typeof fplThresholds];
  }
  // For households larger than 8, add $5,380 for each additional person
  return fplThresholds[8] + ((householdSize - 8) * 5380);
};

/**
 * Determine subsidy level based on income and household size
 * @param income - Annual household income
 * @param householdSize - Number of people in household
 * @returns Subsidy level description
 */
export const getSubsidyLevel = (income: number, householdSize: number): string => {
  const fpl = getFPL(householdSize);
  const percentage = (income / fpl) * 100;
  
  if (percentage <= 150) return 'Maximum Subsidies + Cost Sharing';
  if (percentage <= 200) return 'High Subsidies';
  if (percentage <= 250) return 'Moderate Subsidies';
  if (percentage <= 400) return 'Some Subsidies';
  return 'No Subsidies';
};

/**
 * Estimate monthly savings based on income and household size
 * @param income - Annual household income
 * @param householdSize - Number of people in household
 * @returns Estimated monthly savings amount
 */
export const estimateMonthlySavings = (income: number, householdSize: number): number => {
  const fpl = getFPL(householdSize);
  const percentage = (income / fpl) * 100;
  
  if (percentage <= 150) return 500;
  if (percentage <= 200) return 400;
  if (percentage <= 250) return 300;
  if (percentage <= 400) return 200;
  return 0;
};

/**
 * Calculate FPL percentage for display
 * @param income - Annual household income
 * @param householdSize - Number of people in household
 * @returns Percentage of FPL as a number
 */
export const calculateFPLPercentage = (income: number, householdSize: number): number => {
  const fpl = getFPL(householdSize);
  return Math.round((income / fpl) * 100);
};

/**
 * Determine if household qualifies for subsidies
 * @param income - Annual household income
 * @param householdSize - Number of people in household
 * @returns Boolean indicating subsidy eligibility
 */
export const qualifiesForSubsidies = (income: number, householdSize: number): boolean => {
  const fpl = getFPL(householdSize);
  const percentage = (income / fpl) * 100;
  return percentage <= 400;
};

/**
 * Get income type label for form descriptions
 * @param type - Income type value
 * @returns User-friendly label for income description field
 */
export const getIncomeTypeLabel = (type: string): string => {
  switch (type) {
    case 'employment': return 'Employer';
    case 'unemployment': return 'Previous Employer';
    case 'self-employment': return 'Business Description';
    case 'other': return 'Income Description';
    default: return 'Description';
  }
};

/**
 * Validate income range for household size
 * @param income - Annual household income
 * @param householdSize - Number of people in household
 * @returns Validation result with warnings
 */
export const validateIncomeRange = (income: number, householdSize: number) => {
  const fpl = getFPL(householdSize);
  const percentage = (income / fpl) * 100;
  
  return {
    isValid: income > 0,
    percentage,
    warnings: {
      veryLowIncome: percentage < 100,
      noSubsidyEligible: percentage > 400,
      medicaidEligible: percentage <= 138
    },
    subsidyTier: getSubsidyLevel(income, householdSize)
  };
};