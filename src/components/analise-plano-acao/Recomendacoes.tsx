import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecomendacoesProps {
  recomendacoes: string[];
}

const Recomendacoes: React.FC<RecomendacoesProps> = ({ recomendacoes }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Recomendações Objetivas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recomendacoes.map((recomendacao, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {recomendacao}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Recomendacoes;