import React from "react";
import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelTituloLanding({ children }: CustomLabelProps) {
  return (
    <Label className={"text-4xl font-medium text-gray-600 dark:text-gray-200"}>    
      {children}
    </Label>
  );
}
