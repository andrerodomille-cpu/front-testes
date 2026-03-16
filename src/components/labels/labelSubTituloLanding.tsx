import React from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelSubTituloLanding({ children }: CustomLabelProps) {
  return (
    <Label className={"text-xl font-medium text-gray-500 dark:text-gray-400"}>    
      {children}
    </Label>
  );
}