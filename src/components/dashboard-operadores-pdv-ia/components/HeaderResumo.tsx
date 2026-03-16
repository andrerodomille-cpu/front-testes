import { Card, CardContent } from "@/components/ui/card";
import { DashboardOperadoresPDVIAData } from "../types";
import { fmtInt, fmtNumber, fmtSeconds } from "../utils/formatters";

interface HeaderResumoProps {
  data: DashboardOperadoresPDVIAData;
}

export function HeaderResumo({ data }: HeaderResumoProps) {
  const { resumo, medias } = data.indicadores;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-200">
          Prevenção de perdas e eficiência operacional
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Dashboard de Operadores PDV · {resumo.loja || "Loja"}
        </h1>

        <p className="max-w-4xl text-sm text-gray-600 dark:text-gray-400">
          Painel construído apenas com os dados fornecidos pelo endpoint.
          Os alertas usam as médias e os desvios retornados na resposta.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full lg:w-auto">
        <Card className="rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Operadores analisados
            </div>

            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {fmtInt(resumo.operadores_analisados)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Média de cupons/hora
            </div>

            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {fmtNumber(medias.cupons_por_hora)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70 col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tempo médio por cupom
            </div>

            <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {fmtSeconds(medias.tempo_medio_por_cupom_seg)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}