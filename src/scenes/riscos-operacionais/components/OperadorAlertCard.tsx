import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, UserRound } from "lucide-react";
import { AnaliseRiscoOperacionalPayload, OperadorScorado } from "../types";
import { fmtMoney, fmtNumber, getRiskLevel, toneClasses } from "../utils";

interface OperadorAlertCardProps {
  operador: OperadorScorado;
  payload: AnaliseRiscoOperacionalPayload;
}

function MetricRow({
  label,
  value,
  reference,
  invert = false,
}: {
  label: string;
  value: number;
  reference: number;
  invert?: boolean;
}) {
  const diff = value - reference;
  const positive = invert ? diff < 0 : diff > 0;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/70 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Média da loja: {fmtNumber(reference)}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold">{fmtNumber(value)}</p>
        <Badge
          variant="outline"
          className={positive ? toneClasses.warning : toneClasses.success}
        >
          {diff >= 0 ? "+" : ""}{fmtNumber(diff)}
        </Badge>
      </div>
    </div>
  );
}

export function OperadorAlertCard({ operador, payload }: OperadorAlertCardProps) {
  const level = getRiskLevel(operador.riskScore);

  return (
    <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="h-4 w-4" />
              {operador.nome_operador}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {operador.loja} • {fmtMoney(operador.valor_total_venda)} em vendas • {fmtNumber(operador.quantidade_cupons)} cupons
            </p>
          </div>

          <Badge variant="outline" className={toneClasses[level.tone]}>
            {level.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricRow
            label="Taxa itens cancelados"
            value={operador.taxa_itens_cancelados}
            reference={payload.indicadores.medias.taxa_itens_cancelados}
          />
          <MetricRow
            label="Taxa vendas canceladas"
            value={operador.taxa_vendas_canceladas}
            reference={payload.indicadores.medias.taxa_vendas_canceladas}
          />
          <MetricRow
            label="Taxa consultas"
            value={operador.taxa_consultas}
            reference={payload.indicadores.medias.taxa_consultas}
          />
          <MetricRow
            label="Cupons por hora"
            value={operador.cupons_por_hora}
            reference={payload.indicadores.medias.cupons_por_hora}
            invert
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {operador.alerts.map((alert) => (
            <Badge
              key={`${operador.nome_operador}-${alert.label}`}
              variant="outline"
              className={toneClasses[alert.severity]}
            >
              <AlertTriangle className="mr-1 h-3.5 w-3.5" />
              {alert.label}: {alert.value}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
