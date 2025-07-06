// Address validation utilities for ZIP lookup and format checking

export interface LocationResult {
  city: string;
  state: string;
  country?: string;
}

export interface AddressValidationResult {
  isValid: boolean;
  confidence: 'low' | 'medium' | 'high';
  message: string;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

/**
 * Enhanced ZIP code lookup using Zippopotam.us API
 * Returns location data for valid US ZIP codes
 */
export const getLocationFromZip = async (zipCode: string): Promise<LocationResult | null> => {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
    if (response.ok) {
      const data = await response.json();
      return {
        city: data.places[0]['place name'],
        state: data.places[0]['state abbreviation'],
        country: data.country
      };
    }
  } catch (error) {
    console.warn('ZIP lookup failed:', error);
  }
  return null;
};

/**
 * Local address format validation
 * Checks for common address format requirements
 */
export const validateAddressLocally = (address: Address): AddressValidationResult => {
  const hasAllFields = address.streetAddress && address.city && address.state && address.zipCode;
  const zipIsValid = /^\d{5}$/.test(address.zipCode);
  const streetHasNumber = /\d/.test(address.streetAddress);
  const cityIsValid = /^[a-zA-Z\s'-]+$/.test(address.city);
  const stateIsValid = address.state && address.state.length === 2;
  
  // Check for PO Box (some plans may not deliver to PO Boxes)
  const isPOBox = /^\s*p\.?o\.?\s*box/i.test(address.streetAddress);
  
  // Calculate confidence level
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (hasAllFields && zipIsValid && streetHasNumber && cityIsValid && stateIsValid) {
    confidence = isPOBox ? 'medium' : 'high';
  } else if (hasAllFields && zipIsValid) {
    confidence = 'medium';
  }
  
  const isValid = hasAllFields && zipIsValid && streetHasNumber && cityIsValid && stateIsValid;
  
  let message = 'Address format looks good';
  if (!isValid) {
    if (!hasAllFields) {
      message = 'Please fill in all required address fields';
    } else if (!zipIsValid) {
      message = 'ZIP code must be exactly 5 digits';
    } else if (!streetHasNumber) {
      message = 'Street address must include a number';
    } else if (!cityIsValid) {
      message = 'City name can only contain letters, spaces, hyphens, and apostrophes';
    } else if (!stateIsValid) {
      message = 'Please select a valid state';
    }
  } else if (isPOBox) {
    message = 'PO Box detected - some plans may have delivery restrictions';
  }
  
  return {
    isValid,
    confidence,
    message
  };
};

/**
 * Debounced address validation for real-time feedback
 * Prevents excessive API calls during user input
 */
export const debounceAddressValidation = (
  validationFn: (address: Address) => void,
  delay: number = 2000
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (address: Address) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      validationFn(address);
    }, delay);
  };
};

/**
 * Format ZIP code to ensure proper 5-digit format
 */
export const formatZipCode = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 5);
};

/**
 * Check if ZIP code is in a supported state
 * Can be extended to filter by available insurance markets
 */
export const isSupportedZipCode = (zipCode: string, supportedStates: string[] = []): boolean => {
  if (supportedStates.length === 0) {
    return true; // No restrictions if no supported states specified
  }
  
  // This would typically check against a ZIP-to-state mapping
  // For now, we'll use a simplified check
  const zipRanges: Record<string, string[]> = {
    'FL': ['32', '33', '34'],
    'CA': ['90', '91', '92', '93', '94', '95', '96'],
    'TX': ['75', '76', '77', '78', '79'],
    'NY': ['10', '11', '12', '13', '14'],
    // Add more as needed
  };
  
  const zipPrefix = zipCode.slice(0, 2);
  return Object.entries(zipRanges).some(([state, prefixes]) => 
    supportedStates.includes(state) && prefixes.includes(zipPrefix)
  );
};