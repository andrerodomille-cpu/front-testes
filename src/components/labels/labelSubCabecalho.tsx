

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelSubCabecalho({ children }: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, []);

  return (
    <Label className={`text-md font-medium ${headerColor}`}>    
      {children}
    </Label>
  );
}