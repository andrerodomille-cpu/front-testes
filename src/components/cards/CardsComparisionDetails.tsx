import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { ColorHex } from "@/utils/colorUtils";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";

interface CardsComparisionProps {
  titulo?: string;
  valorAtual?: string;
  valorAnterior?: string;
  maior: string;
  menor: string;
  porcentagem?: string;
  textoAtual?: string;
  textoAnterior?: string;
  cor: string | undefined;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  
}

export const CardsComparisionDetails = ({
  titulo,
  valorAtual,
  valorAnterior,
  maior,
  menor,
  porcentagem,
  textoAtual,
  textoAnterior,
  cor,
  carregando = false,
  erro = false,
  apresentacao = false
}: CardsComparisionProps) => {
  const badgeColor = ColorHex(cor);
  const { t } = useTranslation();
  if (carregando) {
    return (
      <Card className="w-full text-sm bg-neutral-50 dark:bg-gray-800 p-4 space-y-3">
        <Skeleton className="h-5 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3 mb-4" />
        <Skeleton className="h-48 w-full rounded-md" />
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
          <AlertTitle className="font-bold">{t("comum.errocarregardados")}</AlertTitle>
          <AlertDescription>
          {t("comum.naofoipossivelcarregarinformacoes")}
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="w-full h-full bg-stone-100 dark:bg-gray-800 p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <div className="col-span-3">
          <LabelCardTitulo bold={true}>{titulo}</LabelCardTitulo>
        </div>
        <div className="flex flex-col items-end">
          <Badge
            className="px-2 py-0.5 sm:text-md flex items-center justify-center gap-1 text-white rounded-t rounded-b"
            style={{ backgroundColor: badgeColor }}
          >
            {cor === "red" ? (
              <ArrowDownCircleIcon className="w-4 h-4" />
            ) : (
              <ArrowUpCircleIcon className="w-4 h-4" />
            )}
            {porcentagem}
          </Badge>
        </div>
      </div>

      <p>
        <Label
          style={{ color: badgeColor }}
          className="text-3xl font-medium text-gray-600 dark:text-gray-100"
        >
          {valorAtual}
        </Label>
      </p>

      <p>
        <LabelCardSubTitulo bold={false}>
          {textoAnterior} {valorAnterior}
        </LabelCardSubTitulo>
      </p>

      <p>
        <Label
          style={{ color: badgeColor }}
          className="!text-xs font-medium"
        >
          {textoAtual}
        </Label>
      </p>

      {/* Nova linha com duas colunas */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-md p-2">
          <LabelCardTitulo bold={true}>{t("comum.maiorvalor")}</LabelCardTitulo>
          <LabelCardTitulo bold={false}>{maior}</LabelCardTitulo>
        </div>
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-md p-2">
          <LabelCardTitulo bold={true}>{t("comum.menorvalor")}</LabelCardTitulo>
          <LabelCardTitulo bold={false}>{menor}</LabelCardTitulo>
        </div>
      </div>
    </Card>
  );
};
