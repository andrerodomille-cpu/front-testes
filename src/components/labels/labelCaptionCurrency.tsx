
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatUtils";

interface TextInputProps {
  label: string;
  value: number; 
}

export default function LabelCaptionCurrency({
  label,
  value
}: TextInputProps) {
  return (
    <div>{label && <Label className="text-sm font-medium text-gray-400 dark:text-gray-400">{label}: </Label>} 
    <Label className="text-sm text-gray-600 dark:text-gray-300">{formatCurrency(value)}</Label></div>

  );
}