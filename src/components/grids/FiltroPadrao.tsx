import { Toggle } from "@/components/ui/toggle"
import { Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Keyboard } from 'lucide-react';
import { Search } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import DiscountIcon from '@mui/icons-material/Discount';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface FiltrosDescontoToggleProps {
    filtroRef: React.RefObject<any>
}

export function FiltroPadrao({ filtroRef }: FiltrosDescontoToggleProps) {
    const [ativoDescontoItem, setAtivoDescontoItem] = useState(false)
    const [ativoCupom, setAtivoCupom] = useState(false)
    const [ativoDigitado, setAtivoDigitado]= useState(false)
    const [ativoConsultados, setAtivoConsultados] = useState(false)	
    const [ativoItensCancelados, setAtivoItensCancelados] = useState(false)	
    const [ativoVendasCanceladas, setAtivoVendasCanceladas] = useState(false)	
    const [ativoCuponsCancelados, setAtivoCuponsCancelados] = useState(false)	

    const handleToggle = (
        ativo: boolean,
        campo: string,
        setAtivo: (v: boolean) => void
    ) => {
        setAtivo(ativo)

        if (ativo) {
            filtroRef.current?.adicionarFiltroDireto({
                campo,
                tipo: "maior",
                valor1: "0",
            })
        } else {
            filtroRef.current?.removerFiltroDireto(campo)
        }
    }

    const toggleBaseClass =
        "!h-7 text-xs rounded px-3 py-1 transition-all font-medium flex items-center gap-2"

    const getClass = (ativo: boolean) =>
        cn(
            toggleBaseClass,
            ativo
                ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:ring-blue-400"
                : "bg-gray-300 text-zinc-700 hover:bg-gray-400 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
        )


return (
  <TooltipProvider delayDuration={300}>
    <div className="flex gap-2">

      {/* Desconto por item */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoDescontoItem}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "valor_desconto_item", setAtivoDescontoItem)
            }
            className={getClass(ativoDescontoItem)}
            aria-label="Filtro Desconto Item"
          >
            <DiscountIcon className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Desconto aplicado no item
        </TooltipContent>
      </Tooltip>

      {/* Desconto no cupom */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoCupom}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "valor_desconto_cupom", setAtivoCupom)
            }
            className={getClass(ativoCupom)}
            aria-label="Filtro Desconto Cupom"
          >
            <Percent className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Desconto aplicado no cupom
        </TooltipContent>
      </Tooltip>

      {/* Itens digitados */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoDigitado}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "quantidade_itens_digitados", setAtivoDigitado)
            }
            className={getClass(ativoDigitado)}
            aria-label="Filtro Itens Digitados"
          >
            <Keyboard className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Itens digitados
        </TooltipContent>
      </Tooltip>

      {/* Itens consultados */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoConsultados}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "quantidade_itens_consultados", setAtivoConsultados)
            }
            className={getClass(ativoConsultados)}
            aria-label="Filtro Itens Consultados"
          >
            <Search className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Itens consultados
        </TooltipContent>
      </Tooltip>

      {/* Itens cancelados */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoItensCancelados}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "quantidade_itens_cancelados", setAtivoItensCancelados)
            }
            className={getClass(ativoItensCancelados)}
            aria-label="Filtro Itens Cancelados"
          >
            <Trash2 className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Itens cancelados
        </TooltipContent>
      </Tooltip>

      {/* Vendas canceladas */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoVendasCanceladas}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "quantidade_vendas_canceladas", setAtivoVendasCanceladas)
            }
            className={getClass(ativoVendasCanceladas)}
            aria-label="Filtro Vendas Canceladas"
          >
            <RemoveShoppingCartIcon className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Vendas canceladas
        </TooltipContent>
      </Tooltip>

      {/* Cupons cancelados */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={ativoCuponsCancelados}
            onPressedChange={(ativo) =>
              handleToggle(ativo, "quantidade_cupons_canceladas", setAtivoCuponsCancelados)
            }
            className={getClass(ativoCuponsCancelados)}
            aria-label="Filtro Cupons Cancelados"
          >
            <ProductionQuantityLimitsIcon className="w-3 h-3" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="top">
          Cupons cancelados
        </TooltipContent>
      </Tooltip>

    </div>
  </TooltipProvider>
);
}
