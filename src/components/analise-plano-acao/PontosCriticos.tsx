import React from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  ShoppingCart, 
  FileSearch, 
  TrendingUp,
  User 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PontoCritico } from './types';

interface PontosCriticosProps {
  pontos: PontoCritico[];
}

const PontosCriticos: React.FC<PontosCriticosProps> = ({ pontos }) => {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'risco_operacional':
        return <AlertTriangle className="h-4 w-4" />;
      case 'cancelamentos':
        return <XCircle className="h-4 w-4" />;
      case 'vendas_canceladas':
        return <ShoppingCart className="h-4 w-4" />;
      case 'consultas':
        return <FileSearch className="h-4 w-4" />;
      case 'eficiencia':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'risco_operacional':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'cancelamentos':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'vendas_canceladas':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'consultas':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'eficiencia':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Pontos Críticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pontos.map((ponto, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className={`mt-0.5 ${getBadgeColor(ponto.tipo)} p-1.5 rounded-full`}>
                {getIcon(ponto.tipo)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {ponto.titulo}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    {ponto.operador}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {ponto.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PontosCriticos;