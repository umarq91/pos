import { DashboardLayout } from '@/components/dashboard-layout';
import Headings from '@/components/Headings';
import { ProductForm } from '@/components/product-form';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <>
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[80vh] w-full">
          <div className="w-full max-w-3xl ">
            <section className="space-y-4">
                <Headings/>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl"></div>
                <div className="relative bg-card/30 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl">
                  <ProductForm />
                </div>
              </div>
            </section>
          </div>
        </div>
      </DashboardLayout>
      <Toaster position="top-right" />
    </>
  );
}