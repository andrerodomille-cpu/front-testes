import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  id: string;
  value: string;
  label: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  obrigatorio?: boolean;
  disabled?: boolean;
  onChange: (id: string, newValue: string) => void;
};

export const InputSelectSimNao: React.FC<SelectFieldProps> = ({
  id,
  value,
  label,
  colSpan = 1,
  obrigatorio = false,
  disabled=false,
  onChange,
}) => {
  const [error, setError] = useState(false);
  const colSpanClass = `ml-1 col-span-${colSpan}`;

  const handleChange = (newValue: string) => {
    if (obrigatorio) {
      setError(newValue.trim() === "");
    }

    onChange(id, newValue);
  };

  return (
    <div key={id} className={colSpanClass}>
      <Label
        htmlFor={id}
        className="text-xs text-gray-600 dark:text-gray-200"
      >
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative h-8">
        <Select disabled ={disabled} value={value} onValueChange={handleChange}>
          <SelectTrigger
            className={`h-7 text-sm py-1 border ${
                    error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } bg-gray-100 dark:bg-gray-600 dark:text-white rounded-t rounded-b 
                focus:outline-none focus:border-gray-500`}>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Sim</SelectItem>
            <SelectItem value="0">Não</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error && obrigatorio && (
        <div className="flex items-center gap-1 text-red-500 text-[10px] mt-1">
          <AlertCircle size={12} className="min-w-[12px]" />
          <span>Este campo é obrigatório.</span>
        </div>
      )}
    </div>
  );
};
