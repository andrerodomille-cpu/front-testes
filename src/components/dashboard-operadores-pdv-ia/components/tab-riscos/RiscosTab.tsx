import { AlertTriangle, BarChart3, DollarSign } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OperadorAnalisado } from "../../types";
import { fmtNumber, fmtPct } from "../../utils/formatters";

interface ScatterPoint {
  x: number;
  y: number;
  z: number;
  nome_operador: string;
  total_alertas: number;
}

interface RiscosTabProps {
  topRisco: OperadorAnalisado[];
  topImpactoFinanceiro: OperadorAnalisado[];
  scatterData: ScatterPoint[];
}

function CustomScatterTooltip({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0]?.payload as ScatterPoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 text-sm shadow-lg dark:border-gray-800 dark:bg-gray-950">
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {point.nome_operador}
      </div>

      <div className="mt-2 text-gray-600 dark:text-gray-300">
        Cupons/hora:{" "}
        <span className="text-gray-900 dark:text-gray-100">
          {fmtNumber(point.x)}
        </span>
      </div>

      <div className="text-gray-600 dark:text-gray-300">
        Taxa itens cancelados:{" "}
        <span className="text-gray-900 dark:text-gray-100">
          {fmtPct(point.y)}
        </span>
      </div>

      <div className="text-gray-600 dark:text-gray-300">
        Alertas:{" "}
        <span className="text-gray-900 dark:text-gray-100">
          {point.total_alertas}
        </span>
      </div>
    </div>
  );
}

export function RiscosTab({
  topRisco,
  topImpactoFinanceiro,
  scatterData,
}: RiscosTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-300" />
              Operadores com mais alertas acionados
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topRisco}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                  />

                  <XAxis
                    type="number"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <YAxis
                    dataKey="nome_operador"
                    type="category"
                    width={100}
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      color: "#111827",
                    }}
                    formatter={(value) => [value, "Alertas acionados"]}
                  />

                  <Bar dataKey="total_alertas" radius={[0, 10, 10, 0]}>
                    {topRisco.map((_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "#ef4444"
                            : index === 1
                            ? "#f97316"
                            : "#38bdf8"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              Pontos críticos imediatos
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {topRisco.length === 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Nenhum alerta acionado pelos critérios atuais.
              </div>
            )}

            {topRisco.map((op) => (
              <div
                key={op.nome_operador}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {op.nome_operador}
                  </div>

                  <Badge className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200">
                    {op.total_alertas} alerta{op.total_alertas > 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {op.alertas.map((a) => (
                    <Badge
                      key={a.id}
                      variant="outline"
                      className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      {a.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
              <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-300" />
              Maior impacto financeiro de cancelamentos
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topImpactoFinanceiro}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                  />

                  <XAxis
                    dataKey="nome_operador"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />

                  <YAxis
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                    tickFormatter={(v) => `${fmtNumber(v)}%`}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      color: "#111827",
                    }}
                    formatter={(value) => [
                      fmtPct(Number(value)),
                      "Impacto do valor cancelado",
                    ]}
                  />

                  <Bar
                    dataKey="impacto_valor_cancelado"
                    radius={[10, 10, 0, 0]}
                    fill="#f59e0b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
              <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Produtividade x taxa de cancelamento de itens
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700"
                  />

                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Cupons/hora"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Taxa cancelamento"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                  />

                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomScatterTooltip />}
                  />

                  <Scatter data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.total_alertas > 0 ? "#ef4444" : "#22c55e"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}