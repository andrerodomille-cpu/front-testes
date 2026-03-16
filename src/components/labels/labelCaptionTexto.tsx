import { Label } from "@/components/ui/label";

interface TextInputProps {
  label: string;
  value: string; 
}

export default function LabelCaptionTexto({
  label,
  value
}: TextInputProps) {
  return (
    <div>{label && <Label className="text-sm font-medium text-gray-400 dark:text-gray-400">{label}: </Label>} 
    <Label className="text-sm text-gray-600 dark:text-gray-300">{value}</Label>
    </div>
  );
}