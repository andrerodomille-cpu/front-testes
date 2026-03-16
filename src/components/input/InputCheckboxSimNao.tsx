import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

type CheckboxFieldProps = {
  id: string;
  value: 0 | 1;               
  textoCheckbox: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  obrigatorio?: boolean;
  disabled?: boolean;
  onChange: (id: string, newValue: 0 | 1) => void;
};

export const InputCheckboxSimNao: React.FC<CheckboxFieldProps> = ({
  id,
  value,
  textoCheckbox,
  colSpan = 1,
  obrigatorio = false,
  disabled = false,
  onChange,
}) => {
  const [error, setError] = useState(false);
  const colSpanClass = `ml-1 col-span-${colSpan}`;

  const isChecked = value === 1;

  const handleChange = (checked: boolean) => {
    const newValue = checked ? 1 : 0;
    if (obrigatorio) {
      setError(newValue === 0);
    }
    onChange(id, newValue);
  };

  return (
    <div key={id} className={colSpanClass}>
      <div className="relative flex items-center h-6 gap-2 mt-1">
        <label htmlFor={id} className="flex items-center gap-2 cursor-pointer !text-xs">
          <Checkbox
            id={id}
            checked={isChecked}
            disabled={disabled}
            onCheckedChange={(checked: boolean) => handleChange(checked)}
            className={`border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} bg-gray-300 dark:bg-gray-600 dark:text-white rounded 
            focus:outline-none focus:border-gray-500`}
          />
          <Label
            htmlFor={id}
            className="text-xs text-gray-600 dark:text-gray-200">{textoCheckbox} {obrigatorio && <span className="text-red-500">*</span>}
          </Label>

          
        </label>
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
