import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelMenuCabecalho({ children }: CustomLabelProps) {
  return <Label className="text-sm font-medium text-gray-700 dark:text-gray-100">{children}</Label>;
}
