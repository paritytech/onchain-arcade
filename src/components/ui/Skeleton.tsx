import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-grey-200 dark:bg-grey-800',
        'bg-[length:200%_100%] bg-gradient-to-r',
        'from-grey-200 via-grey-100 to-grey-200',
        'dark:from-grey-800 dark:via-grey-700 dark:to-grey-800',
        'animate-shimmer',
        className
      )}
      aria-hidden="true"
    />
  );
}
