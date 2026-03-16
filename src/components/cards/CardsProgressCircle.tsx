import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { ColorHex } from "@/utils/colorUtils";
import { formatPercentageInteger } from "@/utils/formatUtils";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LucideIcon } from "lucide-react";
import { HiTrendingUp } from "react-icons/hi";

interface CardsProgressCircleProps {
  titulo: string;
  valor: number;
  cor: string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const CardsProgressCircle = ({
  titulo,
  valor=0,
  cor,
  carregando = false,
  erro = false,
  apresentacao = false,
  icon: Icon = TrendingUp,
  iconBgColor,
  iconColor
}: CardsProgressCircleProps) => {

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
        error={""}
        type={"server"}
        showDetails={process.env.NODE_ENV === "development"}
      />
    );
  }

  const textColor = cor ? ColorHex(cor) : "";

  return (
<Card
  className={cn(
    "w-full h-full rounded-b rounded-t border transition-all duration-300 p-3",
    "bg-gray-50",
    "dark:bg-gray-900"
  )}
>
  <div className="flex items-start gap-2">
    <div className={cn("p-2 rounded flex items-center justify-center", iconColor, iconBgColor)}>
      <Icon className="w-5 h-5" />
    </div>

    <div className="w-full">
      <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>
      <p>
        <LabelCardValor bold={true}>
          {formatPercentageInteger((Number(valor) || 0) / 100)}
        </LabelCardValor>
      </p>

      <div className="mt-1 w-full">
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${valor}%`,
              backgroundColor: textColor,
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>0%</span>
          <span className="font-medium">{valor}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  </div>
</Card>

  );


};
