import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'accent' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm',
  warning: 'bg-warning-500 text-surface-900 hover:bg-warning-600 shadow-sm',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-sm',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  ghost: 'text-surface-600 hover:bg-surface-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export function Button({ children, variant = 'primary', size = 'md', disabled, type = 'button', onClick, className = '' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed 
        ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}