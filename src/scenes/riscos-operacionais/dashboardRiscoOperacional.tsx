
import { useMemo } from "react";
import {
  AlertTriangle,
  ArrowDownCircle,
  BarChart3,
  Calculator,
  Eye,
  Gauge,
  ScanSearch,
  ShieldAlert,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { analiseRiscoOperacionalMock } from "./mock"; // você cria este arquivo
import { CardsKPIsOperacionais } from "./components/CardsKPIsOperacionais";
import { GraficoDistribuicaoRisco } from "./components/GraficoDistribuicaoRisco";
import { InsightCard } from "./components/InsightCard";
import { OperadorAlertCard } from "./components/OperadorAlertCard";
import { RankingListCard } from "./components/RankingListCard";
import { TabelaOperadoresRisco } from "./components/TabelaOperadoresRisco";
import { AnaliseRiscoOperacionalPayload } from "./types";
import {
  buildOperadoresScorados,
  fmtMoney,
  fmtNumber,
  fmtPct,
  getRiskLevel,
  toneClasses,
} from "./utils";

export default function DashboardRiscoOperacional() {
  const payload = analiseRiscoOperacionalMock as AnaliseRiscoOperacionalPayload;

  const analysis = useMemo(() => {
    const operadoresScorados = buildOperadoresScorados(payload);
    const operadoresComAlerta = operadoresScorados.filter((item) => item.alerts.length > 0);
    const riscoCritico = operadoresScorados.filter(
      (item) => getRiskLevel(item.riskScore).label === "Crítico"
    );

    const produtividadeAlta = payload.indicadores.operadores
      .slice()
      .sort((a, b) => b.cupons_por_hora - a.cupons_por_hora)
      .slice(0, 3);

    const produtividadeBaixa = payload.indicadores.operadores
      .slice()
      .sort((a, b) => a.cupons_por_hora - b.cupons_por_hora)
      .slice(0, 3);

    const pontosCriticos: string[] = [];
    const oportunidades: string[] = [];
    const destaques: string[] = [];

    if (riscoCritico.length > 0) {
      pontosCriticos.push(
        `${riscoCritico.map((item) => item.nome_operador).join(", ")} concentram os maiores sinais de risco pelo conjunto de cancelamentos, consultas, impacto financeiro e produtividade abaixo da média.`
      );
    }

    const topVendasCanceladas = payload.indicadores.topVendasCanceladas[0];
    const topCancelamento = payload.indicadores.topCancelamento[0];
    const topConsultas = payload.indicadores.topConsultas[0];
    const topFaturamento = payload.indicadores.topFaturamento[0];
    const topProdutividade = payload.indicadores.topProdutividade[0];

    pontosCriticos.push(
      `${topVendasCanceladas.nome_operador} apresenta a maior taxa de vendas canceladas (${fmtPct(topVendasCanceladas.taxa_vendas_canceladas)}) e o maior valor em vendas canceladas (${fmtMoney(topVendasCanceladas.valor_vendas_canceladas)}).`
    );

    pontosCriticos.push(
      `${topCancelamento.nome_operador} lidera em taxa de itens cancelados (${fmtPct(topCancelamento.taxa_itens_cancelados)}) e em valor de itens cancelados (${fmtMoney(topCancelamento.valor_itens_cancelados)}).`
    );

    pontosCriticos.push(
      `${topConsultas.nome_operador} possui a maior taxa de consultas (${fmtPct(topConsultas.taxa_consultas)}), acima da média da loja (${fmtPct(payload.indicadores.medias.taxa_consultas)}).`
    );

    destaques.push(
      `${topFaturamento.nome_operador} lidera o faturamento com ${fmtMoney(topFaturamento.valor_total_venda)}.`
    );
    destaques.push(
      `${topProdutividade.nome_operador} tem a maior produtividade, com ${fmtNumber(topProdutividade.cupons_por_hora)} cupons/h.`
    );
    destaques.push(
      `${produtividadeAlta.map((item) => item.nome_operador).join(", ")} formam o grupo de maior eficiência em cupons por hora.`
    );

    oportunidades.push(
      `Priorizar monitoramento de ${
        riscoCritico.length > 0
          ? riscoCritico.map((item) => item.nome_operador).join(", ")
          : operadoresScorados.slice(0, 3).map((item) => item.nome_operador).join(", ")
      } por apresentarem os maiores desvios operacionais.`
    );

    oportunidades.push(
      `Revisar causas de cancelamento com foco em ${topCancelamento.nome_operador} e ${topVendasCanceladas.nome_operador}, pois concentram os maiores indicadores de perda.`
    );

    oportunidades.push(
      `Usar ${produtividadeAlta[0].nome_operador}, ${produtividadeAlta[1].nome_operador} e ${produtividadeAlta[2].nome_operador} como referência operacional para ritmo de atendimento.`
    );

    oportunidades.push(
      `${produtividadeBaixa.map((item) => item.nome_operador).join(", ")} merecem revisão de fluxo, pois operam abaixo da média da loja em cupons por hora.`
    );

    return {
      operadoresScorados,
      operadoresComAlerta,
      pontosCriticos,
      oportunidades,
      destaques,
    };
  }, [payload]);

  return (
    <div className="min-h-screen border-gray-200 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-border/60 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={toneClasses.info}>
                  Análise IA • Risco Operacional
                </Badge>
                <Badge variant="outline" className={toneClasses.success}>
                  {payload.indicadores.resumo.loja}
                </Badge>
                <Badge variant="outline" className={toneClasses.info}>
                  {payload.indicadores.resumo.operadores_analisados} operadores
                </Badge>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
                Dashboard de prevenção de perdas e eficiência operacional
              </h1>

              <p className="mt-2 max-w-3xl text-sm text-muted-foreground border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
                Painel executivo para acompanhamento de risco operacional, perdas por cancelamento, operadores fora da curva e produtividade, estruturado apenas com base nos dados fornecidos.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:w-[340px]">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Média cupons/h</p>
                <p className="mt-1 text-xl font-bold">
                  {fmtNumber(payload.indicadores.medias.cupons_por_hora)}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">Ticket médio</p>
                <p className="mt-1 text-xl font-bold">
                  {fmtMoney(payload.indicadores.medias.ticket_medio)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardsKPIsOperacionais
          operadoresScorados={analysis.operadoresScorados}
          operadoresComAlerta={analysis.operadoresComAlerta}
          mediaCuponsHora={payload.indicadores.medias.cupons_por_hora}
        />

        <div className="grid gap-4 xl:grid-cols-3">
          <InsightCard
            title="Pontos críticos"
            items={analysis.pontosCriticos}
            icon={AlertTriangle}
            toneClass={toneClasses.danger}
          />
          <InsightCard
            title="Oportunidades de melhoria"
            items={analysis.oportunidades}
            icon={TrendingUp}
            toneClass={toneClasses.warning}
          />
          <InsightCard
            title="Destaques operacionais"
            items={analysis.destaques}
            icon={BarChart3}
            toneClass={toneClasses.success}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card className="rounded-2xl border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Eye className="h-4 w-4" />
                Leitura executiva do cenário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-sm">
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="font-medium">Prevenção de perdas</p>
                  <p className="mt-2 text-muted-foreground">
                    O principal risco está concentrado em cancelamentos, vendas anuladas e impacto financeiro por operador.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="font-medium">Fora da curva</p>
                  <p className="mt-2 text-muted-foreground">
                    Os cards de alerta priorizam apenas operadores com desvio relevante contra a média da loja.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="font-medium">Eficiência operacional</p>
                  <p className="mt-2 text-muted-foreground">
                    Produtividade e tempo por cupom ajudam a diferenciar alto volume de alta eficiência.
                  </p>
                </div>
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="font-medium">Ação recomendada</p>
                  <p className="mt-2 text-muted-foreground">
                    Foco nos maiores desvios e replicação das melhores rotinas dos operadores mais produtivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <GraficoDistribuicaoRisco rows={analysis.operadoresScorados} />
        </div>

<Tabs defaultValue="riscos" className="space-y-4 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
  <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900 md:grid-cols-5 xl:grid-cols-5">
    <TabsTrigger
      value="riscos"
      className="w-full rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
    >
      Riscos
    </TabsTrigger>

    <TabsTrigger
      value="rankings"
      className="w-full rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
    >
      Rankings
    </TabsTrigger>

    <TabsTrigger
      value="criterios"
      className="w-full rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70"
    >
      Critérios
    </TabsTrigger>

    <TabsTrigger
      value="analise"
      className="w-full rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
    >
      Análise textual
    </TabsTrigger>

    <TabsTrigger
      value="base"
      className="w-full rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600"
    >
      Base detalhada
    </TabsTrigger>
  </TabsList>

  <TabsContent value="riscos" className="space-y-4">
    <div className="flex items-center gap-2">
      <ShieldAlert className="h-4 w-4" />
      <h2 className="text-lg font-semibold">Operadores fora da curva</h2>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      {analysis.operadoresComAlerta.map((operador) => (
        <OperadorAlertCard
          key={operador.nome_operador}
          operador={operador}
          payload={payload}
        />
      ))}
    </div>
  </TabsContent>

  <TabsContent value="rankings" className="space-y-4 border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 ">
      <RankingListCard
        title="Maior cancelamento de itens"
        icon={ArrowDownCircle}
        rows={payload.indicadores.topCancelamento}
        metricKey="taxa_itens_cancelados"
        metricLabel="Taxa de itens cancelados"
        formatter={fmtPct}
      />

      <RankingListCard
        title="Maior cancelamento de vendas"
        icon={TrendingDown}
        rows={payload.indicadores.topVendasCanceladas}
        metricKey="taxa_vendas_canceladas"
        metricLabel="Taxa de vendas canceladas"
        formatter={fmtPct}
      />

      <RankingListCard
        title="Maior taxa de consultas"
        icon={ScanSearch}
        rows={payload.indicadores.topConsultas}
        metricKey="taxa_consultas"
        metricLabel="Taxa de consultas"
        formatter={fmtPct}
      />

      <RankingListCard
        title="Maior faturamento"
        icon={BarChart3}
        rows={payload.indicadores.topFaturamento}
        metricKey="valor_total_venda"
        metricLabel="Faturamento"
        formatter={fmtMoney}
      />

      <RankingListCard
        title="Maior produtividade"
        icon={ShoppingCart}
        rows={payload.indicadores.topProdutividade}
        metricKey="cupons_por_hora"
        metricLabel="Cupons por hora"
        formatter={(value) => `${fmtNumber(value)} cupons/h`}
      />
    </div>
  </TabsContent>

  <TabsContent value="criterios" className="space-y-4">
    <Card className="rounded-2xl border-border/60 shadow-sm border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4" />
          Critérios do painel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          O painel compara cada operador com as médias e desvios fornecidos no payload.
        </p>
        <Separator />
        <p>
          Os alertas consideram cinco dimensões: taxa de itens cancelados, taxa de vendas canceladas, taxa de consultas, impacto financeiro de cancelamento e produtividade abaixo da média.
        </p>
        <Separator />
        <p>
          O score de risco é uma soma de desvios padronizados positivos. Quanto maior o score, maior a prioridade operacional do operador.
        </p>
        <Separator />
        <p>
          Nenhum valor adicional foi inventado. O dashboard apenas organiza, compara, ranqueia e interpreta os dados disponíveis.
        </p>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="analise" className="space-y-4">
     <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Texto analítico da IA</h2>
              </div>
    <Card className="rounded-2xl border-border/60 shadow-sm border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4" />
          Análise textual do período
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          {payload.texto_analitico
            ?.split(/\n+/)
            .filter((trecho) => trecho.trim())
            .map((trecho, index) => {
              const texto = trecho.trim();
              const isTituloSecao = /^\d+\./.test(texto);
              const isIntroducao = index === 0;
              const isConclusao = /^concluindo/i.test(texto);

              if (isIntroducao) {
                return (
                  <div
                    key={`analise-${index}`}
                    className="rounded-xl border border-border/50 bg-muted/30 px-4 py-4 text-foreground"
                  >
                    <p className="font-medium leading-7">{texto}</p>
                  </div>
                );
              }

              if (isTituloSecao) {
                const partes = texto.split(":");
                const titulo = partes[0] ?? texto;
                const conteudo = partes.slice(1).join(":").trim();

                return (
                  <div
                    key={`analise-${index}`}
                    className="rounded-xl border border-border/50 px-4 py-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      {titulo}
                    </h3>
                    {conteudo ? (
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {conteudo}
                      </p>
                    ) : null}
                  </div>
                );
              }

              if (isConclusao) {
                return (
                  <div
                    key={`analise-${index}`}
                    className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-900 dark:bg-blue-950/20"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      Conclusão
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {texto}
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={`analise-${index}`}
                  className="rounded-xl border border-border/50 px-4 py-4"
                >
                  <p>{texto}</p>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  <TabsContent value="base" className="space-y-4">
    <TabelaOperadoresRisco rows={analysis.operadoresScorados} />
  </TabsContent>
</Tabs>
      </div>
    </div>
  );
}
