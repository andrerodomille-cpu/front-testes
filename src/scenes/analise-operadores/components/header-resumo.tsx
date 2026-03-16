import { AlertTriangle, Receipt, Store, Wallet } from "lucide-react";
import { KpiCard } from "./kpi-card";
import { AnaliseOperadoresPayload } from "../types";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

const fmtInt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(v);

interface HeaderResumoProps {
  data: AnaliseOperadoresPayload;
}

export function HeaderResumo({ data }: HeaderResumoProps) {
  const { resumo, medias } = data.indicadores;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Loja"
        value={resumo.loja}
        subtitle={`${resumo.operadores_analisados} operadores analisados`}
        icon={Store}
      />
      <KpiCard
        title="Faturamento total"
        value={fmtMoney(resumo.valor_total_venda)}
        subtitle="Base consolidada da análise"
        icon={Wallet}
      />
      <KpiCard
        title="Cupons"
        value={fmtInt(resumo.quantidade_cupons)}
        subtitle={`Média geral: ${medias.cupons_por_hora.toFixed(2)} cupons/h`}
        icon={Receipt}
      />
      <KpiCard
        title="Impacto cancelado"
        value={`${medias.impacto_valor_cancelado.toFixed(2)}%`}
        subtitle="Média da operação"
        icon={AlertTriangle}
      />
    </div>
  );
}