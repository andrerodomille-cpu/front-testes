import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "../input/InputData";
import { Button } from "../ui/button";
import { FilterIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputSingleSelect } from "../input/InputSingleSelect";

interface FiltroCarrinhoProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onAplicarFiltro?: (filtros: {
    datainicial: string | undefined;
    datafinal: string | undefined;
    status: string | undefined;
  }) => void;
}

function parseLocalStorageDateOrDefault(key: string): Date {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsedValue = new Date(JSON.parse(storedValue));
      if (!isNaN(parsedValue.getTime())) {
        return parsedValue;
      }
    }
  } catch (error) {
    console.warn(`Erro ao fazer o parse do valor armazenado em "${key}":`, error);
  }
  return new Date();
}

const FiltroDataLogistica: React.FC<FiltroCarrinhoProps> = ({
  onInicioChange,
  onFimChange,
  onAplicarFiltro,
}) => {
  const { t } = useTranslation();
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const filtros = t("comum.filtros");
  const statusLabel = t("comum.status");

  const [carregando, setIsLoading] = useState<boolean>(false);
  const [dataInicial, setDataInicial] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("ocorrenciasinicio")
  );
  const [dataFinal, setDataFinal] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("ocorrenciasfim")
  );
  const [status, setStatus] = useState<string>(() => {
    return localStorage.getItem("ocorrenciasStatus") || "0";
  });

  const salvarDataNoLocalStorage = (key: string, date: Date) => {
    localStorage.setItem(key, JSON.stringify(date.toISOString()));
  };

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;
    setDataInicial(date);
    salvarDataNoLocalStorage("ocorrenciasinicio", date);
    onInicioChange?.(date);
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;
    setDataFinal(date);
    salvarDataNoLocalStorage("ocorrenciasfim", date);
    onFimChange?.(date);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    localStorage.setItem("ocorrenciasStatus", value);
  };

  const handleAplicarFiltro = async () => {
    setIsLoading(true);
    try {
      await onAplicarFiltro?.({
        datainicial: dataInicial ? dataInicial.toISOString().slice(0, 10) : undefined,
        datafinal: dataFinal ? dataFinal.toISOString().slice(0, 10) : undefined,
        status: status || "0",
      });
    } finally {
      setIsLoading(false);
    }
  };

   const statusOptions = [
    { value: "0", label: "Todos" },
    { value: "1", label: "Liberado para Separação" },
    { value: "2", label: "Liberado para Montagem" },
    { value: "3", label: "Liberado para Expedição" },
    { value: "4", label: "Ordem Expedida" },
  ];


  return (
    <div>
      <Card className="w-full bg-neutral-50 dark:bg-gray-800 p-2">
        <LabelCardTitulo bold={false}>{filtros}</LabelCardTitulo>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap gap-2">
            {/* Data inicial */}
            <div className="w-full sm:flex-4 md:basis-1/6 lg:basis-1/12 min-w-[140px]">
              <InputData
                id="dataInicial"
                colSpan={1}
                date={dataInicial}
                caption={selecaodatainicial}
                onChange={handleInicio}
                obrigatorio={true}
              />
            </div>

            {/* Data final */}
            <div className="w-full sm:flex-4 md:basis-1/6 lg:basis-1/12 min-w-[140px]">
              <InputData
                id="dataFinal"
                colSpan={1}
                date={dataFinal}
                caption={selecaodatafinal}
                onChange={handleFim}
                obrigatorio={true}
              />
            </div>

            {/* Select Status */}
             <div className="w-full sm:flex-4 md:basis-1/6 lg:basis-1/6 min-w-[220px]">
              <InputSingleSelect
                id="status"
                value={status}
                label={t("comum.status")}
                options={statusOptions}
                colSpan={1}
                onChange={handleStatusChange}
              />
            </div>

            {/* Botão Aplicar */}
            <div className="w-full sm:flex-1 md:basis-1/1 lg:basis-1/1 min-w-[140px]">
              <Button
                variant="outline"
                onClick={handleAplicarFiltro}
                className="ml-3 mt-6 h-7 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 text-xs rounded w-18 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                {carregando ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <FilterIcon className="w-3 h-3" />
                )}
                {carregando ? t("comum.aplicando") : t("comum.aplicarfiltro")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FiltroDataLogistica;
