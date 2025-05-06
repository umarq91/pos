import { DashboardHeader } from "@/components/dashboard-header";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Professional blue glow effect */}
      <div
        className="absolute -top-[40%] -right-[20%] w-[1000px] h-[1000px] opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, hsl(221, 83%, 53%) 0%, transparent 70%)",
          filter: "blur(64px)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <DashboardHeader />

        <main
          className={cn(
            "flex-1 flex items-center justify-center w-full px-4",
            className
          )}
        >
          {children}
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/20">
          <p>
            © {new Date().getFullYear()} Inventory Dashboard • All rights
            reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
