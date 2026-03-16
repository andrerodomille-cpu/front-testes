import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { useTranslation } from "react-i18next";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardsInformationProps {
  titulo: string;
  rodape?: string
  valor?: string | string;
  tipoValor?: "s" | "n";
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  mensagemErro?: string;
  tipoErro?: "network" | "server" | "data" | "auth" | "generic";
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

const CardsHome: React.FC<CardsInformationProps> = ({
  titulo,
  rodape = "",
  valor = "0",
  tipoValor = "n",
  carregando,
  erro,
  apresentacao = false,
  mensagemErro = "",
  tipoErro = "server",
  icon: Icon = TrendingUp,
  iconBgColor,
  iconColor
}) => {

  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";


  if (carregando) {
    return (
      <LoadingCard
        isDark={isDark}
        compact
        type="stats"
      />
    );
  }

  if (erro) {
    return (
      <ErrorCard
        error={mensagemErro}
        type={tipoErro}
        showDetails={process.env.NODE_ENV === "development"}
      />
    );
  }

  return (
    <Card className={cn(
      "w-full h-full rounded-b rounded-t border transition-all duration-300 p-3",
      "bg-gray-50",
      "dark:bg-gray-900")}>

      <div className="flex items-center justify-between w-full">
        <div>
          <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>
          <p></p>
          <LabelCardValor bold>
            {valor}            
          </LabelCardValor>

          {rodape?.trim() && (
            <div className="mt-1">
              <LabelCardSubTitulo bold={false}>{rodape}</LabelCardSubTitulo>
            </div>
          )}
        </div>

        <div className={cn(
          "p-2 rounded flex items-center justify-center",
          iconColor,
          iconBgColor
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};


export default CardsHome;
