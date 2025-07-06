// src/utils/quoteEngine.ts - Foundation Quote Engine for Gig Workers

export interface WorkerProfile {
  workType: string;
  weeklyIncome: number;
  state: string;
  zipCode: string;
  age?: number; // Optional, estimated from work type if not provided
  budgetRange: [number, number];
  coveragePriorities: string[];
  urgency: 'asap' | 'next-month' | 'exploring';
}

export interface InsurancePlan {
  id: string;
  carrierName: string;
  carrierLogo: string;
  planName: string;
  planType: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  monthlyPremium: number;
  deductible: number;
  maxOutOfPocket: number;
  copays: {
    primaryCare: number;
    specialist: number;
    urgentCare: number;
    emergency: number;
  };
  prescription: {
    generic: number;
    preferred: number;
    specialty: string;
  };
  features: string[];
  network: string;
  rating: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface QuoteResult {
  originalPremium: number;
  estimatedPremium: number;
  monthlySavings: number;
  annualSavings: number;
  taxDeduction: number;
  effectiveMonthlyRate: number;
  plan: InsurancePlan;
  gigWorkerBenefits: string[];
}

// Work type risk factors (affects pricing)
const WORK_TYPE_FACTORS = {
  'rideshare': 1.1,
  'delivery': 1.05,
  'freelancer': 1.0,
  'contractor': 1.0,
  'small-business': 0.98,
  'seasonal': 1.15,
  'multiple': 1.2,
  'food-service': 1.1,
  'photography': 1.0,
  'beauty': 1.0,
  'cleaning': 1.05,
  'retail': 1.0,
  'handyman': 1.1,
  'warehouse': 1.05,
  'other': 1.0
};

// State-based pricing factors
const STATE_FACTORS = {
  'FL': 1.0,
  'TX': 0.95,
  'CA': 1.3,
  'NY': 1.25,
  'GA': 0.9,
  'NC': 0.85,
  'AL': 0.8,
  'AZ': 0.9,
  'IL': 1.1,
  'OH': 0.85
};

// Age estimation based on work type
const AGE_ESTIMATES = {
  'rideshare': 32,
  'delivery': 29,
  'freelancer': 35,
  'contractor': 42,
  'small-business': 45,
  'seasonal': 38,
  'multiple': 30,
  'food-service': 28,
  'photography': 33,
  'beauty': 31,
  'cleaning': 40,
  'retail': 27,
  'handyman': 44,
  'warehouse': 35,
  'other': 35
};

// Base plan templates
const BASE_PLANS: Omit<InsurancePlan, 'monthlyPremium'>[] = [
  {
    id: 'bronze-hsa',
    carrierName: 'Blue Cross Blue Shield',
    carrierLogo: '/logos/blue_cross_blue_shield_Logo.webp',
    planName: 'Bronze HSA Advantage',
    planType: 'Bronze',
    deductible: 6000,
    maxOutOfPocket: 8000,
    copays: { primaryCare: 25, specialist: 65, urgentCare: 85, emergency: 350 },
    prescription: { generic: 15, preferred: 45, specialty: '30% coinsurance' },
    features: ['HSA-eligible', 'Preventive care covered', 'Tax advantages'],
    network: 'Blue Choice PPO',
    rating: 4.2
  },
  {
    id: 'silver-standard',
    carrierName: 'Ambetter',
    carrierLogo: '/logos/Ambetter_Logo.webp',
    planName: 'Silver Balanced Care',
    planType: 'Silver',
    deductible: 3500,
    maxOutOfPocket: 7000,
    copays: { primaryCare: 20, specialist: 45, urgentCare: 75, emergency: 300 },
    prescription: { generic: 10, preferred: 35, specialty: '25% coinsurance' },
    features: ['Balanced coverage', 'Mental health included', 'Telehealth'],
    network: 'Ambetter Regional',
    rating: 4.5,
    isPopular: true
  },
  {
    id: 'gold-comprehensive',
    carrierName: 'Oscar Health',
    carrierLogo: '/logos/Oscar_Health_logo.webp',
    planName: 'Gold Comprehensive',
    planType: 'Gold',
    deductible: 1500,
    maxOutOfPocket: 6000,
    copays: { primaryCare: 15, specialist: 35, urgentCare: 50, emergency: 250 },
    prescription: { generic: 5, preferred: 25, specialty: '20% coinsurance' },
    features: ['Low deductible', 'Comprehensive coverage', 'Concierge care'],
    network: 'Oscar Metro Plus',
    rating: 4.7,
    isBestValue: true
  }
];

// Calculate base premium based on age and location
function calculateBasePremium(age: number, state: string, planType: string): number {
  const basePremiums = {
    'Bronze': 280,
    'Silver': 350,
    'Gold': 420,
    'Platinum': 520
  };
  
  const ageFactor = Math.max(0.8, Math.min(2.0, age / 30));
  const stateFactor = STATE_FACTORS[state as keyof typeof STATE_FACTORS] || 1.0;
  const base = basePremiums[planType as keyof typeof basePremiums] || 350;
  
  return Math.round(base * ageFactor * stateFactor);
}

// Calculate gig worker specific adjustments
function calculateGigWorkerAdjustments(profile: WorkerProfile): {
  riskFactor: number;
  incomeDiscount: number;
  gigWorkerBenefits: string[];
} {
  const riskFactor = WORK_TYPE_FACTORS[profile.workType as keyof typeof WORK_TYPE_FACTORS] || 1.0;
  
  // Income-based discount (gig workers often get better rates)
  const annualIncome = profile.weeklyIncome * 52;
  let incomeDiscount = 1.0;
  
  if (annualIncome < 30000) incomeDiscount = 0.85;
  else if (annualIncome < 50000) incomeDiscount = 0.92;
  else if (annualIncome < 75000) incomeDiscount = 0.98;
  
  const gigWorkerBenefits = [
    'Tax-deductible premiums',
    'Flexible payment options',
    'No employer verification needed',
    'Coverage during income gaps'
  ];
  
  return { riskFactor, incomeDiscount, gigWorkerBenefits };
}

// Calculate tax deduction benefit
function calculateTaxDeduction(monthlyPremium: number, annualIncome: number): number {
  const annualPremium = monthlyPremium * 12;
  const taxRate = annualIncome > 50000 ? 0.22 : 0.12; // Simplified tax brackets
  return Math.round(annualPremium * taxRate);
}

// Main quote generation function
export function generateQuotes(profile: WorkerProfile): QuoteResult[] {
  const age = profile.age || AGE_ESTIMATES[profile.workType as keyof typeof AGE_ESTIMATES] || 35;
  const annualIncome = profile.weeklyIncome * 52;
  const adjustments = calculateGigWorkerAdjustments(profile);
  
  return BASE_PLANS.map(basePlan => {
    const originalPremium = calculateBasePremium(age, profile.state, basePlan.planType);
    const adjustedPremium = Math.round(originalPremium * adjustments.riskFactor * adjustments.incomeDiscount);
    
    // Apply budget preference (slight adjustment if outside range)
    const [minBudget, maxBudget] = profile.budgetRange;
    let finalPremium = adjustedPremium;
    
    if (adjustedPremium > maxBudget) {
      finalPremium = Math.round(adjustedPremium * 0.95); // Small discount for budget-conscious
    }
    
    const monthlySavings = Math.max(0, originalPremium - finalPremium);
    const annualSavings = monthlySavings * 12;
    const taxDeduction = calculateTaxDeduction(finalPremium, annualIncome);
    const effectiveMonthlyRate = Math.round(finalPremium - (taxDeduction / 12));
    
    const plan: InsurancePlan = {
      ...basePlan,
      monthlyPremium: finalPremium
    };
    
    return {
      originalPremium,
      estimatedPremium: finalPremium,
      monthlySavings,
      annualSavings,
      taxDeduction,
      effectiveMonthlyRate,
      plan,
      gigWorkerBenefits: adjustments.gigWorkerBenefits
    };
  }).sort((a, b) => {
    // Sort by value: best effective rate first
    return a.effectiveMonthlyRate - b.effectiveMonthlyRate;
  });
}

// Quick quote for immediate display
export function generateQuickQuote(profile: WorkerProfile): {
  estimatedRange: [number, number];
  averageRate: number;
  potentialSavings: number;
} {
  const quotes = generateQuotes(profile);
  const premiums = quotes.map(q => q.estimatedPremium);
  const minPremium = Math.min(...premiums);
  const maxPremium = Math.max(...premiums);
  const averageRate = Math.round(premiums.reduce((a, b) => a + b, 0) / premiums.length);
  const potentialSavings = Math.round(quotes.reduce((sum, q) => sum + q.annualSavings, 0) / quotes.length);
  
  return {
    estimatedRange: [minPremium, maxPremium],
    averageRate,
    potentialSavings
  };
}

// Helper function to format quotes for display
export function formatQuoteForDisplay(quote: QuoteResult): string {
  const { plan, estimatedPremium, taxDeduction, effectiveMonthlyRate } = quote;
  
  return `${plan.planName} - $${estimatedPremium}/month (After tax savings: $${effectiveMonthlyRate}/month)`;
}

// Integration function for the form
export function integrateWithForm(formData: any): QuoteResult[] {
  const profile: WorkerProfile = {
    workType: formData.workType,
    weeklyIncome: formData.weeklyIncome,
    state: formData.state,
    zipCode: formData.zipCode,
    budgetRange: formData.budgetRange,
    coveragePriorities: formData.coveragePriorities,
    urgency: formData.urgency
  };
  
  return generateQuotes(profile);
}

// Export for testing and expansion
export { WORK_TYPE_FACTORS, STATE_FACTORS, AGE_ESTIMATES, BASE_PLANS };