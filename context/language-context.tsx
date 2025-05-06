// contexts/language-context.tsx
"use client";

import { createContext, useContext, useState } from "react";

type Language = "en" | "zh";
type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  productInventory: {
    en: "Product Inventory",
    zh: "产品库存",
  },
  manageInventory: {
    en: "Manage your product stock information and availability",
    zh: "管理您的产品库存信息和可用性",
  },
  skuLabel: {
    en: "SKU (Stock Keeping Unit)",
    zh: "SKU (库存单位)",
  },
  skuPlaceholder: {
    en: "Enter product SKU",
    zh: "输入产品SKU",
  },
  stockStatusLabel: {
    en: "Stock Status",
    zh: "库存状态",
  },
  outOfStock: {
    en: "Out of Stock",
    zh: "缺货",
  },
  reasonLabel: {
    en: "Out of Stock Reason",
    zh: "缺货原因",
  },
  reasonPlaceholder: {
    en: "Please provide a reason",
    zh: "请提供原因",
  },
  backInStockLabel: {
    en: "When will it be back in stock?",
    zh: "何时会重新有货？",
  },
  selectDate: {
    en: "Select a date",
    zh: "选择日期",
  },
  submitButton: {
    en: "Save Product Information",
    zh: "保存产品信息",
  },
  saving: {
    en: "Saving...",
    zh: "保存中...",
  },
  confirmationTitle: {
    en: "Confirm Submission",
    zh: "确认提交",
  },
  confirmButton: {
    en: "Confirm",
    zh: "确认",
  },
  cancelButton: {
    en: "Cancel",
    zh: "取消",
  },
  skuConfirmation: {
    en: "SKU",
    zh: "SKU",
  },
  reasonConfirmation: {
    en: "Reason",
    zh: "原因",
  },
  backInStockConfirmation: {
    en: "Back in Stock Date",
    zh: "重新有货日期",
  },
  successMessage: {
    en: "Product information saved successfully!",
    zh: "产品信息保存成功！",
  },
  errorMessage: {
    en: "Failed to save product information",
    zh: "保存产品信息失败",
  },
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
