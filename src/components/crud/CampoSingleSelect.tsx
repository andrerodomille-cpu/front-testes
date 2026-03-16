import React, { useState, useMemo, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, Search, AlertCircle } from "lucide-react";

type Option = { label: string; value: string };

type CampoSingleSelectProps = {
  id: string;
  caption: string;
  valor: string;
  opcoes?: Option[];
  obrigatorio?: boolean;
  somenteLeitura?: boolean;
  disabled?: boolean;
  textSize?: string;
  destacado?: boolean;
  registerRequiredField?: (id: string) => void;
  onChange: (id: string, val: string) => void;
  onError?: (id: string, erro: boolean) => void;
};

export const CampoSingleSelect: React.FC<CampoSingleSelectProps> = ({
  id,
  caption,
  valor,
  opcoes = [],
  obrigatorio = false,
  somenteLeitura = false,
  disabled = false,
  destacado = false,
  registerRequiredField,
  textSize = "text-xs",
  onChange,
  onError
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  // Filtra as opções com verificação de segurança
  const filteredOptions = useMemo(() => {
    if (!Array.isArray(opcoes)) return [];
    return opcoes.filter((opt) => 
      opt?.label?.toLowerCase().includes(search.toLowerCase())
    );
  }, [opcoes, search]);

  // Obtém o label da opção selecionada
  const selectedLabel = useMemo(() => {
    if (!Array.isArray(opcoes)) return "";
    const found = opcoes.find((opt) => opt?.value === valor);
    return found ? found.label : "";
  }, [opcoes, valor]);

  const handleSelect = (val: string) => {
    if (obrigatorio) setError(val === "");
    onChange(id, val);
    setOpen(false);
    setSearch("");
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (obrigatorio) {
      registerRequiredField?.(id);
    }
  }, [obrigatorio, id, registerRequiredField]);

  useEffect(() => {
    if (!onError) return;

    const invalido =
      valor === null ||
      valor === undefined ||
      valor === "" ||
      (typeof valor === "number" && valor === 0);

    onError(id, obrigatorio ? invalido : false);
    setError(obrigatorio ? invalido : false);
  }, [valor, obrigatorio, id, onError]);

  // Para eventos de clique
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative mt-1 mr-1" ref={dropdownRef}>
      <Label
        htmlFor={id}
        className="text-xs text-gray-500 dark:text-gray-400"
      >
        {caption} {obrigatorio && <span className="text-red-500">*</span>}
      </Label>
      
      {somenteLeitura ? (
        <div
          className={`w-full h-7 ${textSize} py-1 px-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600`}
        >
          {selectedLabel || "—"}
        </div>
      ) : (
        <>
          <Button
            ref={buttonRef}
            variant="outline"
            type="button"
            className={`w-full h-7 justify-between ${textSize} py-1 border 
            ${error ? "border-red-500" : "border-gray-300 dark:border-gray-700"} 
            
            bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded`}
            onClick={() => {
              if (!disabled) {
                setOpen((prev) => !prev);
              }
            }}
            disabled={disabled}
          >
            <span className={`text-xs text-gray-900 dark:text-white truncate ${!valor ? "text-gray-400 dark:text-gray-500" : ""}`}>
              {selectedLabel || "Selecione..."}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>

          {open && (
            <div
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg"
              onClick={stopPropagation}
            >
              <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-200 dark:border-gray-700">
                <Search size={14} className="text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="!text-xs py-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-7 p-0"
                  onClick={stopPropagation}
                  autoFocus
                />
              </div>

              <div className="max-h-48 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => {
                    const isSelected = valor === opt.value;
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(opt.value)}
                        className={`flex items-center ${textSize} py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
                          isSelected ? "bg-gray-50 dark:bg-gray-800" : ""
                        }`}
                      >
                        <div
                          className={`w-4 h-4 border rounded-full mr-2 flex items-center justify-center 
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-400 dark:border-gray-600"
                            }`}
                        >
                          {isSelected && <Check size={10} className="text-white" />}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className={`px-3 py-2 ${textSize} text-gray-500 dark:text-gray-400`}>
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {error && obrigatorio && (
        <div className={`flex items-center gap-1 text-red-500 ${textSize} mt-1`}>
          <AlertCircle size={12} />
          <span>Este campo é obrigatório.</span>
        </div>
      )}
    </div>
  );
};