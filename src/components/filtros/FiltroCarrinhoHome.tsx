import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import configService from "@/services/configurador.service";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { InputSingleSelect } from "../input/InputSingleSelect";

import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Store,
  Calendar
} from "lucide-react";

interface RetrieveParams {
  id: number;
}

interface Loja {
  idconexao: string;
  loja: string;
}

interface FiltroCarrinhoProps {
  onLojaChange?: (id: string) => void;
  defaultExpanded?: boolean;
}

const FiltroCarrinhoHome: React.FC<FiltroCarrinhoProps> = ({
  onLojaChange,
  defaultExpanded = true,
}) => {
  const { t } = useTranslation();
  const filtros = t("comum.filtros");
  const selecaoloja = t("comum.selecaoloja");

  const [showFilters, setShowFilters] = useState<boolean>(defaultExpanded);
  const [headerColor, setHeaderColor] = useState<string>("from-blue-500 to-blue-600");

  const [tableLojas, setTableLojas] = useState<Loja[]>([]);
  const [idConexao, setIdConexao] = useState<string | null>(() => {
    const stored = localStorage.getItem("idConexaoSmartCart");
    return stored ? JSON.parse(stored) : null;
  });

  /** 🔹 Buscar lojas */
  const filtrarLojas = (idUsuario: number) => {
    configService.listarLojasSmartCart(idUsuario).then((response) => {
      setTableLojas(response.data);
    });
  };

  /** 🔹 Alteração da loja */
  const handleLojas = (id: string) => {
    setIdConexao(id);
    localStorage.setItem("idConexaoSmartCart", JSON.stringify(id));
    onLojaChange?.(id);
  };

  /** 🔹 Carregar usuário */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: RetrieveParams = JSON.parse(user);
      filtrarLojas(parsed.id);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mb-2"
    >
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-b rounded-t">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20`}>
                      <SlidersHorizontal className={`h-4 w-4 text-gray-600 dark:text-gray-400`} />
                    </div>

            <LabelCardTitulo bold={false}>
              {filtros}
            </LabelCardTitulo>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-600 dark:text-gray-500"
          >
            {showFilters ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                {t("comum.ocultarfiltros")}
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                 {t("comum.mostrarfiltros")}
              </>
            )}
          </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className={`h-4 w-4 text-gray-500`} />
                      <LabelCardTitulo bold={false}>
                         {selecaoloja}
                      </LabelCardTitulo>
                    </div>
                    <InputSingleSelect
                      id="idConexao"
                      label=""
                      value={idConexao ?? ""}
                      options={tableLojas.map((opcao) => ({
                        label: opcao.loja,
                        value: String(opcao.idconexao),
                      }))}
                      obrigatorio={false}
                      onChange={(_, value) => handleLojas(String(value))}
                    />
                  </div>
                </div>
              </div>


            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FiltroCarrinhoHome;
