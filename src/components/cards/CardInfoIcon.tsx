import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "react-i18next";

interface InfoCardProps {
  cor: "green" | "red" | "blue" | "yellow" | "orange";
  icon: React.ElementType;
  titulo: string;
  valor: string | number;
  carregando?: boolean;
  erro?: boolean;
}

const CardInfoIcon: React.FC<InfoCardProps> = ({ cor, icon: Icon, titulo, valor, carregando, erro }) => {
  const { t } = useTranslation();
  const colorMap: Record<string, { border: string; text: string }> = {
    green: { border: "border-green-500", text: "text-green-500 dark:text-green-400" },
    red: { border: "border-red-500", text: "text-red-500 dark:text-red-400" },
    blue: { border: "border-blue-500", text: "text-blue-500 dark:text-blue-400" },
    yellow: { border: "border-yellow-500", text: "text-yellow-500 dark:text-yellow-400" },
    orange: { border: "border-orange-500", text: "text-orange-500 dark:text-orange-600" },
  };

  const classes = colorMap[cor] || colorMap.green;

   if (carregando) {
    return (
      <Card className="mt-2 w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border shadow-md">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4" />
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="mt-2 w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700"
      >
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
        <div className="flex flex-col">
          <AlertTitle className="font-bold">{t("comun.errocarregardados")}</AlertTitle>
          <AlertDescription>
            {t("comun.naofoipossivelcarregarinformacoes")}
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <div className="col-span-1">
      <Card className={`border-4 ${classes.border} ${classes.text} p-1 rounded-lg flex items-center`}>
        <div className="mr-4 mt-1">
          <Icon size={32} className={classes.text} />
        </div>
        <div>
          <Label className="mt-1 text-xl font-medium">{titulo}</Label>
          <h2 className="mt-1 text-xl font-bold">{valor}</h2>
        </div>
      </Card>
    </div>
  );
};

export default CardInfoIcon;
