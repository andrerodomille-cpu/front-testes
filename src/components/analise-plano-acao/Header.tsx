import React from 'react';
import { Store, TrendingUp, AlertCircle } from 'lucide-react';

interface HeaderProps {
  loja: string;
  operadoresAnalisados: number;
  valorTotalVenda: number;
  quantidadeCupons: number;
}

const Header: React.FC<HeaderProps> = ({ 

}) => {
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-200">
        <span className="flex items-center gap-1">
          <Store className="h-3.5 w-3.5" />
            Plano de Ação
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Painel de Análise de Risco e Plano de Ação
      </h1>

      

      <div className="flex flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2">
          <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Criticidade: Baixa
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            4 Alertas Ativos
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;