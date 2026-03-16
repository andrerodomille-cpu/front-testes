// components/SidebarMenu/index.tsx
import { useEffect, useState, useMemo } from "react";
import ConfiguradorService from "../../services/configurador.service";
import { ChevronLeft, Bell, VideoIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getIconComponent } from "@/utils/iconMapper";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import authService from "@/services/auth.service";

interface User {
  id: string;
  fullname: string;
  empresa: string;
}

interface RetrieveParams {
  id: number;
  id_empresa: number;
}

interface Menu {
  id_modulo_web_grupo_item: string;
  modulo_web_grupo: string;
  modulo_web_grupo_item: string;
  rota: string;
  icone: string;
  icone_grupo: string;
}

interface SidebarMenuProps {
  plataforma: string;
  titulo: string;
  IdModulo: number;
  defaultCollapsed?: boolean;
  onMenuItemClick?: (rota: string, idItem: string) => void;
  customHeaderColor?: string;
  showNotifications?: boolean;
  showUserInfo?: boolean;
}

export function SidebarMenu({
  plataforma,
  titulo,
  IdModulo,
  defaultCollapsed = false,
  onMenuItemClick,
  customHeaderColor,
  showNotifications = true,
  showUserInfo = true,
}: SidebarMenuProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [headerColor, setHeaderColor] = useState<string>(customHeaderColor || "#059669");
  const [nomeCompletoUsuario, setNomeCompletoUsuario] = useState("");
  const [idEmpresa, setIdEmpresa] = useState<Number>(1);
  const [empresa, setEmpresa] = useState("");
  const [foto, setFoto] = useState("");
  const [menu, setMenu] = useState<Menu[]>([]);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  const groupedMenu = useMemo(() => {
    const grupos: Record<
      string,
      { icone_grupo: string; icone: string; items: Menu[] }
    > = {};

    menu.forEach((item) => {
      if (!grupos[item.modulo_web_grupo]) {
        grupos[item.modulo_web_grupo] = {
          icone: item.icone,
          icone_grupo: item.icone_grupo,
          items: [],
        };
      }
      grupos[item.modulo_web_grupo].items.push(item);
    });

    return grupos;
  }, [menu]);

  const listarItemMenuUsuarioAtivo = async () => {
    const userData = localStorage.getItem("user") ?? "{}";
    const parsedUser: User = JSON.parse(userData);
    try {
      const response = await ConfiguradorService.listarItemMenuUsuarioAtivo(
        Number(parsedUser.id),
        IdModulo
      );
      setMenu(response);
    } catch (error) {
      console.error("Erro ao carregar Itens de Menu do usuário:", error);
    }
  };

  const handleMenuClick = async (rota: string, id_modulo_web_grupo_item: string) => {
    try {
      const userData = localStorage.getItem("user") ?? "{}";
      const parsedUser: User = JSON.parse(userData);

      await authService.logarItemMenu(parsedUser.id, id_modulo_web_grupo_item);
    } catch (error) {
      console.error("Erro ao logar item do menu", error);
    } finally {
      // Chama o callback personalizado se fornecido
      if (onMenuItemClick) {
        onMenuItemClick(rota, id_modulo_web_grupo_item);
      } else {
        // Comportamento padrão: navegação
        navigate(rota);
      }
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      const colorWithoutBg = savedColor.replace(/bg-/g, "text-");
      setHeaderColor(colorWithoutBg);
    }

    const userData = localStorage.getItem("user") ?? "{}";
    const parsedUser: User = JSON.parse(userData);

    setNomeCompletoUsuario(parsedUser.fullname);
    setFoto(
      localStorage.getItem(`foto_${parsedUser.id}`) ??
      `${import.meta.env.BASE_URL}assets/user_photo.png`
    );

    const storedEmpresa = localStorage.getItem("empresa") ?? "{}";
    if (storedEmpresa) {
      setEmpresa(JSON.parse(storedEmpresa));
    }

    const retrieveParamsString = localStorage.getItem("user");
    if (retrieveParamsString) {
      const retrieveParams: RetrieveParams = JSON.parse(retrieveParamsString);
      setIdEmpresa(retrieveParams.id_empresa);
    } else {
      console.error("Nenhum dado foi encontrado no localStorage.");
    }

    listarItemMenuUsuarioAtivo();
  }, [IdModulo]); // Adiciona IdModulo como dependência para recarregar menu quando mudar

  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <Sidebar
          collapsible="none"
          className={cn(
            "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out shadow-xl",
            isCollapsed ? "w-[100px]" : "w-[320px]"
          )}
        >

          <SidebarHeader
            className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20"
            style={{ backgroundColor: customHeaderColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <VideoIcon className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <h1 className="font-bold text-lg 
                      text-blue-500 dark:text-blue-400
                      tracking-tight">
                      {plataforma}
                    </h1>
                    <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold">
                      {titulo}
                    </p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all hover:scale-105"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isCollapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex-1 py-3 px-2 overflow-y-auto">
            <div className="space-y-0.5">
              {Object.entries(groupedMenu).map(
                ([grupo, { icone_grupo, items }]) => {
                  const GrupoIcon = getIconComponent(icone_grupo);
                  const isGroupOpen = openGroups.includes(grupo);

                  return (
                    <Accordion
                      key={grupo}
                      type="single"
                      collapsible
                      className="w-full"
                      onValueChange={(value) =>
                        setOpenGroups(value ? [value] : [])
                      }
                    >
                      <AccordionItem value={grupo} className="border-none">
                        <Tooltip.Provider delayDuration={300}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <AccordionTrigger
                                className={cn(
                                  "flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group mb-1",
                                  isCollapsed ? "justify-center" : "justify-between",
                                  isGroupOpen && "bg-blue-50 dark:bg-blue-900/20"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                                    isGroupOpen
                                      ? "bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-800/40 dark:to-blue-800/40"
                                      : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                                  )}>
                                    {GrupoIcon && (
                                      <GrupoIcon className={cn(
                                        "h-4 w-4 transition-colors",
                                        isGroupOpen
                                          ? "text-orange-600 dark:text-orange-400"
                                          : "text-gray-600 dark:text-gray-400"
                                      )} />
                                    )}
                                  </div>
                                  {!isCollapsed && (
                                    <div className="flex flex-col items-start">
                                      <span className="font-medium text-sm text-orange-600 dark:text-orange-400 whitespace-normal break-words leading-snug text-left">
  {t(grupo)}
</span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {items.length} {items.length === 1 ? 'item' : 'itens'}
                                      </span>
                                    </div>
                                  )}
                                </div>

                              </AccordionTrigger>
                            </Tooltip.Trigger>
                            {isCollapsed && (
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="right"
                                  align="center"
                                  sideOffset={5}
                                  className="z-50 overflow-hidden rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg animate-in fade-in-0 zoom-in-95"
                                >
                                  <div className="font-medium ">{t(grupo)}</div>
                                  <div className="text-gray-300">{items.length} itens</div>
                                  <Tooltip.Arrow className="fill-gray-900" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            )}
                          </Tooltip.Root>
                        </Tooltip.Provider>

                        {!isCollapsed && (
                          <AccordionContent className="pt-1 pb-0">
                            <div className="ml-10 space-y-1 pl-2">
                              {items.map(
                                ({ id_modulo_web_grupo_item, modulo_web_grupo_item, rota, icone }) => {
                                  const IconComponent = getIconComponent(icone);
                                  const isActive = location.pathname === rota;

                                  return (
                                    <Button
                                      key={rota}
                                      variant="ghost"
                                      onClick={() => handleMenuClick(rota, id_modulo_web_grupo_item)}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-b rounded-t justify-start transition-all relative group/item",
                                        "hover:bg-orange-50 dark:hover:bg-orange-900/20",
                                        isActive
                                          ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-semibold shadow-sm"
                                          : "text-gray-600 dark:text-gray-400"
                                      )}
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className={cn(
                                          "flex items-center justify-center w-7 h-7 rounded-lg transition-all",
                                          isActive
                                            ? "bg-orange-100 dark:bg-orange-800/40 shadow-sm"
                                            : "bg-gray-100 dark:bg-gray-800 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-800/20"
                                        )}>
                                          {IconComponent && (
                                            <IconComponent className={cn(
                                              "h-3.5 w-3.5 transition-colors",
                                              isActive
                                                ? "text-orange-600 dark:text-orange-400"
                                                : "text-gray-500 dark:text-gray-500 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400"
                                            )} />
                                          )}
                                        </div>
                                        <span className="text-xs whitespace-normal break-words leading-snug text-left">
                                          {t(modulo_web_grupo_item)}
                                        </span>
                                      </div>
                                      {isActive && (
                                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-full animate-pulse" />
                                      )}
                                      {!isActive && (
                                        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-0 group-hover/item:h-4 bg-blue-300 dark:bg-blue-600 rounded-full transition-all duration-300" />
                                      )}
                                    </Button>
                                  );
                                }
                              )}
                            </div>
                          </AccordionContent>
                        )}
                      </AccordionItem>
                    </Accordion>
                  );
                }
              )}
            </div>

          </SidebarContent>

          {showUserInfo && (
            <SidebarFooter className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
              <div className={cn(
                "flex items-center gap-3",
                isCollapsed ? "justify-center" : ""
              )}>
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-800 shadow-md ring-2 ring-blue-500/20">
                    <AvatarImage src={foto} alt={nomeCompletoUsuario} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                      {getUserInitials(nomeCompletoUsuario)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="overflow-hidden">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {nomeCompletoUsuario}
                        </p>
                        <p className="text-sm font-bold
                      text-blue-500 dark:text-blue-400
                      tracking-tight">
                          {empresa}
                        </p>
                      </div>
                      {showNotifications && (
                        <div className="flex items-center gap-1">
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Bell className="h-4 w-4" />
                              {notificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                  {notificationsCount}
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </SidebarFooter>
          )}
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default SidebarMenu;