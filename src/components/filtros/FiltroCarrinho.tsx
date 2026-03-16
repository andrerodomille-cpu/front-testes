import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { InputData } from "@/components/input/InputData";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { Button } from "../ui/button";
import { InputSingleSelect } from "../input/InputSingleSelect";
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
  Store
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

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

interface FiltroCarrinhoProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    datainicial: string | undefined;
    datafinal: string | undefined;
    idconexao: string | undefined;
  }) => void;
  quickFilters?: Array<{
    label: string;
    days: number;
  }>;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
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

const FiltroCarrinho: React.FC<FiltroCarrinhoProps> = ({
  onLojaChange,
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
  const [headerColor, setHeaderColor] = useState<string>("");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [tablelojas, setTableLojas] = useState<any[]>([]);

  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaoloja = t("comum.selecaoloja");
  const filtros = t("comum.filtros");

  const salvarDataNoLocalStorage = (key: string, date: Date) => {
    localStorage.setItem(key, JSON.stringify(date.toISOString()));
  };

  const [idconexao, setIdConexao] = useState<string | undefined>(() => {
    const storedValue = localStorage.getItem("idConexaoSmartCart");
    return storedValue ? JSON.parse(storedValue) : undefined;
  });

  const [dataInicial, setDataInicial] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("carrinhoinicio")
  );

  const [dataFinal, setDataFinal] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("carrinhofim")
  );

  const handleLojas = (id: string): void => {
    setIdConexao(id);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));
    setActiveQuickFilter(null);
    if (onLojaChange) {
      onLojaChange(id);
    }
  };

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;

    setDataInicial(date);
    setActiveQuickFilter(null);
    salvarDataNoLocalStorage("carrinhoinicio", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;

    setDataFinal(date);
    setActiveQuickFilter(null);
    salvarDataNoLocalStorage("carrinhofim", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };

  function filtrarLojas(idUsuario: number): void {
    configService
      .listarLojasSmartCart(idUsuario)
      .then((response) => {
        setTableLojas(response.data || []);
      })
      .catch((error) => {
        console.error("Erro ao carregar lojas:", error);
        setTableLojas([]);
      });
  }

  const handleAplicarFiltro = async (
    inicio = dataInicial,
    fim = dataFinal,
    loja = idconexao
  ) => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          datainicial: inicio ? inicio.toISOString().slice(0, 10) : undefined,
          datafinal: fim ? fim.toISOString().slice(0, 10) : undefined,
          idconexao: loja
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
      handleAplicarFiltro(startDate, today, idconexao);
    }, 100);
  };

  const handleReset = () => {
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);

    handleInicio(defaultStart);
    handleFim(today);
    setActiveQuickFilter(null);

    localStorage.removeItem("carrinhoinicio");
    localStorage.removeItem("carrinhofim");

    setTimeout(() => {
      if (onAplicarFiltro) {
        onAplicarFiltro({
          datainicial: defaultStart.toISOString().slice(0, 10),
          datafinal: today.toISOString().slice(0, 10),
          idconexao
        });
      }
    }, 150);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getLojaLabel = () => {
    if (!idconexao) 
      return "Nenhuma loja selecionada";
    const lojaSelecionada = tablelojas.find(l => String(l.idconexao) === String(idconexao));
    return lojaSelecionada ? lojaSelecionada.loja : `Loja ${idconexao}`;
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }

    const retrieveParamsString = localStorage.getItem("user");
    if (retrieveParamsString) {
      try {
        const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
        filtrarLojas(retrieveParams.id);
      } catch (error) {
        console.error("Erro ao parsear usuário do localStorage:", error);
      }
    }
  }, []);



  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-2"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-b rounded-t">
        <div className="p-2">

          <div
            className="
              flex flex-col gap-3
              sm:flex-row sm:items-center sm:justify-between">
            {/* ESQUERDA */}
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 shrink-0">
                <SlidersHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>

              <div className="min-w-0">
                <LabelCardTitulo bold={false}>
                  {filtros}
                </LabelCardTitulo>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  
                  {dataInicial && dataFinal && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-words">
                      {t("comum.periodo")}: {formatDate(dataInicial)} → {formatDate(dataFinal)}
                    </p>
                  )}
                
                  
                    <div className="flex items-center gap-1">
                      <Store className="h-3 w-3 text-gray-400 shrink-0" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {getLojaLabel()}
                      </p>
                    </div>
                
                </div>
              </div>
            </div>

            {/* DIREITA / BOTÃO */}
            <div className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="
                    w-full sm:w-auto
                    justify-center sm:justify-start
                    text-gray-600 dark:text-gray-400
                    hover:bg-gray-100 dark:hover:bg-gray-800">
                {showFilters ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    {t("comum.ocultarfiltros")}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {t("comum.mostrarfiltros")}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {t("comum.filtrosrapidos")}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {quickFilters.map((filter) => (
                <Badge
                  key={filter.label}
                  variant={activeQuickFilter === filter.label ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${activeQuickFilter === filter.label ? `bg-blue-500 text-gray-100 dark:bg-blue-600 dark:text-gray-300 border-gray-200 dark:border-gray-800` : ''}`}
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
                      <Calendar className={`h-4 w-4 text-gray-500`} />
                      <LabelCardTitulo bold={false}>
                        {t("comum.filtrospersonalizados")}
                      </LabelCardTitulo>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <div className="md:col-span-3">
                        <InputData
                          id="dataInicial"
                          date={dataInicial}
                          caption={selecaodatainicial}
                          onChange={handleInicio}
                          obrigatorio={true}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <InputData
                          id="dataFinal"
                          date={dataFinal}
                          caption={selecaodatafinal}
                          onChange={handleFim}
                          obrigatorio={true}
                        />
                      </div>

                      <div className="md:col-span-4">
                        <InputSingleSelect
                          id="idConexao"
                          label={selecaoloja}
                          value={idconexao || ""}
                          options={tablelojas.map((opcao) => ({
                            label: opcao.loja,
                            value: String(opcao.idconexao),
                          }))}
                          disabled={false}
                          onChange={(_, newValue) => handleLojas(newValue)}
                          obrigatorio={true}
                        />
                      </div>

                      <div className="flex justify-end">
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
                              `}>
                          {carregando ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </>
                          ) : (
                            <>
                              <FilterIcon className="w-4 h-4" />

                            </>
                          )}
                        </button>


                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(dataInicial && dataFinal && idconexao) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FiltroCarrinho;