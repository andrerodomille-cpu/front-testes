import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "@/components/input/InputData";
import { InputSingleSelect } from "../input/InputSingleSelect";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import {
  FilterIcon,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal,
  Store,
  Building
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

interface FiltroFiscalRemotoResumoProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date | undefined;
    dataFinal: Date | undefined;
    conexoesSelecionadas: string[];
  }) => void;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
}

const FiltroFiscalRemotoResumo: React.FC<FiltroFiscalRemotoResumoProps> = ({
  onInicioChange,
  onFimChange,
  onLojaChange,
  onAplicarFiltro,
  showAdvanced = false,
  defaultExpanded = true
}) => {
  const { t } = useTranslation();
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaolojas = t("comum.selecaolojas");
  const filtros = t("comum.filtros");
  const [headerColor, setHeaderColor] = useState<string>("");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [idConexao, setIdConexao] = useState<string | null>(() => {
    const storedValue = localStorage.getItem("idConexaoSmartCart");
    return storedValue ? JSON.parse(storedValue) : null;
  });
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("supervisorremotolojas"));
  const [dataInicial, setDataInicial] = useState<Date | undefined>(() => StorageUtils.lerData("supervisorremotoinicio") ?? new Date());
  const [dataFinal, setDataFinal] = useState<Date | undefined>(() => StorageUtils.lerData("supervisorremotofim") ?? new Date());
  const [loja, setLoja] = useState<string>("");
  
  const handleInicio = (date: Date | undefined): void => {
  if (!date) return;

  // Ajusta para 00:00:00
  const inicio = new Date(date);
  inicio.setHours(0, 0, 0, 0);

  setDataInicial(inicio);
  setActiveQuickFilter(null);
  StorageUtils.salvarData("supervisorremotoinicio", inicio);

  if (onInicioChange) {
    onInicioChange(inicio);
  }
};

const handleFim = (date: Date | undefined): void => {
  if (!date) return;

  // Ajusta para 23:59:59
  const fim = new Date(date);
  fim.setHours(23, 59, 59, 999);

  setDataFinal(fim);
  setActiveQuickFilter(null);
  StorageUtils.salvarData("supervisorremotofim", fim);

  if (onFimChange) {
    onFimChange(fim);
  }
};


  /*
  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;
    setDataInicial(date);
    setActiveQuickFilter(null);
    StorageUtils.salvarData("supervisorremotoinicio", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;
    setDataFinal(date);
    setActiveQuickFilter(null);
    StorageUtils.salvarData("supervisorremotofim", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };
  */
  function filtrarLojas(idUsuario: number): void {
    configService
      .listarLojasFiscalRemoto(idUsuario)
      .then((response) => {
        const listaLojas: ItemLoja[] = [];
        response.data.forEach((item: Loja) => {
          const itemLoja: ItemLoja = {
            value: item.idconexao,
            label: item.loja,
          };
          listaLojas.push(itemLoja);
        });

        setTableLojas(response.data);
      });
  }

  const handleAplicarFiltro = async (
    inicio = dataInicial,
    fim = dataFinal,
    conexoes = selecionados
  ) => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          dataInicial: inicio,
          dataFinal: fim,
          conexoesSelecionadas: conexoes,
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
      handleAplicarFiltro(startDate, today, selecionados);
    }, 100);
  };

  const handleReset = () => {
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);

    handleInicio(defaultStart);
    handleFim(today);
    setActiveQuickFilter(null);

    StorageUtils.removerItem("supervisorremotoinicio");
    StorageUtils.removerItem("supervisorremotofim");
    StorageUtils.removerItem("supervisorremotolojas");
    localStorage.removeItem("idConexaoSmartCart");

    setIdConexao(null);
    setSelecionados([]);
    setLoja("");

    setTimeout(() => {
      if (onAplicarFiltro) {
        onAplicarFiltro({
          dataInicial: today,
          dataFinal: today,
          conexoesSelecionadas: [],
        });
      }
      if (onLojaChange) {
        onLojaChange("");
      }
    }, 150);
  };

  const handleLojas = (id: string): void => {
    if (!id) return;

    setIdConexao(id);
    setSelecionados([id]);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));

    const opcaoSelecionada = tablelojas.find(
      (opcao) => String(opcao.idconexao) === id
    );

    if (opcaoSelecionada) {
      setLoja(opcaoSelecionada.loja);

      if (onLojaChange) {
        onLojaChange(opcaoSelecionada.loja);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getLojaText = () => {
    if (!loja || !idConexao) return "Nenhuma loja selecionada";
    return loja;
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }

    const retrieveParamsString = localStorage.getItem("user");

    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas(retrieveParams.id);
    } else {
      console.error("Nenhum dado foi encontrado no localStorage.");
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
      className="mb-1"
    >
      <Card className="rounded-b rounded-t overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-b rounded-t">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-b rounded-t bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 dark:from-${primaryColor}-900/20 dark:to-${primaryColor}-800/20`}>
                <Building className={`h-4 w-4 text-${primaryColor}-600 dark:text-${primaryColor}-400`} />
              </div>
              <div>
                <LabelCardTitulo bold={false}>
                  {filtros}
                </LabelCardTitulo>
                {dataInicial && dataFinal && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  
                    {getLojaText()}
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

              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className={`h-4 w-4 text-${primaryColor}-500`} />
                      <LabelCardTitulo bold={false}>
                        {t("comum.filtrospersonalizados")}
                      </LabelCardTitulo>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                      <div className="md:col-span-4">
                        <InputSingleSelect
                          id="idConexao"
                          label={selecaolojas}
                          value={`${idConexao}`}
                          options={tablelojas.map((opcao) => ({
                            label: opcao.loja,
                            value: String(opcao.idconexao),
                          }))}
                          disabled={false}
                          obrigatorio={true}
                          onChange={(_, newValue) => handleLojas(newValue)}
                        />
                      </div>

                      <div className="md:col-span-2 flex items-end">
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
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FilterIcon className="w-4 h-4" />
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

        <AnimatePresence>
          {dataInicial && dataFinal && (
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

export default FiltroFiscalRemotoResumo;