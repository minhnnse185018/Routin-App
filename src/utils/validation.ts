export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  return { isValid: true };
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateSignUpForm = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!firstName.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (!validateName(firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
  }

  if (!lastName.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (!validateName(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.push({ field: 'password', message: passwordValidation.message || 'Invalid password' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
