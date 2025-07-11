import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';

interface EnhancedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  hapticType?: 'light' | 'medium' | 'strong' | 'success' | 'error' | 'notification';
  animationType?: 'bounce' | 'scale' | 'pulse' | 'shake' | 'rotate';
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  hapticType = 'light',
  animationType = 'scale'
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center font-medium rounded-lg
    transition-all duration-200 ease-in-out transform-gpu
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-95 hover:shadow-lg
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700 text-white
      hover:from-primary-700 hover:to-primary-800
      focus:ring-primary-500 shadow-primary-500/25
      active:shadow-inner active:shadow-primary-800/30
    `,
    secondary: `
      bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-900
      hover:from-secondary-200 hover:to-secondary-300
      focus:ring-secondary-500 shadow-secondary-500/25
      active:shadow-inner active:shadow-secondary-300/50
    `,
    outline: `
      border-2 border-primary-600 text-primary-600 bg-transparent
      hover:bg-primary-50 hover:border-primary-700 hover:text-primary-700
      focus:ring-primary-500 shadow-primary-500/25
      active:bg-primary-100
    `,
    ghost: `
      text-gray-700 bg-transparent hover:bg-gray-100
      focus:ring-gray-500 shadow-gray-500/25
      active:bg-gray-200
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 text-white
      hover:from-red-700 hover:to-red-800
      focus:ring-red-500 shadow-red-500/25
      active:shadow-inner active:shadow-red-800/30
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 text-white
      hover:from-green-700 hover:to-green-800
      focus:ring-green-500 shadow-green-500/25
      active:shadow-inner active:shadow-green-800/30
    `
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const animationClasses = {
    bounce: 'hover:animate-bounce',
    scale: 'hover:scale-105 active:scale-95',
    pulse: 'hover:animate-pulse',
    shake: 'hover:animate-wiggle',
    rotate: 'hover:rotate-3'
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      // Trigger haptic feedback
      hapticFeedback[hapticType]();
      
      // Call the original onClick handler
      onClick();
    }
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${animationClasses[animationType]}
    ${className}
  `;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
      )}
      
      {children}
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />
      )}

      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-200 rounded-lg" />
      </span>
    </button>
  );
};

export default EnhancedButton;