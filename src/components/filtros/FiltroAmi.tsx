import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { Card } from "@/components/ui/card";
import { InputData } from "@/components/input/InputData";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { Button } from "../ui/button";
import { InputSingleSelect } from "../input/InputSingleSelect";
import { FilterIcon, Loader2 } from "lucide-react";
import { StorageUtils } from "@/utils/storageUtils";

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
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    idconexao: string | undefined;
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
    console.warn(
      `Erro ao fazer o parse do valor armazenado em "${key}":`,
      error
    );
  }
  return new Date();
}

const FiltroAmi: React.FC<FiltroProps> = ({
  onLojaChange,
  onAplicarFiltro
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [carregando, setIsLoading] = useState<boolean>(false);
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaoloja = t("comum.selecaoloja");
  const filtros = t("comum.filtros");
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("supervisorremotolojas"));
  const [loja, setLoja] = useState<string>("");
  const [tablelojas, setTableLojas] = useState<any[]>([]);

  const [idconexao, setIdConexao] = useState<string | undefined>(() => {
    const storedValue = localStorage.getItem("idConexaoSmartCart");
    return storedValue ? JSON.parse(storedValue) : null;
  });


  const handleLojas = (id: string): void => {
    setIdConexao(id);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));
    if (onLojaChange) {
      onLojaChange(id);
    }
  };


  function filtrarLojas(idUsuario: number): void {
    configService
      .listarLojasSmartCart(idUsuario)
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

  const handleAplicarFiltro = async () => {
    setIsLoading(true);
    try {
      if (onAplicarFiltro) {
        await onAplicarFiltro({
          idconexao
        });
      }
    } finally {
      setIsLoading(false);
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
      filtrarLojas(retrieveParams.id);
    } else {
      console.error("Nenhum dado foi encontrado no localStorage.");
    }
  }, []);

  return (
    <div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap gap-2 ">            

            <div className="w-full sm:flex-4 md:basis-1/4 lg:basis-1/4 min-w-[160px]">
              <InputSingleSelect
                id="idConexao"
                label={selecaoloja}
                value={`${idconexao}`}
                options={tablelojas.map((opcao) => ({
                  label: opcao.loja,
                  value: String(opcao.idconexao),
                }))}
                colSpan={2}
                disabled={false}
                onChange={(_, newValue) => handleLojas(newValue)}
                obrigatorio={true}
              />
            </div>

            <div className="w-full sm:flex-4 md:basis-1/6 lg:basis-1/6 min-w-[35px]">
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

            <div className="gap=-2 w-full sm:flex-1 md:basis-1/4 lg:basis-1/4 min-w-[140px]">
            </div>

          </div>
        </div>


    </div>
  );
};

export default FiltroAmi;
