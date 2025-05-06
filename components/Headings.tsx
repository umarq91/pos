"use client";
import { useLanguage } from "@/context/language-context";
import React from "react";

function Headings() {
  const { t } = useLanguage();
  return (
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {t("productInventory")}
      </h2>
      <p className="text-muted-foreground">{t("manageInventory")}</p>
    </div>
  );
}

export default Headings;
