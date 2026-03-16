import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import cockpitServices from "@/services/cockpit.services";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { Card } from "@/components/ui/card";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputData } from "../input/InputData";
import { LabelSubTitulo } from "../labels/labelSubTitulo";
import { InputMultiSelect } from "../input/InputMultiSelect";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { CheckCircle, FilterIcon, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatarData } from "@/utils/dateUtils";
import { Label } from "../ui/label";
import { InputSelect } from "../input/InputSelect";
import { Loader2 } from "lucide-react";
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

interface FiltroCarrinhoProps {
  onAplicarFiltro?: (filtros: {
    conexoesSelecionadas: string[];
    datapublicacao: string;
    quantidadepublicaoes: string;
  }) => void;
}

const FiltroOcorrenciasIndicadores: React.FC<FiltroCarrinhoProps> = ({
  onAplicarFiltro
}) => {
  const { t } = useTranslation();
  const selecaodatainicial = t("comum.selecaodatainicial");
  const selecaodatafinal = t("comum.selecaodatafinal");
  const selecaolojas = t("comum.selecaolojas");
  const filtros = t("comum.filtros");
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>(() => StorageUtils.lerArrayString("ocorrenciaslojas"));
  const [opcoesDataPublicada, setOpcoesDataPublicada] = useState<{ label: string, value: string }[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [quantidadePublicacoes, setQuantidadePublicacoes] = useState("1");
  const [carregando, setIsLoading] = useState<boolean>(false);

  function filtrarLojas(idUsuario: number): void {
    configService.listarLojasOcorrencias(idUsuario).then((response) => {
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

  function filtrarDatasPublicacao(conexoes: string[]): void {
    cockpitServices
      .FiltrosDataPublicacao({ conexoesSelecionadas: conexoes })
      .then((response) => {
        const opcoes = response.data.map(
          (item: { data_publicacao: string }) => {
            const dataFormatada = formatarData(item.data_publicacao);
            return { label: dataFormatada, value: dataFormatada };
          }
        );
        setOpcoesDataPublicada(opcoes);
      })
      .catch((error) => {
        console.error("Erro ao carregar datas publicadas:", error.message);
      });
  }

  const handleMultiSelectChange = (id: string, newValue: string[]) => {
    setSelecionados(newValue);
    StorageUtils.salvarArrayString("ocorrenciaslojas", newValue);
  };

  const opcoesNumerosPublicacoes = Array.from({ length: 16 }, (_, i) => ({
    value: String(i + 1),
    label:
      i === 0
        ? "Publicação anterior"
        : `${i + 1} ${i === 0 ? "Publicação" : "últimas publicações"}`
  }));

const handleAplicarFiltro = async () => {
  setIsLoading(true);
  try {


    if (onAplicarFiltro) {
      await onAplicarFiltro({
        conexoesSelecionadas: selecionados,
        datapublicacao: dataSelecionada,
        quantidadepublicaoes: quantidadePublicacoes
      });
    }
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    const retrieveParamsString = localStorage.getItem("user");
    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas(retrieveParams.id);
    }

    if (selecionados.length > 0) {
      filtrarDatasPublicacao(selecionados);
    }
  }, [selecionados]);


  return (
          
      <div className="p-2">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-wrap gap-2 ">    

            <div className="col-span-1 sm:col-span-1 lg:col-span-2 px-2">
              <InputMultiSelect
                id="idConexao"
                label={selecaolojas}
                value={selecionados}
                options={tablelojas.map((opcao) => ({
                  label: opcao.loja,
                  value: String(opcao.idconexao),
                }))}
                colSpan={2}
                disabled={false}
                obrigatorio={true}
                onChange={handleMultiSelectChange}
              />
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2 px-2">
              <InputSingleSelect
                id="dataPublicacao"
                label="Data de Publicação"
                value={dataSelecionada}
                options={opcoesDataPublicada}
                obrigatorio={true}
                onChange={(id, newValue) => setDataSelecionada(newValue)}
                colSpan={1}
              />
            </div>

            <div className="col-span-1 sm:col-span-1 lg:col-span-2 px-2">
              <InputSingleSelect
                id="qtdPublicacoes"
                label="Quantas Publicações"
                value={quantidadePublicacoes}
                options={opcoesNumerosPublicacoes}
                obrigatorio={true}
                onChange={(id, newValue) => setQuantidadePublicacoes(newValue)}
                colSpan={2}
              />
            </div>


            <div className="col-span-1 sm:col-span-1 lg:col-span-1 px-2 flex items-end">
              <Button
                variant="outline"
                onClick={handleAplicarFiltro}
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
  );
};

export default FiltroOcorrenciasIndicadores;
