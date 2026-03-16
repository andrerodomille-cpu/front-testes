import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelLabel({ children }: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, []);

  return (
   <Label className="text-xs text-gray-600 dark:text-gray-200">
      {children}
    </Label>
  );
}