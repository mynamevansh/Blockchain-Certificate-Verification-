import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4',
  };

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        {/* Center modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />&#8203;
        
        <div className={`
          inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden 
          shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 w-full
          ${sizeClasses[size]}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="mb-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
