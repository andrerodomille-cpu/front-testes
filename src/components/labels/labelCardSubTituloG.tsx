import { Label } from "@/components/ui/label";
import { ColorHex } from "@/utils/colorUtils";

interface CustomLabelProps {
  children: React.ReactNode;
  bold: boolean;
  color?: string;
}

export function LabelCardSubTituloG({ children, bold = false, color }: CustomLabelProps) {
  const textColor = color ? ColorHex(color) : "";

  return color ? (
    <Label className={`text-2xl ${bold ? "font-bold" : "font-medium"}`} style={{ color: textColor }}>
      {children}
    </Label>
  ) : (
    <Label className = {`text-2xl  ${bold ? "font-bold" : "font-medium"} text-gray-700 dark:text-gray-400`}>
      {children}
    </Label>
  );
}
