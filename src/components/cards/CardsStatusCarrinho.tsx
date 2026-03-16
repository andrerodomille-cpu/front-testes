import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Power,
  Scale,
  Cable,
  Battery,
  Calendar,
  Clock,
  ShoppingCart,
  RefreshCw,
  Zap
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LoadingCard } from "./LoadingCard";
import { ErrorCard } from "./ErrorCard";
import { useTheme } from "@/components/theme/ThemeProvider";
import { LabelCardTitulo } from "../labels/labelCardTitulo";

interface CardsInformationProps {
  idCaixa: string;
  bateriaCarga: number;
  datahoraAtualizacao: string;
  statusCarrinho: string;
  idStatus: string;
  dataUltimoCupom: string;
  statusBalanca: string;
  statusBateria: string;
  ligado: string;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
}

const CardsStatusCarrinho: React.FC<CardsInformationProps> = ({
  idCaixa,
  bateriaCarga,
  datahoraAtualizacao,
  statusCarrinho,
  idStatus,
  dataUltimoCupom,
  statusBalanca,
  statusBateria,
  ligado,
  carregando,
  erro,
  apresentacao = false
}) => {

  const formatDate = (isoString: string | null): string => {
    if (!isoString) return "Sem informação";
    const date = new Date(isoString);
    const pad = (num: number) => num.toString().padStart(2, "0");
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getBatteryTextColor = (level: number) => {
    if (level >= 80) return "text-green-600";
    if (level >= 60) return "text-green-500";
    if (level >= 40) return "text-yellow-600";
    if (level >= 20) return "text-orange-600";
    return "text-red-600";
  };

  const getBatteryBgColor = (level: number) => {
    if (level >= 80) return "bg-green-500/10";
    if (level >= 60) return "bg-green-400/10";
    if (level >= 40) return "bg-yellow-500/10";
    if (level >= 20) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  const getProgressColorClass = (level: number) => {
    if (level >= 80) return "bg-green-500";
    if (level >= 60) return "bg-green-400";
    if (level >= 40) return "bg-yellow-500";
    if (level >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  const isScaleConnected = ligado === "Carrinho ligado" && statusBalanca === "Está recebendo dados da balança";
  const isBatteryConnected = ligado === "Carrinho ligado" && statusBateria === "Está recebendo dados da bateria";
  const isPoweredOn = ligado === "Carrinho ligado";
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (carregando) {
    return (
      <LoadingCard
        isDark={isDark}
        compact
        type="stats"
      />
    );
  }

  if (erro) {
    return (
      <ErrorCard
        error={""}
        type={"server"}
        showDetails={process.env.NODE_ENV === "development"}
      />
    );
  }

  return (
    <Card className="rounded-b rounded-t bg-gray-50 dark:bg-gray-900 w-full h-full p-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn(
              "p-1.5 rounded-b rounded-t flex-shrink-0",
              getBatteryBgColor(bateriaCarga)
            )}>
              <Battery className={cn(
                "h-6 w-6 flex items-center gap-2",
                getBatteryTextColor(bateriaCarga)
              )} />
            </div>
            <div>
              <CardTitle className="w-full text-base font-semibold flex items-center gap-1 truncate">
                <ShoppingCart className="h-3.5 w-3.5 flex-shrink-0" />
                  <LabelCardTitulo bold={true}>{idCaixa}</LabelCardTitulo>
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "mt-2 text-[10px] font-normal h-5 px-1.5 truncate max-w-full",
                  isPoweredOn
                    ? "text-green-600 bg-green-500/10"
                    : "text-red-600 bg-red-500/10"
                )}
              >
               {t(`carrinho.${statusCarrinho.toLowerCase()}`)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className={cn(
            "mt-5 p-1.5 rounded-full transition-colors flex-shrink-0",
            isScaleConnected
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          )}>
            <Scale className="h-3.5 w-3.5" />
            </div>
            <div className={cn(
            "mt-5 p-1.5 rounded-full transition-colors flex-shrink-0",
            isBatteryConnected
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          )}>
            <Cable className="h-3.5 w-3.5" />
            </div>
            <div className={cn(
            "mt-5 p-1.5 rounded-full transition-colors flex-shrink-0",
            isPoweredOn
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          )}>
            <Power className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </CardHeader>

      <Separator className="mx-4" />

      <CardContent className="px-4 pt-4 pb-4 flex-1">
        <div className="space-y-4">
          {/* Informações da Bateria */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Battery className="h-3 w-3" />
                Bateria
              </span>
              <span className={cn(
                "text-xs font-bold",
                getBatteryTextColor(bateriaCarga)
              )}>
                {Math.round(bateriaCarga)}%
              </span>
            </div>
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  getProgressColorClass(bateriaCarga)
                )}
                style={{ width: `${bateriaCarga}%` }}
              />
            </div>
          </div>

          {/* Status do Sistema */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Status
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs">Alimentação</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] h-5 px-1.5",
                    isPoweredOn
                      ? "bg-green-800 text-white border-green-800"
                      : "bg-red-600 text-white border-red-600"
                  )}>
                  {isPoweredOn ? "ON" : "OFF"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs">Balança</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] h-5 px-1.5",
                    isScaleConnected
                      ? "bg-green-800 text-white border-green-800"
                      : "bg-red-600 text-white border-red-600"
                  )}>
                  {isScaleConnected ? "OK" : "ERRO"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Informações Temporais */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Atualização
                </span>
              </div>
              <p className="text-xs font-medium truncate" title={formatDate(datahoraAtualizacao)}>
                {formatDate(datahoraAtualizacao)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Última Compra
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium truncate flex-1 mr-2" title={formatDate(dataUltimoCupom)}>
                  {formatDate(dataUltimoCupom)}
                </p>
                {dataUltimoCupom && (
                  <RefreshCw className="h-3 w-3 text-gray-400 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* Footer com ID do Status */}
          <div className="pt-3 border-t mt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 truncate mr-2">
                ID: {idStatus}
              </span>
              <div className="flex items-center gap-1">
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full flex-shrink-0",
                  isPoweredOn ? "bg-green-500" : "bg-red-500"
                )} />
                <span className="text-[10px] text-gray-500">
                  {isPoweredOn ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardsStatusCarrinho;