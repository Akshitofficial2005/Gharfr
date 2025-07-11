export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePGForm = (data: any): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};
  
  if (!data.name?.trim()) {
    errors.name = 'PG name is required';
  }
  
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  }
  
  if (!data.location?.address?.trim()) {
    errors.address = 'Address is required';
  }
  
  if (!data.location?.city?.trim()) {
    errors.city = 'City is required';
  }
  
  if (!data.location?.pincode || !/^\d{6}$/.test(data.location.pincode)) {
    errors.pincode = 'Valid 6-digit pincode is required';
  }
  
  if (!data.roomTypes || data.roomTypes.length === 0) {
    errors.roomTypes = 'At least one room type is required';
  }
  
  if (!data.images || data.images.length === 0) {
    errors.images = 'At least one image is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};