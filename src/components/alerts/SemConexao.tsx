import React from "react";
import { useTranslation } from "react-i18next";
import { Filter, SlidersHorizontal, ChevronRight, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AguardandoFiltroProps {
  onShowFilters?: () => void;
  compact?: boolean;
}

export default function SemConexao({ 
  onShowFilters, 
  compact = false 
}: AguardandoFiltroProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <Card className="border border-dashed border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/30">
                <WifiOff className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {t("Impossível estabelecer conexão")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Aplique filtros para visualizar os dados
                </p>
              </div>
            </div>
            {onShowFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onShowFilters}
                className="border-gray-300 dark:border-gray-700"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-b rounded-t border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
      <CardContent className="p-8 md:p-10">
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          {/* Ícone */}
          <div className="mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30">
              <WifiOff className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
          </div>

          {/* Texto */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {t("Impossível estabelecer conexão")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("No momento os dados não estão disponíveis.")}  
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
