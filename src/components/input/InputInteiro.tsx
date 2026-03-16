import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatInteger } from "@/utils/formatUtils";
import { AlertCircle } from "lucide-react";

type EditableFieldProps = {
    id: string;
    value: number;
    label: string;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    obrigatorio?: boolean;
    readOnly?: boolean;
    onChange: (id: string, newValue: string) => void;
};

export const InputInteiro: React.FC<EditableFieldProps> = ({
    id,
    value,
    label,
    colSpan = 1,
    onChange,
    readOnly = false,
    obrigatorio = false,
}) => {
    const [error, setError] = useState(false);
    const colSpanClass = `ml-1 col-span-${colSpan}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const isEmpty = newValue.trim() === "";

        if (obrigatorio) {
            setError(isEmpty);
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
            <div className="relative h-7">
                <Input
                    readOnly={readOnly}
                    id={id}
                    defaultValue={Number.isFinite(value) ? formatInteger(value) : ""}
                    className={`!text-xs py-1 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                        } bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-t rounded-b h-7 
                        focus:outline-none focus:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500`}
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
