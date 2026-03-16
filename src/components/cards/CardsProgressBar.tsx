import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { ColorHex } from "@/utils/colorUtils";
import { formatInteger, formatPercentage, formatPercentageInteger } from "@/utils/formatUtils";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";

interface CardsProgressBarProps {
  titulo: string;
  total: number;
  porcentagem: number;
  porcentagemOK: number;
  corBarra: string;
  textoOK: string;
  totalOK: number;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

export const CardsProgressBar = ({
  titulo,
  total,
  porcentagem,
  porcentagemOK,
  corBarra,
  textoOK,
  totalOK,
  carregando = false,
  erro = false,
  apresentacao = false
}: CardsProgressBarProps) => {

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

  const barra = corBarra ? ColorHex(corBarra) : "";
  const progressoPercentual = Math.min(Math.max(porcentagem, 0), 100);

  return (
    <Card className="w-full h-full text-xs bg-gray-100 dark:bg-gray-800 p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-gap-2">
        <div className="flex flex-col items-start">
          <LabelCardTitulo bold={false} >{titulo}</LabelCardTitulo>
        </div>
      </div>

      <p>
        <LabelCardValor bold={false}>{formatInteger(total)}</LabelCardValor>
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
        <div
          className={cn("h-2.5 rounded-full")}
          style={{ width: `${progressoPercentual}%`, backgroundColor: barra }}
        ></div>
      </div>

      <p>
        <LabelCardSubTitulo bold={false}> {textoOK} {totalOK} &bull; {formatPercentageInteger(porcentagemOK)}</LabelCardSubTitulo>
      </p>

    </Card>
  );
};
