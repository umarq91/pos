"use client"
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters",
  }),
  outOfStock: z.boolean().default(false),
  outOfStockReason: z.string().optional(),
  backInStockDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [outOfStock, setOutOfStock] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      outOfStock: false,
      outOfStockReason: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .upsert([
          {
            sku: values.sku,
            out_of_stock: values.outOfStock,
            out_of_stock_reason: values.outOfStockReason,
            back_in_stock_date: values.backInStockDate || null,
          },
        ])
        .single();

      if (error) throw error;

      console.log(data);
      toast.success("Product information saved successfully!");
      reset();
      setDate(undefined);
      setOutOfStock(false);
    } catch (error) {
      toast.error("Failed to save product information");
    }
  };

  const toggleOutOfStock = () => {
    const newValue = !outOfStock;
    setOutOfStock(newValue);
    setValue("outOfStock", newValue);
    if (!newValue) {
      setValue("outOfStockReason", "");
      setValue("backInStockDate", undefined);
      setDate(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
      <FormField>
        <div className="space-y-3">
          <Label
            htmlFor="sku"
            className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            SKU (Stock Keeping Unit)
          </Label>
          <Input
            id="sku"
            placeholder="Enter product SKU"
            className="transition-all duration-300 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 bg-background/50 backdrop-blur-sm"
            {...register("sku")}
          />
          {errors.sku && (
            <p className="text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
              {errors.sku.message}
            </p>
          )}
        </div>
      </FormField>

      <FormField>
        <div className="flex space-x-4 space-y-2 flex-col">
          <Label className="text-base ml-2 font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Stock Status
          </Label>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">In Stock</span>
            <button
              type="button"
              onClick={toggleOutOfStock}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                outOfStock ? "bg-destructive/20" : "bg-primary/20"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition-all duration-200",
                  "border border-border/50",
                  outOfStock 
                    ? "translate-x-5 bg-destructive border-destructive/50" 
                    : "translate-x-0 bg-primary border-primary/50"
                )}
              />
            </button>
            <span className="ml-2 text-sm font-medium">Out of Stock</span>
          </div>
        </div>
      </FormField>

      {outOfStock && (
        <div className="space-y-8 animate-in slide-in-from-top-2 duration-300">
          <FormField>
            <div className="space-y-3">
              <Label
                htmlFor="outOfStockReason"
                className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                Out of Stock Reason
              </Label>
              <Textarea
                id="outOfStockReason"
                placeholder="Please provide a reason"
                className="min-h-[100px] transition-all duration-300 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none bg-background/50 backdrop-blur-sm"
                {...register("outOfStockReason")}
              />
            </div>
          </FormField>

          <FormField>
            <div className="space-y-3">
              <Label className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                When will it be back in stock?
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-border/50 bg-background/50 backdrop-blur-sm",
                      "hover:bg-primary/5 hover:border-primary/50 transition-all duration-300",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      setValue("backInStockDate", newDate || undefined);
                    }}
                    initialFocus
                    className="rounded-lg border border-border/50 shadow-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </FormField>
        </div>
      )}

      <Button
        type="submit"
        className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Product Information"}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></div>
      </Button>
    </form>
  );
}