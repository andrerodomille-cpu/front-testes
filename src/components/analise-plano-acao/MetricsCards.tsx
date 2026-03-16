import React from 'react';
import { 
  Users, 
  DollarSign, 
  Receipt, 
  AlertTriangle,
  TrendingDown,
  ShoppingCart,
  FileSearch,
  Percent
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricsCardsProps {
  totalOperadores: number;
  valorTotalVenda: number;
  totalCupons: number;
  taxaMediaCancelamento: number;
  operadoresRisco: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({
  totalOperadores,
  valorTotalVenda,
  totalCupons,
  taxaMediaCancelamento,
  operadoresRisco
}) => {
  const metrics = [
    {
      title: "Operadores Analisados",
      value: totalOperadores,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Volume Total",
      value: `R$ ${valorTotalVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Total de Cupons",
      value: totalCupons.toLocaleString('pt-BR'),
      icon: Receipt,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Taxa Média Cancelamento",
      value: `${taxaMediaCancelamento.toFixed(2)}%`,
      icon: Percent,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      title: "Operadores em Risco",
      value: operadoresRisco,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {metric.value}
                  </p>
                </div>
                <div className={`rounded-lg ${metric.bgColor} p-3`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;