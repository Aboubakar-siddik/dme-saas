import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal';
}

export function Card({ children, className = '', padding = 'normal' }: CardProps) {
  const paddings = {
    none: 'p-0',
    small: 'p-4',
    normal: 'p-6',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
}