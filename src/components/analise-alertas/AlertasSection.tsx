import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, Siren, Bell } from "lucide-react";
import { AlertaAutomatico } from "./types";
import { alertaTone } from "./utils";
import { motion, AnimatePresence } from "framer-motion";

interface AlertasSectionProps {
  alertas: AlertaAutomatico[];
}

// Configuração de ícones por severidade
const severityIcons = {
  alta: ShieldAlert,
  media: AlertTriangle,
  baixa: AlertTriangle,
};

// Mapeamento de variantes do Badge baseado na severidade
const badgeVariant = (severidade: string) => {
  switch (severidade) {
    case "alta":
      return "destructive";
    case "media":
      return "default";
    case "baixa":
      return "secondary";
    default:
      return "outline";
  }
};

export function AlertasSection({ alertas }: AlertasSectionProps) {
  return (
    <Card className="relative overflow-hidden border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      {/* Efeito de gradiente sutil no fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-transparent dark:from-cyan-950/20" />
      
      <CardHeader className="relative pb-4">
        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <div className="rounded-xl bg-cyan-100 p-2 dark:bg-cyan-900/40">
            <Siren className="h-5 w-5 text-cyan-700 dark:text-cyan-300" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Alertas automáticos</span>
            {alertas.length > 0 && (
              <Badge variant="secondary" className="rounded-full px-2">
                {alertas.length}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {alertas.map((alerta, index) => {
            const Icon = severityIcons[alerta.severidade as keyof typeof severityIcons] || AlertTriangle;
            const toneStyles = alertaTone(alerta.severidade);

            return (
              <motion.div
                key={`${alerta.operador}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md ${toneStyles.card}`}
              >
                {/* Barra de destaque superior */}
                <div className="absolute left-0 top-0 h-1 w-full bg-current opacity-20" />

                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-black/5 p-2 dark:bg-white/10">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {alerta.operador}
                      </span>
                    </div>
                  </div>

                  <Badge 
                    variant={badgeVariant(alerta.severidade)}
                    className={`capitalize shadow-sm ${toneStyles.badge}`}
                  >
                    {alerta.severidade}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {alerta.tipo.replace(/_/g, " ")}
                  </p>
                  
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {alerta.mensagem}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alertas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50"
          >
            <Bell className="mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum alerta automático no momento
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Os alertas aparecerão aqui quando detectados
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}