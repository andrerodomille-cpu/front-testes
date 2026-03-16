import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TextoAnaliticoProps {
  texto: string;
}

const TextoAnalitico: React.FC<TextoAnaliticoProps> = ({ texto }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const lines = texto.split('\n');
  const previewLines = lines.slice(0, 5);
  const hasMore = lines.length > 5;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          Análise Detalhada
        </CardTitle>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 dark:text-gray-400"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Ver mais <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {(isExpanded ? lines : previewLines).map((line, index) => {
            if (line.trim().startsWith('-')) {
              return (
                <div key={index} className="ml-4 flex items-start gap-2">
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span>{line.substring(1).trim()}</span>
                </div>
              );
            }
            if (line.trim().match(/^\d+\./)) {
              return (
                <div key={index} className="font-medium text-gray-900 dark:text-gray-100 mt-2 first:mt-0">
                  {line}
                </div>
              );
            }
            return (
              <p key={index} className={index === 0 ? 'font-medium' : ''}>
                {line}
              </p>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextoAnalitico;