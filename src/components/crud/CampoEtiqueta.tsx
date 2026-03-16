import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDecimal, formatInteger } from "@/utils/formatUtils";
import { formatarData } from "@/utils/dateUtils";

type EditableFieldProps = {
  id: string;
  value: string | number;
  label: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  tipo?: "data" | "decimal" | "hora" | "inteiro" | "monetario" | "caracter";
};

// Função para formatar os valores com base no tipo
const formatValue = (value: string | number, tipo?: EditableFieldProps["tipo"]) => {
  if (value === null || value === undefined) return "";

  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  switch (tipo) {

    case "data":
      return formatarData(String(value));
    case "hora":
      return typeof value === "string" ? value.slice(0, 5) : String(value);
    case "decimal": 
      return formatDecimal(numericValue); 
    case "inteiro":
      return formatInteger(numericValue); 
    case "monetario":
      return formatCurrency(numericValue);
    case "caracter":
    default:
      return String(value);
  }
};

export const CampoEtiqueta: React.FC<EditableFieldProps> = ({
  id,
  value,
  label,
  colSpan = 1,
  tipo
}) => {
  const colSpanClass = `ml-1 col-span-${colSpan}`;
  const formattedValue = formatValue(value, tipo);

  return (
    <div key={id} className={colSpanClass}>
      <Label htmlFor={id} className="!text-xs text-gray-600 dark:text-gray-200">
        {label}
      </Label>
      <div className="relative h-5">
        <Input
          id={id}
          readOnly
          defaultValue={formattedValue}
          className="!text-xs py-1 border-none bg-gray-100 dark:bg-gray-600 dark:text-white rounded-t rounded-b h-7"
        />
      </div>
    </div>
  );
};
