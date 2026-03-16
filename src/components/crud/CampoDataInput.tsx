import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type CampoDataInputProps = {
    id: string;
    valor: string; 
    caption: string;
    obrigatorio?: boolean;
    somenteLeitura?: boolean;
    destacado?:boolean;
    registerRequiredField?: (id: string) => void;
    onChange: (id: string, newValue: string) => void;
    onError?: (id: string, erro: boolean) => void;
};

export const CampoDataInput: React.FC<CampoDataInputProps> = ({
    id,
    valor,
    caption,
    onChange,
    obrigatorio = false,
    somenteLeitura = false,
    destacado=false,
    registerRequiredField,
    onError
}) => {
    const [displayValue, setDisplayValue] = useState("");
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

    const [isValidDate, setIsValidDate] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const formatDateForDisplay = (dateStr: string): string => {
        if (!dateStr || dateStr.trim() === "") return "";

        // Se já estiver no formato ISO (yyyy-MM-dd)
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`;
        }

        return dateStr;
    };
    const parseDisplayToISO = (display: string): string => {
        if (!display || display.trim() === "") return "";

        // Remove tudo que não é número
        const numbers = display.replace(/\D/g, "");

        // Se não tiver 8 números, retorna string vazia
        if (numbers.length !== 8) return "";

        const day = numbers.substring(0, 2);
        const month = numbers.substring(2, 4);
        const year = numbers.substring(4, 8);

        return `${year}-${month}-${day}`;
    };

    const isValidDateString = (dateStr: string): boolean => {
        if (!dateStr || dateStr.trim() === "") return true;

        const isoDate = parseDisplayToISO(dateStr);
        if (isoDate === "") return false;

        const [year, month, day] = isoDate.split("-").map(Number);
        const date = new Date(year, month - 1, day);

        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day &&
            year >= 1900 &&
            year <= 2100
        );
    };

    const applyDateMask = (value: string): string => {
        // Remove tudo que não é número
        let numbers = value.replace(/\D/g, "");

        // Limita a 8 caracteres (ddmmyyyy)
        if (numbers.length > 8) {
            numbers = numbers.substring(0, 8);
        }

        // Aplica a máscara
        let masked = numbers;

        if (numbers.length > 2) {
            masked = `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
            if (numbers.length > 4) {
                masked += `/${numbers.substring(4)}`;
            }
        }

        return masked;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const maskedValue = applyDateMask(rawValue);

        setDisplayValue(maskedValue);

        // Validação da data
        const valid = isValidDateString(maskedValue);
        setIsValidDate(valid);

        // Se for uma data válida e completa, converte para ISO
        if (valid && maskedValue.replace(/\D/g, "").length === 8) {
            const isoDate = parseDisplayToISO(maskedValue);
            onChange(id, isoDate);

            // Validação de obrigatoriedade
            if (obrigatorio) {
                const newErrorState = maskedValue.trim() === "";
                setError(newErrorState);
                if (onError) onError(id, newErrorState);
            }
        } else if (maskedValue.trim() === "") {
            // Se estiver vazio, envia string vazia
            onChange(id, "");

            if (obrigatorio) {
                setError(true);
                if (onError) onError(id, true);
            }
        } else {
            // Data incompleta ou inválida, não envia
            setError(false);
            if (onError) onError(id, false);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const currentValue = e.target.value;

        // Completa com zeros se necessário
        if (currentValue && currentValue.replace(/\D/g, "").length < 8) {
            const numbers = currentValue.replace(/\D/g, "").padEnd(8, "0");
            const masked = applyDateMask(numbers);
            setDisplayValue(masked);

            const valid = isValidDateString(masked);
            setIsValidDate(valid);

            if (valid) {
                const isoDate = parseDisplayToISO(masked);
                onChange(id, isoDate);
            }
        }

        // Validação de obrigatoriedade
        if (obrigatorio) {
            const newErrorState = currentValue.trim() === "";
            setError(newErrorState);
            if (onError) onError(id, newErrorState);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permite navegação com setas, tab, delete, backspace, etc.
        if (["ArrowLeft", "ArrowRight", "Tab", "Delete", "Backspace"].includes(e.key)) {
            return;
        }

        // Permite apenas números
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (obrigatorio) {
            registerRequiredField?.(id);
        }
    }, [obrigatorio, id]);

    useEffect(() => {
        if (!onError) return;

        const invalido =
            valor === null ||
            valor === undefined ||
            valor === "" ||
            (typeof valor === "number" && valor === 0);

        onError(id, obrigatorio ? invalido : false);
    }, [valor]);

    useEffect(() => {
        setDisplayValue(formatDateForDisplay(valor));
        setIsValidDate(isValidDateString(formatDateForDisplay(valor)));
    }, [valor]);

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
                    ref={inputRef}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    readOnly={somenteLeitura}
                    id={id}
                    value={displayValue}
                    placeholder="dd/mm/aaaa"
                    maxLength={10} // dd/mm/yyyy = 10 caracteres
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
            </div>
            {error && obrigatorio && (
                <div className="flex items-center gap-1 dark:text-red-300 text-red-600 text-[12px] mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Campo obrigatório.</span>
                </div>
            )}
            {!isValidDate && displayValue.trim() !== "" && (
                <div className="flex items-center gap-1 dark:text-orange-300 text-orange-600 text-[12px] mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Data inválida.</span>
                </div>
            )}
        </div>
    );
};