"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters",
  }),
  outOfStockReason: z.string().min(1, {
    message: "Please provide a reason",
  }),
  backInStockDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProductForm() {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<FormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: "",
      outOfStockReason: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from("products")
        .upsert([
          {
            sku: values.sku,
            out_of_stock: true, // Always out of stock now
            out_of_stock_reason: values.outOfStockReason,
            back_in_stock_date: values.backInStockDate || null,
          },
        ])
        .single();

      if (error) throw error;

      console.log(data);
      toast.success(t("successMessage"));
      reset();
      setDate(undefined);
    } catch (error) {
      toast.error(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    setSubmissionData(values);
    setIsConfirmOpen(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-8 space-y-8"
      >
        <FormField>
          <div className="space-y-3">
            <Label
              htmlFor="sku"
              className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              {t("skuLabel")}
            </Label>
            <Input
              id="sku"
              placeholder={t("skuPlaceholder")}
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
          <div className="space-y-3">
            <Label className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("stockStatusLabel")}
            </Label>
            <div className="flex items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {t("outOfStock")}
              </span>
            </div>
          </div>
        </FormField>

        <div className="space-y-8">
          <FormField>
            <div className="space-y-3">
              <Label
                htmlFor="outOfStockReason"
                className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                {t("reasonLabel")}
              </Label>
              <Textarea
                id="outOfStockReason"
                placeholder={t("reasonPlaceholder")}
                className="min-h-[100px] transition-all duration-300 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none bg-background/50 backdrop-blur-sm"
                {...register("outOfStockReason")}
              />
              {errors.outOfStockReason && (
                <p className="text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                  {errors.outOfStockReason.message}
                </p>
              )}
            </div>
          </FormField>

          <FormField>
            <div className="space-y-3">
              <Label className="text-base font-medium inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t("backInStockLabel")}
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
                    {date ? format(date, "PPP") : t("selectDate")}
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

        <Button
          type="submit"
          className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("saving") : t("submitButton")}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></div>
        </Button>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-lg border-border/50 bg-background/50 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("confirmationTitle")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t("reviewDetails")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("skuConfirmation")}
              </Label>
              <p className="text-sm">{submissionData?.sku}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">
                {t("reasonConfirmation")}
              </Label>
              <p className="text-sm">{submissionData?.outOfStockReason}</p>
            </div>

            {submissionData?.backInStockDate && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  {t("backInStockConfirmation")}
                </Label>
                <p className="text-sm">
                  {format(submissionData.backInStockDate, "PPP")}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="border-border/50 hover:border-primary/50"
            >
              {t("cancelButton")}
            </Button>
            <Button
              onClick={() => submissionData && onSubmit(submissionData)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("saving") : t("confirmButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}