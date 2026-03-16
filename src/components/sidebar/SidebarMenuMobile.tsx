import { useEffect, useState, useMemo } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import ConfiguradorService from "@/services/configurador.service";
import authService from "@/services/auth.service";
import { getIconComponent } from "@/utils/iconMapper";
import { useTranslation } from "react-i18next";

interface MenuItem {
  id_modulo_web_grupo_item: string;
  modulo_web_grupo: string;
  modulo_web_grupo_item: string;
  rota: string;
  icone: string;
}

interface Props {
  plataforma: string;
  titulo: string;
  IdModulo: number;
}

export default function SidebarMenuMobile({
  plataforma,
  titulo,
  IdModulo,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    const carregarMenu = async () => {
      const user = JSON.parse(localStorage.getItem("user") ?? "{}");

      const response =
        await ConfiguradorService.listarItemMenuUsuarioAtivo(
          Number(user.id),
          IdModulo
        );

      setMenu(response);
    };

    carregarMenu();
  }, [IdModulo]);

  const menuAgrupado = useMemo(() => {
    return menu.reduce<Record<string, MenuItem[]>>((acc, item) => {
      if (!acc[item.modulo_web_grupo]) {
        acc[item.modulo_web_grupo] = [];
      }
      acc[item.modulo_web_grupo].push(item);
      return acc;
    }, {});
  }, [menu]);

  const handleClick = async (item: MenuItem) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") ?? "{}");
    await authService.logarItemMenu(
      user.id,
      item.id_modulo_web_grupo_item
    );
  } finally {
    setOpen(false);
    setTimeout(() => {
      navigate(item.rota);
    }, 50);
  }
};


  return (
    <Sheet open={open} onOpenChange={setOpen} >
      {/* Botão hamburguer */}
      <SheetTrigger className="bg-white dark:bg-gray-900" asChild>
        <Button
          size="icon"
          variant="ghost"
          className="fixed top-4 left-4 z-50 bg-white dark:bg-gray-900"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-white dark:bg-gray-900
          p-0
          w-full sm:w-[360px]
          h-dvh
          flex flex-col
        "
      >
        {/* Header FIXO */}
        <div className="p-4 border-b bg-white dark:bg-gray-900 shrink-0">
          <h1 className="text-base font-semibold">
            {plataforma}
          </h1>
          <p className="text-xs text-muted-foreground">
            {titulo}
          </p>
        </div>

        {/* MENU SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-white dark:bg-gray-900">
          {Object.entries(menuAgrupado).map(
            ([grupo, itens]) => (
              <div key={grupo} className="mb-3">
                {/* Título do grupo */}
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-white dark:bg-gray-900">
                  {t(grupo)}
                </div>

                {/* Itens */}
                {itens.map(item => {
                  const Icon = getIconComponent(item.icone);
                  const active =
                    location.pathname === item.rota;

                  return (
                    <button
                      key={item.rota}
                      onClick={() => handleClick(item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-left",
                        "active:bg-gray-100 dark:active:bg-gray-800 transition",
                        active &&
                          "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                      )}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 shrink-0">
                        {Icon && (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>

                      <span className="text-sm font-medium leading-tight">
                        {t(item.modulo_web_grupo_item)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer FIXO */}
        <div className="p-3 border-t text-[11px] text-center text-muted-foreground shrink-0">
          Deslize para fechar
        </div>
      </SheetContent>
    </Sheet>
  );
}
