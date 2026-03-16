import {
  AlertTriangle,
  BadgeAlert,
  DollarSign,
  Search,
  ShoppingCart,
  TrendingDown,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { OperadorAnalisado } from "../../types";
import {
  fmtInt,
  fmtMoney,
  fmtNumber,
  fmtPct,
  fmtSeconds,
} from "../../utils/formatters";
import { toneClasses } from "../../utils/analysis";
import { MetricBox } from "../MetricBox";

interface DetalhesTabProps {
  busca: string;
  setBusca: (value: string) => void;
  filtrados: OperadorAnalisado[];
}

export function DetalhesTab({
  busca,
  setBusca,
  filtrados,
}: DetalhesTabProps) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
          <Users className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
          Detalhamento por operador
        </CardTitle>

        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -trangray-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar operador..."
            className="rounded-xl border-gray-300 bg-white pl-10 text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[720px] pr-4">
          <div className="space-y-4">
            {filtrados.map((op) => (
              <div
                key={op.nome_operador}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {op.nome_operador}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {fmtInt(op.quantidade_cupons)} cupons ·{" "}
                      {fmtInt(op.quantidade_itens_inclusos)} itens ·{" "}
                      {fmtMoney(op.valor_total_venda)} em vendas
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={toneClasses(
                        op.total_alertas > 0 ? "critical" : "normal"
                      )}
                    >
                      {op.total_alertas > 0
                        ? `${op.total_alertas} alerta${
                            op.total_alertas > 1 ? "s" : ""
                          }`
                        : "Sem alerta"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      {fmtNumber(op.cupons_por_hora)} cupons/h
                    </Badge>

                    <Badge
                      variant="outline"
                      className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      {fmtSeconds(op.tempo_medio_por_cupom_seg)} por cupom
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4 bg-gray-200 dark:bg-gray-800" />

                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4 xl:grid-cols-6">
                  <MetricBox
                    title="Ticket médio"
                    value={fmtMoney(op.ticket_medio)}
                    icon={ShoppingCart}
                  />
                  <MetricBox
                    title="Itens cancelados"
                    value={fmtPct(op.taxa_itens_cancelados)}
                    icon={TrendingDown}
                  />
                  <MetricBox
                    title="Vendas canceladas"
                    value={fmtPct(op.taxa_vendas_canceladas)}
                    icon={AlertTriangle}
                  />
                  <MetricBox
                    title="Consultas"
                    value={fmtPct(op.taxa_consultas)}
                    icon={Search}
                  />
                  <MetricBox
                    title="Descontos"
                    value={fmtPct(op.taxa_descontos)}
                    icon={DollarSign}
                  />
                  <MetricBox
                    title="Impacto financeiro"
                    value={fmtPct(op.impacto_valor_cancelado)}
                    icon={BadgeAlert}
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/60">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Pontos críticos
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {op.alertas.length > 0 ? (
                        op.alertas.map((a) => (
                          <Badge
                            key={a.id}
                            className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200"
                          >
                            {a.label}
                          </Badge>
                        ))
                      ) : (
                        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200">
                          Nenhum indicador fora da curva pelos critérios atuais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/60">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Oportunidades / pontos fortes
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {op.pontos_positivos.length > 0 ? (
                        op.pontos_positivos.map((item) => (
                          <Badge
                            key={item}
                            className="border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-200"
                          >
                            {item}
                          </Badge>
                        ))
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400"
                        >
                          Sem destaque positivo automático
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}