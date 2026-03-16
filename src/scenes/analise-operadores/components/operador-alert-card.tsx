import {
  AlertTriangle,
  Eye,
  OctagonAlert,
  ShieldAlert,
  TimerReset,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OperadorAnalise } from "../types";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

const riskBadgeClass: Record<string, string> = {
  alto: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  medio:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  baixo:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
};

interface OperadorAlertCardProps {
  operador: OperadorAnalise;
}

export function OperadorAlertCard({ operador }: OperadorAlertCardProps) {
  const baixoVolume = operador.quantidade_cupons < 100;

  return (
    <Card className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{operador.nome_operador}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Score risco {operador.score_risco.toFixed(4)} • Score eficiência{" "}
              {operador.score_eficiencia.toFixed(4)}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge className={riskBadgeClass[operador.classificacao_risco]}>
              {operador.classificacao_risco === "medio"
                ? "Risco médio"
                : operador.classificacao_risco === "alto"
                ? "Risco alto"
                : "Risco baixo"}
            </Badge>

            <Badge variant="outline">
              {operador.classificacao_eficiencia === "alta"
                ? "Eficiência alta"
                : operador.classificacao_eficiencia === "media"
                ? "Eficiência média"
                : "Eficiência baixa"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {baixoVolume ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300">
            Leitura com cautela: operador com baixo volume de cupons.
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <TimerReset className="h-4 w-4" />
              Vendas canceladas
            </div>
            <p className="text-xl font-bold">
              {operador.taxa_vendas_canceladas.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {operador.quantidade_vendas_canceladas} vendas •{" "}
              {fmtMoney(operador.valor_vendas_canceladas)}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <OctagonAlert className="h-4 w-4" />
              Itens cancelados
            </div>
            <p className="text-xl font-bold">
              {operador.taxa_itens_cancelados.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {operador.quantidade_itens_cancelados} itens •{" "}
              {fmtMoney(operador.valor_itens_cancelados)}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4" />
              Consultas
            </div>
            <p className="text-xl font-bold">
              {operador.taxa_consultas.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {operador.quantidade_itens_consultados} consultas
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <ShieldAlert className="h-4 w-4" />
              Impacto cancelado
            </div>
            <p className="text-xl font-bold">
              {operador.impacto_valor_cancelado.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">
              Ticket médio {fmtMoney(operador.ticket_medio)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 p-3 dark:border-gray-800">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            Leitura executiva
          </div>

          <p className="text-sm text-muted-foreground">
            {operador.classificacao_risco === "alto" && (
              <>Prioridade máxima de auditoria por classificação de risco alta. </>
            )}

            {operador.classificacao_risco === "medio" && (
              <>Operador acima da normalidade da equipe em indicadores de risco. </>
            )}

            {operador.taxa_vendas_canceladas > 1 && (
              <>Há atenção especial para vendas canceladas. </>
            )}

            {operador.taxa_itens_cancelados > 0.7 && (
              <>O volume de cancelamento de itens merece validação operacional. </>
            )}

            {operador.classificacao_eficiencia === "baixa" && (
              <>A eficiência operacional está abaixo dos melhores pares da loja.</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}