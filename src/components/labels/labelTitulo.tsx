import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
   bold?: boolean;
}

export function LabelTitulo({ children, bold = true }: CustomLabelProps) {
  const [headerColor, setHeaderColor] = useState<string>("");

  useEffect(() => {
      setHeaderColor("text-blue-500 dark:text-blue-500");
  }, [headerColor]);

  return (
    
    <Label className={`text-xl ${bold ? "font-bold" : "font-medium"}  ${headerColor}`}>    
      {children}
    </Label>
  );
}
