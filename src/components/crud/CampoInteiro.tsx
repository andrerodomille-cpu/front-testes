import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatInteger } from "@/utils/formatUtils";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditableFieldProps = {
    id: string;
    valor: number;
    caption: string;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    obrigatorio?: boolean;
    somenteLeitura?: boolean;
    destacado?: boolean;
    onChange: (id: string, newValue: string) => void;
};

export const CampoInteiro: React.FC<EditableFieldProps> = ({
    id,
    valor,
    caption,
    onChange,
    destacado = false,
    somenteLeitura = false,
    obrigatorio = false,
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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isEmpty = newValue.trim() === "";

        if (obrigatorio) {
            setError(isEmpty);
        }

        onChange(id, newValue);
    };
    return (
        <div className="mt-1 mr-1" key={id}>
            <Label
                htmlFor={id}
                className="text-xs text-gray-600 dark:text-gray-200"
            >
                {caption} {obrigatorio && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative h-7">
                <Input
                    readOnly={somenteLeitura}
                    id={id}
                    value={ formatInteger(valor)}
                    className={`
                        !text-xs py-1 border
                        ${baseBorder}
                        ${baseBg}
                        ${baseHover}
                        ${baseFocus}
                        ${baseText}
                        ${baseFont}
                        rounded-t rounded-b h-7
                        focus:outline-none
                    `}
                    onChange={(e) => {
                        const newValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                        );
                        e.target.value = newValue;
                        handleChange(e)
                    }}

                    onBlur={(e) => {
                        const numericValue = parseFloat(
                            e.target.value.replace(/[^0-9]/g, "")
                        );
                        const formattedValue =
                            formatInteger(numericValue);
                        e.target.value = formattedValue;
                    }}
                    onFocus={(e) => {
                        const rawValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                        );
                        e.target.value = rawValue;
                    }}
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
