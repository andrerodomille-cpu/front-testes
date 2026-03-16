import React, { useState, useEffect } from "react";
import { Settings, LogOut, Sun, Moon, Wrench, CameraIcon, VideoIcon, Bell, ChevronDown, Search, HelpCircle, User, LayoutDashboard, Component, Presentation } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import AuthService from "../../services/auth.service";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingCart,
  ContactRound,
  ShieldCheck,
  FileText,
  ShieldAlert,
  Pickaxe,
  CircleGauge,
  PackageSearch, CheckSquare, CornerUpLeft, Monitor, Eye, Activity,
  BarChart3,
  PieChart as PieChartIcon,

  Cog
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { usePermission } from "@/contexts/PermissionContext";
import { useNavigate } from "react-router-dom";
import { } from "@radix-ui/react-dialog";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";


interface UserParams {
  fullname: string;
  empresa: string;
}
interface User {
  id: number;
  id_empresa: number;
  primeiro_acesso: number;
  alterar_senha_login: number;
}

type Module = {
  id_modulo_web: number;
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  image: string;
  enabled: boolean;
  internal: boolean;
  category: string;
};

const Home: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [headerColor, setHeaderColor] = useState<string>("bg-gradient-to-r from-blue-600 to-indigo-600");
  const [isOpen, setIsOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [id, setId] = useState<number>(0);
  const [idEmpresa, setIdEmpresa] = useState<number>(5000);
  const [nomeCompletoUsuario, setNomeCompletoUsuario] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [language, setLanguage] = useState(i18n.language);
  const [mostrarUpload, setMostrarUpload] = useState(false);
  const languageOptions: { [key: string]: string } = { "pt-BR": "BR", "en-US": "US" };
  const [searchTerm, setSearchTerm] = useState("");
  //const basePath = import.meta.env.MODE === "production" ? "/portal" : "";


  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    AuthService.logout();
    localStorage.setItem("isLogOut", "true");
    window.location.reload();
  };

  const handleColorChange = (color: string) => {
    setHeaderColor(color);
    localStorage.setItem("headerColor", color);
  };

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const isMobile = () => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );
  };

  const abrirDashboardAnaliseOperadores = () => {
    window.open("/analise-operadores", "_blank");
  };

  const abrirDashboardRiscoOperacional = () => {
    window.open("/risco-operacional", "_blank");
  };

  const abrirDashboardAnaliseAlertas = () => {
    window.open("/analise-alertas", "_blank");
  };

    const abrirDashboardAPlanoAcao = () => {
    window.open("/analise-plano-acao", "_blank");
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      if (savedColor.startsWith("#")) {
        localStorage.setItem("headerColor", "bg-gradient-to-r from-blue-600 to-indigo-600");
        setHeaderColor("bg-gradient-to-r from-blue-600 to-indigo-600");
      } else {
        setHeaderColor(savedColor);
        localStorage.setItem("headerColor", "bg-gradient-to-r from-blue-600 to-indigo-600");
      }
    } else {
      localStorage.setItem("headerColor", "bg-gradient-to-r from-blue-600 to-indigo-600");
      setHeaderColor("bg-gradient-to-r from-blue-600 to-indigo-600");
    }

    const userData = localStorage.getItem("user") ?? "{}";
    const parsedUser: User = JSON.parse(userData);
    const primeiroAcesso = parsedUser.primeiro_acesso;
    const alterarSenhaLogin = parsedUser.alterar_senha_login;

    if (parsedUser?.id) {
      setId(parsedUser.id);
      setIdEmpresa(parsedUser.id_empresa);
    }

    if (primeiroAcesso === 1) {
      navigate("/criar-senha");
    } else if (alterarSenhaLogin === 1) {
      navigate("/alterar-senha");
    }

    const userDataParams = localStorage.getItem("user") ?? "{}";
    const parsedUserParams: UserParams = JSON.parse(userDataParams);

    setNomeCompletoUsuario(parsedUserParams.fullname);
    localStorage.setItem("nomecompletousuario", parsedUserParams.fullname);

    return () => {
      if (fotoUrl) {
        URL.revokeObjectURL(fotoUrl);
      }
    };
  }, [i18n.language]);


  return (
    <div key={i18n.language} className="min-h-screen overflow-x-hidden">
      <header className={`sticky top-0 z-50 ${headerColor} shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">

            <div className="hidden md:flex flex-1 max-w-md ml-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/4 transform -trangray-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t("comum.buscarmodulos")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-white hover:bg-white/20"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("comum.alternartema")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("comum.faq")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-white hover:bg-white/20"
                  >
                    <Avatar className="h-8 w-8 border-2 border-white/30">
                      <AvatarImage src={fotoUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{nomeCompletoUsuario?.split(" ")[0]}</p>
                      <p className="text-xs opacity-80">{empresa}</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={fotoUrl} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{nomeCompletoUsuario}</p>
                        <p className="text-xs text-muted-foreground">{empresa}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(false);
                      setIsOpen(true);
                    }}>

                    <Settings className="mr-2 h-4 w-4" />
                    {t("comum.configuracoes")}
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t("comum.ajudaefaq")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("comum.sair")}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-2"
        >
        </motion.section>

        <section className="mb-8">
          <Card className="mb-2 rounded-2xl border-blue-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-950/40">
                      <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Painel de Desempenho de Análise de Operadores de Caixa
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Prevenção de perdas e eficiência operacional no PDV
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-300">

                    {/* Seção 1: Visão do painel */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        O que este painel apresenta
                      </h3>
                      <p>
                        Este painel apresenta indicadores operacionais dos operadores de caixa,
                        permitindo uma leitura clara do desempenho da operação de PDV.
                        A análise considera diferentes dimensões do comportamento operacional
                        para ajudar gestores a identificar padrões e oportunidades de melhoria.
                      </p>

                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li><span className="font-medium">Produtividade:</span> volume de vendas, cupons processados e ritmo de atendimento</li>
                        <li><span className="font-medium">Risco operacional:</span> cancelamentos, consultas e comportamentos fora do padrão</li>
                        <li><span className="font-medium">Impacto financeiro:</span> valores envolvidos em cancelamentos e operações sensíveis</li>
                      </ul>
                    </div>

                    {/* Seção 2: Interpretação dos indicadores */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        🔍 Como interpretar os indicadores
                      </h3>

                      <p className="mb-2">
                        A análise deve ser observada em conjunto. Um operador pode apresentar
                        alta produtividade e, ao mesmo tempo, taxas elevadas de cancelamento ou consultas.
                        Por isso, o ideal é sempre avaliar o equilíbrio entre desempenho,
                        risco operacional e impacto financeiro.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">⚠️ Possível risco</p>
                          <p className="text-xs mt-1">
                            Alta incidência de cancelamentos ou consultas combinada com impacto financeiro relevante
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">📈 Alta produtividade</p>
                          <p className="text-xs mt-1">
                            Grande volume de cupons ou itens processados com risco operacional controlado
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">⚖️ Equilíbrio operacional</p>
                          <p className="text-xs mt-1">
                            Operadores com desempenho consistente e indicadores próximos à média da equipe
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">📊 Comportamento fora da curva</p>
                          <p className="text-xs mt-1">
                            Indicadores muito acima ou abaixo da média podem indicar situações que merecem investigação
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 3: Uso na gestão diária */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        💡 Como utilizar no dia a dia
                      </h3>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p>
                            <span className="font-medium">Acompanhamento operacional:</span>
                            Utilize o painel em reuniões de rotina para acompanhar o desempenho da equipe.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p>
                            <span className="font-medium">Treinamentos direcionados:</span>
                            Identifique operadores que apresentem maior taxa de erros ou inconsistências.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p>
                            <span className="font-medium">Prioridade de auditoria:</span>
                            Operadores com muitos alertas ou alto impacto financeiro podem exigir atenção imediata.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 4: Destaque positivo */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                        <span className="text-lg">⭐</span>
                        Operadores com boa produtividade e baixo risco operacional podem servir
                        como referência para a equipe. Identificar essas boas práticas ajuda
                        a fortalecer padrões positivos na operação e melhorar o desempenho geral.
                      </p>
                    </div>

                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 lg:w-auto">
                  <Button
                    onClick={abrirDashboardAnaliseOperadores}
                    className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Abrir dashboard
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    O painel será aberto em uma nova página.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-2 rounded-2xl border-blue-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl space-y-6">
                  {/* Cabeçalho */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-950/40">
                      <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Painel de Desempenho de Prevenção de Perdas e Eficiência Operacional
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Prevenção de perdas e eficiência operacional no PDV
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo principal - Organizado em seções */}
                  <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-300">

                    {/* Seção 1: O que o dashboard mostra */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        O que você encontra aqui
                      </h3>
                      <p>
                        O dashboard consolida dados operacionais do PDV para oferecer uma visão completa
                        do desempenho dos operadores de caixa através de três categorias principais:
                      </p>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li><span className="font-medium">Produtividade:</span> volume de vendas, tempo médio de atendimento e itens processados</li>
                        <li><span className="font-medium">Risco operacional:</span> taxas de cancelamento, consultas sem venda e alertas de comportamento</li>
                        <li><span className="font-medium">Impacto financeiro:</span> valores cancelados, descontos atípicos e diferenças de caixa</li>
                      </ul>
                    </div>

                    {/* Seção 2: Como analisar */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        🔍 Como analisar os dados
                      </h3>
                      <p className="mb-2">
                        <span className="font-medium">A análise deve ser integrada:</span> nunca considere um indicador isoladamente.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">⚠️ Alto risco</p>
                          <p className="text-xs mt-1">Múltiplos alertas + alto impacto financeiro = Auditoria prioritária</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">📈 Boas práticas</p>
                          <p className="text-xs mt-1">Alta produtividade + baixo risco = Referência para a equipe</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">🎯 Oportunidade</p>
                          <p className="text-xs mt-1">Produtividade média + alta taxa de erros = Treinamento direcionado</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">📊 Tendências</p>
                          <p className="text-xs mt-1">Compare evolução temporal e padrões por turno/dia da semana</p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 3: Como usar no dia a dia */}
                    <div>
                      <h3 className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                        💡 Aplicação prática
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p><span className="font-medium">Diariamente:</span> Identifique alertas críticos e aja rapidamente em casos de alto impacto</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p><span className="font-medium">Semanalmente:</span> Analise tendências, compare com semanas anteriores e planeje treinamentos</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <p><span className="font-medium">Mensalmente:</span> Avalie evolução da equipe, reconheça destaques e defina ações estruturais</p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 4: Dica importante */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                        <span className="text-lg">💎</span>
                        <span className="font-semibold">Lembre-se:</span> Os dados são um guia, não um veredito. Use-os para fazer perguntas melhores,
                        não para tirar conclusões precipitadas. O objetivo é o desenvolvimento da equipe e a melhoria contínua dos resultados.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão de ação - mantido igual */}
                <div className="flex w-full flex-col gap-3 lg:w-auto">
                  <Button
                    onClick={abrirDashboardRiscoOperacional}
                    className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Abrir dashboard
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    O painel será aberto em uma nova página.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-2 rounded-2xl border-cyan-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl space-y-6">
                  {/* Cabeçalho */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-100 p-3 dark:bg-cyan-950/40">
                      <ShieldAlert className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Painel de Alertas, Auditoria e Eficiência dos Operadores
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Leitura gerencial dos desvios, alertas automáticos e desempenho operacional do caixa
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo principal */}
                  <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {/* Seção 1 */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        O que você encontra aqui
                      </h3>
                      <p>
                        Este painel consolida os principais indicadores operacionais dos operadores de caixa
                        para apoiar a gestão na identificação de riscos, desvios de comportamento, eficiência
                        de atendimento e prioridades de auditoria.
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>
                          <span className="font-medium">Resumo executivo:</span> visão geral da loja,
                          volume analisado, operador de maior risco e sinais gerenciais mais relevantes
                        </li>
                        <li>
                          <span className="font-medium">Alertas automáticos:</span> ocorrências já
                          destacadas como foco de ação imediata ou acompanhamento
                        </li>
                        <li>
                          <span className="font-medium">Operadores prioritários:</span> nomes que exigem
                          auditoria mais próxima, com destaque para impacto financeiro e padrão operacional
                        </li>
                        <li>
                          <span className="font-medium">Rankings e indicadores:</span> comparação entre
                          risco, eficiência, faturamento, cancelamentos, vendas canceladas e consultas
                        </li>
                      </ul>
                    </div>

                    {/* Seção 2 */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        Como interpretar os dados
                      </h3>
                      <p className="mb-2">
                        <span className="font-medium">A análise deve ser contextual:</span> um único
                        indicador não basta. O ideal é observar o conjunto entre risco, eficiência,
                        cancelamentos, consultas e impacto financeiro.
                      </p>

                      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ⚠️ Auditoria prioritária
                          </p>
                          <p className="mt-1 text-xs">
                            Operadores com alertas altos, baixa eficiência e forte impacto financeiro
                            devem entrar primeiro na rotina de validação gerencial.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            📉 Desvio operacional
                          </p>
                          <p className="mt-1 text-xs">
                            Taxas elevadas de cancelamento, vendas canceladas ou consultas podem indicar
                            fragilidade de execução, necessidade de reciclagem ou comportamento fora do padrão.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            📈 Referência positiva
                          </p>
                          <p className="mt-1 text-xs">
                            Operadores com boa produtividade e risco controlado podem servir de base
                            para boas práticas e treinamento da equipe.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            🔎 Leitura comparativa
                          </p>
                          <p className="mt-1 text-xs">
                            Use os rankings para entender quem está mais exposto em cada dimensão
                            e não apenas quem movimenta maior volume.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 3 */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        Como usar no dia a dia
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">•</span>
                          <p>
                            <span className="font-medium">Na abertura da rotina:</span> verifique os
                            alertas automáticos e identifique rapidamente os nomes que exigem ação no curto prazo.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">•</span>
                          <p>
                            <span className="font-medium">Na gestão semanal:</span> compare os rankings
                            de risco, eficiência e consultas para entender padrões recorrentes e priorizar acompanhamento.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">•</span>
                          <p>
                            <span className="font-medium">Na auditoria:</span> concentre validações nos
                            operadores prioritários e nos casos com maior pressão financeira de cancelamentos.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">•</span>
                          <p>
                            <span className="font-medium">No desenvolvimento da equipe:</span> use a
                            leitura analítica para orientar feedback, treinamento e reconhecimento de boas práticas.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 4 */}
                    <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
                      <p className="flex items-center gap-2 text-xs font-medium text-cyan-800 dark:text-cyan-300">
                        <span className="text-lg">💎</span>
                        <span className="font-semibold">Ponto de atenção:</span>
                        Este painel não deve ser usado para conclusões isoladas. Ele serve para orientar
                        perguntas melhores, aprofundar a análise gerencial e apoiar decisões mais consistentes
                        sobre auditoria, treinamento e melhoria operacional.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão de ação */}
                <div className="flex w-full flex-col gap-3 lg:w-auto">
                  <Button
                    onClick={abrirDashboardAnaliseAlertas}
                    className="rounded-xl bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700"
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Abrir dashboard
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    O painel será aberto em uma nova página.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Dentro do seu componente, após o cabeçalho de navegação */}
          <Card className="mb-6 rounded-2xl border border-cyan-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl space-y-6">
                  {/* Cabeçalho */}
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-cyan-100 p-3 dark:bg-cyan-950/40">
                      <ShieldAlert className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Painel de Análise de Risco e Plano de Ação
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ferramenta gerencial para identificação de riscos operacionais, alertas automáticos e priorização de auditoria
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo principal */}
                  <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {/* Seção 1 - O que o dashboard faz */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        O que este dashboard oferece
                      </h3>
                      <p>
                        Esta interface consolida a análise de risco operacional dos operadores de caixa,
                        combinando dados de vendas, cancelamentos, consultas e eficiência para apoiar a gestão
                        na tomada de decisões mais assertivas.
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        <li>
                          <span className="font-medium">Visão executiva:</span> resumo da loja com total de
                          operadores analisados, volume financeiro e cupons processados
                        </li>
                        <li>
                          <span className="font-medium">Métricas consolidadas:</span> cards com indicadores-chave
                          de performance e risco
                        </li>
                        <li>
                          <span className="font-medium">Pontos críticos:</span> destaques automáticos dos principais
                          desvios por operador
                        </li>
                        <li>
                          <span className="font-medium">Alertas automáticos:</span> notificações priorizadas por
                          severidade (alta/média)
                        </li>
                        <li>
                          <span className="font-medium">Operadores prioritários:</span> lista detalhada de quem
                          precisa de atenção imediata
                        </li>
                        <li>
                          <span className="font-medium">Recomendações e plano de ação:</span> sugestões objetivas
                          e cronograma de ações
                        </li>
                      </ul>
                    </div>

                    {/* Seção 2 - Como interpretar os dados */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        Como interpretar as informações
                      </h3>
                      <p className="mb-2">
                        <span className="font-medium">Análise multidimensional:</span> não olhe para um único
                        indicador isoladamente. O risco real está no cruzamento de múltiplos fatores.
                      </p>

                      <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ⚠️ Score de risco
                          </p>
                          <p className="mt-1 text-xs">
                            Quanto maior o score, maior a probabilidade de desvios operacionais.
                            Operadores com score elevado devem ser priorizados em auditorias.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            📊 Taxa de cancelamentos
                          </p>
                          <p className="mt-1 text-xs">
                            Percentual de itens cancelados vs. total vendido. Taxas muito altas podem
                            indicar falhas no processo de vendas ou problemas com produtos.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            🔍 Taxa de consultas
                          </p>
                          <p className="mt-1 text-xs">
                            Volume de consultas realizadas durante as vendas. Acima da média pode
                            indicar insegurança operacional ou dependência de supervisão.
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
                          <p className="font-medium text-gray-900 dark:text-white">
                            💰 Impacto financeiro
                          </p>
                          <p className="mt-1 text-xs">
                            Valor total cancelado em reais. Este indicador mostra o peso real dos
                            cancelamentos no faturamento da loja.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 3 - Como usar no dia a dia */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        Como usar no dia a dia
                      </h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">1.</span>
                          <p>
                            <span className="font-medium">Início da rotina:</span> consulte os
                            <span className="text-cyan-600 dark:text-cyan-400"> Alertas Automáticos </span>
                            para identificar rapidamente situações que exigem ação imediata.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">2.</span>
                          <p>
                            <span className="font-medium">Análise de pontos críticos:</span> revise os
                            <span className="text-cyan-600 dark:text-cyan-400"> Pontos Críticos </span>
                            para entender quais operadores estão em destaque negativo em cada indicador.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">3.</span>
                          <p>
                            <span className="font-medium">Aprofundamento:</span> examine os detalhes dos
                            <span className="text-cyan-600 dark:text-cyan-400"> Operadores Prioritários </span>
                            para entender o contexto completo de cada caso.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">4.</span>
                          <p>
                            <span className="font-medium">Plano de ação:</span> siga as
                            <span className="text-cyan-600 dark:text-cyan-400"> Recomendações </span>
                            e execute o <span className="text-cyan-600 dark:text-cyan-400">Plano de Ação</span>
                            conforme as prioridades estabelecidas.
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span className="font-bold text-cyan-500">5.</span>
                          <p>
                            <span className="font-medium">Análise detalhada:</span> consulte o
                            <span className="text-cyan-600 dark:text-cyan-400"> Texto Analítico </span>
                            para uma visão completa e contextualizada dos dados.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seção 4 - Legenda de cores e severidades */}
                    <div>
                      <h3 className="mb-2 font-semibold text-cyan-600 dark:text-cyan-400">
                        Entendendo as cores e níveis
                      </h3>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-900 dark:bg-red-950/20">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="text-xs font-medium text-red-700 dark:text-red-300">Severidade Alta</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-2 dark:border-yellow-900 dark:bg-yellow-950/20">
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Severidade Média</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2 dark:border-green-900 dark:bg-green-950/20">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Referência Positiva</span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Prioridade 1:</span>
                          <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded">Crítica</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Prioridade 2:</span>
                          <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded">Alta</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Prioridade 3:</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded">Média</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Prioridade 5:</span>
                          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded">Monitoramento</span>
                        </div>
                      </div>
                    </div>

                    {/* Seção 5 - Ponto de atenção */}
                    <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/20">
                      <p className="flex items-start gap-2 text-xs font-medium text-cyan-800 dark:text-cyan-300">
                        <span className="text-lg">💡</span>
                        <span>
                          <span className="font-semibold">Como usar este dashboard:</span> Esta ferramenta foi
                          desenvolvida para apoiar a gestão na tomada de decisões, não substituindo o olhar crítico
                          do gestor. Use os dados para direcionar sua atenção, aprofundar investigações e
                          embasar feedbacks e planos de desenvolvimento. Sempre valide os achados com observação
                          in loco e converse com os operadores antes de conclusões precipitadas.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botão de ação */}
                <div className="flex w-full flex-col gap-3 lg:w-auto">
                  <Button
                    onClick={abrirDashboardAPlanoAcao}
                    className="rounded-xl bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700"
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Abrir dashboard
                  </Button>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    O painel será aberto em uma nova página.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <section id="modulos">
        </section>
      </main>
    </div>
  );
};

export default Home;