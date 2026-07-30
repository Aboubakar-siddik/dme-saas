interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'info' | 'error';
}

const variants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  error: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}