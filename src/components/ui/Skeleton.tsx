import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse-fast rounded-xl bg-muted/60 dark:bg-muted/30 clay-input border-none shadow-none",
        className
      )}
      {...props}
    />
  );
}
