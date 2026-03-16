import React from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { 
  BarChart3, 
  DollarSign,
  Layers,
  TrendingUp,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  Calendar,
  TrendingDown,
  LucideIcon,
  Activity,
  RadarIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { LabelCardTitulo } from "../labels/labelCardTitulo";

// Mapeamento dos ícones disponíveis
const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  DollarSign,
  Layers,
  TrendingUp,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Users,
  Package,
  CreditCard,
  Calendar,
  TrendingDown, RadarIcon, Activity
};

type IconName = keyof typeof iconMap;

interface CardsInformationProps {
  titulo: string;
  valor?: string | number;
  quantidade?: string | number;
  carregando?: boolean;
  erro?: boolean;
  mensagemErro?: string;
  tipoErro?: "network" | "server" | "data" | "auth" | "generic";
  corFundo?: string;
  variacao?: number;
  
  // Props para personalização do ícone
  icone?: IconName;
  corIcone?: string;
  corFundoIcone?: string;
  
  // Props para personalização dos cards internos
  corFundoQuantidade?: string;
  corTextoQuantidade?: string;
  corIconeQuantidade?: string;
  corFundoValor?: string;
  corTextoValor?: string;
  corIconeValor?: string;
  compact?: boolean;

}

const CardsOcorrenciasResumo: React.FC<CardsInformationProps> = ({
  titulo,
  valor = "N/A",
  quantidade = "N/A",
  carregando = false,
  erro = false,
  mensagemErro,
  tipoErro = "generic",
  corFundo,
  icone = "BarChart3",
  corIcone,
  corFundoIcone,
  corFundoQuantidade,
  corTextoQuantidade,
  corIconeQuantidade,
  corFundoValor,
  corTextoValor,
  corIconeValor,
  compact = true,

}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const IconeSelecionado = iconMap[icone] || BarChart3;
  const corIconePadrao = isDark ? "#60a5fa" : "#3b82f6"; // blue-500
  const corFundoIconePadrao = isDark 
    ? "rgba(96, 165, 250, 0.2)" 
    : "rgba(59, 130, 246, 0.1)";
  const corTextoQuantidadePadrao = isDark ? "#d1d5db" : "#374151";
  const corIconeQuantidadePadrao = isDark ? "#9ca3af" : "#6b7280";
  const corFundoQuantidadePadrao = isDark 
    ? "rgba(31, 41, 55, 0.5)" 
    : "rgba(249, 250, 251, 1)";
  const corTextoValorPadrao = isDark ? "#ffffff" : "#111827";
  const corIconeValorPadrao = isDark ? "#93c5fd" : "#3b82f6";
  const corFundoValorPadrao = isDark 
  ? "rgba(31, 41, 55, 0.5)" 
    : "rgba(249, 250, 251, 1)";

  if (carregando) {
    return (
      <LoadingCard
        isDark={isDark}
        compact={compact}
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
    <Card
      className={cn(
        "w-full h-full p-4 rounded-b rounded-t transition-all duration-300 hover:shadow-md",
        corFundo ?? "bg-gray-50 dark:bg-gray-900",
        compact && "p-3"
      )}
      style={corFundo ? { backgroundColor: corFundo } : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div 
            className="p-2 rounded-b rounded-t flex items-center justify-center"
            style={{ 
              backgroundColor: corFundoIcone || corFundoIconePadrao,
              color: corIcone || corIconePadrao
            }}
          >
            <IconeSelecionado className="w-4 h-4" />
          </div>
          <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>
          
        </div>
        
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div 
          className="flex flex-col items-center p-3 rounded-b rounded-t transition-all duration-200"
          style={{
            backgroundColor: corFundoQuantidade || corFundoQuantidadePadrao,
            borderColor: isDark ? '#374151' : '#e5e7eb'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Package 
              className="w-4 h-4" 
              style={{ 
                color: corIconeQuantidade || corIconeQuantidadePadrao 
              }}
            />
            <span 
              className="text-sm font-medium opacity-80"
              style={{ 
                color: corTextoQuantidade || corTextoQuantidadePadrao 
              }}
            >
              {t("comum.quantidade")}
            </span>
          </div>
          <div 
            className="text-2xl font-bold tracking-tight"
            style={{ 
              color: corTextoQuantidade || corTextoQuantidadePadrao 
            }}
          >
            {quantidade}
          </div>
          
        </div>

        <div 
          className="flex flex-col items-center p-3 rounded-b rounded-t transition-all duration-200"
          style={{
            backgroundColor: corFundoValor || corFundoValorPadrao,
            borderColor: isDark ? '#3b82f6' : '#93c5fd'
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign 
              className="w-4 h-4" 
              style={{ 
                color: corIconeValor || corIconeValorPadrao 
              }}
            />
            <span 
              className="text-sm font-medium opacity-80"
              style={{ 
                color: corTextoValor || corTextoValorPadrao 
              }}
            >
              {t("comum.valor")}
            </span>
          </div>
          <div 
            className="text-2xl font-bold tracking-tight"
            style={{ 
              color: corTextoValor || corTextoValorPadrao 
            }}
          >
            {valor}
          </div>
          
        </div>
      </div>

    </Card>
  );
};

// Exporta também o tipo IconName para uso externo
export type { IconName };
export default CardsOcorrenciasResumo;