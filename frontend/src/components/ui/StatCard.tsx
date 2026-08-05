import { Card } from './Card';
interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colors = {
  blue: 'text-primary-600 bg-primary-50',
  green: 'text-accent-600 bg-accent-50',
  orange: 'text-warning-600 bg-warning-50',
  purple: 'text-purple-600 bg-purple-50',
};

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-heading font-bold text-surface-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}