import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  Search,
  BarChart3,
  Shield,
  Zap,
  ShoppingCart
} from "lucide-react";
import { AnaliseIARiscoOperacionalComAlertas } from "./types";
import { TopListCard } from "./TopListCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RankingTabProps {
  data: AnaliseIARiscoOperacionalComAlertas;
}

// Função auxiliar para garantir que os dados sejam tratados como array
const ensureArray = <T,>(data: T | T[] | undefined): T[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// Configuração dos rankings com metadados visuais
const rankingConfigs = [
  {
    id: 'risco',
    title: "Top Risco",
    description: "Operadores com maior score de risco",
    icon: Shield,
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    dataKey: 'topRisco' as const,
    metricLabel: "Score de risco",
    metricKey: "score_risco",
    badge: "Crítico"
  },
  {
    id: 'eficiencia',
    title: "Top Eficiência",
    description: "Operadores mais eficientes da operação",
    icon: Zap,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    dataKey: 'topEficiencia' as const,
    metricLabel: "Score de eficiência",
    metricKey: "score_eficiencia",
    badge: "Destaque"
  },
  {
    id: 'faturamento',
    title: "Top Faturamento",
    description: "Maiores volumes de venda",
    icon: DollarSign,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    dataKey: 'topFaturamento' as const,
    metricLabel: "Valor total",
    metricKey: "valor_total_venda",
    badge: "Performance"
  },
  {
    id: 'cancelamento',
    title: "Top Cancelamento",
    description: "Maiores taxas de cancelamento",
    icon: AlertTriangle,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    dataKey: 'topCancelamento' as const,
    metricLabel: "Taxa de itens cancelados",
    metricKey: "taxa_itens_cancelados",
    badge: "Atenção"
  },
  {
    id: 'vendasCanceladas',
    title: "Top Vendas Canceladas",
    description: "Maiores taxas de vendas canceladas",
    icon: ShoppingCart,
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    dataKey: 'topVendasCanceladas' as const,
    metricLabel: "Taxa de vendas canceladas",
    metricKey: "taxa_vendas_canceladas",
    badge: "Alerta"
  },
  {
    id: 'consultas',
    title: "Top Consultas",
    description: "Maiores taxas de consultas",
    icon: Search,
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    dataKey: 'topConsultas' as const,
    metricLabel: "Taxa de consultas",
    metricKey: "taxa_consultas",
    badge: "Monitoramento"
  }
];

export function RankingTab({ data }: RankingTabProps) {
  const { indicadores } = data;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Rankings Operacionais
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Análise comparativa dos operadores por diferentes métricas
          </p>
        </div>
        <Badge variant="outline" className="gap-1 px-3 py-1">
          <BarChart3 className="h-3 w-3" />
          Atualizado em tempo real
        </Badge>
      </div>

      {/* Grid de rankings */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 xl:grid-cols-2"
      >
        {rankingConfigs.map((config) => {
          const Icon = config.icon;
          const rankingData = indicadores[config.dataKey];
          
          // Garantir que rankingData seja um array
          const dataArray = ensureArray(rankingData);

          return (
            <motion.div
              key={config.id}
              variants={itemVariants}
              className="group relative"
            >
              {/* Card decorativo com gradiente na borda */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${config.gradient} opacity-0 blur transition-all group-hover:opacity-30 dark:opacity-20 dark:group-hover:opacity-40`} />
              
              <div className="relative">
                {/* Header do card com gradiente */}
                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${config.gradient}`} />
                
                <TopListCard
                  title={
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg bg-${config.color}-100 p-1.5 dark:bg-${config.color}-900/40`}>
                        <Icon className={`h-4 w-4 text-${config.color}-600 dark:text-${config.color}-300`} />
                      </div>
                      <span>{config.title}</span>
                    </div>
                  }
                  data={dataArray}
                  metricLabel={config.metricLabel}
                  metricKey={config.metricKey}
                  badge={
                    <Badge 
                      variant="outline" 
                      className={`ml-2 border-${config.color}-200 bg-${config.color}-50/50 text-${config.color}-700 dark:border-${config.color}-800 dark:bg-${config.color}-950/30 dark:text-${config.color}-300`}
                    >
                      {config.badge}
                    </Badge>
                  }
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Insights baseados nos rankings */}
      <Card className="overflow-hidden border-gray-200 bg-gradient-to-br from-cyan-50/30 to-white dark:border-gray-800 dark:from-cyan-950/20 dark:to-gray-900">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-cyan-100 p-3 dark:bg-cyan-900/40">
              <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Insights dos Rankings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Análise cruzada dos rankings mostra que operadores no topo do ranking de eficiência 
                tendem a ter menor taxa de cancelamento. Recomenda-se investigar a correlação entre 
                alta taxa de consultas e eficiência operacional.
              </p>
              <div className="flex gap-2 pt-2">
                <Badge variant="secondary" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Correlação positiva
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BarChart3 className="h-3 w-3" />
                  5 operadores em múltiplos tops
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}