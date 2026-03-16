import {
  CircleAlert,
  CircleDollarSign,
  Gauge,
  ShieldAlert,
} from "lucide-react";
import { KPICard } from "./KPICard";
import { OperadorScorado } from "../types";
import { fmtMoney, fmtNumber, getRiskLevel } from "../utils";

interface CardsKPIsOperacionaisProps {
  operadoresScorados: OperadorScorado[];
  operadoresComAlerta: OperadorScorado[];
  mediaCuponsHora: number;
}

export function CardsKPIsOperacionais({
  operadoresScorados,
  operadoresComAlerta,
  mediaCuponsHora,
}: CardsKPIsOperacionaisProps) {
  const maiorRisco = operadoresScorados[0];
  const maiorFaturamento = operadoresScorados
    .slice()
    .sort((a, b) => b.valor_total_venda - a.valor_total_venda)[0];
  const maiorProdutividade = operadoresScorados
    .slice()
    .sort((a, b) => b.cupons_por_hora - a.cupons_por_hora)[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Maior risco operacional"
        value={maiorRisco?.nome_operador ?? "-"}
        subtitle={
          maiorRisco
            ? `Score ${fmtNumber(maiorRisco.riskScore)} • ${getRiskLevel(maiorRisco.riskScore).label}`
            : "-"
        }
        icon={ShieldAlert}
      />

      <KPICard
        title="Maior faturamento"
        value={maiorFaturamento?.nome_operador ?? "-"}
        subtitle={maiorFaturamento ? fmtMoney(maiorFaturamento.valor_total_venda) : "-"}
        icon={CircleDollarSign}
      />

      <KPICard
        title="Maior produtividade"
        value={maiorProdutividade?.nome_operador ?? "-"}
        subtitle={maiorProdutividade ? `${fmtNumber(maiorProdutividade.cupons_por_hora)} cupons/h` : "-"}
        icon={Gauge}
      />

      <KPICard
        title="Operadores com alerta"
        value={String(operadoresComAlerta.length)}
        subtitle={`Média loja: ${fmtNumber(mediaCuponsHora)} cupons/h`}
        icon={CircleAlert}
      />
    </div>
  );
}

