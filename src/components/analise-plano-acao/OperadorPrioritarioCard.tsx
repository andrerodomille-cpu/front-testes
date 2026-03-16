import React from 'react';
import { 
  User, 
  AlertTriangle, 
  DollarSign, 
  ShoppingCart, 
  FileSearch, 
  Percent,
  TrendingDown 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Operador } from './types';

interface OperadorPrioritarioCardProps {
  operador: Operador;
}

const OperadorPrioritarioCard: React.FC<OperadorPrioritarioCardProps> = ({ operador }) => {
  const metrics = [
    {
      label: 'Total Vendas',
      value: `R$ ${operador.valor_total_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Cupons',
      value: operador.quantidade_cupons?.toLocaleString('pt-BR'),
      icon: ShoppingCart,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Taxa Cancelamento',
      value: `${operador.taxa_vendas_canceladas}%`,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Consultas',
      value: `${(operador.taxa_consultas! * 100).toFixed(2)}%`,
      icon: FileSearch,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Descontos',
      value: `${(operador.taxa_descontos! * 100).toFixed(2)}%`,
      icon: Percent,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Impacto Cancelado',
      value: `R$ ${operador.impacto_valor_cancelado?.toFixed(2)}`,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-2">
              <User className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {operador.nome_operador}
              </CardTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {operador.loja}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Risco: {operador.classificacao_risco}
            </Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
              Eficiência: {operador.classificacao_eficiencia}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-1">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {metric.label}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Motivo principal: </span>
            {operador.motivo_principal}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperadorPrioritarioCard;