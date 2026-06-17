import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={cn("bg-card p-6 rounded-xl border border-border shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold text-foreground">{value}</h3>
        {trend && (
          <p className={cn("text-sm mt-2 flex items-center gap-1", trendUp ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400")}>
            <span className="font-medium">{trendUp ? '+' : '-'}{trend}</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </p>
        )}
      </div>
    </div>
  );
}
