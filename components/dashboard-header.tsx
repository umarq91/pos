'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Boxes, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

export function DashboardHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between w-full px-4 py-3 transition-all duration-300 backdrop-blur-md',
        scrolled 
          ? 'bg-background/80 shadow-sm border-b border-border/50'
          : 'bg-transparent'
      )}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Boxes className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Package className="w-4 h-4" />
          {/* <span>Products: 128</span> */}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}