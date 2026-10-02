import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DetailCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
}

export const DetailCard: React.FC<DetailCardProps> = React.memo(({
  icon: Icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="detail-metric-card glass-card">
      <div className="detail-card-head">
        <Icon size={16} style={{ color: 'var(--color-indigo-light)' }} />
        <span>{title}</span>
      </div>
      <div className="detail-card-val tabular-nums">{value}</div>
      {subtitle && <div className="detail-card-sub">{subtitle}</div>}
    </div>
  );
});
