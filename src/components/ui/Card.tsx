import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CardVariant = 'default' | 'interactive' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-grey-900 border border-grey-200 dark:border-grey-800 shadow-sm',
  interactive:
    'bg-white dark:bg-grey-900 border border-grey-200 dark:border-grey-800 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-premium',
  outlined:
    'bg-transparent border border-grey-300 dark:border-grey-700',
};

function Card({ variant = 'default', children, className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl p-6', variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-b border-border', className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold text-text-primary', className)} {...props}>
      {children}
    </h3>
  );
}

function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4 border-t border-border', className)} {...props}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter, type CardVariant };
