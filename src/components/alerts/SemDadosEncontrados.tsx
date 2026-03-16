import React from "react";
import { useTranslation } from "react-i18next";

export default function SemDadosEncontrados() {
  const { t } = useTranslation();
  return ( 
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-100 dark:bg-gray-800 px-2 rounded-2xl">
      <div className="bg-neutral-50 dark:bg-gray-800 p-1 p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-yellow-500 dark:text-yellow-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4 0a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h3l2 2h6a2 2 0 012 2v8z"
            />
          </svg>


        </div>
        <h1 className="text-md font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          {t("comum.nenhumresultado")}
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 text-center mb-6 max-w-sm">
          {t("comum.textonenhumsresultado")}
        </p>

      </div>
    </div>
  );
}
