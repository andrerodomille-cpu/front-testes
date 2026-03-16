import React from "react";
import { useTranslation } from "react-i18next";

export default function ParametrosObrigatoriosInvalidos() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-100 dark:bg-gray-900 px-2 rounded-2xl">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="text-red-500 dark:text-red-400 mb-4">
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
              d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        </div>
        <h1 className="text-md font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          {t("comum.parametrosobrigatoriosinvalidos")}
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 text-center mb-6 max-w-sm">
          {t("comum.textoparametrosobrigatoriosinvalidos")}
        </p>
      </div>
    </div>
  );
}
