import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
    children: React.ReactNode;
    bold?: boolean;
    color?: string;
}

export function LabelSideBarG({ children, bold = false, color }: CustomLabelProps) {
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
       className={`text-2xl ${bold ? "font-bold" : "font-medium"} ${
         color ? "" : textColor
       }`}
       style={color ? { color } : {}}
     >
       {children}
     </Label>
   );
 
}