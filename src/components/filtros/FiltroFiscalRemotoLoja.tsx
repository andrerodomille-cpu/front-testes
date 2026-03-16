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

interface FiltroFiscalRemotoLojaProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date | undefined;
    dataFinal: Date | undefined;
    conexoesSelecionadas: string[];
  }) => void;
  quickFilters?: Array<{
    label: string;
    days: number;
  }>;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
}

const FiltroFiscalRemotoLoja: React.FC<FiltroFiscalRemotoLojaProps> = ({
  onInicioChange,
  onFimChange,
  onLojaChange,
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
          dataInicial: defaultStart,
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
      className="mb-2"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-b rounded-t">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r from-${primaryColor}-50 to-${primaryColor}-100 dark:from-${primaryColor}-900/20 dark:to-${primaryColor}-800/20`}>
                <Building className={`h-4 w-4 text-${primaryColor}-600 dark:text-${primaryColor}-400`} />
              </div>
              <div>
                <LabelCardTitulo bold={false}>
                  {filtros} - Loja Específica
                </LabelCardTitulo>
                {dataInicial && dataFinal && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Período: {formatDate(dataInicial)} → {formatDate(dataFinal)} • {getLojaText()}
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

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-2">
                        <InputData
                          id="dataInicial"
                          date={dataInicial}
                          caption={selecaodatainicial}
                          onChange={handleInicio}
                          obrigatorio={true}
                        />
                      </div>

                      <div className="md:col-span-2">
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
                          className={`w-full px-4 py-2 bg-gradient-to-r from-${primaryColor}-600 to-${primaryColor}-700 hover:from-${primaryColor}-700 hover:to-${primaryColor}-800
                            text-white shadow hover:shadow-md flex items-center justify-center gap-2`}
                        >
                          {carregando ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <FilterIcon className="w-4 h-4" />
                          )}
                          {carregando ? t("comum.aplicando") : t("comum.aplicarfiltro")}
                        </Button>
                      </div>

                      
                    </div>
                  </div>

                  {/* 
                  {tablelojas.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Store className={`h-4 w-4 text-${primaryColor}-500`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lojas disponíveis ({tablelojas.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tablelojas.slice(0, 8).map((lojaItem) => (
                          <Badge
                            key={lojaItem.idconexao}
                            variant={idConexao === String(lojaItem.idconexao) ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${idConexao === String(lojaItem.idconexao) ? `bg-${primaryColor}-100 text-${primaryColor}-700 dark:bg-${primaryColor}-900 dark:text-${primaryColor}-300 border-${primaryColor}-200 dark:border-${primaryColor}-800` : ''}`}
                            onClick={() => handleLojas(String(lojaItem.idconexao))}
                          >
                            {lojaItem.loja}
                          </Badge>
                        ))}
                        {tablelojas.length > 8 && (
                          <Badge variant="outline" className="text-gray-500">
                            +{tablelojas.length - 8} mais...
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                   */}


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

export default FiltroFiscalRemotoLoja;