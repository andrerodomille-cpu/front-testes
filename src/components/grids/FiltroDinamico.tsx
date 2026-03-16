import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { Trash } from "lucide-react";
import { Plus } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/contexts/LocaleProvider";

type Campo = {
  nome: string;
  tipo: string;
};

type Filtro = {
  campo: string;
  tipo: string;
  valor1: string;
  valor2?: string;
};

export interface FiltroDinamicoHandles {
  adicionarFiltroDireto: (filtro: Filtro) => void;
  removerFiltroDireto: (campo: string) => void;
}

interface Props {
  colunas: Campo[];
  aplicarFiltros: (filtros: Filtro[]) => void;
}

export const FiltroDinamico = forwardRef<FiltroDinamicoHandles, Props>(
  ({ colunas, aplicarFiltros }, ref) => {
    const [filtros, setFiltros] = useState<Filtro[]>([]);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const locale = useLocale();
    const adicionarFiltro = () => {
      setFiltros((prev) => [
        ...prev,
        { campo: "", tipo: "", valor1: "", valor2: undefined },
      ]);
    };
    const adicionarFiltroDireto = (filtro: Filtro) => {
      const novosFiltros = [...filtros, filtro];
      setFiltros(novosFiltros);
      aplicarFiltros(novosFiltros);
    };
    const removerFiltroDireto = (campo: string) => {
      const atualizados = filtros.filter((f) => f.campo !== campo);
      setFiltros(atualizados);
      aplicarFiltros(atualizados);
    };
    const atualizarFiltro = (
      index: number,
      key: keyof Filtro,
      value: string
    ) => {
      const atualizados = [...filtros];
      atualizados[index][key] = value;
      setFiltros(atualizados);
    };

    const removerFiltro = (index: number) => {
      const atualizados = filtros.filter((_, i) => i !== index);
      setFiltros(atualizados);
    };

    const handleAplicar = () => {
      aplicarFiltros(filtros);
      setOpen(false);
    };

    useImperativeHandle(ref, () => ({
      adicionarFiltroDireto,
      removerFiltroDireto,
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="!h-7 ml-1 text-gray-600 dark:text-gray-300 bg-gray-300 dark:bg-gray-800 
          text-xs rounded-t rounded-b w-15 flex items-center gap-2 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            <Filter className="w-2 h-2" />
            {t("comum.filtrosdinamicos")}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="max-w-4xl bg-gray-100 dark:bg-gray-800"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <LabelCardTitulo bold={false}>
              {t("comum.aplicacaofiltrodinamico")}
            </LabelCardTitulo>
            <LabelCardSubTitulo bold={false}>
              {t("comum.infomefiltrodinamico")}{" "}
            </LabelCardSubTitulo>
          </DialogHeader>

          <Card className="w-full h-full bg-gray-100 dark:bg-gray-800 p-3 sm:p-4">
            <div className="space-y-2">
              {filtros.map((filtro, index) => {
                const tipoColuna = colunas.find(
                  (c) => c.nome === filtro.campo
                )?.tipo;
                return (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-2 items-end text-xs"
                  >
                    <div className="col-span-1">
                      <Label className="text-[11px] text-gray-700 dark:text-gray-300">
                        {t("comum.campo")}
                      </Label>
                      <Select
                        value={filtro.campo}
                        onValueChange={(value) =>
                          atualizarFiltro(index, "campo", value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs px-2 bg-gray-100 dark:bg-gray-900  rounded-t rounded-b">
                          <SelectValue placeholder={t("comum.campo")} />
                        </SelectTrigger>
                        <SelectContent className="text-xs max-h-64 overflow-auto">
                          {colunas.map((col) => (
                            <SelectItem
                              className="text-xs"
                              key={col.nome}
                              value={col.nome}
                            >
                              {t(`comum.${col.nome}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1">
                      <Label className="text-[11px] text-gray-700 dark:text-gray-300">
                        {t("comum.condicao")}
                      </Label>
                      <Select
                        value={filtro.tipo}
                        onValueChange={(value) =>
                          atualizarFiltro(index, "tipo", value)
                        }
                      >
                        <SelectTrigger className="h-8 text-xs px-2 bg-gray-100 dark:bg-gray-900  rounded-t rounded-b">
                          <SelectValue placeholder={t("comum.condicao")} />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          <SelectItem className="text-xs" value="maior">
                            {t("comum.maiorque")}
                          </SelectItem>
                          <SelectItem className="text-xs" value="menor">
                            {t("comum.menorque")}
                          </SelectItem>
                          <SelectItem className="text-xs" value="igual">
                            {t("comum.igual")}
                          </SelectItem>
                          <SelectItem className="text-xs" value="entre">
                            {t("comum.entre")}
                          </SelectItem>
                          <SelectItem className="text-xs" value="contem">
                            {t("comum.contem")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 flex gap-2">
                      <div>
                        <Label className="text-[11px] text-gray-700 dark:text-gray-300 rounded-b rounded-t">
                          {t("comum.valor1")}
                        </Label>
                        <Input
                          className="h-8 !text-xs px-2  text-gray-500 dark:text-gray-100  bg-gray-100 dark:bg-gray-900 rounded-b rounded-t"
                          value={filtro.valor1}
                          onChange={(e) =>
                            atualizarFiltro(index, "valor1", e.target.value)
                          }
                        />
                      </div>
                      {filtro.tipo === "entre" && (
                        <div className="flex-1">
                          <Label className="text-[11px] text-gray-700 dark:text-gray-300 rounded-b rounded-t">
                            {t("comum.valor2")}
                          </Label>
                          <Input
                            className="h-8 !text-xs px-2  text-gray-500 dark:text-gray-100  bg-gray-100 dark:bg-gray-900 rounded-b rounded-t"
                            value={filtro.valor2}
                            onChange={(e) =>
                              atualizarFiltro(index, "valor2", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <Button
                        onClick={() => removerFiltro(index)}
                        className="h-6 px-2 text-xs rounded-b rounded-t bg-red-600 dark:bg-red-300"
                      >
                        <Trash className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <Button
                className="mt-2 h-8 px-6 text-xs rounded-b rounded-t bg-blue-500 dark:bg-blue-300"
                onClick={adicionarFiltro}
              >
                <Plus className="h-2 w-2" /> {t("comum.adicionarcondicao")}
              </Button>
            </div>
          </Card>
          <DialogFooter className="flex justify-between">
            <Button
              className="h-8 px-8 text-xs rounded-b rounded-t bg-green-500 dark:bg-green-300"
              onClick={handleAplicar}
            >
              <Filter className="h-2 w-2" /> {t("comum.aplicarfiltro")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
