import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "../input/InputData";
import { InputMultiSelect } from "../input/InputMultiSelect";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";

import {
  FilterIcon,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RotateCcw,
  Store
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";

interface RetrieveParams {
  id: number;
  id_empresa: number;
}

interface Loja {
  idconexao: string;
  loja: string;
}

interface ItemLoja {
  value: string;
  label: string;
}

interface FiltroProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: string | undefined;
    dataFinal: string | undefined;
    conexoesSelecionadas: string[];
  }) => void;
  quickFilters?: Array<{
    label: string;
    days: number;
  }>;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
}

const salvarDataNoLocalStorage = (key: string, date: Date) => {
  localStorage.setItem(key, JSON.stringify(date.toISOString()));
};

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

const FiltroOcorrenciasRelatorios: React.FC<FiltroProps> = ({
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
  defaultExpanded = true
}) => {
  const { t } = useTranslation();
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [headerColor, setHeaderColor] = useState<string>("");
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [dataInicial, setDataInicial] = useState<Date | undefined>(() => parseLocalStorageDateOrDefault("ocorrenciasinicio"));
  const [dataFinal, setDataFinal] = useState<Date | undefined>(() => parseLocalStorageDateOrDefault("ocorrenciasfim"));
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("ocorrenciaslojas"));

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
  function filtrarLojas(idUsuario: number): void {
    configService.listarLojasOcorrencias(idUsuario).then((response) => {
      setTableLojas(response.data);
    });
  }
  const handleMultiSelectChange = (id: string, newValue: string[]) => {
    setSelecionados(newValue);
    StorageUtils.salvarArrayString("ocorrenciaslojas", newValue);
  };
  const handleAplicarFiltro = async (
    inicio = dataInicial,
    fim = dataFinal
  ) => {

    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({          
          dataInicial: inicio ? inicio.toISOString().slice(0, 10) : undefined,
          dataFinal: fim ? fim.toISOString().slice(0, 10) : undefined,
          conexoesSelecionadas: selecionados,
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

  const getSelectedStoresLabel = () => {
    if (selecionados.length === 0) return "Todas as lojas";
    if (selecionados.length === 1) {
      const loja = tablelojas.find(l => String(l.idconexao) === selecionados[0]);
      return loja ? loja.loja : "1 loja selecionada";
    }
    return `${selecionados.length} lojas selecionadas`;
  };

  useEffect(() => {
    const retrieveParamsString = localStorage.getItem("user");
    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas(retrieveParams.id);
    }
    
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }
  }, []);

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
                  {t("comum.filtros")}
                </LabelCardTitulo>
                 {dataInicial && dataFinal && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Período: {formatDate(dataInicial)} → {formatDate(dataFinal)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
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

          <div className="mt-3">
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
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
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
                          caption={t("comum.selecaodatainicial")}
                          onChange={handleInicio}
                          obrigatorio={true}
                        />
                      </div>
                      
                      <div>
                        <InputData
                          id="dataFinal"
                          date={dataFinal}
                          caption={t("comum.selecaodatafinal")}
                          onChange={handleFim}
                          obrigatorio={true}
                        />
                      </div>
                      
                      <div className="md:col-span-4">
                        <InputMultiSelect
                          id="idConexao"
                          label={t("comum.selecaolojas")}
                          value={selecionados}
                          options={tablelojas.map((opcao) => ({
                            label: opcao.loja,
                            value: String(opcao.idconexao),
                          }))}
                          disabled={false}
                          onChange={handleMultiSelectChange}
                          obrigatorio={false}
                        />
                      </div>

                      <div className="relative group">
                        <Button
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
                                `}>
                            {carregando ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                            <FilterIcon className="w-3 h-3" />
                          )}
                      
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FiltroOcorrenciasRelatorios;