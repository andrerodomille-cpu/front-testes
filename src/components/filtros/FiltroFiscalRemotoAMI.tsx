import React, { useEffect, useState } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import { InputSingleSelect } from "../input/InputSingleSelect";
import { FilterIcon, Loader2 } from "lucide-react";

interface RetrieveParams {
  id: number;
  id_empresa: number;
}

interface URA {
  idura: string;
  nome: string;
}

interface FiltroProps {
  onLojaChange?: (loja: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date;
    dataFinal: Date;
    conexaoSelecionada: string;
  }) => void;
}

const inicioDoDia = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const fimDoDia = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const FiltroFiscalRemotoAMI: React.FC<FiltroProps> = ({
  onLojaChange,
  onAplicarFiltro,
}) => {
  const { t } = useTranslation();
  const [carregando, setIsLoading] = useState(false);
  const [tablelojas, setTableLojas] = useState<any[]>([]);
  const [idURA, setIdURA] = useState<string | null>(() => {
    const stored = localStorage.getItem("idConexaoSmartCart");
    return stored ? JSON.parse(stored) : null;
  });

  const [selecionado, setSelecionado] = useState<string>("");

  function filtrarLojas() {
    configService.listarURAS().then((response) => {
      setTableLojas(response.data);
    });
  }

  const handleLojas = (id: string) => {
    setIdURA(id);
    setSelecionado(id);

    const opcaoSelecionada = tablelojas.find(
      (opcao) => String(opcao.id_ura) === id
    );

    onLojaChange?.(opcaoSelecionada?.nome);
  };

  const handleAplicarFiltro = async () => {
    if (!selecionado) return;
    setIsLoading(true);
    try {
      await onAplicarFiltro?.({
        dataInicial: inicioDoDia(),
        dataFinal: fimDoDia(),
        conexaoSelecionada: selecionado,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const retrieveParamsString = localStorage.getItem("user");

    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas();
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 items-end">

        <div className="w-full sm:flex-1 max-w-[400px] min-w-[200px]">
          <InputSingleSelect
            id="idUra"
            label={t("comum.selecaolojas")}
            value={idURA ?? ""}
            options={tablelojas.map((opcao) => ({
              label: opcao.nome,
              value: String(opcao.id_ura),
            }))}
            obrigatorio
            onChange={(_, value) => handleLojas(value)}
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
  );
};

export default FiltroFiscalRemotoAMI;
