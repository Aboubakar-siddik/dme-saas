interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'info' | 'error';
}

const variants = {
  success: 'bg-accent-50 text-accent-700 border-accent-200',
  warning: 'bg-warning-50 text-warning-700 border-warning-200',
  info: 'bg-primary-50 text-primary-700 border-primary-200',
  error: 'bg-danger-50 text-danger-700 border-danger-200',
};

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}