import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  BarChart3,
  Info,
  LineChartIcon,
  SatelliteDishIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { ColorHex } from "@/utils/colorUtils";
import { useTranslation } from "react-i18next";
import { getFontSizeTitulo } from "@/utils/fontSizes";
import { getFontSizeSubTitulo } from "@/utils/fontSizes";
import { getFontSizeValor } from "@/utils/fontSizes";
import { getFontSizeDetalhe } from "@/utils/fontSizes";
import { cn } from "@/lib/utils";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LucideIcon } from "lucide-react";

interface CardsComparisionProps {
  titulo?: string;
  valorAtual?: string;
  valorAnterior?: string;
  porcentagem?: string;
  textoAtual?: string;
  textoAnterior?: string;
  cor: string | undefined;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  destacar?: boolean;
  icon?: React.ReactNode;
  mensagemErro?: string;
  tipoErro?: "network" | "server" | "data" | "auth" | "generic";
}

export const CardsComparision = ({
  titulo,
  valorAtual,
  valorAnterior,
  porcentagem,
  textoAtual,
  textoAnterior,
  cor,
  carregando = false,
  erro = false,
  apresentacao = false,
  destacar = false,
  icon,
  mensagemErro="",
  tipoErro= "server"

}: CardsComparisionProps) => {
  const { t } = useTranslation();
  const badgeColor = ColorHex(cor);
  const tamanhoFonteTitulo = getFontSizeTitulo(apresentacao);
  const tamanhoFonteSubTitulo = getFontSizeSubTitulo(apresentacao);
  const tamanhoFonteValor = getFontSizeValor(apresentacao);
  const tamanhoFonteDetalhe = getFontSizeDetalhe(apresentacao);

  const isPositive = cor !== "red";
  const isHighlighted = destacar || apresentacao;
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
            "dark:bg-gray-900",
          )}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-b rounded-t flex items-center justify-center"
                style={{
                  backgroundColor: corFundoIconePadrao,
                  color: corIconePadrao
                }}>
                <TrendingUp className="w-5 h-5" />
              </div>
            <LabelCardTitulo
              bold={true}>
              {titulo}
            </LabelCardTitulo>
          </div>

          <Badge
            variant={isPositive ? "default" : "destructive"}
            className={cn(
              "flex items-center gap-1.5 font-medium rounded-full",
              isPositive
                ? "text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "text-xs bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            )}
          >
            {isPositive ? (
              <ArrowUpCircle className="h-4 w-4" />
            ) : (
              <ArrowDownCircle className="h-4 w-4" />
            )}
            {porcentagem}
          </Badge>
        </div>

        {/* Valor Atual */}
        <div className="mb-4">
          <Label
            className={cn(
              "text-3xl font-bold tracking-tight",
              isPositive
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-rose-700 dark:text-rose-400"
            )}
            style={{ fontSize: tamanhoFonteValor }}
          >
            {valorAtual}
          </Label>
        </div>

        <Separator className="mb-4 bg-neutral-200 dark:bg-neutral-700" />

        {/* Comparação */}
        <div className="space-y-3 mt-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="h-3.5 w-3.5" />
            <LabelCardSubTitulo
              bold={false}
              size={tamanhoFonteSubTitulo}
            >
              {textoAnterior}:{" "}
              <span className="font-medium text-neutral-800 dark:text-neutral-300">
                {valorAnterior}
              </span>
            </LabelCardSubTitulo>
          </div>

          <div
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
            style={{
              backgroundColor: `${badgeColor}10`,
              border: `1px solid ${badgeColor}20`,
            }}
          >
            <Info className="h-3.5 w-3.5" style={{ color: badgeColor }} />
            <Label
              className="font-medium"
              style={{ fontSize: tamanhoFonteSubTitulo, color: badgeColor }}
            >
              {textoAtual} {t("carrinho.periodoAnterior")}
            </Label>
          </div>
        </div>

        {/* Indicador de tendência */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
            <span>{t("comum.tendencia")}</span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {t("comum.positiva")}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {t("comum.negativa")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};