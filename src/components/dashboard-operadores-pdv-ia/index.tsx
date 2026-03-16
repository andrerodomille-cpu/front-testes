// src/components/dashboard-operadores-pdv-ia/index.tsx
import React, { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOperadoresPDVIAData } from "./types";
import { buildOperatorAnalysis } from "./utils/analysis";
import { HeaderResumo } from "./components/HeaderResumo";
import { CardsExecutivos } from "./components/CardsExecutivos";
import { RiscosTab } from "./components/tab-riscos/RiscosTab";
import { ForaDaCurvaTab } from "./components/tab-fora-curva/ForaDaCurvaTab";
import { EficienciaTab } from "./components/tab-eficiencia/EficienciaTab";
import { DetalhesTab } from "./components/tab-detalhes/DetalhesTab";

interface DashboardOperadoresPDVIAProps {
  data: DashboardOperadoresPDVIAData;
}

export default function DashboardOperadoresPDVIA({
  data,
}: DashboardOperadoresPDVIAProps) {
  const [busca, setBusca] = useState("");

  const indicadores = data.indicadores;
  const { medias, desvios, operadores } = indicadores;

  const analisados = useMemo(() => {
    return operadores
      .map((op) => buildOperatorAnalysis(op, indicadores))
      .sort(
        (a, b) =>
          b.total_alertas - a.total_alertas ||
          b.impacto_valor_cancelado - a.impacto_valor_cancelado
      );
  }, [operadores, indicadores]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return analisados;

    return analisados.filter((op) =>
      op.nome_operador.toLowerCase().includes(termo)
    );
  }, [analisados, busca]);

  const topRisco = useMemo(
    () => analisados.filter((op) => op.total_alertas > 0).slice(0, 5),
    [analisados]
  );

  const topImpactoFinanceiro = useMemo(
    () =>
      [...analisados]
        .sort(
          (a, b) => b.impacto_valor_cancelado - a.impacto_valor_cancelado
        )
        .slice(0, 5),
    [analisados]
  );

  const topProdutividade = useMemo(
    () =>
      [...analisados]
        .sort((a, b) => b.cupons_por_hora - a.cupons_por_hora)
        .slice(0, 5),
    [analisados]
  );

  const oportunidadeTreinamento = useMemo(() => {
    return [...analisados]
      .filter(
        (op) =>
          op.cupons_por_hora < medias.cupons_por_hora ||
          op.tempo_medio_por_cupom_seg > medias.tempo_medio_por_cupom_seg
      )
      .sort(
        (a, b) => b.tempo_medio_por_cupom_seg - a.tempo_medio_por_cupom_seg
      )
      .slice(0, 5);
  }, [analisados, medias]);

  const scatterData = useMemo(() => {
    return analisados.map((op) => ({
      x: op.cupons_por_hora,
      y: op.taxa_itens_cancelados,
      z: op.quantidade_cupons,
      nome_operador: op.nome_operador,
      total_alertas: op.total_alertas,
    }));
  }, [analisados]);

  return (
    <div className="min-h-screen bg-white p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeaderResumo data={data} />

        <CardsExecutivos
          topRisco={topRisco}
          topImpactoFinanceiro={topImpactoFinanceiro}
          topProdutividade={topProdutividade}
        />


        <Tabs defaultValue="riscos" className="space-y-4">
  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 rounded-2xl border border-gray-200 bg-gray-100 p-1 dark:border-slate-800 dark:bg-slate-900">
    
    <TabsTrigger
      value="riscos"
      className="rounded-xl text-gray-600 dark:text-slate-300
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm"
    >
      Riscos
    </TabsTrigger>

    <TabsTrigger
      value="fora-curva"
      className="rounded-xl text-gray-600 dark:text-slate-300
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm"
    >
      Fora da curva
    </TabsTrigger>

    <TabsTrigger
      value="eficiencia"
      className="rounded-xl text-gray-600 dark:text-slate-300
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm"
    >
      Eficiência
    </TabsTrigger>

    <TabsTrigger
      value="detalhes"
      className="rounded-xl text-gray-600 dark:text-slate-300
      data-[state=active]:bg-blue-600
      data-[state=active]:text-white
      data-[state=active]:shadow-sm"
    >
      Detalhes
    </TabsTrigger>

  </TabsList>

          <TabsContent value="riscos">
            <RiscosTab
              topRisco={topRisco}
              topImpactoFinanceiro={topImpactoFinanceiro}
              scatterData={scatterData}
            />
          </TabsContent>

          <TabsContent value="fora-curva">
            <ForaDaCurvaTab
              analisados={analisados}
              medias={medias}
              desvios={desvios}
            />
          </TabsContent>

          <TabsContent value="eficiencia">
            <EficienciaTab
              topProdutividade={topProdutividade}
              oportunidadeTreinamento={oportunidadeTreinamento}
              analisados={analisados}
              medias={medias}
            />
          </TabsContent>

          <TabsContent value="detalhes">
            <DetalhesTab
              busca={busca}
              setBusca={setBusca}
              filtrados={filtrados}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}