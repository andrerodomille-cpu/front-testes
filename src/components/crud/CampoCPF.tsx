import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditableFieldProps = {
    id: string;
    value: string;
    label: string;
    obrigatorio?: boolean;
    readOnly?: boolean;
    onChange: (id: string, newValue: string) => void;
    onError?: (id: string, erro: boolean) => void;
};

export const CampoCPF: React.FC<EditableFieldProps> = ({
    id,
    value,
    label,
    onChange,
    obrigatorio = false,
    readOnly = false,
    onError
}) => {
    const [error, setError] = useState(false);

    const formatCPF = (v: string) => {
        // Remove tudo que não for número
        v = v.replace(/\D/g, "");
        // Limita a 11 dígitos
        v = v.slice(0, 11);
        // Aplica a máscara
        if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
        if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
        if (v.length > 3) return v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
        return v;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        const isEmpty = formatted.trim() === "";
        if (obrigatorio) {
            const newErrorState = isEmpty;
            setError(newErrorState);
            if (onError) onError(id, newErrorState);
        }
        onChange(id, formatted);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (obrigatorio) {
            const newErrorState = e.target.value.trim() === "";
            setError(newErrorState);
            if (onError) onError(id, newErrorState);
        }
    };

    return (
        <div className="mt-1 mr-1" key={id}>
            <Label
                htmlFor={id}
                className="text-xs text-gray-600 dark:text-gray-200"
            >
                {label} {obrigatorio && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative h-7">
                <Input
                    onBlur={handleBlur}
                    autoComplete="off"
                    readOnly={readOnly}
                    id={id}
                    value={String(value)}
                    className={`!text-xs py-1 border ${
                        error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                    } bg-gray-100 dark:bg-gray-600 dark:text-white rounded-t rounded-b h-7 hover:bg-gray-200 dark:hover:bg-gray-500
                    focus:outline-none focus:border-gray-500`}
                    onChange={handleChange}
                    maxLength={14} // 11 dígitos + pontos + traço
                />
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