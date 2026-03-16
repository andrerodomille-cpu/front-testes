import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { InputData } from "@/components/input/InputData";
import { InputSelect } from "../input/InputSelect";
import { Button } from "../ui/button";
import { FilterIcon, Loader2 } from "lucide-react";
import configuradorService from "@/services/configurador.service";
import conexaoclienteService from "@/services/conexaocliente.service";
import { StorageUtils } from "@/utils/storageUtils";
import { InputSingleSelect } from "../input/InputSingleSelect";

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
interface EventChange {
  value: string | number | Date;
}
interface FiltroEvolucaoRiscoPerdaProps {
  onLojaChange?: (id: string) => void;
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onRiscoChange?: (id: number) => void;
  onFiltrar?: () => void;
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

const FiltroEvolucaoRiscoPerda: React.FC<FiltroEvolucaoRiscoPerdaProps> = ({
  onLojaChange,
  onInicioChange,
  onFimChange,
  onRiscoChange,
  onFiltrar,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaoloja = t("comum.selecaoloja");
  const [tableLojas, setTableLojas] = useState<any[]>([]);
  const [tableRiscos, setTableRiscos] = useState<any[]>([]);
  const [idRisco, setIdRisco] = useState<number>(29);
  const [idConexao, setIdConexao] = useState<string | null>(() => {
    const storedValue = localStorage.getItem("idConexaoEnterprise");
    return storedValue ? JSON.parse(storedValue) : null;
  });

  function filtrarLojas(idUsuario: number, idEmpresa: number): void {
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

  function listarRiscos() {
    configuradorService.ListaRiscos().then((response) => {
      setTableRiscos(response.data);
    });
  }

  const salvarDataNoLocalStorage = (key: string, date: Date) => {
    localStorage.setItem(key, JSON.stringify(date.toISOString()));
  };

  const [dataInicial, setDataInicial] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("dataInicioEnterprise")
  );

  const [dataFinal, setDataFinal] = useState<Date | undefined>(() =>
    parseLocalStorageDateOrDefault("dataFimEnterprise")
  );

  const handleInicio = (date: Date | undefined): void => {
    if (!date) return;

    setDataInicial(date);
    salvarDataNoLocalStorage("dataInicioEnterprise", date);
    if (onInicioChange) {
      onInicioChange(date);
    }
  };

  const handleFim = (date: Date | undefined): void => {
    if (!date) return;

    setDataFinal(date);
    salvarDataNoLocalStorage("dataFimEnterprise", date);
    if (onFimChange) {
      onFimChange(date);
    }
  };

  const handleLojas = (id: string): void => {
    setIdConexao(id);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));
    if (onLojaChange) {
      onLojaChange(id);
    }
  };

  const handleRisco = (id: number): void => {
    setIdRisco(id);
    if (onRiscoChange) {
      onRiscoChange(id);
    }
  };

  const aplicarFiltro = async () => {
    setIsLoading(true);
    if (onFiltrar) {
      try {
        await onFiltrar(); // espera o filtro terminar
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const retrieveParamsString = localStorage.getItem("user");
    listarRiscos();
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
          
          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/12 min-w-[140px]">
            <InputData
              id="dataInicial"
              colSpan={1}
              date={dataInicial}
              caption={selecaodatainicial}
              obrigatorio={true}
              onChange={handleInicio}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/12 min-w-[140px]">
            <InputData
              id="dataFinal"
              colSpan={1}
              date={dataFinal}
              onChange={handleFim}
              obrigatorio={true}
              caption={selecaodatafinal}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/6 min-w-[140px]">
            <InputSingleSelect
              id="idConexao"
              label={selecaoloja}
              value={`${idConexao}`}
              options={tableLojas.map((opcao) => ({
                label: opcao.loja,
                value: String(opcao.idconexao),
              }))}
              colSpan={2}
              disabled={false}
              obrigatorio={true}
              onChange={(_, newValue) => handleLojas(newValue)}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/6 min-w-[140px]">
            <InputSingleSelect
              id="idRisco"
              label={t("riscos.selecaorisco")}
              value={`${idRisco}`}
              options={tableRiscos.map((opcao) => ({
                label: t(`riscos.${opcao.nome_fisico}`),
                value: String(opcao.id_risco),
              }))}
              colSpan={2}
              disabled={false}
              obrigatorio={true}
              onChange={(_, newValue) => handleRisco(Number(newValue))}
            />
          </div>

          <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/6 min-w-[140px]">
            <Button
              variant="outline"
              onClick={aplicarFiltro}
              className="mt-6 h-7 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 text-xs rounded w-full flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              {carregando ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <FilterIcon className="w-3 h-3" />
              )}
              {carregando ? "Aplicando..." : "Aplicar Filtro"}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2"></div>
      </div>

      <div className="w-full sm:flex-1 md:basis-1/6 lg:basis-1/12 flex items-end min-w-[140px]"></div>
    </>
  );
};

export default FiltroEvolucaoRiscoPerda;
