import React, { useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";

interface DatePickerProps {
  id: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  caption?: string;
  obrigatorio?: boolean;
}

export const InputData: React.FC<DatePickerProps> = ({
  id,
  colSpan = 1,
  date,
  onChange,
  caption,
  obrigatorio = false
}) => {
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(date || new Date());
  const locale = useLocale();
  const { t } = useTranslation();
  const colSpanClass = `ml-1 col-span-${colSpan}`;

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(selectedDate);
      setOpen(false);
    }
  };
  const [error, setError] = useState(false);
  const goToNextYear = () => {
    const next = new Date(currentMonth);
    next.setFullYear(currentMonth.getFullYear() + 1);
    setCurrentMonth(next);
  };

  const goToPreviousYear = () => {
    const prev = new Date(currentMonth);
    prev.setFullYear(currentMonth.getFullYear() - 1);
    setCurrentMonth(prev);
  };

  return (
    <div key={id} className={colSpanClass}>
      <Label
        htmlFor={id}
        className="!text-xs text-gray-600 dark:text-gray-200"
      >
        {caption} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`h-7 w-full !text-xs flex items-center justify-start rounded-t rounded-b 
              ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-900 dark:text-white rounded-t rounded-b h-7 
              focus:outline-none focus:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800`}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            {date ? format(date, "dd/MM/yyyy") : "Selecione uma data"}
          </Button>

        </PopoverTrigger>
        <PopoverContent className="w-auto" forceMount>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={goToPreviousYear}>
              ← {currentMonth.getFullYear() - 1}
            </Button>
            <span className="!text-xs font-medium">
              {format(currentMonth, "MMMM yyyy", { locale })}
            </span>
            <Button variant="ghost" size="sm" onClick={goToNextYear}>
              {currentMonth.getFullYear() + 1} →
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleSelect}
            locale={locale}
            month={currentMonth}
            onMonthChange={(month) => {
              if (month instanceof Date) {
                setCurrentMonth(month);
              }
            }}
            initialFocus
          />

          <div className="flex justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="!text-xs"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Limpar data
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
