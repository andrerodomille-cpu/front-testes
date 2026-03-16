import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditableFieldProps = {
    id: string;
    valor: string | number;
    caption: string;
    type?: string;
    obrigatorio?: boolean;
    somenteLeitura?: boolean;
    ocultarPorPadrao?: boolean;
    destacado?: boolean;
    onChange: (id: string, newValue: string) => void;
    onError?: (id: string, erro: boolean) => void;
};

export const CampoOcultavel: React.FC<EditableFieldProps> = ({
    id,
    valor,
    caption,
    type = "text",
    obrigatorio = false,
    somenteLeitura = false,
    ocultarPorPadrao = false,
    destacado = false,
    onChange,
    onError,
}) => {
    const [error, setError] = useState(false);
    const [oculto, setOculto] = useState(ocultarPorPadrao);
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
            const newErrorState = isEmpty;
            setError(newErrorState);
            onError && onError(id, newErrorState);
        }

        onChange(id, newValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (obrigatorio) {
            const newErrorState = e.target.value.trim() === "";
            setError(newErrorState);
            onError && onError(id, newErrorState);
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

            <div className="relative h-7">
                <Input
                    type={oculto ? "password" : type}
                    onBlur={handleBlur}
                    readOnly={somenteLeitura}
                    id={id}
                    value={String(valor)}
                    autoComplete="off"
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
                    onChange={handleChange}
                />

                {/* Botão Ocultar/Mostrar */}
                {!somenteLeitura && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        onClick={() => setOculto((prev) => !prev)}
                        tabIndex={-1}
                    >
                        {oculto ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                )}
            </div>

            {error && obrigatorio && (
                <div className="flex items-center gap-1 dark:text-red-300 text-red-600 text-[12px] mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Campo obrigatório.</span>
                </div>
            )}
        </div>
    );
};
