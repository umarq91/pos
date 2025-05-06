'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div 
      className={cn(
        "relative p-6 overflow-hidden rounded-xl bg-card shadow-md transition-all duration-300 hover:shadow-lg border border-border/50",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-transparent before:to-primary/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        className
      )}
    >
      {children}
    </div>
  );
}