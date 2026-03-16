import { BadgeAlert, DollarSign, TrendingDown, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OperadorAnalisado } from "../types";
import { fmtNumber, fmtPct } from "../utils/formatters";

interface CardsExecutivosProps {
  topRisco: OperadorAnalisado[];
  topImpactoFinanceiro: OperadorAnalisado[];
  topProdutividade: OperadorAnalisado[];
}

export function CardsExecutivos({
  topRisco,
  topImpactoFinanceiro,
  topProdutividade,
}: CardsExecutivosProps) {
  const cards = [
    {
      title: "Operadores com alertas acionados",
      value: topRisco.length,
      icon: BadgeAlert,
      help: "Quantidade de operadores com pelo menos um indicador fora da curva.",
    },
    {
      title: "Maior impacto financeiro",
      value: topImpactoFinanceiro[0]
        ? `${topImpactoFinanceiro[0].nome_operador} · ${fmtPct(
            topImpactoFinanceiro[0].impacto_valor_cancelado
          )}`
        : "-",
      icon: DollarSign,
      help: "Percentual do valor cancelado sobre a venda total do operador.",
    },
    {
      title: "Maior taxa de itens cancelados",
      value: topRisco[0]
        ? `${topRisco[0].nome_operador} · ${fmtPct(
            topRisco[0].taxa_itens_cancelados
          )}`
        : "-",
      icon: TrendingDown,
      help: "Taxa calculada com base nos dados retornados pelo endpoint.",
    },
    {
      title: "Melhor produtividade",
      value: topProdutividade[0]
        ? `${topProdutividade[0].nome_operador} · ${fmtNumber(
            topProdutividade[0].cupons_por_hora
          )} cupons/h`
        : "-",
      icon: Zap,
      help: "Maior volume de cupons por hora entre os operadores retornados.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {item.title}
                  </div>

                  <div className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
                    {String(item.value)}
                  </div>

                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {item.help}
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-100 p-2 dark:bg-gray-800">
                  <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}