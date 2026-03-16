import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Award,
  Crown,
  Medal
} from "lucide-react";
import { motion } from "framer-motion";

interface TopListCardProps {
  title: React.ReactNode;
  data: Array<Record<string, any>>;
  metricLabel: string;
  metricKey: string;
  badge?: React.ReactNode;
}

// Função para formatar valores baseado no tipo de métrica
const formatValue = (value: any, metricKey: string): string => {
  if (typeof value === 'number') {
    if (metricKey.includes('valor') || metricKey.includes('venda')) {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    }
    if (metricKey.includes('taxa') || metricKey.includes('score')) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(2);
  }
  return String(value);
};

// Ícones de posição
const positionIcons = [
  <Crown key="1" className="h-4 w-4 text-yellow-500" />,
  <Medal key="2" className="h-4 w-4 text-gray-400" />,
  <Award key="3" className="h-4 w-4 text-amber-600" />
];

// Cores de fundo para posições
const positionColors = [
  'from-yellow-50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20',
  'from-gray-50 to-slate-50/50 dark:from-gray-800/50 dark:to-slate-800/50',
  'from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20'
];

export function TopListCard({ 
  title, 
  data, 
  metricLabel, 
  metricKey,
  badge
}: TopListCardProps) {
  
  return (
    <Card className="overflow-hidden border-gray-200 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/80">
      <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-transparent pb-3 dark:border-gray-800 dark:from-gray-800/30">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-gray-100">
            {title}
            {badge}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            Operador
          </span>
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {metricLabel}
          </span>
        </div>

        <div className="space-y-2">
          {data.map((item, index) => {
            const value = item[metricKey];
            const formattedValue = formatValue(value, metricKey);
            const initials = item.nome_operador
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'OP';

            return (
              <motion.div
                key={`${item.nome_operador}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-xl p-3 transition-all ${
                  index < 3 
                    ? `bg-gradient-to-r ${positionColors[index]} border border-${index === 0 ? 'yellow' : index === 1 ? 'gray' : 'amber'}-200 dark:border-${index === 0 ? 'yellow' : index === 1 ? 'gray' : 'amber'}-800` 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex w-6 items-center justify-center">
                      {index < 3 ? (
                        positionIcons[index]
                      ) : (
                        <span className="text-xs font-medium text-gray-400">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm dark:border-gray-700">
                      <AvatarFallback className={`text-xs ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.nome_operador}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      index === 0 ? 'text-yellow-600 dark:text-yellow-400' :
                      index === 1 ? 'text-gray-600 dark:text-gray-400' :
                      index === 2 ? 'text-amber-600 dark:text-amber-400' :
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      {formattedValue}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <TrendingUp className="mb-2 h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum dado disponível
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}