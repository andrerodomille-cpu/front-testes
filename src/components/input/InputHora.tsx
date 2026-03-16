import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface InputHoraProps {
  id: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  time?: string; // Formato "hh:mm:ss"
  onChange: (value: string) => void;
  label?: string;
  obrigatorio?: boolean;
}

export const InputHora: React.FC<InputHoraProps> = ({
  id,
  colSpan = 1,
  time,
  onChange,
  label,
  obrigatorio = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time || "00:00:00");

  const colSpanClass = `ml-1 col-span-${colSpan}`;

  useEffect(() => {
    if (time) setSelectedTime(time);
  }, [time]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedTime(value);
    onChange(value);
  };

  return (
    <div key={id} className={colSpanClass}>
      <Label htmlFor={id} className="!text-xs text-gray-600 dark:text-gray-200">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            className={`h-7 w-full !text-xs flex items-center justify-start 
              border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-600 dark:text-white 
              rounded-t rounded-b text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-500 
              focus:outline-none focus:border-gray-500`}
          >
            <Clock className="h-4 w-4 mr-2" />
            {selectedTime || "hh:mm:ss"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <input
            id={id}
            type="time"
            step="1"
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 
              bg-white dark:bg-gray-800 dark:text-white rounded focus:outline-none"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
