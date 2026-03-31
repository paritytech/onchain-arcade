import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'pink';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-grey-100 dark:bg-grey-800 text-grey-700 dark:text-grey-300',
  success:
    'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  error:
    'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  warning:
    'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  pink:
    'bg-pink-soft text-pink dark:text-pink',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-label',
  md: 'px-2.5 py-1 text-caption',
};

function Badge({ variant = 'default', size = 'sm', children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium font-sans rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize };
