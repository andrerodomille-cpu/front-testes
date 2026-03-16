import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelMenuItem({ children }: CustomLabelProps) {
  return <Label className="text-xs font-medium text-gray-500 dark:text-gray-100">{children}</Label>;
}
