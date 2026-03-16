import { IndicadoresPDVIA, OperadorAnalisado, OperadorPDVIA } from "../types";

export function kpiTone(value: number, mean: number, std: number, mode = "higher-risk") {
  if (mode === "higher-risk") {
    if (value > mean + std) return "critical";
    if (value > mean) return "attention";
    return "normal";
  }

  if (mode === "lower-risk") {
    if (value < mean - std) return "critical";
    if (value < mean) return "attention";
    return "normal";
  }

  return "normal";
}

export function toneClasses(tone: string) {
  if (tone === "critical") return "border-red-500/40 bg-red-500/10 text-red-200";
  if (tone === "attention") return "border-amber-500/40 bg-amber-500/10 text-amber-200";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
}

export function buildOperatorAnalysis(op: OperadorPDVIA, indicadores: IndicadoresPDVIA): OperadorAnalisado {
  const { medias, desvios } = indicadores;
  const alerts: OperadorAnalisado["alertas"] = [];

  if (op.taxa_itens_cancelados > medias.taxa_itens_cancelados + (desvios.taxa_itens_cancelados || 0)) {
    alerts.push({
      id: "taxa_itens_cancelados",
      label: "Itens cancelados acima da curva",
      value: op.taxa_itens_cancelados,
      baseline: medias.taxa_itens_cancelados,
    });
  }

  if (op.taxa_vendas_canceladas > medias.taxa_vendas_canceladas + (desvios.taxa_vendas_canceladas || 0)) {
    alerts.push({
      id: "taxa_vendas_canceladas",
      label: "Vendas canceladas acima da curva",
      value: op.taxa_vendas_canceladas,
      baseline: medias.taxa_vendas_canceladas,
    });
  }

  if (op.taxa_consultas > medias.taxa_consultas + (desvios.taxa_consultas || 0)) {
    alerts.push({
      id: "taxa_consultas",
      label: "Consultas acima da curva",
      value: op.taxa_consultas,
      baseline: medias.taxa_consultas,
    });
  }

  if (op.impacto_valor_cancelado > medias.impacto_valor_cancelado + (desvios.impacto_valor_cancelado || 0)) {
    alerts.push({
      id: "impacto_valor_cancelado",
      label: "Impacto financeiro de cancelamentos acima da curva",
      value: op.impacto_valor_cancelado,
      baseline: medias.impacto_valor_cancelado,
    });
  }

  if (op.cupons_por_hora < medias.cupons_por_hora - (desvios.cupons_por_hora || 0)) {
    alerts.push({
      id: "cupons_por_hora",
      label: "Produtividade abaixo da curva",
      value: op.cupons_por_hora,
      baseline: medias.cupons_por_hora,
    });
  }

  const strengths: string[] = [];

  if (op.cupons_por_hora > medias.cupons_por_hora) strengths.push("Produtividade acima da média");
  if (op.tempo_medio_por_cupom_seg < medias.tempo_medio_por_cupom_seg) strengths.push("Tempo por cupom abaixo da média da loja");
  if (op.taxa_itens_cancelados < medias.taxa_itens_cancelados) strengths.push("Taxa de cancelamento de itens abaixo da média");
  if (op.taxa_vendas_canceladas < medias.taxa_vendas_canceladas) strengths.push("Taxa de vendas canceladas abaixo da média");

  return {
    ...op,
    alertas: alerts,
    total_alertas: alerts.length,
    pontos_positivos: strengths,
  };
}
