import { Timer, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OperadorAnalisado } from "../../types";
import {
  fmtMoney,
  fmtNumber,
  fmtPct,
  fmtSeconds,
} from "../../utils/formatters";

interface EficienciaTabProps {
  topProdutividade: OperadorAnalisado[];
  oportunidadeTreinamento: OperadorAnalisado[];
  analisados: OperadorAnalisado[];
  medias: {
    ticket_medio: number;
    cupons_por_hora: number;
    itens_por_hora: number;
    tempo_medio_por_cupom_seg: number;
    taxa_itens_cancelados: number;
  };
}

export function EficienciaTab({
  topProdutividade,
  oportunidadeTreinamento,
  analisados,
  medias,
}: EficienciaTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
              Top produtividade
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProdutividade}>
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
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--tooltip-bg, #ffffff)",
                      border: "1px solid var(--tooltip-border, #e5e7eb)",
                      borderRadius: 16,
                      color: "var(--tooltip-text, #111827)",
                    }}
                    formatter={(value) => [
                      fmtNumber(Number(value)),
                      "Cupons por hora",
                    ]}
                  />

                  <Bar
                    dataKey="cupons_por_hora"
                    radius={[10, 10, 0, 0]}
                    fill="#22c55e"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
              <Timer className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              Oportunidades de melhoria de fluxo
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {oportunidadeTreinamento.map((op) => (
              <div
                key={op.nome_operador}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {op.nome_operador}
                  </div>

                  <Badge
                    variant="outline"
                    className="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                  >
                    {fmtSeconds(op.tempo_medio_por_cupom_seg)} / cupom
                  </Badge>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    Cupons/hora:{" "}
                    <span className="text-gray-900 dark:text-gray-200">
                      {fmtNumber(op.cupons_por_hora)}
                    </span>
                  </div>

                  <div>
                    Itens/hora:{" "}
                    <span className="text-gray-900 dark:text-gray-200">
                      {fmtNumber(op.itens_por_hora)}
                    </span>
                  </div>

                  <div>
                    Ticket médio:{" "}
                    <span className="text-gray-900 dark:text-gray-200">
                      {fmtMoney(op.ticket_medio)}
                    </span>
                  </div>

                  <div>
                    Consultas:{" "}
                    <span className="text-gray-900 dark:text-gray-200">
                      {fmtPct(op.taxa_consultas)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              Média da loja
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Ticket médio</span>
              <span className="text-gray-900 dark:text-gray-100">
                {fmtMoney(medias.ticket_medio)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Cupons/hora</span>
              <span className="text-gray-900 dark:text-gray-100">
                {fmtNumber(medias.cupons_por_hora)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Itens/hora</span>
              <span className="text-gray-900 dark:text-gray-100">
                {fmtNumber(medias.itens_por_hora)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tempo por cupom</span>
              <span className="text-gray-900 dark:text-gray-100">
                {fmtSeconds(medias.tempo_medio_por_cupom_seg)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              Eficiência com menor risco
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {analisados
              .filter(
                (op) =>
                  op.cupons_por_hora >= medias.cupons_por_hora &&
                  op.taxa_itens_cancelados <= medias.taxa_itens_cancelados
              )
              .slice(0, 4)
              .map((op) => (
                <div
                  key={op.nome_operador}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <span className="text-gray-900 dark:text-gray-100">
                    {op.nome_operador}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {fmtNumber(op.cupons_por_hora)} c/h
                  </span>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
          <CardHeader>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100">
              Possíveis focos de melhorias
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {analisados
              .filter(
                (op) =>
                  op.total_alertas > 0 ||
                  op.tempo_medio_por_cupom_seg >
                    medias.tempo_medio_por_cupom_seg
              )
              .slice(0, 4)
              .map((op) => (
                <div
                  key={op.nome_operador}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 dark:text-gray-100">
                      {op.nome_operador}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {op.total_alertas} alerta
                      {op.total_alertas !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}