export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:5000';

export const BLOCKCHAIN_CONFIG = {
  NETWORK_ID: process.env.REACT_APP_NETWORK_ID || '1337',
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  IPFS_GATEWAY: process.env.REACT_APP_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
};

export const APP_CONFIG = {
  NAME: 'CertVerify',
  DESCRIPTION: 'Tamper-Proof Certificate Verification System',
  VERSION: '1.0.0',
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  SUPPORTED_FILE_TYPES: ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx'],
};

export const CERTIFICATE_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  PENDING: 'pending',
  EXPIRED: 'expired',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const ROUTES = {
  HOME: '/',
  UPLOAD: '/upload',
  VERIFY: '/verify',
  REVOKE: '/revoke',
  DASHBOARD: '/dashboard',
};

export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  UNSUPPORTED_FILE_TYPE: 'File type not supported',
  NETWORK_ERROR: 'Network error. Please try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  CERTIFICATE_NOT_FOUND: 'Certificate not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
};

export const SUCCESS_MESSAGES = {
  CERTIFICATE_UPLOADED: 'Certificate uploaded successfully',
  CERTIFICATE_VERIFIED: 'Certificate verified successfully',
  CERTIFICATE_REVOKED: 'Certificate revoked successfully',
  WALLET_CONNECTED: 'Wallet connected successfully',
  WALLET_DISCONNECTED: 'Wallet disconnected successfully',
};

export const LOADING_MESSAGES = {
  CONNECTING_WALLET: 'Connecting wallet...',
  UPLOADING_CERTIFICATE: 'Uploading certificate...',
  VERIFYING_CERTIFICATE: 'Verifying certificate...',
  REVOKING_CERTIFICATE: 'Revoking certificate...',
  LOADING_DATA: 'Loading data...',
};

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
};

export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
};
