import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { ColorHex } from "@/utils/colorUtils";

interface CustomLabelProps {
  children: React.ReactNode;
  bold: boolean;
  color?: string;
}

export function LabelTituloModal({ children, bold = false, color }: CustomLabelProps) {
  const [textColor, setTextColor] = useState<string>("#fff");

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
      className={`text-xl ${bold ? "font-bold" : "font-medium"} ${color ? "" : textColor
        }`}
      style={color ? { color } : {}}
    >
      {children}
    </Label>
  );

}
