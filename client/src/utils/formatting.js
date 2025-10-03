// Date formatting utilities
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  return formatDate(date);
};

// Address formatting
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

// Hash formatting
export const formatHash = (hash, length = 8) => {
  if (!hash) return '';
  if (hash.length <= length * 2) return hash;
  
  return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return 'N/A';
  
  return new Intl.NumberFormat(undefined, options).format(number);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return formatNumber(amount, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatPercentage = (value, decimals = 1) => {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Text formatting
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Status formatting
export const formatStatus = (status) => {
  if (!status) return '';
  
  return status
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

// URL formatting
export const formatUrl = (url) => {
  if (!url) return '';
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
};

// Certificate ID formatting for display
export const formatCertificateId = (id) => {
  if (!id) return '';
  
  // Format as CERT-XXXX-XXXX pattern for better readability
  if (id.length >= 8) {
    return `CERT-${id.substring(0, 4)}-${id.substring(4, 8)}${id.length > 8 ? '...' : ''}`;
  }
  
  return `CERT-${id}`;
};
