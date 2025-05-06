// components/language-switcher.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className={cn(
          "transition-all duration-200",
          language === "en" && "bg-primary text-primary-foreground"
        )}
      >
        EN
      </Button>
      <Button
        variant={language === "zh" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("zh")}
        className={cn(
          "transition-all duration-200",
          language === "zh" && "bg-primary text-primary-foreground"
        )}
      >
        中文
      </Button>
    </div>
  );
}