import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "@/components/input/InputData";
import { InputCaracter } from "../input/InputCaracter";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import {
  FilterIcon,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { InputMultiSelect } from "../input/InputMultiSelect";
import configuradorService from "@/services/configurador.service";

interface FiltroGravacoesURAProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onOrigemChange?: (value: string) => void;
  onDestinoChange?: (value: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date | undefined;
    dataFinal: Date | undefined;
    conexoesSelecionadas: string[];
    origem?: string;
    destino?: string;
  }) => void;
  quickFilters?: Array<{
    label: string;
    days: number;
  }>;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
}

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

const FiltroGravacoesURA: React.FC<FiltroGravacoesURAProps> = ({
  onInicioChange,
  onFimChange,
  onOrigemChange,
  onDestinoChange,
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
  const origemlabel = t("comum.origem");
  const destinolabel = t("comum.destino");
  const filtros = t("comum.filtros");
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("supervisorremotolojasURA"));
  const [headerColor, setHeaderColor] = useState<string>("");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [dataInicial, setDataInicial] = useState<Date | undefined>(() => StorageUtils.lerData("gravacoesURAdataInicial") ?? new Date());
  const [dataFinal, setDataFinal] = useState<Date | undefined>(() => StorageUtils.lerData("gravacoesURAdataFinal") ?? new Date());
  const [origem, setOrigem] = useState<string>(() => StorageUtils.lerString("gravacoesURAorigem") ?? "");
  const [destino, setDestino] = useState<string>(() => StorageUtils.lerString("gravacoesURAdestino") ?? "");
  const [tablelojas, setTableLojas] = useState<any[]>([]);

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;
    setDataInicial(date);
    setActiveQuickFilter(null);
    StorageUtils.salvarData("gravacoesURAdataInicial", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;
    setDataFinal(date);
    setActiveQuickFilter(null);
    StorageUtils.salvarData("gravacoesURAdataFinal", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };

  const handleOrigem = (id: string, value: string): void => {
    setOrigem(value);
    StorageUtils.salvarString("gravacoesURAorigem", value);
    if (onOrigemChange) {
      onOrigemChange(value);
    }
  };

  const handleDestino = (id: string, value: string): void => {
    setDestino(value);
    StorageUtils.salvarString("gravacoesURAdestino", value);
    if (onDestinoChange) {
      onDestinoChange(value);
    }
  };

    function filtrarLojas(idUsuario: number): void {
      configuradorService
        .listarLojasViaURA(idUsuario)
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
    origemVal = origem,
    destinoVal = destino,
    conexoes = selecionados
  ) => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          dataInicial: inicio,
          dataFinal: fim,
          origem: origemVal,
          destino: destinoVal,
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
      handleAplicarFiltro(startDate, today, origem, destino);
    }, 100);
  };

  const handleMultiSelectChange = (id: string, newValue: string[]) => {
    setSelecionados(newValue);
    StorageUtils.salvarArrayString("supervisorremotolojasURA", newValue);
  };

  const handleResetFiltros = () => {
    setDataInicial(new Date());
    setDataFinal(new Date());
    setOrigem("");
    setDestino("");
    setActiveQuickFilter(null);

    StorageUtils.salvarData("gravacoesURAdataInicial", new Date());
    StorageUtils.salvarData("gravacoesURAdataFinal", new Date());
    StorageUtils.salvarString("gravacoesURAorigem", "");
    StorageUtils.salvarString("gravacoesURAdestino", "");

    if (onInicioChange) onInicioChange(new Date());
    if (onFimChange) onFimChange(new Date());
    if (onOrigemChange) onOrigemChange("");
    if (onDestinoChange) onDestinoChange("");

    setTimeout(() => {
      handleAplicarFiltro(new Date(), new Date(), "", "");
    }, 100);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString('pt-BR');
  };

  const getFiltrosText = () => {
    const periodo = dataInicial && dataFinal
      ? `Período: ${formatDate(dataInicial)} → ${formatDate(dataFinal)}`
      : "";

    const filtrosAdicionais = [];
    if (origem) filtrosAdicionais.push(`Origem: ${origem}`);
    if (destino) filtrosAdicionais.push(`Destino: ${destino}`);

    const adicionais = filtrosAdicionais.length > 0
      ? ` • ${filtrosAdicionais.join(" • ")}`
      : "";

    return `${periodo}${adicionais}`;
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
      className="mb-4"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-lg">
        <div className="p-4">
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
                    {getFiltrosText()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFiltros}
                className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("comum.limpar")}
              </Button>

              {showAdvanced && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {showFilters ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      {t("comum.ocultar")}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      {t("comum.mostrar")}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {t("comum.filtrosrapidos")}:
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
                      {/* Data Inicial */}
                      <div className="md:col-span-2">
                        <InputData
                          id="dataInicial"
                          date={dataInicial}
                          caption={selecaodatainicial}
                          onChange={handleInicio}
                          obrigatorio={true}
                        />
                      </div>

                      {/* Data Final */}
                      <div className="md:col-span-2">
                        <InputData
                          id="dataFinal"
                          date={dataFinal}
                          caption={selecaodatafinal}
                          onChange={handleFim}
                          obrigatorio={true}
                        />
                      </div>

                      {/* Origem */}
                      <div className="md:col-span-2">
                        <InputCaracter
                          id="origem"
                          label={origemlabel}
                          value={origem}
                          onChange={handleOrigem}
                        />
                      </div>

                      {/* Destino */}
                      <div className="md:col-span-2">
                        <InputCaracter
                          id="destino"
                          label={destinolabel}
                          value={destino}
                          onChange={handleDestino}
                        />
                      </div>

                      <div className="md:col-span-4">
                        <InputMultiSelect
                          id="idConexao"
                          label={selecaolojas}
                          value={selecionados}
                          options={tablelojas.map((opcao) => ({
                            label: opcao.loja,
                            value: String(opcao.idconexao),
                          }))}
                          disabled={false}
                          obrigatorio={true}
                          onChange={handleMultiSelectChange}
                        />
                      </div>

                      {/* Botão Aplicar */}
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
                          `}
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Versão compacta quando showAdvanced é false */}
        {!showAdvanced && (
          <div className="p-4 border-t">
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

              <div className="md:col-span-2">
                <InputCaracter
                  id="origem"
                  label={origemlabel}
                  value={origem}
                  onChange={handleOrigem}
                />
              </div>

              <div className="md:col-span-2">
                <InputCaracter
                  id="destino"
                  label={destinolabel}
                  value={destino}
                  onChange={handleDestino}
                />
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={() => handleAplicarFiltro()}
                  disabled={carregando}
                  className="w-full h-10 mt-5 bg-blue-600 hover:bg-blue-700 text-white"
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
        )}

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

export default FiltroGravacoesURA;