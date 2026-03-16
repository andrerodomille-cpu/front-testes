import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OperadorRiscoOperacional } from "../types";
import { fmtMoney } from "../utils";

interface RankingListCardProps {
  title: string;
  icon: React.ElementType;
  rows: OperadorRiscoOperacional[];
  metricKey: keyof OperadorRiscoOperacional;
  metricLabel: string;
  formatter: (value: number) => string;
}

export function RankingListCard({
  title,
  icon: Icon,
  rows,
  metricKey,
  metricLabel,
  formatter,
}: RankingListCardProps) {
  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div
              key={`${title}-${row.nome_operador}-${index}`}
              className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3"
            >
              <div>
                <p className="font-medium">{index + 1}. {row.nome_operador}</p>
                <p className="text-xs text-muted-foreground">
                  Vendas {fmtMoney(row.valor_total_venda)} • {row.quantidade_cupons} cupons
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">{formatter(Number(row[metricKey]))}</p>
                <p className="text-xs text-muted-foreground">{metricLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

