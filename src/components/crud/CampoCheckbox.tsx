import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditableFieldProps = {
  id: string;
  valor: string | number;
  caption: string;
  obrigatorio?: boolean;
  somenteLeitura?: boolean;
  onChange: (id: string, newValue: number) => void;
};

export const CampoCheckbox: React.FC<EditableFieldProps> = ({
  id,
  valor,
  caption,
  obrigatorio = false,
  somenteLeitura = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(valor === 1);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (valor === 1 && !checked) setChecked(true);
    if (valor === 0 && checked) setChecked(false);
  }, [valor]);

  const handleChange = (val: boolean) => {
    if (somenteLeitura) return;

    setChecked(val);
    if (obrigatorio) setError(!val);
    onChange(id, val ? 1 : 0);
  };

  return (
    <div>
      <div className="mt-3 flex items-center gap-2 mt-1">
        <Checkbox
          id={id}
          checked={checked}
          disabled={somenteLeitura}
          className={`
    border 
    ${checked ? "bg-gray-200 dark:bg-gray-500 border-gray-400" : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-700"}
    data-[state=checked]:bg-gray-200
    data-[state=checked]:border-gray-400
    data-[state=checked]:text-gray-900
    dark:data-[state=checked]:bg-gray-500
    dark:data-[state=checked]:text-white
    rounded 
    transition-colors
  `}
          onCheckedChange={(val) => handleChange(Boolean(val))}
        />
        <Label htmlFor={id} className="text-xs text-gray-700 dark:text-gray-200">
          {caption} {obrigatorio && <span className="text-red-500">*</span>}
        </Label>
      </div>
      {error && (
        <div className="flex items-center gap-1 dark:text-red-300 text-red-600 text-[12px] mt-1 ml-1">
          <AlertCircle size={12} className="min-w-[12px]" />
          <span>Este campo é obrigatório.</span>
        </div>
      )}
    </div>
  );
};
