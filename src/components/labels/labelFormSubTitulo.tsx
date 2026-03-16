import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelFormSubTitulo({ children}: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");

    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, [headerColor]);

  return (
    
    <Label className="text-base font-medium text-gray-400">
      {children}
    </Label>
  );
}
