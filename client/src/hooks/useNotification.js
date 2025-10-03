import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { NOTIFICATION_TYPES } from '../constants';

export const useNotification = () => {
  const showNotification = useCallback((type, message, options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        toast.success(message, defaultOptions);
        break;
      case NOTIFICATION_TYPES.ERROR:
        toast.error(message, defaultOptions);
        break;
      case NOTIFICATION_TYPES.WARNING:
        toast.warning(message, defaultOptions);
        break;
      case NOTIFICATION_TYPES.INFO:
        toast.info(message, defaultOptions);
        break;
      default:
        toast(message, defaultOptions);
    }
  }, []);

  const showSuccess = useCallback((message, options) => {
    showNotification(NOTIFICATION_TYPES.SUCCESS, message, options);
  }, [showNotification]);

  const showError = useCallback((message, options) => {
    showNotification(NOTIFICATION_TYPES.ERROR, message, options);
  }, [showNotification]);

  const showWarning = useCallback((message, options) => {
    showNotification(NOTIFICATION_TYPES.WARNING, message, options);
  }, [showNotification]);

  const showInfo = useCallback((message, options) => {
    showNotification(NOTIFICATION_TYPES.INFO, message, options);
  }, [showNotification]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
