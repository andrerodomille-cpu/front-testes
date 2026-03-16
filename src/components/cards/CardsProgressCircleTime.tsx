import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  TrendingDown,
  Minus,
  Target,
  Sparkles
} from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardValor } from "../labels/labelCardValor";
import { formatPercentageInteger } from "@/utils/formatUtils";
import { ColorHex } from "@/utils/colorUtils";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LucideIcon, TrendingUp } from "lucide-react";
interface CardsProgressCircleTimeProps {
  titulo: string;
  valor: number;
  cor: string;
  tabela: { data: string; value: number }[];
  categorias: string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  trend?: number;
}

export const CardsProgressCircleTime = ({
  titulo,
  valor,
  cor,
  tabela,
  categorias,
  carregando,
  erro,
  apresentacao = false,
  trend = 0
}: CardsProgressCircleTimeProps) => {
  const { t } = useTranslation();

  const chartConfig = {
    value: {
      label: categorias,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const textColor = cor ? ColorHex(cor) : "";
  const percentage = valor / 100;
  const formattedValue = formatPercentageInteger(percentage);

  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-gray-500" />;
  };

  const getTrendBadgeVariant = () => {
    if (trend > 0) return "default";
    if (trend < 0) return "destructive";
    return "secondary";
  };

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

      </div>


      <CardContent className="mt-2 space-y-3 pt-0">
        {/* Progress Circle Compact */}
        <div className="flex items-center gap-3">
          {/* Donut compacto */}
          <div className="relative w-16 h-16 flex-shrink-0">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800"></div>

            {/* Progress circle */}
            <div
              className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
              style={{
                background: `conic-gradient(${textColor} ${valor}%, transparent ${valor}%)`,
              }}
            />

            {/* Inner circle com valor */}
            <div className="absolute inset-1.5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className={cn(
                  "text-sm font-bold tracking-tight leading-none",
                  percentage >= 0.7 ? "text-green-600 dark:text-green-400" :
                    percentage >= 0.4 ? "text-yellow-600 dark:text-yellow-400" :
                      "text-red-600 dark:text-red-400"
                )}>
                  {formattedValue}
                </div>
              </div>
            </div>
          </div>

          {/* Informações ao lado do donut */}
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <Target className="h-3 w-3 text-gray-400 dark:text-gray-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Progress
              </span>
            </div>
            <div className="space-y-1">

              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${valor}%`,
                    backgroundColor: textColor
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Area Chart Compact */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
            <span>Performance</span>

          </div>

          <div className="rounded-t rounded-b overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-1">
            <ChartContainer
              config={chartConfig}
              className="w-full"
              style={{ height: "40px" }}
            >
              <AreaChart data={tabela}>
                <defs>
                  <linearGradient id={`gradient-${titulo}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={textColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={textColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="value"
                  type="monotone"
                  
                  fillOpacity={1}
                  stroke={textColor}
                  strokeWidth={1.5}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500 dark:text-gray-400">
              {tabela[0]?.data}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {tabela[tabela.length - 1]?.data}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">Média</div>
              <div className="text-xs font-semibold">
                {formatPercentageInteger(tabela.reduce((sum, item) => sum + item.value, 0) / tabela.length / 100)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 dark:text-gray-400">Pico</div>
              <div className="text-xs font-semibold">
                {formatPercentageInteger(Math.max(...tabela.map(item => item.value)) / 100)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};