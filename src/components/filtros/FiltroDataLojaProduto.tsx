import React, { useState, useEffect } from "react";
import configService from "@/services/configurador.service";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { InputData } from "@/components/input/InputData";
import { StorageUtils } from "@/utils/storageUtils";
import { Button } from "../ui/button";
import { InputSingleSelect } from "../input/InputSingleSelect";
import { FilterIcon, Loader2 } from "lucide-react";
import { CampoBusca } from "../crud/CampoBusca";
import { Dialog,DialogContent } from "@/components/ui/dialog";
import BuscaProdutoConexao from "../produtos/BuscaProdutoConexao";

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

interface Produto {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor: number;
  valor_medio_unitario: number;
}

interface FiltroProps {
  onInicioChange?: (date: Date) => void;
  onFimChange?: (date: Date) => void;
  onLojaChange?: (loja: string) => void;
  onProdutoChange?: (ProdutoEAN: string) => void;
  onAplicarFiltro?: (filtros: {
    dataInicial: Date | undefined;
    dataFinal: Date | undefined;
    conexoesSelecionadas: string[];
    produtoEAN: string;
  }) => void;
}

const FiltroDataLojaProduto: React.FC<FiltroProps> = ({
  onInicioChange,
  onFimChange,
  onLojaChange,
  onProdutoChange,
  onAplicarFiltro,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const [carregando, setIsLoading] = useState(false);
  const [tableLojas, setTableLojas] = useState<ItemLoja[]>([]);
  const [idConexao, setIdConexao] = useState<string | null>(() => {
    const storedValue = localStorage.getItem("idConexaoSmartCart");
    return storedValue ? JSON.parse(storedValue) : null;
  });
  const [selecionados, setSelecionados] = useState<string[]>(
    () => StorageUtils.lerArrayString("supervisorremotolojas") || []
  );
  const [dataInicial, setDataInicial] = useState<Date | undefined>(
    () => StorageUtils.lerData("supervisorremotoinicio") ?? new Date()
  );
  const [dataFinal, setDataFinal] = useState<Date | undefined>(
    () => StorageUtils.lerData("supervisorremotofim") ?? new Date()
  );
  const [loja, setLoja] = useState<string>("");
  const [produtoEAN, setProdutoEAN] = useState<string>("");

  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [isOpenProdutos, setIsOpenProdutos] = useState(false);

  // 🧭 Traduções agrupadas
  const labels = {
    dataInicial: t("comum.selecaodatainicial"),
    dataFinal: t("comum.selecaodatafinal"),
    loja: t("comum.selecaoloja"),
    aplicar: t("comum.aplicarfiltro"),
    aplicando: t("comum.aplicando"),
  };

  // 🔄 Carregar lojas do usuário
  const filtrarLojas = async (idUsuario: number, idEmpresa: number) => {
    try {
      const response = await configService.listarLojasUsuario(idUsuario, idEmpresa);
      const listaLojas = response.data.map((item: Loja) => ({
        value: item.idconexao,
        label: item.loja,
      }));
      setTableLojas(listaLojas);
    } catch (error) {
      console.error("Erro ao listar lojas:", error);
    }
  };

  // 🧩 Selecionar produto
  const handleSelectProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setProdutoEAN(produto.codigo);
    onProdutoChange?.(produto.codigo);
  };

  // 🧭 Atualizar datas
  const handleInicio = (date?: Date) => {
    if (!date) return;
    setDataInicial(date);
    StorageUtils.salvarData("supervisorremotoinicio", date);
    onInicioChange?.(date);
  };

  const handleFim = (date?: Date) => {
    if (!date) return;
    setDataFinal(date);
    StorageUtils.salvarData("supervisorremotofim", date);
    onFimChange?.(date);
  };

  // 🏪 Selecionar loja
  const handleLojas = (id: string) => {
    setIdConexao(id);
    setSelecionados([id]);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));

    const opcaoSelecionada = tableLojas.find(
      (opcao) => String(opcao.value) === id
    );
    if (opcaoSelecionada) {
      setLoja(opcaoSelecionada.label);
      onLojaChange?.(opcaoSelecionada.label);
    }
  };

  // 🚀 Aplicar filtro
  const handleAplicarFiltro = async () => {
    if (!dataInicial || !dataFinal || !idConexao) {
      alert("Preencha todos os campos obrigatórios antes de aplicar o filtro.");
      return;
    }

    setIsLoading(true);
    try {
      await onAplicarFiltro?.({
        dataInicial,
        dataFinal,
        conexoesSelecionadas: selecionados,
        produtoEAN,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Inicialização
  useEffect(() => {
    const retrieveParamsString = localStorage.getItem("user");
    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      filtrarLojas(retrieveParams.id, retrieveParams.id_empresa);
    } else {
      console.error("Nenhum dado foi encontrado no localStorage.");
    }
  }, []);

  // 🖼️ Render
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-wrap gap-3">
        <InputData
          id="dataInicial"
          date={dataInicial}
          caption={labels.dataInicial}
          obrigatorio
          onChange={handleInicio}
        />

        <InputData
          id="dataFinal"
          date={dataFinal}
          caption={labels.dataFinal}
          obrigatorio
          onChange={handleFim}
          
        />

        <InputSingleSelect
          id="idConexao"
          label={labels.loja}
          value={idConexao ?? ""}
          options={tableLojas}
          obrigatorio
          onChange={(_, newValue) => handleLojas(newValue)}
          
        />

        <div className="flex-1 min-w-[250px] sm:min-w-[450px]">
          <CampoBusca
            id="produto"
            caption="Produto"
            somenteleitura={false}
            selectedItem={produtoSelecionado || undefined}
            onBuscarClick={() => setIsOpenProdutos(true)}
            formatDisplay={(item) => `${item.codigo} - ${item.descricao}`}
          />
        </div>

        <div className="w-full sm:w-auto flex items-end">
          <Button
            variant={carregando ? "secondary" : "outline"}
            onClick={handleAplicarFiltro}
            className="h-9 w-20 sm:w-auto text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 text-xs rounded flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-500"
            title="Aplicar filtro"
            aria-label="Aplicar filtro"
          >
            {carregando ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <FilterIcon className="w-3 h-3" />
            )}
            {carregando ? labels.aplicando : labels.aplicar}
          </Button>
        </div>
      </div>

      <Dialog open={isOpenProdutos} onOpenChange={setIsOpenProdutos}>
        <DialogContent className="max-w-4xl bg-gray-100 dark:bg-gray-800">
          <BuscaProdutoConexao
            idConexao={Number(idConexao)}
            inicio={dataInicial?.toISOString().split("T")[0] || ""}
            fim={dataFinal?.toISOString().split("T")[0] || ""}
            onSelect={(produto) => {
              handleSelectProduto(produto);
              setIsOpenProdutos(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FiltroDataLojaProduto;