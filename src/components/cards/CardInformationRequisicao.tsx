import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  XCircle,
  XSquare,
  Tag,
  Search,
  PauseCircle,
  DivideSquare,
  RefreshCcw,
  Printer,
  CreditCard
} from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { getFontSizeTitulo, getFontSizeSubTitulo, getFontSizeValor, getFontSizeDetalhe } from "@/utils/fontSizes";
import { useTranslation } from "react-i18next";

interface CardsInformationProps {
  id_requisicao: number;
  titulo: string;
  valor1?: string | string;
  valor2?: string | string;
  valor3?: string | string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

const iconesPorIdRequisicao: Record<number, JSX.Element> = {
  1: <XCircle className="text-red-500" />,          // Cancelamento Cupom
  2: <XSquare className="text-red-400" />,          // Cancelamento Item
  3: <Tag className="text-green-500" />,            // Desconto Item
  4: <Search className="text-blue-500" />,          // Consulta
  5: <PauseCircle className="text-yellow-500" />,   // Pausa
  6: <DivideSquare className="text-purple-500" />,  // Multiplicação
  7: <RefreshCcw className="text-orange-500" />,    // Troca Finalizadora
  8: <Printer className="text-gray-500" />,         // Reimp. Cupom Fiscal
  9: <CreditCard className="text-teal-500" />,      // Reimp. Comprov. Cart
};

const CardInformationRequisicao: React.FC<CardsInformationProps> = ({
  id_requisicao,
  titulo,
  valor1 = "N/A",
  valor2 = "N/A",
  valor3 = "N/A",
  carregando,
  erro,
  apresentacao = false,
}) => {
  const tamanhoFonteTitulo = getFontSizeTitulo(apresentacao);
  const tamanhoFonteSubTitulo = getFontSizeSubTitulo(apresentacao);
  const tamanhoFonteValor = getFontSizeValor(apresentacao);
  const tamanhoFonteDetalhe = getFontSizeDetalhe(apresentacao);
  const { t } = useTranslation();
  
  const iconSize = apresentacao ? "h-8 w-8" : "h-4 w-4";

  if (carregando) {
    return (
      <Card className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t rounded-b">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4" />
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="mt-2 w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700"
      >
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
        <div className="flex flex-col">
          <AlertTitle className="font-bold">{t("comun.errocarregardados")}</AlertTitle>
          <AlertDescription>
            {t("comun.naofoipossivelcarregarinformacoes")}
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  // Seleciona ícone pelo ID ou usa fallback
  const icone = iconesPorIdRequisicao[id_requisicao]
    ? React.cloneElement(iconesPorIdRequisicao[id_requisicao], {
        className: `${iconSize} ${iconesPorIdRequisicao[id_requisicao].props.className}`,
      })
    : <AlertCircle className={`${iconSize} text-gray-400`} />;

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t rounded-b">
      <p className="text-start flex items-center gap-2">
        {icone}
        <LabelCardTitulo bold={true} size={tamanhoFonteValor}>
          {titulo}
        </LabelCardTitulo>
      </p>

      <p className="text-start">
        <LabelCardValor bold={true} size={tamanhoFonteSubTitulo}>
          {t("supervisor.quantidadeRequisicoes")}: {valor1}
        </LabelCardValor>
      </p>

      <p className="text-start">
        <LabelCardValor bold={true} size={tamanhoFonteSubTitulo}>
          {t("supervisor.tempogasto")}: {valor2}
        </LabelCardValor>
      </p>

      <p className="text-start">
        <LabelCardValor bold={true} size={tamanhoFonteSubTitulo}>
          {t("supervisor.tempomedio")}: {valor3}
        </LabelCardValor>
      </p>
    </Card>
  );
};

export default CardInformationRequisicao;
