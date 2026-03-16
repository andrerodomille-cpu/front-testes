import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Building2, Receipt, ShieldAlert } from "lucide-react";
import { fmtInt, fmtMoney, fmtDecimal } from "./utils";

interface SummaryCardsProps {
  loja: string;
  operadores: number;
  quantidadeCupons: number;
  valorTotalVenda: number;
  operadorMaiorRisco?: {
    nome_operador: string;
    score_risco: number;
  } | null;
  totalAlertas?: number;
}

export function SummaryCards({
  loja,
  operadores,
  quantidadeCupons,
  valorTotalVenda,
  operadorMaiorRisco,
  totalAlertas = 0,
}: SummaryCardsProps) {
  const cards = [
    {
      titulo: "Loja",
      valor: loja,
      descricao: `${fmtInt(operadores)} operadores analisados`,
      icon: Building2,
    },
    {
      titulo: "Valor total de venda",
      valor: fmtMoney(valorTotalVenda),
      descricao: `${fmtInt(quantidadeCupons)} cupons processados`,
      icon: Receipt,
    },
    {
      titulo: "Maior risco",
      valor: operadorMaiorRisco?.nome_operador ?? "Sem destaque",
      descricao: operadorMaiorRisco
        ? `Score ${fmtDecimal(operadorMaiorRisco.score_risco, 4)}`
        : "Sem identificação",
      icon: ShieldAlert,
    },
    {
      titulo: "Alertas automáticos",
      valor: fmtInt(totalAlertas),
      descricao: "Sinais objetivos para ação gerencial",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.titulo}
            className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {card.titulo}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {card.valor}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {card.descricao}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-2.5">
                  <Icon className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}