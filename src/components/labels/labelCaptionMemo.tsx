
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";

interface TextInputProps {
  label: string;
  value: string; 
}

export default function LabelCaptionMemo({
  label,
  value
}: TextInputProps) {
  return (
    <div>
      {label && <Label className=" block text-sm font-medium text-gray-400 dark:text-gray-400">{label}</Label>}
      <Label className="mb-5 w-full text-sm text-gray-600 dark:text-gray-300">        
        {value}
      </Label>      
    </div>
  );
}