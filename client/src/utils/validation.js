import { APP_CONFIG } from '../constants';
export const validateFile = (file) => {
  const errors = [];
  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }
  if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${formatFileSize(APP_CONFIG.MAX_FILE_SIZE)}`);
  }
  const fileExtension = getFileExtension(file.name);
  if (!APP_CONFIG.SUPPORTED_FILE_TYPES.includes(fileExtension)) {
    errors.push(`File type ${fileExtension} is not supported. Supported types: ${APP_CONFIG.SUPPORTED_FILE_TYPES.join(', ')}`);
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
};
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validateEthereumAddress = (address) => {
  if (!address) return false;
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(address);
};
export const validateHash = (hash, type = 'sha256') => {
  if (!hash) return false;
  const hashRegex = {
    sha256: /^[a-f0-9]{64}$/i,
    sha512: /^[a-f0-9]{128}$/i,
  };
  return hashRegex[type] ? hashRegex[type].test(hash) : false;
};
export const validateCertificateId = (id) => {
  if (!id) return false;
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id) && id.length >= 3 && id.length <= 50;
};
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};
export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};
export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters long`;
  }
  return null;
};
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : '';
};
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
export const createValidator = (rules) => {
  return (values) => {
    const errors = {};
    Object.keys(rules).forEach((fieldName) => {
      const fieldRules = rules[fieldName];
      const fieldValue = values[fieldName];
      fieldRules.forEach((rule) => {
        if (!errors[fieldName]) { // Only show first error per field
          const error = rule(fieldValue, fieldName);
          if (error) {
            errors[fieldName] = error;
          }
        }
      });
    });
    return errors;
  };
};
