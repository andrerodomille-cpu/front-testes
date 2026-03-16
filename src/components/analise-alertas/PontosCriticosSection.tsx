import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  SearchCheck,
  ShieldAlert,
  TrendingDown,
  Zap,
} from "lucide-react";
import { PontoCritico } from "./types";

interface PontosCriticosSectionProps {
  pontos: PontoCritico[];
}

function getIcon(tipo: string) {
  switch (tipo) {
    case "risco_operacional":
      return ShieldAlert;
    case "cancelamentos":
      return TrendingDown;
    case "consultas":
      return SearchCheck;
    case "eficiencia":
      return Zap;
    default:
      return Activity;
  }
}

export function PontosCriticosSection({ pontos }: PontosCriticosSectionProps) {
  return (
    <Card className="border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Pontos críticos da gestão
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {pontos.map((ponto, index) => {
          const Icon = getIcon(ponto.tipo);

          return (
            <div
              key={`${ponto.titulo}-${index}`}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2">
                    <Icon className="h-4 w-4 text-cyan-700 dark:text-cyan-200" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {ponto.titulo}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {ponto.operador}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className="capitalize">
                  {ponto.tipo.replace(/_/g, " ")}
                </Badge>
              </div>

              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {ponto.descricao}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}