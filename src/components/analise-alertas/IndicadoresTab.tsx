import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  DollarSign, 
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  Percent,
  Activity,
  BarChart3,
  Receipt,
  Package,
  Target,
  AlertCircle
} from "lucide-react";
import { AnaliseIARiscoOperacionalComAlertas } from "./types";
import { fmtDecimal, fmtMoney, fmtInt, fmtPct, fmtTime } from "./utils";
import { motion } from "framer-motion";

interface IndicadoresTabProps {
  data: AnaliseIARiscoOperacionalComAlertas;
}

interface MetricProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  tooltip?: string;
}

function Metric({ 
  label, 
  value, 
  icon, 
  trend, 
  highlight = false,
  tooltip 
}: MetricProps) {
  const trendIcon = {
    up: <TrendingUp className="h-3 w-3 text-emerald-500" />,
    down: <TrendingDown className="h-3 w-3 text-rose-500" />,
    neutral: <Activity className="h-3 w-3 text-gray-400" />
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all ${
        highlight 
          ? 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-white shadow-md dark:border-cyan-800 dark:from-cyan-950/30 dark:to-gray-900' 
          : 'border-gray-200 bg-white/50 backdrop-blur-sm hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700'
      }`}
    >
      {/* Efeito de gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 transition-opacity group-hover:opacity-100 dark:to-gray-800/30" />
      
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`rounded-lg p-1.5 ${
                highlight 
                  ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {icon}
              </div>
            )}
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {label}
            </span>
          </div>
          
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
              {trendIcon[trend]}
              <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                {trend === 'up' ? '+12%' : trend === 'down' ? '-8%' : '0%'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-baseline justify-between">
          <p className={`text-lg font-semibold ${
            highlight 
              ? 'text-cyan-700 dark:text-cyan-300' 
              : 'text-gray-900 dark:text-gray-100'
          }`}>
            {value}
          </p>
          
          {tooltip && (
            <div className="group relative">
              <AlertCircle className="h-4 w-4 cursor-help text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              <div className="absolute bottom-full right-0 mb-2 hidden w-48 rounded-lg bg-gray-900 p-2 text-xs text-white shadow-lg group-hover:block dark:bg-gray-700">
                {tooltip}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <Card className="overflow-hidden border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/80">
      <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-3 dark:border-gray-800 dark:bg-gray-800/30">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          {icon && (
            <div className="rounded-lg bg-cyan-100 p-1.5 dark:bg-cyan-900/40">
              {icon}
            </div>
          )}
          <span className="text-base font-semibold">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {children}
      </CardContent>
    </Card>
  );
}

export function IndicadoresTab({ data }: IndicadoresTabProps) {
  const { resumo, medias, desvios } = data.indicadores;

  // Calcula algumas métricas derivadas para insights
  const ticketMedioVariation = desvios.ticket_medio > 0.3 ? 'up' : desvios.ticket_medio < -0.3 ? 'down' : 'neutral';
  const cancelamentoVariation = desvios.taxa_vendas_canceladas > 0.2 ? 'up' : desvios.taxa_vendas_canceladas < -0.2 ? 'down' : 'neutral';

  return (
    <div className="space-y-6">
      {/* Cards de resumo com layout mais dinâmico */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Metric 
          label="Loja" 
          value={resumo.loja}
          icon={<Store className="h-4 w-4" />}
          highlight
        />
        <Metric 
          label="Operadores" 
          value={fmtInt(resumo.operadores_analisados)}
          icon={<Users className="h-4 w-4" />}
        />
        <Metric 
          label="Valor total venda" 
          value={fmtMoney(resumo.valor_total_venda)}
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
        />
        <Metric 
          label="Quantidade cupons" 
          value={fmtInt(resumo.quantidade_cupons)}
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>

      {/* Seção de médias com grid mais organizado */}
      <MetricCard 
        title="Médias operacionais" 
        icon={<BarChart3 className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Metric 
            label="Ticket médio" 
            value={fmtMoney(medias.ticket_medio)}
            icon={<DollarSign className="h-3 w-3" />}
            trend={ticketMedioVariation}
            tooltip="Valor médio por venda"
          />
          <Metric 
            label="Taxa itens cancelados" 
            value={fmtPct(medias.taxa_itens_cancelados)}
            icon={<Package className="h-3 w-3" />}
            trend={cancelamentoVariation}
          />
          <Metric 
            label="Taxa vendas canceladas" 
            value={fmtPct(medias.taxa_vendas_canceladas)}
            icon={<ShoppingCart className="h-3 w-3" />}
          />
          <Metric 
            label="Taxa consultas" 
            value={fmtPct(medias.taxa_consultas)}
            icon={<Activity className="h-3 w-3" />}
          />
          <Metric 
            label="Taxa descontos" 
            value={fmtPct(medias.taxa_descontos)}
            icon={<Percent className="h-3 w-3" />}
          />
          <Metric 
            label="Impacto valor cancelado" 
            value={fmtPct(medias.impacto_valor_cancelado)}
            icon={<Target className="h-3 w-3" />}
          />
          <Metric 
            label="Cupons por hora" 
            value={fmtDecimal(medias.cupons_por_hora)}
            icon={<Receipt className="h-3 w-3" />}
          />
          <Metric 
            label="Itens por hora" 
            value={fmtDecimal(medias.itens_por_hora)}
            icon={<Package className="h-3 w-3" />}
          />
          <Metric 
            label="Tempo médio por cupom" 
            value={fmtTime(medias.tempo_medio_por_cupom_seg)}
            icon={<Clock className="h-3 w-3" />}
          />
        </div>
      </MetricCard>

      {/* Seção de desvios com visualização de variação */}
      <MetricCard 
        title="Desvios estatísticos" 
        icon={<TrendingUp className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Metric 
            label="Desvio ticket médio" 
            value={fmtDecimal(desvios.ticket_medio)}
            icon={<DollarSign className="h-3 w-3" />}
            trend={desvios.ticket_medio > 0 ? 'up' : 'down'}
          />
          <Metric 
            label="Desvio itens cancelados" 
            value={fmtDecimal(desvios.taxa_itens_cancelados)}
            icon={<Package className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio vendas canceladas" 
            value={fmtDecimal(desvios.taxa_vendas_canceladas)}
            icon={<ShoppingCart className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio consultas" 
            value={fmtDecimal(desvios.taxa_consultas)}
            icon={<Activity className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio descontos" 
            value={fmtDecimal(desvios.taxa_descontos)}
            icon={<Percent className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio impacto cancelado" 
            value={fmtDecimal(desvios.impacto_valor_cancelado)}
            icon={<Target className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio cupons por hora" 
            value={fmtDecimal(desvios.cupons_por_hora)}
            icon={<Receipt className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio itens por hora" 
            value={fmtDecimal(desvios.itens_por_hora)}
            icon={<Package className="h-3 w-3" />}
          />
          <Metric 
            label="Desvio tempo por cupom" 
            value={fmtDecimal(desvios.tempo_medio_por_cupom_seg)}
            icon={<Clock className="h-3 w-3" />}
          />
        </div>
      </MetricCard>

      {/* Insights rápidos baseados nos desvios */}
      {(desvios.ticket_medio > 0.5 || desvios.taxa_vendas_canceladas > 0.4) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/30"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Insights detectados
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {desvios.ticket_medio > 0.5 && 'Alta variação no ticket médio. '}
                {desvios.taxa_vendas_canceladas > 0.4 && 'Aumento significativo em cancelamentos. '}
                Recomendamos análise detalhada destes indicadores.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}