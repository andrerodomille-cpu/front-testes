import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OperadorAnalise } from "../types";
import { CheckCircle2, Gauge, ShieldCheck } from "lucide-react";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);

interface OperadorDestaqueCardProps {
  operador: OperadorAnalise;
}

export function OperadorDestaqueCard({
  operador,
}: OperadorDestaqueCardProps) {
  const baixoVolume = operador.quantidade_cupons < 100;

  return (
    <Card className="border-border/60 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{operador.nome_operador}</h3>
            <p className="text-sm text-muted-foreground">
              Risco {operador.score_risco.toFixed(4)} • Eficiência{" "}
              {operador.score_eficiencia.toFixed(4)}
            </p>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Referência
            </Badge>
            {baixoVolume ? <Badge variant="outline">Baixo volume</Badge> : null}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <Gauge className="h-4 w-4" />
              Velocidade
            </div>
            <p className="text-lg font-bold">
              {operador.cupons_por_hora.toFixed(2)}/h
            </p>
            <p className="text-xs text-muted-foreground">
              {operador.tempo_medio_por_cupom_seg.toFixed(2)} seg/cupom
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="h-4 w-4" />
              Controle de risco
            </div>
            <p className="text-lg font-bold">
              {operador.impacto_valor_cancelado.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">
              Itens cancelados {operador.taxa_itens_cancelados.toFixed(2)}%
            </p>
          </div>

          <div className="rounded-xl bg-muted p-3 dark:bg-gray-800/80">
            <div className="mb-1 text-sm font-medium">Venda</div>
            <p className="text-lg font-bold">{fmtMoney(operador.valor_total_venda)}</p>
            <p className="text-xs text-muted-foreground">
              Ticket {fmtMoney(operador.ticket_medio)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}