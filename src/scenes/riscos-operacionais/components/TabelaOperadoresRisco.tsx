import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { OperadorScorado } from "../types";
import { fmtMoney, fmtNumber, fmtPct, getRiskLevel, toneClasses } from "../utils";

interface TabelaOperadoresRiscoProps {
  rows: OperadorScorado[];
}

export function TabelaOperadoresRisco({ rows }: TabelaOperadoresRiscoProps) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Base detalhada de operadores
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-3 font-medium">Operador</th>
                <th className="px-3 py-3 font-medium">Faturamento</th>
                <th className="px-3 py-3 font-medium">Cupons</th>
                <th className="px-3 py-3 font-medium">Ticket médio</th>
                <th className="px-3 py-3 font-medium">Itens cancelados</th>
                <th className="px-3 py-3 font-medium">Vendas canceladas</th>
                <th className="px-3 py-3 font-medium">Consultas</th>
                <th className="px-3 py-3 font-medium">Impacto cancelado</th>
                <th className="px-3 py-3 font-medium">Cupons/h</th>
                <th className="px-3 py-3 font-medium">Tempo/cupom</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const level = getRiskLevel(row.riskScore);

                return (
                  <tr key={row.nome_operador} className="border-b border-border/50">
                    <td className="px-3 py-3 font-medium">{row.nome_operador}</td>
                    <td className="px-3 py-3">{fmtMoney(row.valor_total_venda)}</td>
                    <td className="px-3 py-3">{fmtNumber(row.quantidade_cupons)}</td>
                    <td className="px-3 py-3">{fmtMoney(row.ticket_medio)}</td>
                    <td className="px-3 py-3">{fmtPct(row.taxa_itens_cancelados)}</td>
                    <td className="px-3 py-3">{fmtPct(row.taxa_vendas_canceladas)}</td>
                    <td className="px-3 py-3">{fmtPct(row.taxa_consultas)}</td>
                    <td className="px-3 py-3">{fmtPct(row.impacto_valor_cancelado)}</td>
                    <td className="px-3 py-3">{fmtNumber(row.cupons_por_hora)}</td>
                    <td className="px-3 py-3">{fmtNumber(row.tempo_medio_por_cupom_seg)} s</td>
                    <td className="px-3 py-3">
                      <Badge variant="outline" className={toneClasses[level.tone]}>
                        {level.label}
                      </Badge>
                    </td>
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

