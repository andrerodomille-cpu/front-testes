import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CampoBuscaGenericoProps<T> {
  id: string;
  caption: string;
  obrigatorio?: boolean;
  onBuscarClick: () => void;
  selectedItem?: T; 
  formatDisplay?: (item: T) => string; 
  somenteleitura?: boolean;
  error?: boolean;
  destacado?: boolean;
}

export const CampoBusca = <T,>({
  id,
  caption,
  obrigatorio = false,
  onBuscarClick,
  selectedItem,
  formatDisplay,
  somenteleitura = false,
  error= false,
  destacado= false
}: CampoBuscaGenericoProps<T>) => {
  const [inputValue, setInputValue] = useState("");
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
    if (selectedItem && formatDisplay) {
      setInputValue(formatDisplay(selectedItem));
    }
  }, [selectedItem, formatDisplay]);

  return (
    <div className="mt-2 flex flex-col mr-1">
      <Label htmlFor={id} className="text-xs text-gray-500 dark:text-gray-400">
        {caption} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>

      <div className="flex gap-1 mt-1 mr-1">
        <Input
          id={id}
          value={inputValue}
          readOnly
          placeholder={!somenteleitura ? "Clique no botão para buscar" : ""}
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
        />

        {!somenteleitura && (
        <Button
          onClick={onBuscarClick}
          className="bg-blue-600 hover:bg-blue-700 text-gray-200 dark:text-gray-100 dark:bg-blue-500 dark:hover:bg-blue-400 h-7 w-8 px-2 text-sm rounded-b rounded-t flex items-center justify-center">
          <Search className="w-4 h-4" />
        </Button>
         )}
      </div>
    </div>
  );
};
