import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";


type InputDataCalendarProps = {
    id: string;
    valor: string; // ISO: "2025-07-29T03:00:00.000Z"
    caption: string;
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    obrigatorio?: boolean;
    somenteLeitura?: boolean;
    destacado?: boolean;
    onChange: (id: string, newValue: string) => void; // formato ISO simples: yyyy-MM-dd
};

export const CampoData: React.FC<InputDataCalendarProps> = ({
    id,
    valor,
    caption,
    obrigatorio = false,
    somenteLeitura = false,
    destacado = false,
    onChange,
}) => {
    const { i18n } = useTranslation();
    const locale = i18n.language === "en" ? enUS : ptBR;
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false); // controla o popover

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

    useEffect(() => {
        if (valor) {
            const date = new Date(valor);
            if (!isNaN(date.getTime())) setSelectedDate(date);
        }
    }, [valor]);

    const handleSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        if (!date && obrigatorio) {
            setError(true);
        } else {
            setError(false);
            onChange(id, format(date!, "yyyy-MM-dd")); // ISO simplificado
        }
    };

    return (
        <div className="mt-1 mr-1">
            <Label htmlFor={id} className="text-xs text-gray-600 dark:text-gray-200">
                {caption} {obrigatorio && <span className="text-red-500">*</span>}
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-7 !text-xs border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                            } bg-gray-50 dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t rounded-b`}
                        disabled={somenteLeitura}
                    >
                        {selectedDate ? format(selectedDate, "P", { locale }) : (
                            <span className="text-gray-400">Selecione uma data</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            handleSelect(date);
                            if (date) setOpen(false); // Fecha o popover ao escolher a data
                        }}
                        locale={locale}
                        disabled={somenteLeitura}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {error && obrigatorio && (
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} className="min-w-[12px]" />
                    <span>Este campo é obrigatório.</span>
                </div>
            )}
        </div>
    );
};
