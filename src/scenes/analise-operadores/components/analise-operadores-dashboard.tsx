import { useMemo } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BarChart3,
  Eye,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderResumo } from "./header-resumo";
import { OperadorAlertCard } from "./operador-alert-card";
import { OperadorDestaqueCard } from "./operador-destaque-card";
import { TabelaOperadores } from "./tabela-operadores";
import { AnaliseOperadoresPayload, OperadorAnalise } from "../types";
import { analiseOperadoresMock } from "../mock";

interface Props {
  data?: AnaliseOperadoresPayload;
}

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

function sortByRiskDesc(a: OperadorAnalise, b: OperadorAnalise) {
  return b.score_risco - a.score_risco;
}

function sortByEfficiencyDesc(a: OperadorAnalise, b: OperadorAnalise) {
  return b.score_eficiencia - a.score_eficiencia;
}

export default function AnaliseOperadoresDashboard({
  data = analiseOperadoresMock,
}: Props) {
  const { indicadores } = data;

  const operadoresPrioritarios = useMemo(() => {
    return [...indicadores.operadores]
      .filter(
        (op) =>
          op.classificacao_risco === "alto" ||
          op.classificacao_risco === "medio" ||
          op.score_risco >= 1
      )
      .sort(sortByRiskDesc);
  }, [indicadores.operadores]);

  const referenciasPositivas = useMemo(() => {
    return [...indicadores.operadores]
      .filter(
        (op) =>
          (op.classificacao_eficiencia === "alta" ||
            op.score_eficiencia >= 0.6) &&
          op.classificacao_risco === "baixo"
      )
      .sort(sortByEfficiencyDesc)
      .slice(0, 5);
  }, [indicadores.operadores]);

  const leiturasOperacionais = useMemo(() => {
    const media = indicadores.medias;

    const maiorConsulta = [...indicadores.operadores].sort(
      (a, b) => b.taxa_consultas - a.taxa_consultas
    )[0];

    const maiorImpacto = [...indicadores.operadores].sort(
      (a, b) => b.impacto_valor_cancelado - a.impacto_valor_cancelado
    )[0];

    const maisRapido = [...indicadores.operadores].sort(
      (a, b) => b.cupons_por_hora - a.cupons_por_hora
    )[0];

    const referenciasEficientes = [...indicadores.operadores]
      .filter(
        (op) =>
          (op.classificacao_eficiencia === "alta" || op.score_eficiencia >= 0.6) &&
          op.classificacao_risco === "baixo"
      )
      .sort((a, b) => b.score_eficiencia - a.score_eficiencia)
      .slice(0, 5);

    const consultasAltoVolume = [...indicadores.operadores]
      .filter((op) => op.quantidade_cupons >= media.cupons_por_hora * 10)
      .sort((a, b) => b.taxa_consultas - a.taxa_consultas)
      .slice(0, 3);

    const nomesReferencias = referenciasEficientes.map((op) => op.nome_operador);
    const nomesConsultasAltoVolume = consultasAltoVolume.map((op) => op.nome_operador);

    const riscoSecundario = operadoresPrioritarios.find(
      (op) => op.nome_operador !== maiorImpacto?.nome_operador
    );

    const textoRisco = [
      maiorImpacto
        ? `${maiorImpacto.nome_operador} concentra o maior impacto financeiro de cancelamentos (${maiorImpacto.impacto_valor_cancelado.toFixed(
          2
        )}%) e taxa de vendas canceladas de ${maiorImpacto.taxa_vendas_canceladas.toFixed(2)}%, acima da média da loja de ${media.taxa_vendas_canceladas.toFixed(
          2
        )}% para vendas canceladas e ${media.impacto_valor_cancelado.toFixed(2)}% de impacto.`
        : null,
      riscoSecundario
        ? `${riscoSecundario.nome_operador} também aparece como ponto relevante de atenção por combinar score de risco ${riscoSecundario.score_risco.toFixed(
          4
        )} com desvios operacionais acima da média.`
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    const textoEficiencia =
      referenciasEficientes.length > 0
        ? `${maisRapido.nome_operador} lidera em velocidade com ${maisRapido.cupons_por_hora.toFixed(
          2
        )} cupons/h. Entre os operadores com melhor equilíbrio entre produtividade e controle, ${nomesReferencias.join(
          ", "
        )} aparecem como principais referências da operação, todos com risco baixo e eficiência superior ao restante da base.`
        : `${maisRapido.nome_operador} lidera em velocidade com ${maisRapido.cupons_por_hora.toFixed(
          2
        )} cupons/h, mas o conjunto analisado não apresentou um grupo amplo de referências positivas com risco baixo e eficiência alta simultaneamente.`;

    const textoConsultas =
      consultasAltoVolume.length > 0
        ? `${maiorConsulta.nome_operador} apresenta a maior taxa de consultas (${maiorConsulta.taxa_consultas.toFixed(
          2
        )}%). ${maiorConsulta.quantidade_cupons < 100
          ? `Como o volume observado é de apenas ${maiorConsulta.quantidade_cupons} cupons, a leitura exige cautela.`
          : `Como o volume é relevante, o indicador merece acompanhamento mais próximo.`
        } Entre os operadores de maior volume, ${nomesConsultasAltoVolume.join(
          ", "
        )} também se destacam e merecem validação de processo e apoio operacional.`
        : `${maiorConsulta.nome_operador} apresenta a maior taxa de consultas (${maiorConsulta.taxa_consultas.toFixed(
          2
        )}%), mas sem concentração relevante adicional entre operadores de maior volume.`;

    return [
      {
        titulo: "Visão geral da operação",
        icon: Users,
        texto: `A loja ${indicadores.resumo.loja} concentrou ${indicadores.resumo.operadores_analisados} operadores, ${indicadores.resumo.quantidade_cupons} cupons e ${fmtMoney(
          indicadores.resumo.valor_total_venda
        )} em vendas. A média da operação ficou em ${media.cupons_por_hora.toFixed(
          2
        )} cupons/h, ticket médio de ${fmtMoney(
          media.ticket_medio
        )} e ${media.tempo_medio_por_cupom_seg.toFixed(2)} segundos por cupom.`,
      },
      {
        titulo: "Leitura de risco e prevenção de perdas",
        icon: ShieldAlert,
        texto: textoRisco,
      },
      {
        titulo: "Leitura de eficiência operacional",
        icon: TrendingUp,
        texto: textoEficiencia,
      },
      {
        titulo: "Ponto de atenção em consultas",
        icon: Eye,
        texto: textoConsultas,
      },
    ];
  }, [indicadores, operadoresPrioritarios]);

  return (
    <div className="space-y-6">
      <HeaderResumo data={data} />

      <Tabs defaultValue="riscos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 xl:w-fit">
          <TabsTrigger value="riscos">Riscos</TabsTrigger>
          <TabsTrigger value="eficiencia">Eficiência</TabsTrigger>
          <TabsTrigger value="leituras">Leituras</TabsTrigger>
          <TabsTrigger value="analitico">Texto analítico</TabsTrigger>
          <TabsTrigger value="base">Base detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="riscos" className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Operadores prioritários para auditoria</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {operadoresPrioritarios.map((operador) => (
              <OperadorAlertCard
                key={operador.nome_operador}
                operador={operador}
              />
            ))}
          </div>


        </TabsContent>

        <TabsContent value="eficiencia" className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Referências positivas da operação</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {referenciasPositivas.map((operador) => (
              <OperadorDestaqueCard
                key={operador.nome_operador}
                operador={operador}
              />
            ))}
          </div>

          <Card className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BadgeCheck className="h-4 w-4" />
                Leitura executiva de eficiência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Os melhores sinais de eficiência estão em <strong>LUCAS</strong>,
                <strong> ANDRE</strong>, <strong>MATEUS</strong>, <strong>MARINA</strong> e
                <strong> JOSEFA</strong>, todos com risco baixo e desempenho operacional
                superior ao restante da base observada.
              </p>
              <p>
                Esses operadores podem servir como referência para padronização de boas
                práticas, especialmente em ritmo de atendimento, tempo por cupom e equilíbrio
                entre produtividade e controle.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leituras" className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Leituras gerenciais e executivas</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {leiturasOperacionais.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.titulo}
                  className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="h-4 w-4" />
                      {item.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.texto}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="base" className="space-y-4">
          <TabelaOperadores operadores={indicadores.operadores} />
        </TabsContent>

        <TabsContent value="analitico" className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <h2 className="text-lg font-semibold">Texto analítico da IA</h2>
          </div>

          <Card className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-4 w-4" />
               Análise textual do período
              </CardTitle>
            </CardHeader>

 <CardContent>
      <div className="space-y-4 text-sm leading-7 text-muted-foreground">
        {data.texto_analitico
          ?.split(/\n+/)
          .filter((trecho) => trecho.trim())
          .map((trecho, index) => {
            const texto = trecho.trim();
            const isSecao = /^\d+\./.test(texto);
            const isIntroducao = index === 0;
            const isConclusao = /^concluindo/i.test(texto);

            if (isIntroducao) {
              return (
                <div
                  key={`texto-analitico-${index}`}
                  className="rounded-xl border border-border/50 bg-muted/30 px-4 py-4"
                >
                  <p className="font-medium text-foreground">{texto}</p>
                </div>
              );
            }

            if (isSecao) {
              const partes = texto.split(":");
              const titulo = partes[0] ?? texto;
              const conteudo = partes.slice(1).join(":").trim();

              return (
                <div
                  key={`texto-analitico-${index}`}
                  className="rounded-xl border border-border/50 px-4 py-4"
                >
                  <h3 className="text-sm font-semibold text-foreground">{titulo}</h3>
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
                  key={`texto-analitico-${index}`}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-900 dark:bg-blue-950/20"
                >
                  <h3 className="text-sm font-semibold text-foreground">Conclusão</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {texto}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={`texto-analitico-${index}`}
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
      </Tabs>
    </div>
  );
}