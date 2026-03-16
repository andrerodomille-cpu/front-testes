import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "../input/InputData";
import { Button } from "../ui/button";
import {
  FilterIcon,
  Loader2,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import BarFilter from "./BarFilter"; // Import do novo componente de filtro

interface FiltroRapidoProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onAplicarFiltro?: (filtros: {
    datainicial: string | undefined;
    datafinal: string | undefined;
  }) => void;
  quickFilters?: Array<{
    label: string;
    days: number;
  }>;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
  
  // Novas props para o filtro de dataset
  showDatasetFilter?: boolean;
  dataset?: any[];
  datasetFields?: string[];
  onDatasetFilter?: (filteredData: any[]) => void;
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
    console.warn(
      `Erro ao fazer o parse do valor armazenado em "${key}":`,
      error
    );
  }
  return new Date();
}

const FiltroRapido: React.FC<FiltroRapidoProps> = ({
  onInicioChange,
  onFimChange,
  onAplicarFiltro,
  quickFilters = [
    { label: "comum.hoje", days: 0 },
    { label: "comum.ultimos7dias", days: -7 },
    { label: "comum.ultimos15dias", days: -15 },
    { label: "comum.ultimos30dias", days: -30 },
    { label: "comum.esteMes", days: -new Date().getDate() + 1 }
  ],
  showAdvanced = false,
  defaultExpanded = true,
  
  // Novas props com valores padrão
  showDatasetFilter = false,
  dataset = [],
  datasetFields = [],
  onDatasetFilter
}) => {
  const { t } = useTranslation();
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const filtros = t("comum.filtros");
  const [headerColor, setHeaderColor] = useState<string>("");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [showDatasetFilters, setShowDatasetFilters] = useState<boolean>(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const salvarDataNoLocalStorage = (key: string, date: Date) => {
    localStorage.setItem(key, JSON.stringify(date.toISOString()));
  };

  const [dataInicial, setDataInicial] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("ocorrenciasinicio")
  );

  const [dataFinal, setDataFinal] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("ocorrenciasfim")
  );

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;

    setDataInicial(date);
    setActiveQuickFilter(null);
    salvarDataNoLocalStorage("ocorrenciasinicio", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;

    setDataFinal(date);
    setActiveQuickFilter(null);
    salvarDataNoLocalStorage("ocorrenciasfim", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };

  const handleAplicarFiltro = async (
    inicio = dataInicial,
    fim = dataFinal
  ) => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          datainicial: inicio ? inicio.toISOString().slice(0, 10) : undefined,
          datafinal: fim ? fim.toISOString().slice(0, 10) : undefined,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFilter = (days: number, label: string) => {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() + days);

    handleInicio(startDate);
    handleFim(today);
    setActiveQuickFilter(label);

    setTimeout(() => {
      handleAplicarFiltro(startDate, today);
    }, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }
  }, []);

  // Extrair cor primária do gradiente
  const getPrimaryColor = () => {
    if (headerColor.includes('from-')) {
      const match = headerColor.match(/from-([^\s]+)/);
      return match ? match[1].split('-')[1] || 'blue' : 'blue';
    }
    return 'blue';
  };

  const primaryColor = getPrimaryColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-2"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-b rounded-t">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 dark:from-${primaryColor}-900/20 dark:to-${primaryColor}-800/20`}>
                <SlidersHorizontal className={`h-4 w-4 text-${primaryColor}-600 dark:text-${primaryColor}-400`} />
              </div>
              <div>
                <LabelCardTitulo bold={false}>
                  {filtros}
                </LabelCardTitulo>
                {dataInicial && dataFinal && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Período: {formatDate(dataInicial)} → {formatDate(dataFinal)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {showFilters ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Ocultar filtros
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Mostrar filtros
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Filtros rápidos:
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {quickFilters.map((filter) => (
                <Badge
                  key={filter.label}
                  variant={activeQuickFilter === filter.label ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${activeQuickFilter === filter.label ? `bg-${primaryColor}-100 text-${primaryColor}-700 dark:bg-${primaryColor}-900 dark:text-${primaryColor}-300 border-${primaryColor}-200 dark:border-${primaryColor}-800` : ''}`}
                  onClick={() => handleQuickFilter(filter.days, filter.label)}
                >
                  {t(filter.label)}
                </Badge>
              ))}
            </div>
          </div>
        </div>


        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />

              <div className="p-3">
                <div className="space-y-1">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`h-4 w-4 text-${primaryColor}-500`} />
                      <LabelCardTitulo bold={false}>
                        {t("comum.filtrospersonalizados")}
                      </LabelCardTitulo>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
                      <div>
                        <InputData
                          id="dataInicial"
                          date={dataInicial}
                          caption={selecaodatainicial}
                          onChange={handleInicio}
                          obrigatorio={true}
                        />
                      </div>

                      <div>
                        <InputData
                          id="dataFinal"
                          date={dataFinal}
                          caption={selecaodatafinal}
                          onChange={handleFim}
                          obrigatorio={true}
                        />
                      </div>
                      
                      <div className="relative group">
                        <button
                          onClick={() => handleAplicarFiltro()}
                          disabled={carregando}
                          className={`
                            mt-5 px-3 py-2 text-sm rounded-t rounded-b
                            bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700
                            hover:from-blue-600 hover:via-blue-700 hover:to-blue-800
                            active:from-blue-700 active:via-blue-800 active:to-blue-900
                            disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600
                            disabled:cursor-not-allowed
                            text-white font-medium
                            shadow-lg hover:shadow-xl active:shadow-2xl
                            transition-all duration-200 ease-out
                            transform hover:-translate-y-0.5 active:translate-y-0
                            flex items-center justify-center gap-2
                            min-w-[20px]
                            relative overflow-hidden
                            after:absolute after:inset-0 after:bg-gradient-to-br after:from-white/0 after:via-white/10 after:to-white/0
                            after:opacity-0 hover:after:opacity-100 after:transition-opacity
                            border border-blue-400/20
                          `}
                        >
                          {carregando ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FilterIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

           {showDatasetFilter && showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />
             
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {dataInicial && dataFinal && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {/* Conteúdo adicional se necessário */}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FiltroRapido;