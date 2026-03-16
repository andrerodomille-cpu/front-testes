import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BarChart3,
  ClipboardList,
  FileText,
  ShieldAlert,
  TrendingUp,
  Users,
  Store,
  DollarSign,
  Clock,
  ChevronRight,
  Download,
  RefreshCw,
  Bell,
  Shield,
  Sparkles,
  Activity,
  Target,
  Eye,
  ListChecks,
  MessageSquare
} from "lucide-react";
import { analiseRiscoOperacionalMock } from "./mock";
import { fmtInt, fmtMoney } from "./utils";
import { IndicadoresTab } from "./IndicadoresTab";
import { RankingTab } from "./RankingTab";
import { OperadoresTab } from "./OperadoresTab";
import { TextoAnaliticoTab } from "./TextoAnaliticoTab";
import { motion, AnimatePresence } from "framer-motion";

export default function AnaliseAlertas() {
  const [data] = useState(analiseRiscoOperacionalMock);
  const [activeTab, setActiveTab] = useState("resumo");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const statsCards = [
    {
      title: "Loja",
      value: data.resumo_executivo.loja,
      icon: Store,
      color: "cyan",
      trend: null
    },
    {
      title: "Maior risco",
      value: data.resumo_executivo.operador_maior_risco?.nome_operador ?? "Sem dado",
      icon: ShieldAlert,
      color: "rose",
      trend: "up"
    },
    {
      title: "Alertas automáticos",
      value: fmtInt(data.alertas_automaticos.length),
      icon: Bell,
      color: "amber",
      trend: data.alertas_automaticos.length > 5 ? "up" : "down"
    },
    {
      title: "Auditoria prioritária",
      value: fmtInt(data.operadores_prioritarios.length),
      icon: ClipboardList,
      color: "emerald",
      trend: data.operadores_prioritarios.length > 3 ? "up" : "neutral"
    }
  ];

  const tabConfig = [
    { id: "resumo", label: "Resumo", icon: BarChart3 },
    { id: "alertas", label: "Alertas", icon: Bell },
    { id: "prioridades", label: "Prioridades", icon: Target },
    { id: "indicadores", label: "Indicadores", icon: Activity },
    { id: "rankings", label: "Rankings", icon: TrendingUp },
    { id: "operadores", label: "Operadores", icon: Users },
    { id: "analitico", label: "Leitura analítica", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900">
      {/* Header com efeito de vidro */}
      <div className="sticky top-0 z-10 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-3 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-300">
                  <Sparkles className="h-3 w-3" />
                  Monitoramento de risco operacional
                </div>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Atualizado agora
                </Badge>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                Painel de Alertas, Auditoria e Eficiência
              </h1>

              <p className="max-w-4xl text-sm text-gray-600 dark:text-gray-400">
                Este painel consolida {fmtInt(data.resumo_executivo.operadores_analisados)} operadores,
                {` ${fmtInt(data.resumo_executivo.quantidade_cupons)} cupons e `}
                {fmtMoney(data.resumo_executivo.valor_total_venda)} em vendas, destacando
                alertas automáticos e indicadores operacionais.
              </p>
            </div>


          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        {/* Cards de estatísticas com animação */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const colors = {
              cyan: "from-cyan-500 to-blue-500",
              rose: "from-rose-500 to-pink-500",
              amber: "from-amber-500 to-orange-500",
              emerald: "from-emerald-500 to-teal-500"
            };

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/80">
                  {/* Gradiente decorativo */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} opacity-0 transition-opacity group-hover:opacity-5`} />
                  
                  <CardContent className="relative p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {stat.title}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`rounded-xl bg-${stat.color}-100 p-2.5 dark:bg-${stat.color}-900/30`}>
                        <Icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-300`} />
                      </div>
                    </div>
                    
                  
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs modernizadas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-20 z-10 -mx-4 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent px-4 pb-4 dark:from-gray-950 dark:via-gray-950">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`relative px-4 py-2 text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-white text-gray-900 shadow-lg dark:bg-gray-800 dark:text-gray-100' 
                        : 'bg-transparent text-gray-600 hover:bg-gray-100/50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-md bg-white dark:bg-gray-800"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="resumo" className="mt-0 space-y-6">
                <Card className="overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                  <CardContent className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                    {data.pontos_criticos.map((item, index) => (
                      <motion.div
                        key={`${item.titulo}-${index}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-5 transition-all hover:shadow-lg dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50"
                      >
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-20%] opacity-10">
                          <AlertTriangle className="h-full w-full text-amber-500" />
                        </div>
                        
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {item.titulo}
                          </h3>
                          <Badge variant="outline" className="bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
                            {item.operador}
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {item.descricao}
                        </p>
                        
                        
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alertas" className="mt-0">
                <Card className="border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                  <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                    {data.alertas_automaticos.map((alerta, index) => (
                      <motion.div
                        key={`${alerta.operador}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white p-5 transition-all hover:shadow-lg dark:border-amber-800 dark:from-amber-950/30 dark:to-gray-900"
                      >
                       
                        
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-amber-100 p-1.5 dark:bg-amber-900/40">
                              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {alerta.operador}
                            </span>
                          </div>
                          <Badge variant="destructive" className="capitalize">
                            {alerta.severidade}
                          </Badge>
                        </div>
                        
                        <p className="pl-9 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {alerta.mensagem}
                        </p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prioridades" className="mt-0">
                <div className="grid gap-6 xl:grid-cols-2">
                  <Card className="overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
                        <div className="rounded-lg bg-rose-100 p-2 dark:bg-rose-900/40">
                          <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-300" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Operadores prioritários
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {data.operadores_prioritarios.length} operadores necessitam atenção
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {data.operadores_prioritarios.map((item, index) => (
                          <motion.div
                            key={item.nome_operador}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50/30 to-white p-4 transition-all hover:border-rose-300 hover:shadow-md dark:border-rose-800 dark:from-rose-950/20 dark:to-gray-900"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {item.nome_operador}
                                </p>
                                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                  {item.motivo_principal}
                                </p>
                              </div>
                              <Badge variant="destructive" className="ml-2">Alto risco</Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
                        <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Referências positivas
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Operadores com destaque positivo
                          </p>
                        </div>
                      </div>

                      {data.referencias_positivas.length > 0 ? (
                        <div className="space-y-3">
                          {data.referencias_positivas.map((item, index) => (
                            <motion.div
                              key={item.nome_operador}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-emerald-800 dark:from-emerald-950/20 dark:to-gray-900"
                            >
                              <div className="flex items-start justify-between">
                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                  {item.nome_operador}
                                </p>
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">Destaque</Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
                          <Users className="mb-2 h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Nenhuma referência positiva no momento
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="indicadores" className="mt-0">
                <IndicadoresTab data={data} />
              </TabsContent>

              <TabsContent value="rankings" className="mt-0">
                <RankingTab data={data} />
              </TabsContent>

              <TabsContent value="operadores" className="mt-0">
                <OperadoresTab data={data} />
              </TabsContent>

              <TabsContent value="analitico" className="mt-0">
                <TextoAnaliticoTab texto={data.texto_analitico} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}