import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";

interface CardsInformationProps {
  titulo: string;
  valorAtual?: number | string;
  valorAnterior?: number | string;
  textoAnterior?: string;
  cor?: string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

const CardsInformation: React.FC<CardsInformationProps> = ({
  titulo,
  valorAtual = "N/A",
  valorAnterior = "N/A",
  textoAnterior = "",
  carregando,
  erro,
  cor,
  apresentacao = false
}) => {
  const { t } = useTranslation();

  if (carregando) {
    return (
      <Card className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border shadow-md">
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-8 w-1/3 mb-3" />
        <Skeleton className="h-4 w-1/2" />
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700"
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

  return (

    <Card className="w-full h-full text-xs bg-gray-100 dark:bg-gray-800 p-3">
      <LabelCardTitulo bold={false} color={cor}>{titulo}</LabelCardTitulo>
      <p>
        <LabelCardValor bold={true} color={cor}>{valorAtual}</LabelCardValor>
      </p>
      <LabelCardSubTitulo bold={false}>{valorAnterior} {textoAnterior}</LabelCardSubTitulo>
    </Card>
  );
};

export default CardsInformation;
