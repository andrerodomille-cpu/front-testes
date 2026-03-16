import React, { useState, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, Search, AlertCircle } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type SingleSelectProps = {
  id: string;
  value: string;
  label: string;
  options: Option[];
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  obrigatorio?: boolean;
  disabled?: boolean;
  onChange: (id: string, newValue: string) => void;
};

export const InputSingleSelect: React.FC<SingleSelectProps> = ({
  id,
  value,
  label,
  options,
  colSpan = 1,
  obrigatorio = false,
  disabled = false,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const [headerColor, setHeaderColor] = useState<string>("");
  const colSpanClass = `ml-1 col-span-${colSpan}`;

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedLabel = useMemo(() => {
    const found = options.find((opt) => opt.value === value);
    return found ? found.label : "";
  }, [options, value]);

  const handleSelect = (val: string) => {
    if (obrigatorio) {
      setError(val === "");
    }
    onChange(id, val);
    setOpen(false); // Fecha após seleção
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }
  }, [headerColor]);

  return (
    <div className={colSpanClass}>
      <Label htmlFor={id} className="!text-xs text-gray-600 dark:text-gray-200 rounded-t rounded-b">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-7 justify-between !text-xs py-1 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-900 dark:text-white text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-t rounded-b`}
            disabled={disabled}
          >
            <span className={`truncate ${!value ? "text-muted-foreground" : ""}`}>
              {selectedLabel || "Selecione..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-t rounded-b bg-gray-50 dark:bg-gray-900 w-[var(--radix-popover-trigger-width)] p-2">
          <div className="flex items-center gap-2 px-1">
            <Search size={14} className="text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="h-7 !text-xs"
            />
          </div>
          <div className="mt-2 max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <div
                    key={opt.value}
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className="bg-gray-50 dark:bg-gray-900 flex items-center text-xs py-1 px-2 hover:bg-muted/30 cursor-pointer rounded-t rounded-b"
                  >
                    <div
                      className={`w-3 h-3 border rounded-t rounded-b mr-2 flex items-center justify-center ${isSelected
                          ? "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300"
                          : "border-gray-600 dark:border-gray-300"
                        }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                    {opt.label}
                  </div>
                );
              })
            ) : (
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Nenhum resultado encontrado
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && obrigatorio && (
        <div className="flex items-center gap-1 text-red-500 !text-xs mt-1">
          <AlertCircle size={12} className="min-w-[12px]" />
          <span>Este campo é obrigatório.</span>
        </div>
      )}
    </div>
  );
};
