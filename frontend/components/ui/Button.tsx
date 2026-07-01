import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-ajo-dark text-white hover:bg-ajo-dark/80 focus-visible:ring-ajo-dark',
        lime:      'bg-ajo-lime text-white hover:bg-ajo-lime-dark focus-visible:ring-ajo-lime',
        secondary: 'border border-ajo-border bg-white text-ajo-dark hover:bg-ajo-blue-light focus-visible:ring-ajo-border',
        ghost:     'text-ajo-muted hover:text-ajo-dark hover:bg-ajo-surface focus-visible:ring-ajo-border',
        green:     'bg-ajo-green text-white hover:bg-green-700 focus-visible:ring-ajo-green',
        outline:   'border-2 border-white/30 text-white hover:border-white hover:bg-white/10',
      },
      size: {
        sm:   'rounded-full px-4 py-2 text-xs',
        md:   'rounded-full px-6 py-3 text-sm',
        lg:   'rounded-full px-8 py-3.5 text-sm',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: { variant: 'lime', size: 'md' },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
