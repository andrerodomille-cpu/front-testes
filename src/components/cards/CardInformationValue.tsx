import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { Label } from "../ui/label";
import { LabelCabecalho } from "../labels/labelCabecalho";
import { getFontSizeTitulo } from "@/utils/fontSizes";
import { getFontSizeSubTitulo } from "@/utils/fontSizes";
import { getFontSizeValor } from "@/utils/fontSizes";
import { getFontSizeDetalhe } from "@/utils/fontSizes"; 
import { useTranslation } from "react-i18next";

interface CardsInformationProps {
  titulo: string;
  valor?: string | string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

const CardInformationValue: React.FC<CardsInformationProps> = ({
  titulo,
  valor = "N/A",
  carregando,
  erro,
  apresentacao = false
}) => {

  const tamanhoFonteTitulo = getFontSizeTitulo(apresentacao);
  const tamanhoFonteSubTitulo = getFontSizeSubTitulo(apresentacao);
  const tamanhoFonteValor = getFontSizeValor(apresentacao);
  const tamanhoFonteDetalhe = getFontSizeDetalhe(apresentacao);
  const { t } = useTranslation();

  if (carregando) {
    return (
      <Card className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border shadow-md rounded-t rounded-b">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4" />
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700 rounded-t rounded-b"
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
    <Card className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t rounded-b">

      <p className="text-center">      
          <LabelCardTitulo bold={false} size={tamanhoFonteTitulo}>
            {titulo}
          </LabelCardTitulo>
      </p>

      <div>
        <p className="mt-3"></p>
      </div>
      
      <p className="text-center">
        <LabelCardValor bold={false} size={tamanhoFonteValor}>
          {valor}
        </LabelCardValor>
      </p>

      <div>
        <p className="mt-3"></p>
      </div>

    </Card>
  );
};

export default CardInformationValue;
