import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';

interface CriticidadeBadgeProps {
  nivel: 'baixo' | 'medio' | 'alto';
  score: number;
  justificativa?: string;
}

const CriticidadeBadge: React.FC<CriticidadeBadgeProps> = ({ nivel, score, justificativa }) => {
  const config = {
    baixo: {
      icon: CheckCircle,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      label: 'Baixo Risco'
    },
    medio: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      label: 'Médio Risco'
    },
    alto: {
      icon: AlertCircle,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      label: 'Alto Risco'
    }
  };

  const { icon: Icon, bgColor, textColor, borderColor, label } = config[nivel];

  return (
    <div className={`rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${bgColor}`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${textColor}`}>
              {label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Score: {score}
            </span>
          </div>
          {justificativa && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {justificativa}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriticidadeBadge;