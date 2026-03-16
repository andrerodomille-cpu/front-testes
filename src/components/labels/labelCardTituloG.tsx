import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ColorHex } from "@/utils/colorUtils";

interface CustomLabelProps {
  children: React.ReactNode;
  bold: boolean;
  color?: string;
}

export function LabelCardTituloG({ children, bold = false, color }: CustomLabelProps) {
  const [textColor, setTextColor] = useState<string>("#fff");
  
 useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setTextColor(colorWithoutBg);
    }

  }, []);

   return (
    <Label
      className={`text-3xl ${bold ? "font-bold" : "font-medium"} ${
        color ? "" : textColor
      }`}
      style={color ? { color } : {}}
    >
      {children}
    </Label>
  );

}
