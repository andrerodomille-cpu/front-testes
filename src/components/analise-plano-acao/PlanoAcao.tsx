import React from 'react';
import { Calendar, Target, Users, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanoAcao as PlanoAcaoType } from './types';

interface PlanoAcaoProps {
  plano: PlanoAcaoType[];
}

const PlanoAcao: React.FC<PlanoAcaoProps> = ({ plano }) => {
  const getPrioridadeColor = (prioridade: number) => {
    switch (prioridade) {
      case 1:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 2:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 3:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const getBorderColor = (prioridade: number) => {
    switch (prioridade) {
      case 1:
        return 'border-red-500 dark:border-red-400';
      case 2:
        return 'border-orange-500 dark:border-orange-400';
      case 3:
        return 'border-yellow-500 dark:border-yellow-400';
      default:
        return 'border-blue-500 dark:border-blue-400';
    }
  };

  const getPrioridadeLabel = (prioridade: number) => {
    switch (prioridade) {
      case 1:
        return 'Crítica';
      case 2:
        return 'Alta';
      case 3:
        return 'Média';
      default:
        return 'Baixa';
    }
  };

  const sortedPlano = [...plano].sort((a, b) => a.prioridade - b.prioridade);

  if (!plano || plano.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Plano de Ação Sugerido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Nenhum plano de ação disponível no momento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          Plano de Ação Sugerido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedPlano.map((item, index) => (
            <div
              key={index}
              className={`border-l-4 ${getBorderColor(item.prioridade)} bg-gray-50 dark:bg-gray-800/50 p-4 rounded-r-lg hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getPrioridadeColor(item.prioridade)}>
                    Prioridade {item.prioridade} - {getPrioridadeLabel(item.prioridade)}
                  </Badge>
                </div>
                
                {item.foco && item.foco.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Target className="h-3 w-3" />
                      <span>Foco:</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {item.foco.map((f, i) => (
                        <Badge 
                          key={i} 
                          variant="outline" 
                          className="text-xs bg-white dark:bg-gray-900"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                {item.acao}
              </h4>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.descricao}
              </p>

              {/* Indicador visual de progresso (opcional) */}
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      item.prioridade === 1 ? 'bg-red-500' :
                      item.prioridade === 2 ? 'bg-orange-500' :
                      item.prioridade === 3 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${100 - (item.prioridade - 1) * 25}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.prioridade === 1 ? 'Iniciar imediatamente' :
                   item.prioridade === 2 ? 'Iniciar em breve' :
                   item.prioridade === 3 ? 'Planejar' : 'Monitorar'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanoAcao;