import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import type { ReactNode } from 'react';

type Variant = 'lime' | 'dark' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const CONTAINER: Record<Variant, string> = {
  lime:      'bg-ajo-lime',
  dark:      'bg-ajo-dark',
  secondary: 'bg-white border border-ajo-border',
  ghost:     'bg-transparent',
};

const LABEL: Record<Variant, string> = {
  lime:      'text-white',
  dark:      'text-white',
  secondary: 'text-ajo-dark',
  ghost:     'text-ajo-muted',
};

const SIZES: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-4 py-2',   text: 'text-xs' },
  md: { container: 'px-5 py-3',   text: 'text-sm' },
  lg: { container: 'px-7 py-3.5', text: 'text-sm' },
};

interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = 'lime',
  size = 'md',
  loading,
  fullWidth,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const s = SIZES[size];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 rounded-full ${CONTAINER[variant]} ${s.container} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {loading && <ActivityIndicator size="small" color="#ffffff" />}
      <Text className={`font-bold ${s.text} ${LABEL[variant]}`}>{children}</Text>
    </TouchableOpacity>
  );
}
