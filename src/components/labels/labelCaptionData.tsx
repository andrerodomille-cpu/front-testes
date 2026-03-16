
import { Label } from "@/components/ui/label";
import { formatarData } from "@/utils/dateUtils";

interface TextInputProps {
  label: string;
  value: string; 
}

export default function LabelCaptionData({
  label,
  value
}: TextInputProps) {
  return (
    <div>{label && <Label className="text-sm font-medium text-gray-400 dark:text-gray-400">{label}: </Label>} 
    <Label className="text-sm text-gray-600 dark:text-gray-300">{formatarData(value)}</Label></div>
  );
}