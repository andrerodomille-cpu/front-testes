import React from "react";

interface HeaderProps {
  titulo?: string;
  subtitulo?: string;
  resumo: string;
}

export function Header({
  titulo = "Monitoramento de risco operacional",
  subtitulo = "Painel de Alertas, Auditoria e Eficiência dos Operadores",
  resumo,
}: HeaderProps) {
  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-700 dark:text-cyan-200">
        {titulo}
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {subtitulo}
      </h1>

      <p className="max-w-4xl text-sm text-gray-600 dark:text-gray-400">
        {resumo}
      </p>
    </div>
  );
}