import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert,AlertDescription,AlertTitle, } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";

interface CardsValueProps {
  titulo: string;
  subTitulo: string;
  valor: number | string;
  cor?: string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

export const CardsValue = ({
  titulo,
  subTitulo,
  valor,
  cor,
  carregando,
  erro,
  apresentacao = false
}: CardsValueProps) => {
  
  const { t } = useTranslation();
  if (carregando) {
    return (      
      <Card className="w-full text-sm bg-neutral-50 dark:bg-gray-800 p-3 sm:p-4 space-y-2 rounded-b rounded-t">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700 rounded-b rounded-t"
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
    <Card className="w-full h-full text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-b rounded-t">
      <LabelCardTitulo  bold={false} color={cor}>{titulo}</LabelCardTitulo>
      <div className="mt-1">
        <LabelCardValor bold={true} color={cor}>{valor}</LabelCardValor>
      </div>

      <div className="mt-1">
        <LabelCardSubTitulo bold={false}>{subTitulo}</LabelCardSubTitulo>
      </div>

    </Card>
  );
};
