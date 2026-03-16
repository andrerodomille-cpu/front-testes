import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnaliseIARiscoOperacionalComAlertas } from "./types";
import { OperadoresTable } from "./OperadoresTable";

interface OperadoresTabProps {
  data: AnaliseIARiscoOperacionalComAlertas;
}

export function OperadoresTab({ data }: OperadoresTabProps) {
  return (
    <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Todos os operadores analisados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OperadoresTable data={data.indicadores.operadores} />
      </CardContent>
    </Card>
  );
}