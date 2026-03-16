import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelFormTitulo({ children}: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");

    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, [headerColor]);

  return (
    
    <Label className={`text-xl font-medium ${headerColor}`}>    
      {children}
    </Label>
  );
}
