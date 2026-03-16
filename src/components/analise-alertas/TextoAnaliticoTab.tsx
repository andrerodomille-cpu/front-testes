import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TextoAnaliticoTabProps {
  texto: string;
}

export function TextoAnaliticoTab({ texto }: TextoAnaliticoTabProps) {
  return (
    <Card className="border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Texto analítico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-7 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 whitespace-pre-line">
          {texto}
        </div>
      </CardContent>
    </Card>
  );
}