import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputMultiSelect } from "../input/InputMultiSelect";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import {
  FilterIcon,
  Loader2,
  Calendar,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import configuradorService from "@/services/configurador.service";

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

interface FiltroFiscalRemotoProps {
  onAplicarFiltro?: (filtros: {
    conexoesSelecionadas: string[];
  }) => void;
  showAdvanced?: boolean;
  defaultExpanded?: boolean;
}

const FiltroAoVivo: React.FC<FiltroFiscalRemotoProps> = ({
  onAplicarFiltro,
  showAdvanced = false,
  defaultExpanded = true
}) => {
  const { t } = useTranslation();
  const selecaolojas = t("comum.selecaolojas");
  const filtros = t("comum.filtros");
  const [headerColor, setHeaderColor] = useState<string>("");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("supervisorremotolojas"));
  
  function filtrarLojas(idUsuario: number): void {
    configuradorService.listarLojasUsuario(idUsuario, 0).then((response) => {
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
    conexoes = selecionados
  ) => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          conexoesSelecionadas: conexoes,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiSelectChange = (id: string, newValue: string[]) => {
    setSelecionados(newValue);
    StorageUtils.salvarArrayString("supervisorremotolojas", newValue);
  };

  const getLojaCountText = () => {
    if (selecionados.length === 0) return "Todas as lojas";
    if (selecionados.length === 1) return "1 loja selecionada";
    return `${selecionados.length} lojas selecionadas`;
  };

  const getPrimaryColor = () => {
    if (headerColor.includes('from-')) {
      const match = headerColor.match(/from-([^\s]+)/);
      return match ? match[1].split('-')[1] || 'blue' : 'blue';
    }
    return 'blue';
  };

  const primaryColor = getPrimaryColor();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-2">

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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getLojaCountText()}
                  </p>
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
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className={`h-4 w-4 text-${primaryColor}-500`} />
                      <LabelCardTitulo bold={false}>
                        {t("comum.filtrospersonalizados")}
                      </LabelCardTitulo>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
                          obrigatorio={false}
                          onChange={handleMultiSelectChange}
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

      </Card>
    </motion.div>
  );
};


export default FiltroAoVivo;