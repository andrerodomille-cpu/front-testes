import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OperadorAnalisado } from "../../types";
import {
  fmtInt,
  fmtMoney,
  fmtPct,
  fmtNumber,
} from "../../utils/formatters";
import { kpiTone, toneClasses } from "../../utils/analysis";

interface ForaDaCurvaTabProps {
  analisados: OperadorAnalisado[];
  medias: {
    taxa_itens_cancelados: number;
    taxa_vendas_canceladas: number;
    taxa_consultas: number;
    impacto_valor_cancelado: number;
    cupons_por_hora: number;
  };
  desvios: {
    taxa_itens_cancelados: number;
    taxa_vendas_canceladas: number;
    taxa_consultas: number;
    impacto_valor_cancelado: number;
    cupons_por_hora: number;
  };
}

function metricToneClasses(tone: string) {
  if (tone === "critical") {
    return "border-red-200 bg-red-50 text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200";
  }

  if (tone === "attention") {
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200";
}

export function ForaDaCurvaTab({
  analisados,
  medias,
  desvios,
}: ForaDaCurvaTabProps) {
  const operadoresComAlerta = analisados.filter((op) => op.total_alertas > 0);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 dark:text-gray-100">
            Operadores fora da curva
          </CardTitle>
        </CardHeader>

        <CardContent>
          {operadoresComAlerta.length === 0 ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Nenhum operador com alerta pelos critérios atuais.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {operadoresComAlerta.map((op) => {
                const toneItens = kpiTone(
                  op.taxa_itens_cancelados,
                  medias.taxa_itens_cancelados,
                  desvios.taxa_itens_cancelados
                );

                const toneVendas = kpiTone(
                  op.taxa_vendas_canceladas,
                  medias.taxa_vendas_canceladas,
                  desvios.taxa_vendas_canceladas
                );

                const toneConsultas = kpiTone(
                  op.taxa_consultas,
                  medias.taxa_consultas,
                  desvios.taxa_consultas
                );

                const toneImpacto = kpiTone(
                  op.impacto_valor_cancelado,
                  medias.impacto_valor_cancelado,
                  desvios.impacto_valor_cancelado
                );

                const toneProd = kpiTone(
                  op.cupons_por_hora,
                  medias.cupons_por_hora,
                  desvios.cupons_por_hora,
                  "lower-risk"
                );

                return (
                  <div
                    key={op.nome_operador}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                          {op.nome_operador}
                        </div>

                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {fmtInt(op.quantidade_cupons)} cupons ·{" "}
                          {fmtMoney(op.valor_total_venda)} em vendas ·{" "}
                          {fmtNumber(op.cupons_por_hora)} cupons/h
                        </div>
                      </div>

                      <Badge className={toneClasses("critical")}>
                        {op.total_alertas} alerta{op.total_alertas > 1 ? "s" : ""}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-5">
                      <div
                        className={`rounded-xl border p-2 ${metricToneClasses(
                          toneItens
                        )}`}
                      >
                        <div className="font-medium opacity-80">Itens cancelados</div>
                        <div className="mt-1 text-sm font-semibold">
                          {fmtPct(op.taxa_itens_cancelados)}
                        </div>
                      </div>

                      <div
                        className={`rounded-xl border p-2 ${metricToneClasses(
                          toneVendas
                        )}`}
                      >
                        <div className="font-medium opacity-80">Vendas canceladas</div>
                        <div className="mt-1 text-sm font-semibold">
                          {fmtPct(op.taxa_vendas_canceladas)}
                        </div>
                      </div>

                      <div
                        className={`rounded-xl border p-2 ${metricToneClasses(
                          toneConsultas
                        )}`}
                      >
                        <div className="font-medium opacity-80">Consultas</div>
                        <div className="mt-1 text-sm font-semibold">
                          {fmtPct(op.taxa_consultas)}
                        </div>
                      </div>

                      <div
                        className={`rounded-xl border p-2 ${metricToneClasses(
                          toneImpacto
                        )}`}
                      >
                        <div className="font-medium opacity-80">Impacto financeiro</div>
                        <div className="mt-1 text-sm font-semibold">
                          {fmtPct(op.impacto_valor_cancelado)}
                        </div>
                      </div>

                      <div
                        className={`rounded-xl border p-2 ${metricToneClasses(
                          toneProd
                        )}`}
                      >
                        <div className="font-medium opacity-80">Cupons/hora</div>
                        <div className="mt-1 text-sm font-semibold">
                          {fmtNumber(op.cupons_por_hora)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="text-base text-gray-900 dark:text-gray-100">
            Leituras operacionais
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Risco concentrado em cancelamentos
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              BABI e LETICIA aparecem com maiores taxas de itens cancelados no
              comparativo, enquanto CARMINHA concentra o maior impacto
              financeiro por vendas canceladas.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Dependência de consulta
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              CLARICE, MARINA, JOSEFA e MARCOS aparecem com níveis de consulta
              relevantes no conjunto analisado.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Produtividade e tempo de atendimento
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              LUCAS lidera em cupons por hora. JOSE e FLOQUINHO têm menor
              produtividade relativa e maior tempo por cupom dentro do grupo
              retornado.
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950/60">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Atenção ao volume pequeno
            </div>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              Alguns operadores possuem baixo volume de cupons. O painel exibe
              os números exatamente como retornados, então taxas em bases
              pequenas devem ser lidas com cautela.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}