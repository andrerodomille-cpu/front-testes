import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  AlertCircle, 
  RefreshCw, 
  XCircle, 
  Server, 
  WifiOff,
  AlertTriangle,
  FileWarning,
  ShieldAlert
} from "lucide-react";

interface ErrorCardProps {
  error?: Error | string;
  title?: string;
  message?: string;
  type?: 'network' | 'server' | 'data' | 'auth' | 'generic';
  showDetails?: boolean;
}

export function ErrorCard({ 
  error,
  title,
  message,
  type = 'generic',
  showDetails = false
}: ErrorCardProps) {
  
  const getErrorConfig = () => {
    const configs = {
      network: {
        icon: <WifiOff className="h-5 w-5" />,
        defaultTitle: "Erro de Conexão",
        defaultMessage: "Não foi possível conectar ao servidor. Verifique sua conexão de internet.",
        color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
        iconColor: "text-yellow-600 dark:text-yellow-400"
      },
      server: {
        icon: <Server className="h-5 w-5" />,
        defaultTitle: "Erro no Servidor",
        defaultMessage: "O servidor está temporariamente indisponível. Tente novamente em alguns instantes.",
        color: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300",
        iconColor: "text-red-600 dark:text-red-400"
      },
      data: {
        icon: <FileWarning className="h-5 w-5" />,
        defaultTitle: "Erro nos Dados",
        defaultMessage: "Não foi possível processar as informações recebidas.",
        color: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 text-orange-800 dark:text-orange-300",
        iconColor: "text-orange-600 dark:text-orange-400"
      },
      auth: {
        icon: <ShieldAlert className="h-5 w-5" />,
        defaultTitle: "Erro de Autenticação",
        defaultMessage: "Sua sessão expirou ou você não tem permissão para acessar este recurso.",
        color: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 text-purple-800 dark:text-purple-300",
        iconColor: "text-purple-600 dark:text-purple-400"
      },
      generic: {
        icon: <AlertCircle className="h-5 w-5" />,
        defaultTitle: "Erro ao Carregar",
        defaultMessage: "Ocorreu um erro ao carregar as informações. Tente novamente.",
        color: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300",
        iconColor: "text-red-600 dark:text-red-400"
      }
    };

    return configs[type];
  };

  const config = getErrorConfig();
  const errorMessage = typeof error === 'string' ? error : error?.message;
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <Card className={cn(
      "p-4 border-0 shadow-lg overflow-hidden",
      "bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950",
      "border border-gray-200 dark:border-gray-800"
    )}>
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="mb-2">
          <div className={cn(
            "p-4 rounded-2xl mb-4 relative",
            type === 'network' ? "bg-yellow-100 dark:bg-yellow-900/30" :
            type === 'server' ? "bg-red-100 dark:bg-red-900/30" :
            type === 'data' ? "bg-orange-100 dark:bg-orange-900/30" :
            type === 'auth' ? "bg-purple-100 dark:bg-purple-900/30" :
            "bg-red-100 dark:bg-red-900/30"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-20",
              type === 'network' ? "bg-yellow-500" :
              type === 'server' ? "bg-red-500" :
              type === 'data' ? "bg-orange-500" :
              type === 'auth' ? "bg-purple-500" :
              "bg-red-500"
            )} />
            <div className={cn("relative z-10", config.iconColor)}>
              {config.icon}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <h3 className={cn(
            "text-xl font-semibold",
            type === 'network' ? "text-yellow-800 dark:text-yellow-300" :
            type === 'server' ? "text-red-800 dark:text-red-300" :
            type === 'data' ? "text-orange-800 dark:text-orange-300" :
            type === 'auth' ? "text-purple-800 dark:text-purple-300" :
            "text-red-800 dark:text-red-300"
          )}>
            {displayTitle}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400">
            {displayMessage}
          </p>

          {showDetails && errorMessage && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                {errorMessage}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Código: {type.toUpperCase()}-{Date.now().toString().slice(-4)}</span>
            <span>{new Date().toLocaleTimeString('pt-BR')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ErrorInline({ message, type = 'generic' }: { message: string; type?: ErrorCardProps['type'] }) {
  const config = getErrorConfig(type);

  return (
    <div className={cn(
      "flex items-start space-x-2 p-3 rounded-lg text-sm",
      config.color
    )}>
      <div className={cn("mt-0.5", config.iconColor)}>
        <AlertTriangle className="h-4 w-4" />
      </div>
      <span>{message}</span>
    </div>
  );
}

function getErrorConfig(type: ErrorCardProps['type'] = 'generic') {
  const configs = {
    network: {
      icon: <WifiOff className="h-5 w-5" />,
      defaultTitle: "Erro de Conexão",
      defaultMessage: "Não foi possível conectar ao servidor. Verifique sua conexão de internet.",
      color: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300",
      iconColor: "text-yellow-600 dark:text-yellow-400"
    },
    server: {
      icon: <Server className="h-5 w-5" />,
      defaultTitle: "Erro no Servidor",
      defaultMessage: "O servidor está temporariamente indisponível. Tente novamente em alguns instantes.",
      color: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300",
      iconColor: "text-red-600 dark:text-red-400"
    },
    data: {
      icon: <FileWarning className="h-5 w-5" />,
      defaultTitle: "Erro nos Dados",
      defaultMessage: "Não foi possível processar as informações recebidas.",
      color: "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 text-orange-800 dark:text-orange-300",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    auth: {
      icon: <ShieldAlert className="h-5 w-5" />,
      defaultTitle: "Erro de Autenticação",
      defaultMessage: "Sua sessão expirou ou você não tem permissão para acessar este recurso.",
      color: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800 text-purple-800 dark:text-purple-300",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    generic: {
      icon: <AlertCircle className="h-5 w-5" />,
      defaultTitle: "Erro ao Carregar",
      defaultMessage: "Ocorreu um erro ao carregar as informações. Tente novamente.",
      color: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300",
      iconColor: "text-red-600 dark:text-red-400"
    }
  };

  return configs[type];
}