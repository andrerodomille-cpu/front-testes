import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { ColorHex } from "@/utils/colorUtils";
import { formatInteger, formatPercentage, formatPercentageInteger } from "@/utils/formatUtils";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";
import { Label } from "../ui/label";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LucideIcon } from "lucide-react";

interface CardsProgressBarProps {
  titulo: string;
  delta: string | undefined | null;
  porcentagem: number;
  total: number;
  textoAnterior: string;
  totalAnterior: number;
  corTotal: string;
  textoTotal: string | undefined;
  periodoAnterior: string;
  porcentagemOK: number;
  corBarra: string;
  textoOK: string;
  totalOK: number;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

export const CardsComparisionProgressBar = ({
  titulo,
  delta,
  porcentagem,
  total,
  textoAnterior,
  totalAnterior,
  corTotal,
  textoTotal,
  periodoAnterior,
  porcentagemOK,
  corBarra,
  textoOK,
  totalOK,
  carregando = false,
  erro = false,
  apresentacao = false
}: CardsProgressBarProps) => {
  const { t } = useTranslation();

  const deltaConfig = {
    increase: {
      icon: TrendingUp,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-700 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-800"
    },
    decrease: {
      icon: TrendingDown,
      color: "rose",
      bgColor: "bg-rose-500/10",
      textColor: "text-rose-700 dark:text-rose-400",
      borderColor: "border-rose-200 dark:border-rose-800"
    },
    neutral: {
      icon: Minus,
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-700 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800"
    }
  };

  const currentDelta = delta === "increase" ? deltaConfig.increase :
    delta === "decrease" ? deltaConfig.decrease :
      deltaConfig.neutral;
  const DeltaIcon = currentDelta.icon;

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const corIconePadrao = isDark ? "#60a5fa" : "#3b82f6";
  const corFundoIconePadrao = isDark
    ? "rgba(96, 165, 250, 0.2)"
    : "rgba(59, 130, 246, 0.1)";

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
  const barra = corBarra ? ColorHex(corBarra) : currentDelta.color;

  const progressoPercentual = Math.min(
    Math.max(porcentagemOK * 100, 0), 100);

  return (
    <Card className="rounded-b rounded-t bg-gray-50 dark:bg-gray-900 w-full h-full p-3">
      <div className="flex items-center justify-between mb-4">

<div className="flex items-center gap-3">
        <div
                className="p-2 rounded-b rounded-t flex items-center justify-center"
                style={{
                  backgroundColor: corFundoIconePadrao,
                  color: corIconePadrao
                }}>
                <TrendingUp className="w-5 h-5" />
              </div>
        <LabelCardTitulo bold={false}>
          {titulo}
        </LabelCardTitulo>
</div>
        <Badge
          variant="outline"
          className={cn(
             "flex items-center gap-1.5 font-medium rounded-full",
            currentDelta.bgColor,
            currentDelta.textColor,
            currentDelta.borderColor
          )}
        >
          <DeltaIcon className="h-3.5 w-3.5" />
          <span className="font-semibold text-sm">
            {formatInteger(porcentagem)}%
          </span>
        </Badge>
      </div>


      <div className="mb-6">
        <Label className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatInteger(total)}
        </Label>
        <p></p>
        <Label className="text-gray-500 dark:text-gray-400 mt-1">
          {textoAnterior}: {formatInteger(totalAnterior)}
        </Label>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">{textoOK}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatPercentageInteger(porcentagemOK)}
          </span>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progressoPercentual}%`,
              backgroundColor: corBarra ? barra : undefined
            }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0</span>
          <span>{totalOK} {textoOK}</span>
          <span>100%</span>
        </div>
      </div>

      {/* Footer com comparação */}
      <div className={cn(
        "mt-4 pt-4 border-t",
        currentDelta.borderColor
      )}>
        <div className="flex items-center justify-between">
          <Label className="text-gray-600 dark:text-gray-400">
            {textoTotal}
          </Label>
          <Label

            className={cn(
              "font-semibold",
              currentDelta.textColor
            )}
          >
            {periodoAnterior}
          </Label>
        </div>
      </div>

    </Card>
  );
};