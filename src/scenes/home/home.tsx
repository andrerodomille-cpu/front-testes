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
            <div className="flex items-center space-x-3">
              <img
                src={`${import.meta.env.BASE_URL}assets/cera.png`}
                alt="Cera Ingleza Platform"
                className="h-10"
              />

            </div>
            <div className="hidden md:flex flex-1 max-w-md ml-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -trangray-y-1/2 h-4 w-4 text-gray-400" />
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
  <Card className="rounded-2xl border-blue-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <CardContent className="p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 dark:bg-blue-950/40">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard de Análise de Operadores
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Prevenção de perdas e eficiência operacional no PDV
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
            <p>
              Este painel apresenta indicadores operacionais dos operadores de caixa,
              destacando produtividade, cancelamentos, consultas, vendas canceladas
              e impacto financeiro. O objetivo é ajudar líderes, fiscais e gestores
              a identificar comportamentos fora da curva e oportunidades de melhoria
              com base em dados objetivos.
            </p>

            <p>
              A análise deve ser observada em conjunto. Um operador pode ter alta
              produtividade, mas também apresentar taxas elevadas de cancelamento ou
              consultas. Por isso, a leitura ideal do dashboard não deve considerar
              apenas um indicador isolado, e sim o equilíbrio entre desempenho,
              risco operacional e impacto financeiro.
            </p>

            <p>
              No uso do dia a dia, este painel pode apoiar reuniões de acompanhamento,
              definição de treinamentos, priorização de auditorias e identificação
              de operadores que merecem atenção imediata. Operadores com muitos alertas,
              alto impacto financeiro ou baixa produtividade relativa podem exigir
              atuação mais rápida da liderança.
            </p>

            <p>
              Já os operadores com boa produtividade e baixo risco podem servir como
              referência operacional para o restante da equipe. Dessa forma, o dashboard
              não apenas aponta problemas, mas também ajuda a identificar boas práticas
              que podem ser replicadas na operação.
            </p>
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

  <Card className="rounded-2xl border-blue-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
              Dashboard de Análise de Operadores
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
              📊 O que você encontra aqui
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
</section>
        <section id="modulos">
        </section>
      </main>
    </div>
  );
};

export default Home;