import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OperadorAnalise } from "../types";

interface TabelaOperadoresProps {
  operadores: OperadorAnalise[];
}

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

const riskStyles: Record<string, string> = {
  alto: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  medio:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  baixo:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
};

const efficiencyStyles: Record<string, string> = {
  alta: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-900",
  media:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  baixa:
    "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

export function TabelaOperadores({ operadores }: TabelaOperadoresProps) {
  return (
    <Card className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Base detalhada de operadores</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-border dark:border-gray-800">
                <th className="px-3 py-3 text-left font-medium">Operador</th>
                <th className="px-3 py-3 text-left font-medium">Risco</th>
                <th className="px-3 py-3 text-left font-medium">Eficiência</th>
                <th className="px-3 py-3 text-right font-medium">Faturamento</th>
                <th className="px-3 py-3 text-right font-medium">Cupons</th>
                <th className="px-3 py-3 text-right font-medium">Ticket</th>
                <th className="px-3 py-3 text-right font-medium">Itens cancelados</th>
                <th className="px-3 py-3 text-right font-medium">Vendas canceladas</th>
                <th className="px-3 py-3 text-right font-medium">Consultas</th>
                <th className="px-3 py-3 text-right font-medium">Cupons/h</th>
              </tr>
            </thead>

            <tbody>
              {operadores.map((op) => {
                const baixoVolume = op.quantidade_cupons < 100;

                return (
                  <tr
                    key={op.nome_operador}
                    className="border-b border-border/60 dark:border-gray-800/80"
                  >
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{op.nome_operador}</span>
                        {baixoVolume ? (
                          <span className="text-xs text-amber-600 dark:text-amber-300">
                            Baixo volume
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <Badge className={riskStyles[op.classificacao_risco]}>
                        {op.classificacao_risco}
                      </Badge>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {op.score_risco.toFixed(4)}
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <Badge className={efficiencyStyles[op.classificacao_eficiencia]}>
                        {op.classificacao_eficiencia}
                      </Badge>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {op.score_eficiencia.toFixed(4)}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right">{fmtMoney(op.valor_total_venda)}</td>
                    <td className="px-3 py-3 text-right">{op.quantidade_cupons}</td>
                    <td className="px-3 py-3 text-right">{fmtMoney(op.ticket_medio)}</td>
                    <td className="px-3 py-3 text-right">
                      {op.taxa_itens_cancelados.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right">
                      {op.taxa_vendas_canceladas.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right">{op.taxa_consultas.toFixed(2)}%</td>
                    <td className="px-3 py-3 text-right">{op.cupons_por_hora.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}