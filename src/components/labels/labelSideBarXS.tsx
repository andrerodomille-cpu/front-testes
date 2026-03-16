import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelSideBarXS({ children }: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, []);

  return (
    <Label className={`text-xs font-medium  text-gray-700 dark:text-gray-300`}>    
      {children}
    </Label>
  );
}