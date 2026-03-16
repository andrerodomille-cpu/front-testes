import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
  bold?: boolean;
}

export function LabelSubTitulo({ children, bold = false }: CustomLabelProps) {
  return (
    <Label
      className={`text-sm ${bold ? "font-bold" : "font-medium"} text-orange-500 dark:text-orange-400`}>
      {children}
    </Label>
  );
}
