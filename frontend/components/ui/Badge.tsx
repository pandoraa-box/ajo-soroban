import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full text-xs font-medium px-2.5 py-0.5',
  {
    variants: {
      variant: {
        open:     'bg-blue-50 text-blue-700',
        active:   'bg-ajo-green-light text-ajo-green',
        complete: 'bg-stone-100 text-stone-500',
        pending:  'bg-ajo-amber-light text-ajo-amber',
        default:  'bg-stone-100 text-stone-600',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    className?: string;
  };

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === 'active' && (
        <span className="h-1.5 w-1.5 rounded-full bg-ajo-green animate-pulse-slow" />
      )}
      {variant === 'open' && (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      )}
      {children}
    </span>
  );
}
