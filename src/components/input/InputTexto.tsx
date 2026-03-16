import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { AlertCircle } from "lucide-react";

type EditableFieldProps = {
  id: string;
  value: string | number;
  label: string;
  height?: 16 | 24 | 32 | 40 | 48 | 56 | 64;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  obrigatorio?: boolean;
  readOnly?: boolean;
  onChange: (id: string, newValue: string) => void;
};

export const InputTexto: React.FC<EditableFieldProps> = ({
  id,
  value,
  label,
  colSpan = 1,
  height,
  onChange,
  readOnly = false,
  obrigatorio = false
}) => {
  const colSpanClass = `ml-1 col-span-${colSpan}`;
  const heightClass = `h-${height}`;
  const textAreaClass = `relative h-${height}`;
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const isEmpty = newValue.trim() === "";

    if (obrigatorio) {
      setError(isEmpty);
    }

    onChange(id, newValue);
  };

  return (
    <div key={id} className={`${colSpanClass} ${heightClass}`}>
      <Label
        htmlFor={id}
        className="text-xs text-gray-600 dark:text-gray-200">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      <div className={`${textAreaClass}`}>
        <Textarea
          readOnly={readOnly}
          id={id}
          value={value ?? ""}
          placeholder="Digite aqui..."
          className={`!text-xs py-1 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
          } bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-t rounded-b h-7 
          focus:outline-none focus:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500`}
          onChange={handleChange}
        />
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
