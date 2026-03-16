import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
  bold?: boolean;
  color?: string;
  size?: string;
}

export function LabelCabecalho({ children, bold = false, color, size}: CustomLabelProps) {
   const [textColor, setTextColor] = useState<string>("");
    
   useEffect(() => {
      const savedColor = localStorage.getItem("headerColor");
      if (savedColor) {
        const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
        setTextColor(colorWithoutBg);
      }
    }, []);
  
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