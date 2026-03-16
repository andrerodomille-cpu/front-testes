import { ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface EstadoCarregandoErroProps {
  loading: boolean;
  error: boolean;
  children: ReactNode;
}

export default function LoadingAndError({
  loading,
  error,
  children,
}: EstadoCarregandoErroProps) {
if (loading) {
  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <main className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="mb-6 transform transition-all duration-700">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center">
            Aguarde
          </h1>
        </div>
        
        {/* Spinner modernizado */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-gray-300 dark:border-gray-600 rounded-full animate-spin [animation-duration:1.5s]"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin [animation-duration:1.5s]"></div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Texto de status */}
        <p className="text-sm text-gray-600 dark:text-gray-300 font-light text-center">
          Carregando recursos...
        </p>
      </main>
    </div>
  );
}

  if (error) {
    return (
      <div className="h-full">
        <Alert
          variant="destructive"
          className="rounded-t rounded-b w-full bg-red-100 text-red-800 
                     dark:bg-red-900 dark:text-red-100 border border-red-300 
                     dark:border-red-700"
        >
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
          <AlertTitle className="font-bold">Erro ao carregar dados</AlertTitle>
          <AlertDescription>
            Não foi possível carregar as informações.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
