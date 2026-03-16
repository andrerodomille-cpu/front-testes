import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
  bold?: boolean;
}

export function LabelSubTituloModal({ children, bold = false }: CustomLabelProps) {
  return (
    <Label
      className={`text-base ${bold ? "font-bold" : "font-medium"} text-orange-500 dark:text-orange-400`}>
      {children}
    </Label>
  );
}
