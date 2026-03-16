import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, BarChart3, TrendingUp, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LoadingCardProps {
  isDark?: boolean;
  type?: 'chart' | 'table' | 'stats' | 'list' | 'default';
  compact?: boolean; // Nova prop para modo compacto
}

export function LoadingCard({ 
  isDark = false, 
  type = 'default',
  compact = false 
}: LoadingCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'chart': return <BarChart3 className="h-5 w-5" />;
      case 'stats': return <TrendingUp className="h-5 w-5" />;
      case 'table': return <Activity className="h-5 w-5" />;
      default: return <Loader2 className="h-5 w-5" />;
    }
  };
  const { t } = useTranslation();
  const getTitle = () => {
    switch (type) {
      case 'chart': return (t("comum.carregandografico"));
      case 'stats': return (t("comum.carregandoestatisticas"));
      case 'table': return (t("comum.carregandotabela"));
      default: return (t("comum.carregando"))
    }
  };


  if (compact) {
    return (
      <Card className={cn(
        "p-3 border rounded-b rounded-t min-h-[80px]",
        isDark 
          ? "bg-gray-900/50 border-gray-800" 
          : "bg-white border-gray-200"
      )}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              {getTitle()}
            </h4>
            
          </div>
          <div className={cn(
            "p-1.5 rounded-b rounded-t",
            isDark ? "bg-gray-800" : "bg-gray-100"
          )}>
            <div className="animate-spin text-blue-500">
              {getIcon()}
            </div>
          </div>
        </div>
        
        {/* Indicador de progresso minimalista */}
        <div className="mt-3">
          <div className="relative h-1 overflow-hidden rounded-b rounded-t">
            <div className={cn(
              "absolute h-full w-1/3 rounded-b rounded-t animate-[shimmer_2s_infinite]",
              isDark ? "bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900" 
                     : "bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"
            )} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-3 border rounded-b rounded-t min-h-[80px]",
        isDark 
          ? "bg-gray-900/50 border-gray-800" 
          : "bg-white border-gray-200")}>

      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">      
            <h4 className={cn(
              "text-sm font-medium",
              isDark ? "text-gray-300" : "text-gray-700"
            )}>
              {getTitle()}
            </h4>
        </div>
        <div className={cn(
          "p-2 rounded-b rounded-t",
          isDark ? "bg-gray-800" : "bg-gray-100"
        )}>
          <div className="animate-spin text-blue-500">
            {getIcon()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1 overflow-hidden rounded-b rounded-t">
          <div className={cn(
            "absolute h-full w-1/3 rounded-b rounded-t animate-[shimmer_2s_infinite]",
            isDark ? "bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900" 
                   : "bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"
          )} />
        </div>

        {type === 'chart' && (
          <div className="space-y-3">
            <div className={cn(
              "h-48 rounded-b rounded-t",
              isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse"
            )} />

            
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={cn(
                    "h-3 rounded-b rounded-t",
                    isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse",
                    i === 3 ? "w-16" : "w-8"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {type === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={cn(
                "h-24 rounded-b rounded-t p-4",
                isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse"
              )}>
                <div className={cn(
                  "h-4 rounded-b rounded-t mb-3",
                  isDark ? "bg-gray-700" : "bg-gray-300"
                )} />
                <div className={cn(
                  "h-8 rounded-b rounded-t",
                  isDark ? "bg-gray-700" : "bg-gray-300"
                )} />
              </div>
            ))}
          </div>
        )}

        {type === 'table' && (
          <div className="space-y-2">
            <div className={cn(
              "h-10 rounded-b rounded-t",
              isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse"
            )} />
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn(
                "h-12 rounded-b rounded-t",
                isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse"
              )} />
            ))}
          </div>
        )}

        {type === 'default' && (
          <div className={cn(
            "h-64 rounded-b rounded-t",
            isDark ? "bg-gray-800 animate-pulse" : "bg-gray-200 animate-pulse"
          )} />
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "h-2 w-2 rounded-b rounded-t",
              isDark ? "bg-blue-500 animate-pulse" : "bg-blue-400 animate-pulse"
            )} />
            <span className={cn(
              "text-sm",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              Processando dados...
            </span>
          </div>
          <div className={cn(
            "h-3 rounded-b rounded-t w-24",
            isDark ? "bg-gray-800" : "bg-gray-200"
          )}>
            <div className={cn(
              "h-full rounded-b rounded-t w-1/4 animate-[shimmer_1.5s_infinite]",
              isDark ? "bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900" 
                     : "bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"
            )} />
          </div>
        </div>
      </div>
    </Card>
  );
}