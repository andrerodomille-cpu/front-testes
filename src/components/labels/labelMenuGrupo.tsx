import { Label } from "@/components/ui/label";

interface CustomLabelProps {
  children: React.ReactNode;
}

export function LabelMenuGrupo({ children }: CustomLabelProps) {
  return <Label className="ml-2 text-xs font-bold text-gray-500 dark:text-gray-100">{children}</Label>;
}
