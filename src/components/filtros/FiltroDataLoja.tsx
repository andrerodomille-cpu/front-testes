import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { InputData } from "@/components/input/InputData";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import { InputSingleSelect } from "../input/InputSingleSelect";
import { FilterIcon, Loader2 } from "lucide-react";

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
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date | undefined;
    dataFinal: Date | undefined;
    conexoesSelecionadas: string[];
  }) => void;
}


const FiltroDataLoja: React.FC<FiltroProps> = ({
  onInicioChange,
  onFimChange,
  onLojaChange,
  onAplicarFiltro,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaolojas = t("comum.selecaoloja");
  const filtros = t("comum.filtros");
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [idConexao, setIdConexao] = useState<string | null>(() => {
    const storedValue = localStorage.getItem("idConexaoSmartCart");
    return storedValue ? JSON.parse(storedValue) : null;
  });
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("centralvideolojas"));
  const [dataInicial, setDataInicial] = useState<Date | undefined>(() => StorageUtils.lerData("centralvideoinicio") ?? new Date());
  const [dataFinal, setDataFinal] = useState<Date | undefined>(() => StorageUtils.lerData("centralvideofim") ?? new Date());
  const [loja, setLoja] = useState<string>("");

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;
    setDataInicial(date);
    StorageUtils.salvarData("centralvideoinicio", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;
    setDataFinal(date);
    StorageUtils.salvarData("centralvideofim", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };

  function filtrarLojas(idUsuario: number, idEmpresa: number): void {
    configService.listarLojasUsuario(idUsuario, idEmpresa).then((response) => {
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
  };

  const handleAplicarFiltro = async () => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          dataInicial,
          dataFinal,
          conexoesSelecionadas: selecionados,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLojas = (id: string): void => {
    setIdConexao(id);
    setSelecionados([id]);

    const opcaoSelecionada = tablelojas.find(
      (opcao) => String(opcao.idconexao) === id
    );

    setLoja(opcaoSelecionada.loja);


    if (onLojaChange) {
      onLojaChange(opcaoSelecionada.loja);

    }
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }

    const retrieveParamsString = localStorage.getItem("user");

    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas(retrieveParams.id, retrieveParams.id_empresa);
    } else {
      console.error("Nenhum dado foi encontrado no localStorage.");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-wrap gap-2">
          <div className="w-full sm:flex-1 md:basis-1/1 lg:basis-1/1 min-w-[140px]">
            <InputData
              id="dataInicial"
              colSpan={1}
              date={dataInicial}
              caption={selecaodatainicial}
              obrigatorio={true}
              onChange={handleInicio}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/1 lg:basis-1/1 min-w-[140px]">
            <InputData
              id="dataFinal"
              colSpan={1}
              date={dataFinal}
              onChange={handleFim}
              obrigatorio={true}
              caption={selecaodatafinal}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/1 lg:basis-1/1 min-w-[160px]">
            <InputSingleSelect
              id="idConexao"
              label={selecaolojas}
              value={`${idConexao}`}
              options={tablelojas.map((opcao) => ({
                label: opcao.loja,
                value: String(opcao.idconexao),
              }))}
              colSpan={1}
              disabled={false}
              obrigatorio={true}
              onChange={(_, newValue) => handleLojas(newValue)}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/1 lg:basis-1/1 min-w-[140px]">
            <Button
              variant="outline"
              onClick={handleAplicarFiltro}
              className="mt-6 h-7 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 text-xs rounded w-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              {carregando ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <FilterIcon className="w-3 h-3" />
              )}
              {carregando ? t("comum.aplicando") : t("comum.aplicarfiltro")}
            </Button>
          </div>

          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/6 min-w-[140px]">
          </div>

        </div>


      </div>
    </>
  );
};

export default FiltroDataLoja;
