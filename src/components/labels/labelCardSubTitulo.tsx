import { Label } from "@/components/ui/label";
import { ColorHex } from "@/utils/colorUtils";

interface CustomLabelProps {
  children: React.ReactNode;
  bold: boolean;
  color?: string;
  size?: string;
}

export function LabelCardSubTitulo({ children, bold = false, color,size }: CustomLabelProps) {
  const textColor = color ? ColorHex(color) : "";

  return color ? (
    <Label className={`${bold ? "font-bold" : "font-medium"}`} style={{ color: color ?? undefined, fontSize: size  }}>
      {children}
    </Label>
  ) : (
    <Label className = {`${bold ? "font-bold" : "font-medium"} text-gray-600 dark:text-gray-400`}
    style={{ fontSize: size  }}>
      {children}
    </Label>
  );
}
