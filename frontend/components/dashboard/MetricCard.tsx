import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: string;
  accent?: 'green' | 'amber' | 'default';
  className?: string;
  children?: ReactNode;
}

export function MetricCard({
  label,
  value,
  subtext,
  icon,
  accent = 'default',
  className,
  children,
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        accent === 'green' && 'border-ajo-green-muted bg-ajo-green-light',
        accent === 'amber' && 'border-ajo-amber-light bg-ajo-amber-light',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'mb-1 text-sm font-medium',
              accent === 'green' ? 'text-ajo-green' : 'text-ajo-muted',
              accent === 'amber' && 'text-ajo-amber',
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'text-3xl font-extrabold tracking-tight',
              accent === 'green' ? 'text-ajo-green' : 'text-ajo-dark',
              accent === 'amber' && 'text-ajo-amber',
            )}
          >
            {value}
          </p>
          {subtext && (
            <p className="mt-1 text-xs text-ajo-muted">{subtext}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 text-xl">
            {icon}
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}
