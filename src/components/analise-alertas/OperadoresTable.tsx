import React from "react";
import { Badge } from "@/components/ui/badge";
import { OperadorBase } from "./types";
import { badgeTone, fmtMoney, fmtPct } from "./utils";

interface OperadoresTableProps {
  data: OperadorBase[];
}

export function OperadoresTable({ data }: OperadoresTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-950">
          <tr className="text-left">
            <th className="px-4 py-3">Operador</th>
            <th className="px-4 py-3">Venda total</th>
            <th className="px-4 py-3">Cupons</th>
            <th className="px-4 py-3">Itens cancelados</th>
            <th className="px-4 py-3">Vendas canceladas</th>
            <th className="px-4 py-3">Consultas</th>
            <th className="px-4 py-3">Impacto</th>
            <th className="px-4 py-3">Risco</th>
            <th className="px-4 py-3">Eficiência</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((item) => (
            <tr key={item.nome_operador} className="bg-white dark:bg-gray-900">
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                {item.nome_operador}
              </td>
              <td className="px-4 py-3">{fmtMoney(item.valor_total_venda)}</td>
              <td className="px-4 py-3">{item.quantidade_cupons}</td>
              <td className="px-4 py-3">{fmtPct(item.taxa_itens_cancelados)}</td>
              <td className="px-4 py-3">{fmtPct(item.taxa_vendas_canceladas)}</td>
              <td className="px-4 py-3">{fmtPct(item.taxa_consultas)}</td>
              <td className="px-4 py-3">{fmtPct(item.impacto_valor_cancelado)}</td>
              <td className="px-4 py-3">
                <Badge className={badgeTone(item.classificacao_risco)}>
                  {item.classificacao_risco}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge className={badgeTone(item.classificacao_eficiencia)}>
                  {item.classificacao_eficiencia}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}