import './StatCard.css';

interface StatCardProps {
  id: string;
  label: string;
  value: number;
  variant: 'total' | 'open' | 'in-progress' | 'closed';
}

export function StatCard({ id, label, value, variant }: StatCardProps) {
  return (
    <div id={id} data-testid={id} className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}
