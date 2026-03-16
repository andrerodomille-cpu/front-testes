import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type CampoHoraInputProps = {
    id: string;
    valor: string; 
    caption: string;
    obrigatorio?: boolean;
    somenteLeitura?: boolean;
    registerRequiredField?: (id: string) => void;
    onChange: (id: string, newValue: string) => void; 
    onError?: (id: string, erro: boolean) => void;
};

export const CampoHoraInput: React.FC<CampoHoraInputProps> = ({
    id,
    valor,
    caption,
    onChange,
    obrigatorio = false,
    somenteLeitura = false,
    registerRequiredField,
    onError
}) => {
    const [displayValue, setDisplayValue] = useState("");
    const [error, setError] = useState(false);
    const [isValidTime, setIsValidTime] = useState(true);

    // Converte valor ISO para display
    useEffect(() => {
        if (valor) {
            // Se já estiver no formato HH:mm:ss, usa diretamente
            if (/^\d{2}:\d{2}:\d{2}$/.test(valor)) {
                setDisplayValue(valor);
                setIsValidTime(validateTime(valor));
            } else {
                // Tenta converter para HH:mm:ss
                const formatted = formatForDisplay(valor);
                setDisplayValue(formatted);
                setIsValidTime(validateTime(formatted));
            }
        } else {
            setDisplayValue("");
            setIsValidTime(true);
        }
    }, [valor]);

    useEffect(() => {
        if (onError) {
            onError(id, error);
        }
    }, [error, id, onError]);
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

    const formatForDisplay = (timeStr: string): string => {
        if (!timeStr || timeStr.trim() === "") return "";

        if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
            return timeStr;
        }

        return timeStr;
    };

    const applyMask = (input: string): string => {
        // Remove tudo que não é número
        let numbers = input.replace(/\D/g, "");

        // Aplica máscara HH:mm:ss
        if (numbers.length > 0) {
            // Se o primeiro número for > 2, adiciona 0 antes
            if (numbers.length === 1 && parseInt(numbers[0]) > 2) {
                numbers = '0' + numbers;
            }

            // Limita a 6 dígitos (HHmmss)
            if (numbers.length > 6) {
                numbers = numbers.substring(0, 6);
            }

            // Aplica a máscara
            let result = "";

            if (numbers.length >= 2) {
                // Horas
                result = numbers.substring(0, 2);

                if (numbers.length >= 4) {
                    // Horas + minutos
                    result += ':' + numbers.substring(2, 4);

                    if (numbers.length >= 6) {
                        // Horas + minutos + segundos
                        result += ':' + numbers.substring(4, 6);
                    } else if (numbers.length > 4) {
                        // Horas + minutos + segundos parciais
                        result += ':' + numbers.substring(4);
                    }
                } else if (numbers.length > 2) {
                    // Horas + minutos parciais
                    result += ':' + numbers.substring(2);
                }
            } else {
                // Apenas horas parciais
                result = numbers;
            }

            return result;
        }

        return input;
    };

    const validateTime = (timeStr: string): boolean => {
        if (!timeStr || timeStr.trim() === "") return true;

        if (timeStr.length === 8) {
            const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            return timeRegex.test(timeStr);
        }

        const partialRegex = /^([01]?[0-9]|2[0-3])?(:([0-5]?[0-9]?(:[0-5]?[0-9]?)?)?)?$/;
        return partialRegex.test(timeStr);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const maskedValue = applyMask(rawValue);

        setDisplayValue(maskedValue);

        const valid = validateTime(maskedValue);
        setIsValidTime(valid);

        if (valid && maskedValue.length === 8) {
            onChange(id, maskedValue);
        } else if (maskedValue.trim() === "") {
            onChange(id, "");
        }

        if (obrigatorio) {
            const newErrorState = maskedValue.trim() === "";
            setError(newErrorState);
            if (onError) {
                onError(id, newErrorState);
            }
        }
    };

    const handleBlur = () => {

        if (displayValue && displayValue.length < 8) {
            const parts = displayValue.split(':');

            while (parts.length < 3) {
                parts.push('');
            }

            const hours = parts[0]?.padStart(2, '0') || '00';
            const minutes = parts[1]?.padEnd(2, '0').padStart(2, '0') || '00';
            const seconds = parts[2]?.padEnd(2, '0').padStart(2, '0') || '00';

            const completedTime = `${hours}:${minutes}:${seconds}`;

            if (completedTime !== displayValue) {
                setDisplayValue(completedTime);
                const valid = validateTime(completedTime);
                setIsValidTime(valid);

                if (valid) {
                    onChange(id, completedTime);
                }
            }
        }

        if (obrigatorio) {
            const newErrorState = displayValue.trim() === "";
            setError(newErrorState);
            if (onError) {
                onError(id, newErrorState);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Permite navegação, backspace, delete e dois pontos
        if (
            ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab', ':'].includes(e.key) ||
            e.key === ':' || // Dois pontos
            /^\d$/.test(e.key) // Dígitos
        ) {
            return;
        }

        e.preventDefault();
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
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    readOnly={somenteLeitura}
                    id={id}
                    value={displayValue}
                    placeholder="HH:mm:ss"
                    maxLength={8}
                    className={`!text-xs py-1 border ${error ? "border-red-500" :
                            !isValidTime ? "border-orange-500" :
                                "border-gray-300 dark:border-gray-700"
                        } bg-gray-100 dark:bg-gray-600 dark:text-white rounded-t rounded-b h-7 hover:bg-gray-200 dark:hover:bg-gray-500
                    focus:outline-none focus:border-gray-500`}
                    onChange={handleChange}
                />
            </div>
            {error && obrigatorio && (
                <div className="flex items-center gap-1 dark:text-red-300 text-red-600 text-[12px] mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Campo obrigatório.</span>
                </div>
            )}
            {!isValidTime && displayValue.trim() !== "" && (
                <div className="flex items-center gap-1 dark:text-orange-300 text-orange-600 text-[12px] mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Hora inválida.</span>
                </div>
            )}
        </div>
    );
};