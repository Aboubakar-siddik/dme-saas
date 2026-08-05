import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal';
}

export function Card({ children, className = '', padding = 'normal' }: CardProps) {
  const paddings = { none: 'p-0', small: 'p-4', normal: 'p-6' };
  return (
    <div className={`bg-surface-50 rounded-xl shadow-sm border border-surface-200 
      hover:shadow-md transition-all duration-200 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}