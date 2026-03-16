import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
  bold: boolean;
  color?: string;
  size?: string;
}

export function LabelCardTitulo({ children, bold = false, color, size}: CustomLabelProps) {
  const [textColor, setTextColor] = useState<string>("");
  
 useEffect(() => {
   if (!color) {
    const savedColor = localStorage.getItem("headerColor");

    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setTextColor("text-blue-500 dark:text-blue-400");
    }
  }
  }, [color]);


   return (
    <Label
      className={`${bold ? "font-bold" : "font-medium"} ${
        color ? "" : textColor
      }`}
       style={{ color: color ?? undefined, fontSize: size  }}
    >
      {children}
    </Label>
  );

}
