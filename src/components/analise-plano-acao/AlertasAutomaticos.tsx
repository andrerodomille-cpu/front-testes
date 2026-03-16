import React from 'react';
import { AlertCircle, AlertTriangle, Info, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertaAutomatico } from './types';

interface AlertasAutomaticosProps {
  alertas: AlertaAutomatico[];
}

const AlertasAutomaticos: React.FC<AlertasAutomaticosProps> = ({ alertas }) => {
  const getSeveridadeConfig = (severidade: string) => {
    switch (severidade) {
      case 'alta':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-100 dark:bg-red-900/30',
          textColor: 'text-red-700 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Alta Prioridade'
        };
      case 'media':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          label: 'Média Prioridade'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-100 dark:bg-blue-900/30',
          textColor: 'text-blue-700 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: 'Baixa Prioridade'
        };
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Alertas Automáticos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertas.map((alerta, index) => {
            const config = getSeveridadeConfig(alerta.severidade);
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={`rounded-lg border ${config.borderColor} ${config.bgColor} p-3`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.textColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="outline" className="bg-white dark:bg-gray-800">
                        <User className="h-3 w-3 mr-1" />
                        {alerta.operador}
                      </Badge>
                      <span className={`text-xs font-medium ${config.textColor}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {alerta.mensagem}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertasAutomaticos;