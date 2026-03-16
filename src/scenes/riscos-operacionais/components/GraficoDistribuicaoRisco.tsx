import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { OperadorScorado } from "../types";
import { fmtNumber, getRiskLevel, toneClasses } from "../utils";

interface GraficoDistribuicaoRiscoProps {
  rows: OperadorScorado[];
}

export function GraficoDistribuicaoRisco({ rows }: GraficoDistribuicaoRiscoProps) {
  const maxScore = Math.max(...rows.map((item) => item.riskScore), 1);

  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4" />
          Distribuição de risco por operador
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {rows.slice(0, 8).map((row) => {
            const percent = (row.riskScore / maxScore) * 100;
            const level = getRiskLevel(row.riskScore);

            return (
              <div key={`grafico-${row.nome_operador}`} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{row.nome_operador}</span>
                  <span className="text-muted-foreground">
                    Score {fmtNumber(row.riskScore)} • {level.label}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      level.tone === "danger"
                        ? "bg-red-500"
                        : level.tone === "warning"
                          ? "bg-amber-500"
                          : level.tone === "info"
                            ? "bg-sky-500"
                            : "bg-emerald-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
