
import {
  AlertaOperador,
  AnaliseRiscoOperacionalPayload,
  OperadorRiscoOperacional,
  OperadorScorado,
  SeveridadeRisco,
} from "./types";

export const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

export const fmtMoney = (value: number) => moneyFormatter.format(value);
export const fmtNumber = (value: number) => numberFormatter.format(value);
export const fmtPct = (value: number) => `${numberFormatter.format(value)}%`;

export const toneClasses: Record<SeveridadeRisco, string> = {
  danger:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  warning:
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  info:
    "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  success:
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
};

export function zScore(value: number, mean: number, std: number) {
  if (!std) return 0;
  return (value - mean) / std;
}

export function getOperatorAlerts(
  operador: OperadorRiscoOperacional,
  payload: AnaliseRiscoOperacionalPayload
): AlertaOperador[] {
  const { medias, desvios } = payload.indicadores;

  const alerts: AlertaOperador[] = [];

  const zCancelItems = zScore(
    operador.taxa_itens_cancelados,
    medias.taxa_itens_cancelados,
    desvios.taxa_itens_cancelados
  );

  const zCancelSales = zScore(
    operador.taxa_vendas_canceladas,
    medias.taxa_vendas_canceladas,
    desvios.taxa_vendas_canceladas
  );

  const zConsults = zScore(
    operador.taxa_consultas,
    medias.taxa_consultas,
    desvios.taxa_consultas
  );

  const zImpact = zScore(
    operador.impacto_valor_cancelado,
    medias.impacto_valor_cancelado,
    desvios.impacto_valor_cancelado
  );

  const zCouponsLow = zScore(
    medias.cupons_por_hora - operador.cupons_por_hora,
    0,
    desvios.cupons_por_hora
  );

  if (zCancelItems >= 1) {
    alerts.push({
      label: "Itens cancelados acima da média",
      severity: zCancelItems >= 2 ? "danger" : "warning",
      value: fmtPct(operador.taxa_itens_cancelados),
    });
  }

  if (zCancelSales >= 1) {
    alerts.push({
      label: "Vendas canceladas acima da média",
      severity: zCancelSales >= 2 ? "danger" : "warning",
      value: fmtPct(operador.taxa_vendas_canceladas),
    });
  }

  if (zConsults >= 1) {
    alerts.push({
      label: "Consultas acima da média",
      severity: zConsults >= 2 ? "danger" : "info",
      value: fmtPct(operador.taxa_consultas),
    });
  }

  if (zImpact >= 1) {
    alerts.push({
      label: "Impacto financeiro de cancelamento",
      severity: zImpact >= 2 ? "danger" : "warning",
      value: fmtPct(operador.impacto_valor_cancelado),
    });
  }

  if (zCouponsLow >= 1) {
    alerts.push({
      label: "Produtividade abaixo da média",
      severity: zCouponsLow >= 2 ? "danger" : "info",
      value: `${fmtNumber(operador.cupons_por_hora)} cupons/h`,
    });
  }

  return alerts;
}

export function getRiskScore(
  operador: OperadorRiscoOperacional,
  payload: AnaliseRiscoOperacionalPayload
) {
  const { medias, desvios } = payload.indicadores;

  const scores = [
    Math.max(
      0,
      zScore(
        operador.taxa_itens_cancelados,
        medias.taxa_itens_cancelados,
        desvios.taxa_itens_cancelados
      )
    ),
    Math.max(
      0,
      zScore(
        operador.taxa_vendas_canceladas,
        medias.taxa_vendas_canceladas,
        desvios.taxa_vendas_canceladas
      )
    ),
    Math.max(
      0,
      zScore(
        operador.taxa_consultas,
        medias.taxa_consultas,
        desvios.taxa_consultas
      )
    ),
    Math.max(
      0,
      zScore(
        operador.impacto_valor_cancelado,
        medias.impacto_valor_cancelado,
        desvios.impacto_valor_cancelado
      )
    ),
    Math.max(
      0,
      zScore(medias.cupons_por_hora - operador.cupons_por_hora, 0, desvios.cupons_por_hora)
    ),
  ];

  return scores.reduce((acc, curr) => acc + curr, 0);
}

export function getRiskLevel(score: number) {
  if (score >= 4) {
    return {
      label: "Crítico",
      tone: "danger" as SeveridadeRisco,
    };
  }

  if (score >= 2) {
    return {
      label: "Atenção",
      tone: "warning" as SeveridadeRisco,
    };
  }

  if (score >= 1) {
    return {
      label: "Monitorar",
      tone: "info" as SeveridadeRisco,
    };
  }

  return {
    label: "Estável",
    tone: "success" as SeveridadeRisco,
  };
}

export function buildOperadoresScorados(
  payload: AnaliseRiscoOperacionalPayload
): OperadorScorado[] {
  return payload.indicadores.operadores
    .map((operador) => ({
      ...operador,
      riskScore: getRiskScore(operador, payload),
      alerts: getOperatorAlerts(operador, payload),
    }))
    .sort((a, b) => b.riskScore - a.riskScore);
}

