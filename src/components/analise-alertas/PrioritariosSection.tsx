import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, ShieldAlert } from "lucide-react";
import { OperadorPrioritario } from "./types";
import { fmtDecimal, fmtInt, fmtMoney, fmtPct, badgeTone } from "./utils";

interface PrioritariosSectionProps {
  operadores: OperadorPrioritario[];
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}

export function PrioritariosSection({ operadores }: PrioritariosSectionProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <ClipboardCheck className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
          Operadores prioritários para auditoria
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {operadores.map((operador) => (
          <div
            key={operador.nome_operador}
            className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 dark:border-red-500/20 dark:bg-red-500/10"
          >
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-300" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {operador.nome_operador}
                  </h3>
                </div>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {operador.motivo_principal}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={badgeTone(operador.classificacao_risco)}>
                  risco {operador.classificacao_risco}
                </Badge>
                <Badge className={badgeTone(operador.classificacao_eficiencia)}>
                  eficiência {operador.classificacao_eficiencia}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Metric label="Score de risco" value={fmtDecimal(operador.score_risco, 4)} />
              <Metric label="Score de eficiência" value={fmtDecimal(operador.score_eficiencia, 4)} />
              <Metric label="Venda total" value={fmtMoney(operador.valor_total_venda)} />
              <Metric label="Cupons" value={fmtInt(operador.quantidade_cupons)} />
              <Metric label="Itens cancelados" value={fmtPct(operador.taxa_itens_cancelados)} />
              <Metric label="Vendas canceladas" value={fmtPct(operador.taxa_vendas_canceladas)} />
              <Metric label="Consultas" value={fmtPct(operador.taxa_consultas)} />
              <Metric label="Descontos" value={fmtPct(operador.taxa_descontos, 3)} />
              <Metric label="Impacto cancelado" value={fmtPct(operador.impacto_valor_cancelado)} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}