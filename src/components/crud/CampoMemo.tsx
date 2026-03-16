import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type CampoTextoMultilinhaProps = {
  id: string;
  valor: string;
  caption: string;
  obrigatorio?: boolean;
  somenteLeitura?: boolean;
  destacado?: boolean;
  onChange: (id: string, newValue: string) => void;
  onError?: (id: string, erro: boolean) => void;
  linhas?: number; // quantidade de linhas visíveis
};

export const CampoMemo: React.FC<CampoTextoMultilinhaProps> = ({
  id,
  valor,
  caption,
  obrigatorio = false,
  somenteLeitura = false,
  destacado = false,
  onChange,
  onError,
  linhas = 4,
}) => {
  const [error, setError] = useState(false);

  const baseFont = destacado ? "font-semibold" : "font-normal";

  const baseText = error
    ? "text-red-600 dark:text-red-400"
    : destacado
      ? "text-blue-700 dark:text-blue-300"
      : "text-gray-900 dark:text-white";
  const baseBorder = error
    ? "border-red-500"
    : destacado
      ? "border-blue-400 dark:border-blue-500"
      : "border-gray-300 dark:border-gray-700";

  const baseBg = destacado
    ? "bg-blue-50 dark:bg-blue-900/20"
    : "bg-gray-50 dark:bg-gray-900";

  const baseHover = destacado
    ? "hover:bg-blue-100 dark:hover:bg-blue-900/30"
    : "hover:bg-gray-100 dark:hover:bg-gray-700";

  const baseFocus = destacado
    ? "focus:border-blue-500"
    : "focus:border-gray-500";


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const isEmpty = newValue.trim() === "";

    if (obrigatorio) {
      const newErrorState = isEmpty;
      setError(newErrorState);
      onError?.(id, newErrorState);
    }

    onChange(id, newValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (obrigatorio) {
      const newErrorState = e.target.value.trim() === "";
      setError(newErrorState);
      onError?.(id, newErrorState);
    }
  };

  return (
    <div className="mt-1 mr-1" key={id}>
      <Label
        htmlFor={id}
        className="text-xs text-gray-600 dark:text-gray-200"
      >
        {caption} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>

      <textarea
        id={id}
        value={valor}
        readOnly={somenteLeitura}
        rows={linhas}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full text-xs p-2 border rounded 
        ${baseBorder}
                        ${baseBg}
                        ${baseHover}
                        ${baseFocus}
                        ${baseText}
                        ${baseFont}
          `}
      />

      {error && obrigatorio && (
        <div className="flex items-center gap-1 dark:text-red-300 text-red-600 text-[12px] mt-1">
          <AlertCircle size={12} className="min-w-[12px]" />
          <span>Campo obrigatório.</span>
        </div>
      )}
    </div>
  );
};
