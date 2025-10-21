import React from 'react';
import { Loader2 } from 'lucide-react';
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;
  const variantClasses = {
    primary: `
      bg-primary-600 text-white hover:bg-primary-700 
      focus:ring-primary-500 shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-200 text-gray-800 hover:bg-gray-300 
      focus:ring-gray-500 border border-gray-300
    `,
    success: `
      bg-success-600 text-white hover:bg-success-700 
      focus:ring-success-500 shadow-sm hover:shadow-md
    `,
    danger: `
      bg-error-600 text-white hover:bg-error-700 
      focus:ring-error-500 shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent border-2 border-primary-600 text-primary-600 
      hover:bg-primary-50 focus:ring-primary-500
    `,
    ghost: `
      bg-transparent text-gray-600 hover:bg-gray-100 
      focus:ring-gray-500
    `,
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();
  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!isLoading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};
export default Button;
